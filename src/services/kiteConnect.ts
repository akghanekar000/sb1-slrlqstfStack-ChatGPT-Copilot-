interface KiteConfig {
  apiKey: string;
  accessToken?: string;
  baseUrl: string;
}

interface KiteQuote {
  instrument_token: number;
  last_price: number;
  last_quantity: number;
  average_price: number;
  volume: number;
  buy_quantity: number;
  sell_quantity: number;
  ohlc: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
  net_change: number;
  oi: number;
  oi_day_high: number;
  oi_day_low: number;
  timestamp: string;
  depth: {
    buy: Array<{ price: number; quantity: number; orders: number }>;
    sell: Array<{ price: number; quantity: number; orders: number }>;
  };
}

interface OptionChainData {
  strike: number;
  call: {
    instrument_token: number;
    last_price: number;
    volume: number;
    oi: number;
    iv: number;
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    bid: number;
    ask: number;
  };
  put: {
    instrument_token: number;
    last_price: number;
    volume: number;
    oi: number;
    iv: number;
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    bid: number;
    ask: number;
  };
}

class KiteConnectService {
  private config: KiteConfig;
  private retryCount = 0;
  private maxRetries = 3;
  private retryDelay = 2000;
  private isConnected = false;
  private lastDataUpdate = 0;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheExpiry = 1000; // 1 second cache

  // Instrument tokens for major indices and options
  private readonly INSTRUMENTS = {
    NIFTY: 256265,
    BANKNIFTY: 260105,
    FINNIFTY: 257801,
    SENSEX: 265,
    // These will be populated dynamically for options
    NIFTY_OPTIONS: new Map<number, number>(),
    BANKNIFTY_OPTIONS: new Map<number, number>()
  };

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_KITE_API_KEY || 'your_kite_api_key',
      baseUrl: 'http://localhost:3001/api/kite-proxy'
    };
    
    // Initialize connection
    this.initialize();
  }

  private async initialize() {
    try {
      // Check if we have a stored access token
      const storedToken = localStorage.getItem('kite_access_token');
      if (storedToken) {
        this.config.accessToken = storedToken;
        await this.validateToken();
      }
      
      // Load instrument tokens for options (only if we have a valid token)
      if (this.config.accessToken) {
        await this.loadInstrumentTokens();
      }
      
      this.isConnected = true;
      console.log('Kite Connect service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Kite Connect service:', error);
      this.handleConnectionError(error);
    }
  }

  private async validateToken(): Promise<boolean> {
    try {
      if (!this.config.accessToken) return false;
      
      const response = await this.makeRequest('/user/profile');
      return response.status === 'success';
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  private async loadInstrumentTokens() {
    try {
      // Only load instruments if we have a valid access token
      if (!this.config.accessToken) {
        console.log('No access token available, skipping instrument loading');
        return;
      }

      // Load instruments list to get option tokens
      const instruments = await this.getInstruments();
      
      // Filter and map NIFTY and BANKNIFTY options
      instruments.forEach((instrument: any) => {
        if (instrument.name === 'NIFTY' && instrument.instrument_type === 'CE') {
          this.INSTRUMENTS.NIFTY_OPTIONS.set(instrument.strike, instrument.instrument_token);
        } else if (instrument.name === 'NIFTY' && instrument.instrument_type === 'PE') {
          this.INSTRUMENTS.NIFTY_OPTIONS.set(-instrument.strike, instrument.instrument_token);
        } else if (instrument.name === 'BANKNIFTY' && instrument.instrument_type === 'CE') {
          this.INSTRUMENTS.BANKNIFTY_OPTIONS.set(instrument.strike, instrument.instrument_token);
        } else if (instrument.name === 'BANKNIFTY' && instrument.instrument_type === 'PE') {
          this.INSTRUMENTS.BANKNIFTY_OPTIONS.set(-instrument.strike, instrument.instrument_token);
        }
      });
    } catch (error) {
      console.error('Failed to load instrument tokens:', error);
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `token ${this.config.apiKey}:${this.config.accessToken}`,
      'Content-Type': 'application/json',
      'X-Kite-Version': '3',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'API Error');
      }

      this.retryCount = 0; // Reset retry count on success
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  private async retryRequest(requestFn: () => Promise<any>): Promise<any> {
    try {
      return await requestFn();
    } catch (error) {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retrying request (${this.retryCount}/${this.maxRetries}) in ${this.retryDelay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.retryRequest(requestFn);
      } else {
        throw error;
      }
    }
  }

  private handleConnectionError(error: any) {
    console.error('Connection error:', error);
    this.isConnected = false;
    
    // Silent retry in background
    setTimeout(() => {
      this.initialize();
    }, this.retryDelay);
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Public API methods
  async getQuote(instruments: string[]): Promise<Record<string, KiteQuote>> {
    const cacheKey = `quote_${instruments.join('_')}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.retryRequest(() => 
        this.makeRequest(`/quote?i=${instruments.join('&i=')}`)
      );
      
      this.setCachedData(cacheKey, response.data);
      this.lastDataUpdate = Date.now();
      return response.data;
    } catch (error) {
      this.handleConnectionError(error);
      throw error;
    }
  }

  async getNiftyQuote(): Promise<KiteQuote> {
    const quotes = await this.getQuote([`NSE:NIFTY 50`]);
    return quotes[`NSE:NIFTY 50`];
  }

  async getBankNiftyQuote(): Promise<KiteQuote> {
    const quotes = await this.getQuote([`NSE:NIFTY BANK`]);
    return quotes[`NSE:NIFTY BANK`];
  }

  async getOptionChain(symbol: 'NIFTY' | 'BANKNIFTY', expiry: string, strikes?: number[]): Promise<OptionChainData[]> {
    const cacheKey = `options_${symbol}_${expiry}_${strikes?.join('_') || 'all'}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Get current spot price to determine ATM strikes if not provided
      let spotPrice: number;
      if (symbol === 'NIFTY') {
        const quote = await this.getNiftyQuote();
        spotPrice = quote.last_price;
      } else {
        const quote = await this.getBankNiftyQuote();
        spotPrice = quote.last_price;
      }

      // If no strikes provided, get 5 strikes around ATM
      if (!strikes) {
        const atmStrike = Math.round(spotPrice / 50) * 50;
        strikes = [
          atmStrike - 100,
          atmStrike - 50,
          atmStrike,
          atmStrike + 50,
          atmStrike + 100
        ];
      }

      // Build instrument list for calls and puts
      const instruments: string[] = [];
      strikes.forEach(strike => {
        instruments.push(`NFO:${symbol}${expiry}${strike}CE`);
        instruments.push(`NFO:${symbol}${expiry}${strike}PE`);
      });

      const quotes = await this.getQuote(instruments);
      
      // Transform data into option chain format
      const optionChain: OptionChainData[] = strikes.map(strike => {
        const callKey = `NFO:${symbol}${expiry}${strike}CE`;
        const putKey = `NFO:${symbol}${expiry}${strike}PE`;
        
        const callQuote = quotes[callKey];
        const putQuote = quotes[putKey];

        return {
          strike,
          call: {
            instrument_token: callQuote?.instrument_token || 0,
            last_price: callQuote?.last_price || 0,
            volume: callQuote?.volume || 0,
            oi: callQuote?.oi || 0,
            iv: this.calculateIV(callQuote?.last_price || 0, spotPrice, strike, 'call'),
            delta: this.calculateDelta(spotPrice, strike, 'call'),
            gamma: this.calculateGamma(spotPrice, strike),
            theta: this.calculateTheta(spotPrice, strike, 'call'),
            vega: this.calculateVega(spotPrice, strike),
            bid: callQuote?.depth?.buy?.[0]?.price || 0,
            ask: callQuote?.depth?.sell?.[0]?.price || 0
          },
          put: {
            instrument_token: putQuote?.instrument_token || 0,
            last_price: putQuote?.last_price || 0,
            volume: putQuote?.volume || 0,
            oi: putQuote?.oi || 0,
            iv: this.calculateIV(putQuote?.last_price || 0, spotPrice, strike, 'put'),
            delta: this.calculateDelta(spotPrice, strike, 'put'),
            gamma: this.calculateGamma(spotPrice, strike),
            theta: this.calculateTheta(spotPrice, strike, 'put'),
            vega: this.calculateVega(spotPrice, strike),
            bid: putQuote?.depth?.buy?.[0]?.price || 0,
            ask: putQuote?.depth?.sell?.[0]?.price || 0
          }
        };
      });

      this.setCachedData(cacheKey, optionChain);
      return optionChain;
    } catch (error) {
      this.handleConnectionError(error);
      throw error;
    }
  }

  async getInstruments(): Promise<any[]> {
    try {
      const response = await this.retryRequest(() => 
        this.makeRequest('/instruments')
      );
      return response.data || [];
    } catch (error) {
      this.handleConnectionError(error);
      console.warn('Failed to fetch instruments, returning empty array');
      return [];
    }
  }

  // Greeks calculation methods (simplified Black-Scholes)
  private calculateIV(optionPrice: number, spotPrice: number, strike: number, type: 'call' | 'put'): number {
    // Simplified IV calculation - in production, use more sophisticated methods
    const moneyness = spotPrice / strike;
    const baseIV = 20; // Base IV of 20%
    
    if (type === 'call') {
      return baseIV + (moneyness > 1 ? (moneyness - 1) * 50 : (1 - moneyness) * 30);
    } else {
      return baseIV + (moneyness < 1 ? (1 - moneyness) * 50 : (moneyness - 1) * 30);
    }
  }

  private calculateDelta(spotPrice: number, strike: number, type: 'call' | 'put'): number {
    const moneyness = spotPrice / strike;
    
    if (type === 'call') {
      return Math.max(0, Math.min(1, 0.5 + (moneyness - 1) * 2));
    } else {
      return Math.max(-1, Math.min(0, -0.5 - (1 - moneyness) * 2));
    }
  }

  private calculateGamma(spotPrice: number, strike: number): number {
    const moneyness = Math.abs(spotPrice - strike) / strike;
    return Math.max(0, 0.1 - moneyness * 0.2);
  }

  private calculateTheta(spotPrice: number, strike: number, type: 'call' | 'put'): number {
    const moneyness = Math.abs(spotPrice - strike) / strike;
    return -(0.05 + moneyness * 0.1);
  }

  private calculateVega(spotPrice: number, strike: number): number {
    const moneyness = Math.abs(spotPrice - strike) / strike;
    return Math.max(0, 0.2 - moneyness * 0.3);
  }

  // Authentication methods
  getLoginUrl(): string {
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
    return `https://kite.trade/connect/login?api_key=${this.config.apiKey}&v=3&redirect_uri=${redirectUri}`;
  }

  async generateSession(requestToken: string): Promise<string> {
    try {
      const response = await this.makeRequest('/session/token', {
        method: 'POST',
        body: JSON.stringify({
          api_key: this.config.apiKey,
          request_token: requestToken,
          checksum: this.generateChecksum(requestToken)
        })
      });

      this.config.accessToken = response.data.access_token;
      localStorage.setItem('kite_access_token', this.config.accessToken);
      
      return this.config.accessToken;
    } catch (error) {
      console.error('Session generation failed:', error);
      throw error;
    }
  }

  private generateChecksum(requestToken: string): string {
    // This should use your API secret to generate SHA256 checksum
    // For security, this should be done on your backend
    return 'checksum_placeholder';
  }

  // Connection status
  isConnectionHealthy(): boolean {
    return this.isConnected && Date.now() - this.lastDataUpdate < 30000; // 30 seconds
  }

  getConnectionStatus(): { connected: boolean; lastUpdate: number; retryCount: number } {
    return {
      connected: this.isConnected,
      lastUpdate: this.lastDataUpdate,
      retryCount: this.retryCount
    };
  }

  // Manual refresh
  async forceRefresh(): Promise<void> {
    this.cache.clear();
    this.retryCount = 0;
    await this.initialize();
  }
}

export default new KiteConnectService();