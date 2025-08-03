// Multi-Broker Service for Indian Stock Market
interface BrokerConfig {
  name: string;
  displayName: string;
  logo: string;
  apiKey: string;
  apiSecret?: string;
  baseUrl: string;
  authUrl: string;
  redirectUri: string;
  isActive: boolean;
  features: {
    liveData: boolean;
    optionsChain: boolean;
    trading: boolean;
    portfolio: boolean;
  };
}

interface BrokerQuote {
  symbol: string;
  ltp: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
  timestamp: string;
}

interface BrokerAuth {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  userId?: string;
  clientId?: string;
}

class MultiBrokerService {
  private brokers: Map<string, BrokerConfig> = new Map();
  private authenticatedBrokers: Map<string, BrokerAuth> = new Map();
  private activeBroker: string | null = null;

  constructor() {
    this.initializeBrokers();
    this.loadStoredAuth();
  }

  private initializeBrokers() {
    const brokerConfigs: BrokerConfig[] = [
      {
        name: 'zerodha',
        displayName: 'Zerodha Kite',
        logo: '⚡',
        apiKey: import.meta.env.VITE_KITE_API_KEY || '',
        apiSecret: import.meta.env.VITE_KITE_API_SECRET || '',
        baseUrl: 'https://api.kite.trade',
        authUrl: 'https://kite.trade/connect/login',
        redirectUri: `${window.location.origin}/auth/callback`,
        isActive: true,
        features: {
          liveData: true,
          optionsChain: true,
          trading: true,
          portfolio: true
        }
      },
      {
        name: 'upstox',
        displayName: 'Upstox Pro',
        logo: '📈',
        apiKey: import.meta.env.VITE_UPSTOX_API_KEY || '',
        baseUrl: 'https://api.upstox.com/v2',
        authUrl: 'https://api.upstox.com/v2/login/authorization/dialog',
        redirectUri: `${window.location.origin}/auth/upstox/callback`,
        isActive: true,
        features: {
          liveData: true,
          optionsChain: true,
          trading: true,
          portfolio: true
        }
      },
      {
        name: 'angelone',
        displayName: 'Angel One',
        logo: '🔰',
        apiKey: import.meta.env.VITE_ANGEL_ONE_API_KEY || '',
        baseUrl: 'https://apiconnect.angelbroking.com',
        authUrl: 'https://smartapi.angelbroking.com/publisher-login',
        redirectUri: `${window.location.origin}/auth/angelone/callback`,
        isActive: true,
        features: {
          liveData: true,
          optionsChain: true,
          trading: true,
          portfolio: true
        }
      },
      {
        name: 'fivepaisa',
        displayName: '5paisa',
        logo: '💰',
        apiKey: import.meta.env.VITE_5PAISA_API_KEY || '',
        baseUrl: 'https://Openapi.5paisa.com/VendorsAPI/Service1.svc',
        authUrl: 'https://dev-openapi.5paisa.com/developer/v1/authorize',
        redirectUri: `${window.location.origin}/auth/fivepaisa/callback`,
        isActive: true,
        features: {
          liveData: true,
          optionsChain: false,
          trading: true,
          portfolio: true
        }
      },
      {
        name: 'dhan',
        displayName: 'Dhan HQ',
        logo: '🎯',
        apiKey: import.meta.env.VITE_DHAN_API_KEY || '',
        baseUrl: 'https://api.dhan.co',
        authUrl: 'https://api.dhan.co/v2/auth/login',
        redirectUri: `${window.location.origin}/auth/dhan/callback`,
        isActive: true,
        features: {
          liveData: true,
          optionsChain: true,
          trading: true,
          portfolio: true
        }
      },
      {
        name: 'iifl',
        displayName: 'IIFL Securities',
        logo: '🏦',
        apiKey: import.meta.env.VITE_IIFL_API_KEY || '',
        baseUrl: 'https://ttblaze.iifl.com/apimarketdata',
        authUrl: 'https://ttblaze.iifl.com/interactive/auth',
        redirectUri: `${window.location.origin}/auth/iifl/callback`,
        isActive: true,
        features: {
          liveData: true,
          optionsChain: false,
          trading: true,
          portfolio: true
        }
      },
      {
        name: 'kotak',
        displayName: 'Kotak Securities',
        logo: '🏢',
        apiKey: import.meta.env.VITE_KOTAK_API_KEY || '',
        baseUrl: 'https://gw-napi.kotaksecurities.com',
        authUrl: 'https://tradeapi.kotaksecurities.com/oauth2/authorize',
        redirectUri: `${window.location.origin}/auth/kotak/callback`,
        isActive: true,
        features: {
          liveData: true,
          optionsChain: false,
          trading: true,
          portfolio: true
        }
      },
      {
        name: 'icici',
        displayName: 'ICICI Direct',
        logo: '🏛️',
        apiKey: import.meta.env.VITE_ICICI_API_KEY || '',
        baseUrl: 'https://api.icicidirect.com',
        authUrl: 'https://api.icicidirect.com/breezeapi/api/v1/customerlogin',
        redirectUri: `${window.location.origin}/auth/icici/callback`,
        isActive: true,
        features: {
          liveData: true,
          optionsChain: false,
          trading: true,
          portfolio: false
        }
      }
    ];

    brokerConfigs.forEach(config => {
      this.brokers.set(config.name, config);
    });
  }

  private loadStoredAuth() {
    try {
      const stored = localStorage.getItem('broker_auth');
      if (stored) {
        const authData = JSON.parse(stored);
        Object.entries(authData).forEach(([broker, auth]) => {
          this.authenticatedBrokers.set(broker, auth as BrokerAuth);
        });
      }

      const activeBroker = localStorage.getItem('active_broker');
      if (activeBroker && this.authenticatedBrokers.has(activeBroker)) {
        this.activeBroker = activeBroker;
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    }
  }

  private saveAuth() {
    try {
      const authData = Object.fromEntries(this.authenticatedBrokers);
      localStorage.setItem('broker_auth', JSON.stringify(authData));
      if (this.activeBroker) {
        localStorage.setItem('active_broker', this.activeBroker);
      }
    } catch (error) {
      console.error('Error saving auth:', error);
    }
  }

  // Public API
  getAvailableBrokers(): BrokerConfig[] {
    return Array.from(this.brokers.values()).filter(broker => broker.isActive);
  }

  getAuthenticatedBrokers(): string[] {
    return Array.from(this.authenticatedBrokers.keys());
  }

  getActiveBroker(): string | null {
    return this.activeBroker;
  }

  setActiveBroker(brokerName: string): boolean {
    if (this.authenticatedBrokers.has(brokerName)) {
      this.activeBroker = brokerName;
      this.saveAuth();
      return true;
    }
    return false;
  }

  getBrokerConfig(brokerName: string): BrokerConfig | null {
    return this.brokers.get(brokerName) || null;
  }

  isAuthenticated(brokerName: string): boolean {
    const auth = this.authenticatedBrokers.get(brokerName);
    if (!auth) return false;
    return Date.now() < auth.expiresAt;
  }

  // Authentication methods
  getLoginUrl(brokerName: string): string {
    const broker = this.brokers.get(brokerName);
    if (!broker) throw new Error(`Broker ${brokerName} not found`);

    switch (brokerName) {
      case 'zerodha':
        return `${broker.authUrl}?api_key=${broker.apiKey}&v=3&redirect_uri=${encodeURIComponent(broker.redirectUri)}`;
      
      case 'upstox':
        return `${broker.authUrl}?response_type=code&client_id=${broker.apiKey}&redirect_uri=${encodeURIComponent(broker.redirectUri)}&state=upstox_auth`;
      
      case 'angelone':
        return `${broker.authUrl}?api_key=${broker.apiKey}&redirect_uri=${encodeURIComponent(broker.redirectUri)}`;
      
      case 'fivepaisa':
        return `${broker.authUrl}?response_type=code&client_id=${broker.apiKey}&redirect_uri=${encodeURIComponent(broker.redirectUri)}&scope=read`;
      
      case 'dhan':
        return `${broker.authUrl}?client_id=${broker.apiKey}&redirect_uri=${encodeURIComponent(broker.redirectUri)}&response_type=code`;
      
      default:
        return `${broker.authUrl}?api_key=${broker.apiKey}&redirect_uri=${encodeURIComponent(broker.redirectUri)}`;
    }
  }

  async authenticateWithCode(brokerName: string, code: string, state?: string): Promise<boolean> {
    try {
      const broker = this.brokers.get(brokerName);
      if (!broker) throw new Error(`Broker ${brokerName} not found`);

      let authData: BrokerAuth;

      switch (brokerName) {
        case 'zerodha':
          authData = await this.authenticateZerodha(broker, code);
          break;
        case 'upstox':
          authData = await this.authenticateUpstox(broker, code);
          break;
        case 'angelone':
          authData = await this.authenticateAngelOne(broker, code);
          break;
        case 'fivepaisa':
          authData = await this.authenticateFivePaisa(broker, code);
          break;
        case 'dhan':
          authData = await this.authenticateDhan(broker, code);
          break;
        default:
          throw new Error(`Authentication not implemented for ${brokerName}`);
      }

      this.authenticatedBrokers.set(brokerName, authData);
      if (!this.activeBroker) {
        this.activeBroker = brokerName;
      }
      this.saveAuth();
      return true;
    } catch (error) {
      console.error(`Authentication failed for ${brokerName}:`, error);
      return false;
    }
  }

  private async authenticateZerodha(broker: BrokerConfig, requestToken: string): Promise<BrokerAuth> {
    const response = await fetch(`${broker.baseUrl}/session/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        api_key: broker.apiKey,
        request_token: requestToken,
        checksum: this.generateChecksum(broker.apiKey, requestToken, broker.apiSecret || '')
      })
    });

    if (!response.ok) throw new Error('Zerodha authentication failed');
    
    const data = await response.json();
    return {
      accessToken: data.data.access_token,
      refreshToken: data.data.refresh_token,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      userId: data.data.user_id
    };
  }

  private async authenticateUpstox(broker: BrokerConfig, code: string): Promise<BrokerAuth> {
    const response = await fetch(`${broker.baseUrl}/login/authorization/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: broker.apiKey,
        client_secret: broker.apiSecret || '',
        redirect_uri: broker.redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!response.ok) throw new Error('Upstox authentication failed');
    
    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + (data.expires_in * 1000)
    };
  }

  private async authenticateAngelOne(broker: BrokerConfig, code: string): Promise<BrokerAuth> {
    // Angel One uses different authentication flow
    const response = await fetch(`${broker.baseUrl}/rest/auth/angelbroking/user/v1/loginByPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-UserType': 'USER',
        'X-SourceID': 'WEB',
        'X-ClientLocalIP': '192.168.1.1',
        'X-ClientPublicIP': '192.168.1.1',
        'X-MACAddress': '00:00:00:00:00:00',
        'X-PrivateKey': broker.apiKey
      },
      body: JSON.stringify({
        clientcode: code, // This would be client code, not auth code
        password: 'password' // This needs to be handled differently
      })
    });

    if (!response.ok) throw new Error('Angel One authentication failed');
    
    const data = await response.json();
    return {
      accessToken: data.data.jwtToken,
      refreshToken: data.data.refreshToken,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000),
      clientId: data.data.clientcode
    };
  }

  private async authenticateFivePaisa(broker: BrokerConfig, code: string): Promise<BrokerAuth> {
    const response = await fetch(`${broker.baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: broker.apiKey,
        client_secret: broker.apiSecret || '',
        redirect_uri: broker.redirectUri
      })
    });

    if (!response.ok) throw new Error('5paisa authentication failed');
    
    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + (data.expires_in * 1000)
    };
  }

  private async authenticateDhan(broker: BrokerConfig, code: string): Promise<BrokerAuth> {
    const response = await fetch(`${broker.baseUrl}/v2/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: broker.apiKey,
        client_secret: broker.apiSecret || '',
        redirect_uri: broker.redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!response.ok) throw new Error('Dhan authentication failed');
    
    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + (data.expires_in * 1000)
    };
  }

  private generateChecksum(apiKey: string, requestToken: string, apiSecret: string): string {
    // This should use crypto library for SHA256 hash
    // For now, return a placeholder - implement proper checksum generation
    return 'checksum_placeholder';
  }

  // Market Data Methods
  async getQuote(symbol: string): Promise<BrokerQuote | null> {
    if (!this.activeBroker) return null;

    const broker = this.brokers.get(this.activeBroker);
    const auth = this.authenticatedBrokers.get(this.activeBroker);
    
    if (!broker || !auth) return null;

    try {
      switch (this.activeBroker) {
        case 'zerodha':
          return await this.getZerodhaQuote(broker, auth, symbol);
        case 'upstox':
          return await this.getUpstoxQuote(broker, auth, symbol);
        case 'angelone':
          return await this.getAngelOneQuote(broker, auth, symbol);
        case 'fivepaisa':
          return await this.getFivePaisaQuote(broker, auth, symbol);
        case 'dhan':
          return await this.getDhanQuote(broker, auth, symbol);
        default:
          return null;
      }
    } catch (error) {
      console.error(`Error fetching quote from ${this.activeBroker}:`, error);
      return null;
    }
  }

  private async getZerodhaQuote(broker: BrokerConfig, auth: BrokerAuth, symbol: string): Promise<BrokerQuote> {
    const response = await fetch(`${broker.baseUrl}/quote?i=NSE:${symbol}`, {
      headers: {
        'Authorization': `token ${broker.apiKey}:${auth.accessToken}`,
        'X-Kite-Version': '3'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch Zerodha quote');
    
    const data = await response.json();
    const quote = data.data[`NSE:${symbol}`];
    
    return {
      symbol,
      ltp: quote.last_price,
      change: quote.net_change,
      changePercent: (quote.net_change / quote.ohlc.close) * 100,
      volume: quote.volume,
      high: quote.ohlc.high,
      low: quote.ohlc.low,
      open: quote.ohlc.open,
      close: quote.ohlc.close,
      timestamp: new Date().toISOString()
    };
  }

  private async getUpstoxQuote(broker: BrokerConfig, auth: BrokerAuth, symbol: string): Promise<BrokerQuote> {
    const response = await fetch(`${broker.baseUrl}/market-quote/ltp?instrument_key=NSE_EQ|${symbol}`, {
      headers: {
        'Authorization': `Bearer ${auth.accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch Upstox quote');
    
    const data = await response.json();
    const quote = data.data[`NSE_EQ|${symbol}`];
    
    return {
      symbol,
      ltp: quote.last_price,
      change: quote.net_change || 0,
      changePercent: quote.percent_change || 0,
      volume: quote.volume || 0,
      high: quote.ohlc?.high || quote.last_price,
      low: quote.ohlc?.low || quote.last_price,
      open: quote.ohlc?.open || quote.last_price,
      close: quote.ohlc?.close || quote.last_price,
      timestamp: new Date().toISOString()
    };
  }

  private async getAngelOneQuote(broker: BrokerConfig, auth: BrokerAuth, symbol: string): Promise<BrokerQuote> {
    const response = await fetch(`${broker.baseUrl}/rest/secure/angelbroking/order/v1/getLTP`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-UserType': 'USER',
        'X-SourceID': 'WEB',
        'X-ClientLocalIP': '192.168.1.1',
        'X-ClientPublicIP': '192.168.1.1',
        'X-MACAddress': '00:00:00:00:00:00',
        'X-PrivateKey': broker.apiKey
      },
      body: JSON.stringify({
        exchange: 'NSE',
        tradingsymbol: symbol,
        symboltoken: '1' // This needs to be mapped properly
      })
    });

    if (!response.ok) throw new Error('Failed to fetch Angel One quote');
    
    const data = await response.json();
    const quote = data.data;
    
    return {
      symbol,
      ltp: parseFloat(quote.ltp),
      change: parseFloat(quote.change || '0'),
      changePercent: parseFloat(quote.changePercent || '0'),
      volume: parseInt(quote.volume || '0'),
      high: parseFloat(quote.high || quote.ltp),
      low: parseFloat(quote.low || quote.ltp),
      open: parseFloat(quote.open || quote.ltp),
      close: parseFloat(quote.close || quote.ltp),
      timestamp: new Date().toISOString()
    };
  }

  private async getFivePaisaQuote(broker: BrokerConfig, auth: BrokerAuth, symbol: string): Promise<BrokerQuote> {
    const response = await fetch(`${broker.baseUrl}/MarketFeed`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        MarketFeedData: [{
          Exch: 'N',
          ExchType: 'C',
          Symbol: symbol
        }]
      })
    });

    if (!response.ok) throw new Error('Failed to fetch 5paisa quote');
    
    const data = await response.json();
    const quote = data.Data[0];
    
    return {
      symbol,
      ltp: quote.LastRate,
      change: quote.Chg,
      changePercent: quote.ChgPcnt,
      volume: quote.Volume,
      high: quote.High,
      low: quote.Low,
      open: quote.Open,
      close: quote.PrevClose,
      timestamp: new Date().toISOString()
    };
  }

  private async getDhanQuote(broker: BrokerConfig, auth: BrokerAuth, symbol: string): Promise<BrokerQuote> {
    const response = await fetch(`${broker.baseUrl}/v2/charts/historical?symbol=${symbol}&exchange=NSE&instrument=EQUITY`, {
      headers: {
        'Authorization': `Bearer ${auth.accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch Dhan quote');
    
    const data = await response.json();
    const quote = data.data;
    
    return {
      symbol,
      ltp: quote.close,
      change: quote.close - quote.open,
      changePercent: ((quote.close - quote.open) / quote.open) * 100,
      volume: quote.volume,
      high: quote.high,
      low: quote.low,
      open: quote.open,
      close: quote.close,
      timestamp: new Date().toISOString()
    };
  }

  // Logout methods
  logout(brokerName: string): void {
    this.authenticatedBrokers.delete(brokerName);
    if (this.activeBroker === brokerName) {
      const remaining = Array.from(this.authenticatedBrokers.keys());
      this.activeBroker = remaining.length > 0 ? remaining[0] : null;
    }
    this.saveAuth();
  }

  logoutAll(): void {
    this.authenticatedBrokers.clear();
    this.activeBroker = null;
    localStorage.removeItem('broker_auth');
    localStorage.removeItem('active_broker');
  }
}

export default new MultiBrokerService();