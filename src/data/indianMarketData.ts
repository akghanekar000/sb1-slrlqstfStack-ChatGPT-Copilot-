// Comprehensive Indian Market Data for Options Trading
export interface MarketInstrument {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  category: 'index' | 'stock';
  sector?: string;
  lotSize?: number;
  basePrice: number;
  isOptionsAvailable: boolean;
}

// NSE Indices
export const NSE_INDICES: MarketInstrument[] = [
  // Major Indices
  { symbol: 'NIFTY', name: 'Nifty 50', exchange: 'NSE', category: 'index', lotSize: 75, basePrice: 19850, isOptionsAvailable: true },
  { symbol: 'BANKNIFTY', name: 'Bank Nifty', exchange: 'NSE', category: 'index', lotSize: 25, basePrice: 45320, isOptionsAvailable: true },
  { symbol: 'FINNIFTY', name: 'Nifty Financial Services', exchange: 'NSE', category: 'index', lotSize: 40, basePrice: 20150, isOptionsAvailable: true },
  { symbol: 'MIDCPNIFTY', name: 'Nifty Midcap Select', exchange: 'NSE', category: 'index', lotSize: 75, basePrice: 11250, isOptionsAvailable: true },
  
  // Sectoral Indices
  { symbol: 'NIFTYIT', name: 'Nifty IT', exchange: 'NSE', category: 'index', sector: 'Technology', basePrice: 31245, isOptionsAvailable: true },
  { symbol: 'NIFTYFMCG', name: 'Nifty FMCG', exchange: 'NSE', category: 'index', sector: 'FMCG', basePrice: 52180, isOptionsAvailable: true },
  { symbol: 'NIFTYPHARMA', name: 'Nifty Pharma', exchange: 'NSE', category: 'index', sector: 'Pharma', basePrice: 14250, isOptionsAvailable: true },
  { symbol: 'NIFTYAUTO', name: 'Nifty Auto', exchange: 'NSE', category: 'index', sector: 'Auto', basePrice: 16890, isOptionsAvailable: true },
  { symbol: 'NIFTYMETAL', name: 'Nifty Metal', exchange: 'NSE', category: 'index', sector: 'Metal', basePrice: 7845, isOptionsAvailable: true },
  { symbol: 'NIFTYREALTY', name: 'Nifty Realty', exchange: 'NSE', category: 'index', sector: 'Realty', basePrice: 520, isOptionsAvailable: true },
  { symbol: 'NIFTYENERGY', name: 'Nifty Energy', exchange: 'NSE', category: 'index', sector: 'Energy', basePrice: 28450, isOptionsAvailable: true },
  { symbol: 'NIFTYPSE', name: 'Nifty PSE', exchange: 'NSE', category: 'index', sector: 'PSU', basePrice: 4680, isOptionsAvailable: true },
  { symbol: 'NIFTYPVTBANK', name: 'Nifty Private Bank', exchange: 'NSE', category: 'index', sector: 'Banking', basePrice: 25680, isOptionsAvailable: true },
  { symbol: 'NIFTYINFRA', name: 'Nifty Infrastructure', exchange: 'NSE', category: 'index', sector: 'Infrastructure', basePrice: 6890, isOptionsAvailable: true },
  { symbol: 'NIFTYCOMMODITIES', name: 'Nifty Commodities', exchange: 'NSE', category: 'index', sector: 'Commodities', basePrice: 5420, isOptionsAvailable: true },
  { symbol: 'NIFTYCPSE', name: 'Nifty CPSE', exchange: 'NSE', category: 'index', sector: 'PSU', basePrice: 3890, isOptionsAvailable: true },
  { symbol: 'NIFTYMEDIA', name: 'Nifty Media', exchange: 'NSE', category: 'index', sector: 'Media', basePrice: 1850, isOptionsAvailable: true },
  { symbol: 'NIFTYOILGAS', name: 'Nifty Oil & Gas', exchange: 'NSE', category: 'index', sector: 'Oil & Gas', basePrice: 8920, isOptionsAvailable: true },
  { symbol: 'NIFTYSERVICES', name: 'Nifty Services Sector', exchange: 'NSE', category: 'index', sector: 'Services', basePrice: 24680, isOptionsAvailable: true },
  
  // Size-based Indices
  { symbol: 'NIFTYMIDCAP', name: 'Nifty Midcap 100', exchange: 'NSE', category: 'index', basePrice: 42680, isOptionsAvailable: false },
  { symbol: 'NIFTYSMALLCAP', name: 'Nifty Smallcap 100', exchange: 'NSE', category: 'index', basePrice: 13890, isOptionsAvailable: false },
  { symbol: 'NIFTYNEXT50', name: 'Nifty Next 50', exchange: 'NSE', category: 'index', basePrice: 68450, isOptionsAvailable: false },
  { symbol: 'NIFTY100', name: 'Nifty 100', exchange: 'NSE', category: 'index', basePrice: 19680, isOptionsAvailable: false },
  { symbol: 'NIFTY200', name: 'Nifty 200', exchange: 'NSE', category: 'index', basePrice: 10890, isOptionsAvailable: false },
  { symbol: 'NIFTY500', name: 'Nifty 500', exchange: 'NSE', category: 'index', basePrice: 17250, isOptionsAvailable: false },
  
  // Volatility Index
  { symbol: 'VIX', name: 'India VIX', exchange: 'NSE', category: 'index', basePrice: 13.45, isOptionsAvailable: false }
];

// BSE Indices
export const BSE_INDICES: MarketInstrument[] = [
  // Major Indices
  { symbol: 'SENSEX', name: 'BSE Sensex', exchange: 'BSE', category: 'index', lotSize: 10, basePrice: 66589, isOptionsAvailable: true },
  { symbol: 'BANKEX', name: 'BSE Bankex', exchange: 'BSE', category: 'index', lotSize: 15, basePrice: 52890, isOptionsAvailable: true },
  { symbol: 'SENSEX50', name: 'BSE Sensex 50', exchange: 'BSE', category: 'index', basePrice: 28450, isOptionsAvailable: false },
  
  // Sectoral Indices
  { symbol: 'BSEIT', name: 'BSE IT', exchange: 'BSE', category: 'index', sector: 'Technology', basePrice: 35680, isOptionsAvailable: true },
  { symbol: 'BSEHC', name: 'BSE Healthcare', exchange: 'BSE', category: 'index', sector: 'Healthcare', basePrice: 28950, isOptionsAvailable: true },
  { symbol: 'BSEAUTO', name: 'BSE Auto', exchange: 'BSE', category: 'index', sector: 'Auto', basePrice: 32450, isOptionsAvailable: true },
  { symbol: 'BSEFMCG', name: 'BSE FMCG', exchange: 'BSE', category: 'index', sector: 'FMCG', basePrice: 18920, isOptionsAvailable: true },
  { symbol: 'BSEMETAL', name: 'BSE Metal', exchange: 'BSE', category: 'index', sector: 'Metal', basePrice: 24680, isOptionsAvailable: true },
  { symbol: 'BSEOILGAS', name: 'BSE Oil & Gas', exchange: 'BSE', category: 'index', sector: 'Oil & Gas', basePrice: 19850, isOptionsAvailable: true },
  { symbol: 'BSEPOWER', name: 'BSE Power', exchange: 'BSE', category: 'index', sector: 'Power', basePrice: 5890, isOptionsAvailable: true },
  { symbol: 'BSEREALTY', name: 'BSE Realty', exchange: 'BSE', category: 'index', sector: 'Realty', basePrice: 4250, isOptionsAvailable: true },
  { symbol: 'BSETELE', name: 'BSE Telecom', exchange: 'BSE', category: 'index', sector: 'Telecom', basePrice: 1680, isOptionsAvailable: true },
  { symbol: 'BSECAP', name: 'BSE Capital Goods', exchange: 'BSE', category: 'index', sector: 'Capital Goods', basePrice: 45680, isOptionsAvailable: true },
  { symbol: 'BSECONS', name: 'BSE Consumer Durables', exchange: 'BSE', category: 'index', sector: 'Consumer Durables', basePrice: 52890, isOptionsAvailable: true },
  { symbol: 'BSEPSU', name: 'BSE PSU', exchange: 'BSE', category: 'index', sector: 'PSU', basePrice: 15680, isOptionsAvailable: true },
  
  // Size-based Indices
  { symbol: 'BSEMIDCAP', name: 'BSE Midcap', exchange: 'BSE', category: 'index', basePrice: 28450, isOptionsAvailable: false },
  { symbol: 'BSESMALLCAP', name: 'BSE Smallcap', exchange: 'BSE', category: 'index', basePrice: 31250, isOptionsAvailable: false },
  { symbol: 'BSE100', name: 'BSE 100', exchange: 'BSE', category: 'index', basePrice: 19680, isOptionsAvailable: false },
  { symbol: 'BSE200', name: 'BSE 200', exchange: 'BSE', category: 'index', basePrice: 12450, isOptionsAvailable: false },
  { symbol: 'BSE500', name: 'BSE 500', exchange: 'BSE', category: 'index', basePrice: 28950, isOptionsAvailable: false }
];

// NSE Stocks with Options
export const NSE_STOCKS: MarketInstrument[] = [
  // Nifty 50 Stocks
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', exchange: 'NSE', category: 'stock', sector: 'Oil & Gas', lotSize: 250, basePrice: 2456, isOptionsAvailable: true },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', exchange: 'NSE', category: 'stock', sector: 'IT', lotSize: 125, basePrice: 3678, isOptionsAvailable: true },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', exchange: 'NSE', category: 'stock', sector: 'Banking', lotSize: 550, basePrice: 1567, isOptionsAvailable: true },
  { symbol: 'INFY', name: 'Infosys Ltd', exchange: 'NSE', category: 'stock', sector: 'IT', lotSize: 300, basePrice: 1456, isOptionsAvailable: true },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', exchange: 'NSE', category: 'stock', sector: 'Banking', lotSize: 1375, basePrice: 987, isOptionsAvailable: true },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', exchange: 'NSE', category: 'stock', sector: 'FMCG', lotSize: 300, basePrice: 2567, isOptionsAvailable: true },
  { symbol: 'ITC', name: 'ITC Ltd', exchange: 'NSE', category: 'stock', sector: 'FMCG', lotSize: 1600, basePrice: 456, isOptionsAvailable: true },
  { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE', category: 'stock', sector: 'Banking', lotSize: 1500, basePrice: 567, isOptionsAvailable: true },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', exchange: 'NSE', category: 'stock', sector: 'Telecom', lotSize: 1200, basePrice: 890, isOptionsAvailable: true },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', exchange: 'NSE', category: 'stock', sector: 'Banking', lotSize: 400, basePrice: 1789, isOptionsAvailable: true },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd', exchange: 'NSE', category: 'stock', sector: 'Capital Goods', lotSize: 225, basePrice: 3456, isOptionsAvailable: true },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', exchange: 'NSE', category: 'stock', sector: 'Paints', lotSize: 150, basePrice: 3234, isOptionsAvailable: true },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', exchange: 'NSE', category: 'stock', sector: 'Auto', lotSize: 100, basePrice: 10567, isOptionsAvailable: true },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd', exchange: 'NSE', category: 'stock', sector: 'Banking', lotSize: 1200, basePrice: 1098, isOptionsAvailable: true },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', exchange: 'NSE', category: 'stock', sector: 'NBFC', lotSize: 125, basePrice: 6789, isOptionsAvailable: true },
  { symbol: 'TITAN', name: 'Titan Company Ltd', exchange: 'NSE', category: 'stock', sector: 'Jewellery', lotSize: 300, basePrice: 3456, isOptionsAvailable: true },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd', exchange: 'NSE', category: 'stock', sector: 'FMCG', lotSize: 25, basePrice: 23456, isOptionsAvailable: true },
  { symbol: 'WIPRO', name: 'Wipro Ltd', exchange: 'NSE', category: 'stock', sector: 'IT', lotSize: 1200, basePrice: 456, isOptionsAvailable: true },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd', exchange: 'NSE', category: 'stock', sector: 'Cement', lotSize: 100, basePrice: 9876, isOptionsAvailable: true },
  { symbol: 'TECHM', name: 'Tech Mahindra Ltd', exchange: 'NSE', category: 'stock', sector: 'IT', lotSize: 650, basePrice: 1234, isOptionsAvailable: true },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd', exchange: 'NSE', category: 'stock', sector: 'Power', lotSize: 2400, basePrice: 234, isOptionsAvailable: true },
  { symbol: 'NTPC', name: 'NTPC Ltd', exchange: 'NSE', category: 'stock', sector: 'Power', lotSize: 2000, basePrice: 345, isOptionsAvailable: true },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation Ltd', exchange: 'NSE', category: 'stock', sector: 'Oil & Gas', lotSize: 2600, basePrice: 234, isOptionsAvailable: true },
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd', exchange: 'NSE', category: 'stock', sector: 'Steel', lotSize: 800, basePrice: 123, isOptionsAvailable: true },
  { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd', exchange: 'NSE', category: 'stock', sector: 'Steel', lotSize: 1200, basePrice: 890, isOptionsAvailable: true },
  { symbol: 'COALINDIA', name: 'Coal India Ltd', exchange: 'NSE', category: 'stock', sector: 'Mining', lotSize: 2400, basePrice: 456, isOptionsAvailable: true },
  { symbol: 'DRREDDY', name: 'Dr. Reddys Laboratories Ltd', exchange: 'NSE', category: 'stock', sector: 'Pharma', lotSize: 125, basePrice: 5678, isOptionsAvailable: true },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd', exchange: 'NSE', category: 'stock', sector: 'Pharma', lotSize: 400, basePrice: 1234, isOptionsAvailable: true },
  { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone Ltd', exchange: 'NSE', category: 'stock', sector: 'Infrastructure', lotSize: 900, basePrice: 789, isOptionsAvailable: true },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', exchange: 'NSE', category: 'stock', sector: 'Auto', lotSize: 1500, basePrice: 567, isOptionsAvailable: true },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd', exchange: 'NSE', category: 'stock', sector: 'NBFC', lotSize: 500, basePrice: 1567, isOptionsAvailable: true },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd', exchange: 'NSE', category: 'stock', sector: 'IT', lotSize: 300, basePrice: 1456, isOptionsAvailable: true },
  { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd', exchange: 'NSE', category: 'stock', sector: 'FMCG', lotSize: 200, basePrice: 4567, isOptionsAvailable: true },
  
  // Additional Popular Options Stocks
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', exchange: 'NSE', category: 'stock', sector: 'Diversified', lotSize: 400, basePrice: 2890, isOptionsAvailable: true },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Ltd', exchange: 'NSE', category: 'stock', sector: 'Healthcare', lotSize: 150, basePrice: 5678, isOptionsAvailable: true },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd', exchange: 'NSE', category: 'stock', sector: 'Auto', lotSize: 150, basePrice: 6789, isOptionsAvailable: true },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd', exchange: 'NSE', category: 'stock', sector: 'Oil & Gas', lotSize: 1000, basePrice: 456, isOptionsAvailable: true },
  { symbol: 'CIPLA', name: 'Cipla Ltd', exchange: 'NSE', category: 'stock', sector: 'Pharma', lotSize: 700, basePrice: 1234, isOptionsAvailable: true },
  { symbol: 'DIVISLAB', name: 'Divis Laboratories Ltd', exchange: 'NSE', category: 'stock', sector: 'Pharma', lotSize: 200, basePrice: 3456, isOptionsAvailable: true },
  { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd', exchange: 'NSE', category: 'stock', sector: 'Auto', lotSize: 250, basePrice: 3890, isOptionsAvailable: true },
  { symbol: 'GRASIM', name: 'Grasim Industries Ltd', exchange: 'NSE', category: 'stock', sector: 'Cement', lotSize: 400, basePrice: 2345, isOptionsAvailable: true },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd', exchange: 'NSE', category: 'stock', sector: 'Auto', lotSize: 300, basePrice: 3456, isOptionsAvailable: true },
  { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd', exchange: 'NSE', category: 'stock', sector: 'Metals', lotSize: 2000, basePrice: 567, isOptionsAvailable: true },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd', exchange: 'NSE', category: 'stock', sector: 'Banking', lotSize: 900, basePrice: 1234, isOptionsAvailable: true },
  { symbol: 'IOC', name: 'Indian Oil Corporation Ltd', exchange: 'NSE', category: 'stock', sector: 'Oil & Gas', lotSize: 8000, basePrice: 123, isOptionsAvailable: true },
  { symbol: 'JSWENERGY', name: 'JSW Energy Ltd', exchange: 'NSE', category: 'stock', sector: 'Power', lotSize: 1800, basePrice: 456, isOptionsAvailable: true },
  { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd', exchange: 'NSE', category: 'stock', sector: 'Auto', lotSize: 600, basePrice: 1789, isOptionsAvailable: true },
  { symbol: 'MCDOWELL-N', name: 'United Spirits Ltd', exchange: 'NSE', category: 'stock', sector: 'Beverages', lotSize: 900, basePrice: 1234, isOptionsAvailable: true },
  { symbol: 'MOTHERSON', name: 'Motherson Sumi Systems Ltd', exchange: 'NSE', category: 'stock', sector: 'Auto Components', lotSize: 8000, basePrice: 123, isOptionsAvailable: true },
  { symbol: 'NAUKRI', name: 'Info Edge (India) Ltd', exchange: 'NSE', category: 'stock', sector: 'Internet', lotSize: 200, basePrice: 4567, isOptionsAvailable: true },
  { symbol: 'PIDILITIND', name: 'Pidilite Industries Ltd', exchange: 'NSE', category: 'stock', sector: 'Chemicals', lotSize: 350, basePrice: 2890, isOptionsAvailable: true },
  { symbol: 'SAIL', name: 'Steel Authority of India Ltd', exchange: 'NSE', category: 'stock', sector: 'Steel', lotSize: 8000, basePrice: 123, isOptionsAvailable: true },
  { symbol: 'SHREECEM', name: 'Shree Cement Ltd', exchange: 'NSE', category: 'stock', sector: 'Cement', lotSize: 25, basePrice: 28900, isOptionsAvailable: true },
  { symbol: 'SIEMENS', name: 'Siemens Ltd', exchange: 'NSE', category: 'stock', sector: 'Capital Goods', lotSize: 200, basePrice: 4567, isOptionsAvailable: true },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products Ltd', exchange: 'NSE', category: 'stock', sector: 'FMCG', lotSize: 1000, basePrice: 890, isOptionsAvailable: true },
  { symbol: 'TATAPOWER', name: 'Tata Power Company Ltd', exchange: 'NSE', category: 'stock', sector: 'Power', lotSize: 3000, basePrice: 345, isOptionsAvailable: true },
  { symbol: 'VEDL', name: 'Vedanta Ltd', exchange: 'NSE', category: 'stock', sector: 'Metals', lotSize: 3200, basePrice: 234, isOptionsAvailable: true },
  { symbol: 'VOLTAS', name: 'Voltas Ltd', exchange: 'NSE', category: 'stock', sector: 'Consumer Durables', lotSize: 1000, basePrice: 890, isOptionsAvailable: true },
  { symbol: 'ZEEL', name: 'Zee Entertainment Enterprises Ltd', exchange: 'NSE', category: 'stock', sector: 'Media', lotSize: 3600, basePrice: 234, isOptionsAvailable: true },
  
  // Banking & Financial Services
  { symbol: 'FEDERALBNK', name: 'Federal Bank Ltd', exchange: 'NSE', category: 'stock', sector: 'Banking', lotSize: 6000, basePrice: 156, isOptionsAvailable: true },
  { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank Ltd', exchange: 'NSE', category: 'stock', sector: 'Banking', lotSize: 12000, basePrice: 78, isOptionsAvailable: true },
  { symbol: 'PNB', name: 'Punjab National Bank', exchange: 'NSE', category: 'stock', sector: 'Banking', lotSize: 12000, basePrice: 89, isOptionsAvailable: true },
  { symbol: 'BANKBARODA', name: 'Bank of Baroda', exchange: 'NSE', category: 'stock', sector: 'Banking', lotSize: 4500, basePrice: 234, isOptionsAvailable: true },
  { symbol: 'CANBK', name: 'Canara Bank', exchange: 'NSE', category: 'stock', sector: 'Banking', lotSize: 3000, basePrice: 345, isOptionsAvailable: true },
  
  // IT & Technology
  { symbol: 'LTTS', name: 'L&T Technology Services Ltd', exchange: 'NSE', category: 'stock', sector: 'IT', lotSize: 200, basePrice: 4567, isOptionsAvailable: true },
  { symbol: 'MINDTREE', name: 'Mindtree Ltd', exchange: 'NSE', category: 'stock', sector: 'IT', lotSize: 200, basePrice: 4890, isOptionsAvailable: true },
  { symbol: 'MPHASIS', name: 'MphasiS Ltd', exchange: 'NSE', category: 'stock', sector: 'IT', lotSize: 350, basePrice: 2890, isOptionsAvailable: true },
  { symbol: 'PERSISTENT', name: 'Persistent Systems Ltd', exchange: 'NSE', category: 'stock', sector: 'IT', lotSize: 200, basePrice: 5678, isOptionsAvailable: true },
  
  // Pharma & Healthcare
  { symbol: 'BIOCON', name: 'Biocon Ltd', exchange: 'NSE', category: 'stock', sector: 'Pharma', lotSize: 2400, basePrice: 345, isOptionsAvailable: true },
  { symbol: 'CADILAHC', name: 'Cadila Healthcare Ltd', exchange: 'NSE', category: 'stock', sector: 'Pharma', lotSize: 1500, basePrice: 567, isOptionsAvailable: true },
  { symbol: 'LUPIN', name: 'Lupin Ltd', exchange: 'NSE', category: 'stock', sector: 'Pharma', lotSize: 800, basePrice: 1234, isOptionsAvailable: true },
  { symbol: 'TORNTPHARM', name: 'Torrent Pharmaceuticals Ltd', exchange: 'NSE', category: 'stock', sector: 'Pharma', lotSize: 400, basePrice: 2890, isOptionsAvailable: true },
  
  // Auto & Auto Components
  { symbol: 'ASHOKLEY', name: 'Ashok Leyland Ltd', exchange: 'NSE', category: 'stock', sector: 'Auto', lotSize: 6000, basePrice: 189, isOptionsAvailable: true },
  { symbol: 'ESCORTS', name: 'Escorts Ltd', exchange: 'NSE', category: 'stock', sector: 'Auto', lotSize: 400, basePrice: 2345, isOptionsAvailable: true },
  { symbol: 'EXIDEIND', name: 'Exide Industries Ltd', exchange: 'NSE', category: 'stock', sector: 'Auto Components', lotSize: 3000, basePrice: 234, isOptionsAvailable: true },
  { symbol: 'FORCEMOT', name: 'Force Motors Ltd', exchange: 'NSE', category: 'stock', sector: 'Auto', lotSize: 600, basePrice: 1789, isOptionsAvailable: true },
  { symbol: 'MRF', name: 'MRF Ltd', exchange: 'NSE', category: 'stock', sector: 'Auto Components', lotSize: 10, basePrice: 123456, isOptionsAvailable: true },
  { symbol: 'TVSMOTOR', name: 'TVS Motor Company Ltd', exchange: 'NSE', category: 'stock', sector: 'Auto', lotSize: 600, basePrice: 1890, isOptionsAvailable: true },
  
  // Metals & Mining
  { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power Ltd', exchange: 'NSE', category: 'stock', sector: 'Steel', lotSize: 1500, basePrice: 567, isOptionsAvailable: true },
  { symbol: 'NMDC', name: 'NMDC Ltd', exchange: 'NSE', category: 'stock', sector: 'Mining', lotSize: 6000, basePrice: 189, isOptionsAvailable: true },
  { symbol: 'RATNAMANI', name: 'Ratnamani Metals & Tubes Ltd', exchange: 'NSE', category: 'stock', sector: 'Metals', lotSize: 350, basePrice: 2890, isOptionsAvailable: true },
  { symbol: 'WELCORP', name: 'Welspun Corp Ltd', exchange: 'NSE', category: 'stock', sector: 'Metals', lotSize: 3000, basePrice: 345, isOptionsAvailable: true },
  
  // FMCG & Consumer
  { symbol: 'COLPAL', name: 'Colgate Palmolive (India) Ltd', exchange: 'NSE', category: 'stock', sector: 'FMCG', lotSize: 400, basePrice: 2345, isOptionsAvailable: true },
  { symbol: 'DABUR', name: 'Dabur India Ltd', exchange: 'NSE', category: 'stock', sector: 'FMCG', lotSize: 1500, basePrice: 567, isOptionsAvailable: true },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products Ltd', exchange: 'NSE', category: 'stock', sector: 'FMCG', lotSize: 800, basePrice: 1234, isOptionsAvailable: true },
  { symbol: 'MARICO', name: 'Marico Ltd', exchange: 'NSE', category: 'stock', sector: 'FMCG', lotSize: 1500, basePrice: 567, isOptionsAvailable: true },
  { symbol: 'UBL', name: 'United Breweries Ltd', exchange: 'NSE', category: 'stock', sector: 'Beverages', lotSize: 600, basePrice: 1789, isOptionsAvailable: true },
  
  // Telecom & Media
  { symbol: 'IDEA', name: 'Vodafone Idea Ltd', exchange: 'NSE', category: 'stock', sector: 'Telecom', lotSize: 60000, basePrice: 12, isOptionsAvailable: true },
  { symbol: 'RCOM', name: 'Reliance Communications Ltd', exchange: 'NSE', category: 'stock', sector: 'Telecom', lotSize: 60000, basePrice: 8, isOptionsAvailable: true },
  
  // Real Estate
  { symbol: 'DLF', name: 'DLF Ltd', exchange: 'NSE', category: 'stock', sector: 'Real Estate', lotSize: 2000, basePrice: 456, isOptionsAvailable: true },
  { symbol: 'GODREJPROP', name: 'Godrej Properties Ltd', exchange: 'NSE', category: 'stock', sector: 'Real Estate', lotSize: 400, basePrice: 2345, isOptionsAvailable: true },
  { symbol: 'OBEROIRLTY', name: 'Oberoi Realty Ltd', exchange: 'NSE', category: 'stock', sector: 'Real Estate', lotSize: 800, basePrice: 1234, isOptionsAvailable: true },
  { symbol: 'PRESTIGE', name: 'Prestige Estates Projects Ltd', exchange: 'NSE', category: 'stock', sector: 'Real Estate', lotSize: 1500, basePrice: 567, isOptionsAvailable: true }
];

// All Market Instruments Combined
export const ALL_MARKET_INSTRUMENTS: MarketInstrument[] = [
  ...NSE_INDICES,
  ...BSE_INDICES,
  ...NSE_STOCKS
];

// Helper functions
export function getInstrumentsByExchange(exchange: 'NSE' | 'BSE'): MarketInstrument[] {
  return ALL_MARKET_INSTRUMENTS.filter(instrument => instrument.exchange === exchange);
}

export function getInstrumentsByCategory(category: 'index' | 'stock'): MarketInstrument[] {
  return ALL_MARKET_INSTRUMENTS.filter(instrument => instrument.category === category);
}

export function getOptionsAvailableInstruments(): MarketInstrument[] {
  return ALL_MARKET_INSTRUMENTS.filter(instrument => instrument.isOptionsAvailable);
}

export function getInstrumentsBySector(sector: string): MarketInstrument[] {
  return ALL_MARKET_INSTRUMENTS.filter(instrument => instrument.sector === sector);
}

export function getInstrumentBySymbol(symbol: string): MarketInstrument | undefined {
  return ALL_MARKET_INSTRUMENTS.find(instrument => instrument.symbol === symbol);
}

export function getAllSectors(): string[] {
  const sectors = new Set<string>();
  ALL_MARKET_INSTRUMENTS.forEach(instrument => {
    if (instrument.sector) {
      sectors.add(instrument.sector);
    }
  });
  return Array.from(sectors).sort();
}

export function getPopularOptionsStocks(): MarketInstrument[] {
  const popularSymbols = [
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC', 'SBIN',
    'BHARTIARTL', 'KOTAKBANK', 'LT', 'ASIANPAINT', 'MARUTI', 'AXISBANK', 'BAJFINANCE',
    'TITAN', 'NESTLEIND', 'WIPRO', 'ULTRACEMCO', 'TECHM'
  ];
  
  return ALL_MARKET_INSTRUMENTS.filter(instrument => 
    popularSymbols.includes(instrument.symbol) && instrument.isOptionsAvailable
  );
}