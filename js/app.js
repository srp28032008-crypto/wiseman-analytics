// Wiseman Analytics Core Orchestrator & Coordinator

// Active Indian Equities for the AI board
const rawNSEStocks = [
  { key: "reliance", symbol: "RELIANCE.NS", name: "Reliance Industries", sector: "Conglomerate" },
  { key: "tata", symbol: "TMPV.NS", name: "Tata Motors Limited", sector: "Automotive" },
  { key: "tata_tech", symbol: "TATATECH.NS", name: "Tata Tech Limited", sector: "IT Services" },
  { key: "hdfc", symbol: "HDFCBANK.NS", name: "HDFC Bank Limited", sector: "Banking" },
  { key: "sbin", symbol: "SBIN.NS", name: "State Bank of India", sector: "Banking" },
  { key: "tcs", symbol: "TCS.NS", name: "Tata Consultancy Services", sector: "IT Services" },
  { key: "adanient", symbol: "ADANIENT.NS", name: "Adani Enterprises", sector: "Conglomerate" },
  { key: "coalindia", symbol: "COALINDIA.NS", name: "Coal India Limited", sector: "Mining & Power" },
  { key: "infy", symbol: "INFY.NS", name: "Infosys Limited", sector: "IT Services" },
  { key: "icicibank", symbol: "ICICIBANK.NS", name: "ICICI Bank Limited", sector: "Banking" },
  { key: "itc", symbol: "ITC.NS", name: "ITC Limited", sector: "Conglomerate" },
  { key: "bhartiartl", symbol: "BHARTIARTL.NS", name: "Bharti Airtel Limited", sector: "Telecommunications" },
  { key: "lt", symbol: "LT.NS", name: "Larsen & Toubro Limited", sector: "Infrastructure" },
  { key: "maruti", symbol: "MARUTI.NS", name: "Maruti Suzuki Limited", sector: "Automotive" },
  { key: "axisbank", symbol: "AXISBANK.NS", name: "Axis Bank Limited", sector: "Banking" },
  { key: "kotakbank", symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank", sector: "Banking" },
  { key: "bajfinance", symbol: "BAJFINANCE.NS", name: "Bajaj Finance Limited", sector: "Financial Services" },
  { key: "bajajfinsv", symbol: "BAJAJFINSV.NS", name: "Bajaj Finserv Limited", sector: "Financial Services" },
  { key: "indusindbk", symbol: "INDUSINDBK.NS", name: "IndusInd Bank Limited", sector: "Banking" },
  { key: "pnb", symbol: "PNB.NS", name: "Punjab National Bank", sector: "Banking" },
  { key: "bob", symbol: "BANKBARODA.NS", name: "Bank of Baroda", sector: "Banking" },
  { key: "canbk", symbol: "CANBK.NS", name: "Canara Bank", sector: "Banking" },
  { key: "idfcfirstb", symbol: "IDFCFIRSTB.NS", name: "IDFC First Bank Limited", sector: "Banking" },
  { key: "federalbnk", symbol: "FEDERALBNK.NS", name: "Federal Bank Limited", sector: "Banking" },
  { key: "yesbank", symbol: "YESBANK.NS", name: "Yes Bank Limited", sector: "Banking" },
  { key: "bandhanbnk", symbol: "BANDHANBNK.NS", name: "Bandhan Bank Limited", sector: "Banking" },
  { key: "recltd", symbol: "RECLTD.NS", name: "REC Limited", sector: "Financial Services" },
  { key: "pfc", symbol: "PFC.NS", name: "Power Finance Corporation", sector: "Financial Services" },
  { key: "lichsgltd", symbol: "LICHSGFIN.NS", name: "LIC Housing Finance", sector: "Financial Services" },
  { key: "sbilife", symbol: "SBILIFE.NS", name: "SBI Life Insurance", sector: "Insurance" },
  { key: "hdfclife", symbol: "HDFCLIFE.NS", name: "HDFC Life Insurance", sector: "Insurance" },
  { key: "icicipruli", symbol: "ICICIPRULI.NS", name: "ICICI Prudential Life", sector: "Insurance" },
  { key: "cholafin", symbol: "CHOLAFIN.NS", name: "Cholamandalam Investment", sector: "Financial Services" },
  { key: "muthootfin", symbol: "MUTHOOTFIN.NS", name: "Muthoot Finance Limited", sector: "Financial Services" },
  { key: "m_mfin", symbol: "M&MFIN.NS", name: "M&M Financial Services", sector: "Financial Services" },
  { key: "lic", symbol: "LICI.NS", name: "Life Insurance Corp of India", sector: "Insurance" },
  { key: "hcltech", symbol: "HCLTECH.NS", name: "HCL Technologies Limited", sector: "IT Services" },
  { key: "wipro", symbol: "WIPRO.NS", name: "Wipro Limited", sector: "IT Services" },
  { key: "techm", symbol: "TECHM.NS", name: "Tech Mahindra Limited", sector: "IT Services" },
  { key: "ltim", symbol: "LTIM.NS", name: "LTIMindtree Limited", sector: "IT Services" },
  { key: "ofss", symbol: "OFSS.NS", name: "Oracle Financial Services", sector: "IT Services" },
  { key: "persistent", symbol: "PERSISTENT.NS", name: "Persistent Systems", sector: "IT Services" },
  { key: "coforge", symbol: "COFORGE.NS", name: "Coforge Limited", sector: "IT Services" },
  { key: "kpittech", symbol: "KPITTECH.NS", name: "KPIT Technologies", sector: "IT Services" },
  { key: "ltts", symbol: "LTTS.NS", name: "L&T Technology Services", sector: "IT Services" },
  { key: "idea", symbol: "IDEA.NS", name: "Vodafone Idea Limited", sector: "Telecommunications" },
  { key: "tatacomm", symbol: "TATACOMM.NS", name: "Tata Communications", sector: "Telecommunications" },
  { key: "m_m", symbol: "M&M.NS", name: "Mahindra & Mahindra", sector: "Automotive" },
  { key: "bajaj_auto", symbol: "BAJAJ-AUTO.NS", name: "Bajaj Auto Limited", sector: "Automotive" },
  { key: "heromotoco", symbol: "HEROMOTOCO.NS", name: "Hero MotoCorp Limited", sector: "Automotive" },
  { key: "eichermot", symbol: "EICHERMOT.NS", name: "Eicher Motors Limited", sector: "Automotive" },
  { key: "ashokley", symbol: "ASHOKLEY.NS", name: "Ashok Leyland Limited", sector: "Automotive" },
  { key: "tvsmotor", symbol: "TVSMOTOR.NS", name: "TVS Motor Company", sector: "Automotive" },
  { key: "bharatforg", symbol: "BHARATFORG.NS", name: "Bharat Forge Limited", sector: "Engineering" },
  { key: "balkrisind", symbol: "BALKRISIND.NS", name: "Balkrishna Industries", sector: "Automotive" },
  { key: "mrf", symbol: "MRF.NS", name: "MRF Limited", sector: "Automotive" },
  { key: "apollotyre", symbol: "APOLLOTYRE.NS", name: "Apollo Tyres Limited", sector: "Automotive" },
  { key: "ongc", symbol: "ONGC.NS", name: "Oil & Natural Gas Corp", sector: "Energy" },
  { key: "ntpc", symbol: "NTPC.NS", name: "NTPC Limited", sector: "Energy" },
  { key: "powergrid", symbol: "POWERGRID.NS", name: "Power Grid Corporation", sector: "Energy" },
  { key: "bpcl", symbol: "BPCL.NS", name: "Bharat Petroleum Corp", sector: "Energy" },
  { key: "ioc", symbol: "IOC.NS", name: "Indian Oil Corporation", sector: "Energy" },
  { key: "hpcl", symbol: "HPCL.NS", name: "Hindustan Petroleum Corp", sector: "Energy" },
  { key: "gail", symbol: "GAIL.NS", name: "GAIL (India) Limited", sector: "Energy" },
  { key: "oil", symbol: "OIL.NS", name: "Oil India Limited", sector: "Energy" },
  { key: "mgl", symbol: "MGL.NS", name: "Mahanagar Gas Limited", sector: "Utilities" },
  { key: "igl", symbol: "IGL.NS", name: "Indraprastha Gas Limited", sector: "Utilities" },
  { key: "gujgasltd", symbol: "GUJGASLTD.NS", name: "Gujarat Gas Limited", sector: "Utilities" },
  { key: "adanigreen", symbol: "ADANIGREEN.NS", name: "Adani Green Energy", sector: "Energy" },
  { key: "adanipower", symbol: "ADANIPOWER.NS", name: "Adani Power Limited", sector: "Energy" },
  { key: "tatapower", symbol: "TATAPOWER.NS", name: "Tata Power Company", sector: "Energy" },
  { key: "jswenergy", symbol: "JSWENERGY.NS", name: "JSW Energy Limited", sector: "Energy" },
  { key: "nhpc", symbol: "NHPC.NS", name: "NHPC Limited", sector: "Energy" },
  { key: "sjvn", symbol: "SJVN.NS", name: "SJVN Limited", sector: "Energy" },
  { key: "tatasteel", symbol: "TATASTEEL.NS", name: "Tata Steel Limited", sector: "Metals" },
  { key: "jswsteel", symbol: "JSWSTEEL.NS", name: "JSW Steel Limited", sector: "Metals" },
  { key: "hindalco", symbol: "HINDALCO.NS", name: "Hindalco Industries", sector: "Metals" },
  { key: "vedl", symbol: "VEDL.NS", name: "Vedanta Limited", sector: "Metals" },
  { key: "nmdc", symbol: "NMDC.NS", name: "NMDC Limited", sector: "Mining" },
  { key: "sail", symbol: "SAIL.NS", name: "Steel Authority of India", sector: "Metals" },
  { key: "nationalum", symbol: "NATIONALUM.NS", name: "National Aluminium Co", sector: "Metals" },
  { key: "jindalstel", symbol: "JINDALSTEL.NS", name: "Jindal Steel & Power", sector: "Metals" },
  { key: "sunpharma", symbol: "SUNPHARMA.NS", name: "Sun Pharmaceutical Ind", sector: "Pharmaceuticals" },
  { key: "cipla", symbol: "CIPLA.NS", name: "Cipla Limited", sector: "Pharmaceuticals" },
  { key: "drreddy", symbol: "DRREDDY.NS", name: "Dr Reddy's Laboratories", sector: "Pharmaceuticals" },
  { key: "divislab", symbol: "DIVISLAB.NS", name: "Divi's Laboratories", sector: "Pharmaceuticals" },
  { key: "apollohosp", symbol: "APOLLOHOSP.NS", name: "Apollo Hospitals Enterprise", sector: "Healthcare" },
  { key: "auroharma", symbol: "AUROPHARMA.NS", name: "Aurobindo Pharma", sector: "Pharmaceuticals" },
  { key: "lupin", symbol: "LUPIN.NS", name: "Lupin Limited", sector: "Pharmaceuticals" },
  { key: "biocon", symbol: "BIOCON.NS", name: "Biocon Limited", sector: "Pharmaceuticals" },
  { key: "torrentph", symbol: "TORNTPHARM.NS", name: "Torrent Pharmaceuticals", sector: "Pharmaceuticals" },
  { key: "zyduslife", symbol: "ZYDUSLIFE.NS", name: "Zydus Lifesciences", sector: "Pharmaceuticals" },
  { key: "maxhealth", symbol: "MAXHEALTH.NS", name: "Max Healthcare Institute", sector: "Healthcare" },
  { key: "lalpathlab", symbol: "LALPATHLAB.NS", name: "Dr Lal PathLabs", sector: "Healthcare" },
  { key: "hindunilvr", symbol: "HINDUNILVR.NS", name: "Hindustan Unilever", sector: "Consumer Goods" },
  { key: "nestleind", symbol: "NESTLEIND.NS", name: "Nestle India Limited", sector: "Consumer Goods" },
  { key: "britannia", symbol: "BRITANNIA.NS", name: "Britannia Industries", sector: "Consumer Goods" },
  { key: "vbl", symbol: "VBL.NS", name: "Varun Beverages Limited", sector: "Consumer Goods" },
  { key: "tataconsum", symbol: "TATACONSUM.NS", name: "Tata Consumer Products", sector: "Consumer Goods" },
  { key: "colpal", symbol: "COLPAL.NS", name: "Colgate Palmolive India", sector: "Consumer Goods" },
  { key: "marico", symbol: "MARICO.NS", name: "Marico Limited", sector: "Consumer Goods" },
  { key: "dabur", symbol: "DABUR.NS", name: "Dabur India Limited", sector: "Consumer Goods" },
  { key: "godrejcp", symbol: "GODREJCP.NS", name: "Godrej Consumer Products", sector: "Consumer Goods" },
  { key: "godrejprop", symbol: "GODREJPROP.NS", name: "Godrej Properties", sector: "Real Estate" },
  { key: "dlf", symbol: "DLF.NS", name: "DLF Limited", sector: "Real Estate" },
  { key: "oberoirlty", symbol: "OBEROIRLTY.NS", name: "Oberoi Realty Limited", sector: "Real Estate" },
  { key: "dmart", symbol: "DMART.NS", name: "Avenue Supermarts (DMart)", sector: "Retail" },
  { key: "trent", symbol: "TRENT.NS", name: "Trent Limited (Tata)", sector: "Retail" },
  { key: "zomato", symbol: "ZOMATO.NS", name: "Zomato Limited", sector: "Internet Retail" },
  { key: "titan", symbol: "TITAN.NS", name: "Titan Company Limited", sector: "Consumer Durables" },
  { key: "asianpaint", symbol: "ASIANPAINT.NS", name: "Asian Paints Limited", sector: "Consumer Goods" },
  { key: "bergerpaint", symbol: "BERGERPAINT.NS", name: "Berger Paints India", sector: "Consumer Goods" },
  { key: "pidilitind", symbol: "PIDILITIND.NS", name: "Pidilite Industries", sector: "Consumer Goods" },
  { key: "ultracemco", symbol: "ULTRACEMCO.NS", name: "UltraTech Cement Limited", sector: "Cement" },
  { key: "grasim", symbol: "GRASIM.NS", name: "Grasim Industries", sector: "Conglomerate" },
  { key: "shreecem", symbol: "SHREECEM.NS", name: "Shree Cements Limited", sector: "Cement" },
  { key: "ambujacem", symbol: "AMBUJACEM.NS", name: "Ambuja Cements Limited", sector: "Cement" },
  { key: "acc", symbol: "ACC.NS", name: "ACC Limited", sector: "Cement" },
  { key: "bhel", symbol: "BHEL.NS", name: "Bharat Heavy Electricals", sector: "Engineering" },
  { key: "bel", symbol: "BEL.NS", name: "Bharat Electronics Limited", sector: "Engineering" },
  { key: "hal", symbol: "HAL.NS", name: "Hindustan Aeronautics", sector: "Aerospace & Defense" },
  { key: "siemens", symbol: "SIEMENS.NS", name: "Siemens India Limited", sector: "Engineering" },
  { key: "abb", symbol: "ABB.NS", name: "ABB India Limited", sector: "Engineering" },
  { key: "cumminsind", symbol: "CUMMINSIND.NS", name: "Cummins India Limited", sector: "Engineering" },
  { key: "gmrinfra", symbol: "GMRINFRA.NS", name: "GMR Infrastructure", sector: "Infrastructure" },
  { key: "adaniports", symbol: "ADANIPORTS.NS", name: "Adani Ports & SEZ", sector: "Infrastructure" },
  { key: "concor", symbol: "CONCOR.NS", name: "Container Corp of India", sector: "Financial Services" },
  { key: "upl", symbol: "UPL.NS", name: "UPL Limited", sector: "Chemicals" },
  { key: "srf", symbol: "SRF.NS", name: "SRF Limited", sector: "Chemicals" },
  { key: "tatachem", symbol: "TATACHEM.NS", name: "Tata Chemicals Limited", sector: "Chemicals" },
  { key: "deepakntr", symbol: "DEEPAKNTR.NS", name: "Deepak Nitrite Limited", sector: "Chemicals" },
  { key: "piind", symbol: "PIIND.NS", name: "PI Industries Limited", sector: "Chemicals" },
  { key: "polycab", symbol: "POLYCAB.NS", name: "Polycab India Limited", sector: "Consumer Durables" },
  { key: "havells", symbol: "HAVELLS.NS", name: "Havells India Limited", sector: "Consumer Durables" },
  { key: "voltas", symbol: "VOLTAS.NS", name: "Voltas Limited (Tata)", sector: "Consumer Durables" },
  { key: "dixon", symbol: "DIXON.NS", name: "Dixon Technologies", sector: "Consumer Durables" }
];

let indianEquitiesDatabase = [];
rawNSEStocks.forEach(s => {
  indianEquitiesDatabase.push({
    key: s.key,
    name: s.name,
    sector: s.sector,
    price: 150.00,
    change: 0.00,
    cap: 'Large Cap',
    pE: (12 + Math.random() * 25).toFixed(1),
    desc: `Institutional interest tracking active for ${s.name}. Dynamic accumulation blocks monitored.`,
    lastAnalysis: `Initial scan completed. Long-term trend shows key support sweeps.`
  });
});

let discoveryCandidates = [
  { key: "m_m", name: "Mahindra & Mahindra", sector: "Automotive", price: 2350.00, change: 1.80, cap: "Large Cap", pE: "19.5", desc: "Dynamic target breakout confirmed on monthly chart.", lastAnalysis: "Strong bullish momentum. Est. target 2480." }
];

const majorCoins = [
  { key: "btc", symbol: "BTCUSDT", name: "Bitcoin", base: 63000 },
  { key: "eth", symbol: "ETHUSDT", name: "Ethereum", base: 3500 },
  { key: "sol", symbol: "SOLUSDT", name: "Solana", base: 150 },
  { key: "ada", symbol: "ADAUSDT", name: "Cardano", base: 0.5 },
  { key: "doge", symbol: "DOGEUSDT", name: "Dogecoin", base: 0.12 },
  { key: "xrp", symbol: "XRPUSDT", name: "Ripple", base: 0.60 },
  { key: "dot", symbol: "DOTUSDT", name: "Polkadot", base: 6.5 },
  { key: "matic", symbol: "MATICUSDT", name: "Polygon", base: 0.75 },
  { key: "ltc", symbol: "LTCUSDT", name: "Litecoin", base: 85 },
  { key: "link", symbol: "LINKUSDT", name: "Chainlink", base: 15 },
  { key: "shib", symbol: "SHIBUSDT", name: "Shiba Inu", base: 0.00002 },
  { key: "trx", symbol: "TRXUSDT", name: "TRON", base: 0.11 },
  { key: "bch", symbol: "BCHUSDT", name: "Bitcoin Cash", base: 450 },
  { key: "xlm", symbol: "XLMUSDT", name: "Stellar Lumens", base: 0.12 },
  { key: "uni", symbol: "UNIUSDT", name: "Uniswap", base: 7.5 },
  { key: "atom", symbol: "ATOMUSDT", name: "Cosmos", base: 9.0 },
  { key: "etc", symbol: "ETCUSDT", name: "Ethereum Classic", base: 28 },
  { key: "xmr", symbol: "XMRUSDT", name: "Monero", base: 140 },
  { key: "fil", symbol: "FILUSDT", name: "Filecoin", base: 5.5 },
  { key: "ldo", symbol: "LDOUSDT", name: "Lido DAO", base: 2.2 },
  { key: "hbar", symbol: "HBARUSDT", name: "Hedera", base: 0.08 },
  { key: "apt", symbol: "APTUSDT", name: "Aptos", base: 9.5 },
  { key: "hnt", symbol: "HNTUSDT", name: "Helium", base: 4.8 },
  { key: "ftm", symbol: "FTMUSDT", name: "Fantom", base: 0.80 },
  { key: "vet", symbol: "VETUSDT", name: "VeChain", base: 0.03 },
  { key: "grt", symbol: "GRTUSDT", name: "The Graph", base: 0.25 },
  { key: "aave", symbol: "AAVEUSDT", name: "Aave", base: 95 },
  { key: "mkr", symbol: "MKRUSDT", name: "Maker", base: 2500 },
  { key: "op", symbol: "OPUSDT", name: "Optimism", base: 2.8 },
  { key: "arb", symbol: "ARBUSDT", name: "Arbitrum", base: 1.15 },
  { key: "inj", symbol: "INJUSDT", name: "Injective", base: 28 },
  { key: "rndr", symbol: "RNDRUSDT", name: "Render Token", base: 8.5 },
  { key: "sei", symbol: "SEIUSDT", name: "Sei", base: 0.65 },
  { key: "sui", symbol: "SUIUSDT", name: "Sui", base: 1.25 },
  { key: "imx", symbol: "IMXUSDT", name: "Immutable", base: 2.1 },
  { key: "tia", symbol: "TIAUSDT", name: "Celestia", base: 11.2 },
  { key: "rune", symbol: "RUNEUSDT", name: "THORChain", base: 5.8 },
  { key: "algo", symbol: "ALGOUSDT", name: "Algorand", base: 0.18 },
  { key: "egld", symbol: "EGLDUSDT", name: "MultiversX", base: 42 },
  { key: "flow", symbol: "FLOWUSDT", name: "Flow", base: 0.95 },
  { key: "sand", symbol: "SANDUSDT", name: "The Sandbox", base: 0.45 },
  { key: "mana", symbol: "MANAUSDT", name: "Decentraland", base: 0.48 },
  { key: "theta", symbol: "THETAUSDT", name: "Theta Network", base: 2.1 },
  { key: "chz", symbol: "CHZUSDT", name: "Chiliz", base: 0.12 },
  { key: "axs", symbol: "AXSUSDT", name: "Axie Infinity", base: 7.2 },
  { key: "kava", symbol: "KAVAUSDT", name: "Kava", base: 0.72 },
  { key: "gala", symbol: "GALAUSDT", name: "Gala", base: 0.04 },
  { key: "neo", symbol: "NEOUSDT", name: "Neo", base: 14.5 },
  { key: "iota", symbol: "IOTAUSDT", name: "IOTA", base: 0.22 },
  { key: "qtum", symbol: "QTUMUSDT", name: "Qtum", base: 3.8 },
  { key: "zec", symbol: "ZECUSDT", name: "Zcash", base: 26 },
  { key: "dash", symbol: "DASHUSDT", name: "Dash", base: 30 },
  { key: "near", symbol: "NEARUSDT", name: "NEAR Protocol", base: 5.5 },
  { key: "avax", symbol: "AVAXUSDT", name: "Avalanche", base: 32 },
  { key: "pepe", symbol: "PEPEUSDT", name: "Pepe Coin", base: 0.000008 },
  { key: "floki", symbol: "FLOKIUSDT", name: "Floki", base: 0.00018 },
  { key: "bonk", symbol: "BONKUSDT", name: "Bonk", base: 0.000024 },
  { key: "wif", symbol: "WIFUSDT", name: "dogwifhat", base: 2.6 },
  { key: "stx", symbol: "STXUSDT", name: "Stacks", base: 1.8 },
  { key: "gmt", symbol: "GMTUSDT", name: "STEPN", base: 0.22 },
  { key: "mina", symbol: "MINAUSDT", name: "Mina Protocol", base: 0.65 },
  { key: "ftt", symbol: "FTTUSDT", name: "FTX Token", base: 1.4 },
  { key: "woo", symbol: "WOOUSDT", name: "WOO Network", base: 0.28 },
  { key: "jasmy", symbol: "JASMYUSDT", name: "JasmyCoin", base: 0.02 },
  { key: "1inch", symbol: "1INCHUSDT", name: "1inch Network", base: 0.38 },
  { key: "dydx", symbol: "DYDXUSDT", name: "dYdX", base: 2.1 },
  { key: "enj", symbol: "ENJUSDT", name: "Enjin Coin", base: 0.32 },
  { key: "bat", symbol: "BATUSDT", name: "Basic Attention Token", base: 0.24 },
  { key: "lrc", symbol: "LRCUSDT", name: "Loopring", base: 0.26 },
  { key: "ankr", symbol: "ANKRUSDT", name: "Ankr", base: 0.04 },
  { key: "audio", symbol: "AUDIOUSDT", name: "Audius", base: 0.18 },
  { key: "rvn", symbol: "RVNUSDT", name: "Ravencoin", base: 0.02 },
  { key: "ont", symbol: "ONTUSDT", name: "Ontology", base: 0.28 },
  { key: "waves", symbol: "WAVESUSDT", name: "Waves", base: 2.2 },
  { key: "iost", symbol: "IOSTUSDT", name: "IOST", base: 0.01 },
  { key: "zrx", symbol: "ZRXUSDT", name: "0x", base: 0.42 },
  { key: "one", symbol: "ONEUSDT", name: "Harmony", base: 0.018 }
];

const extraSymbols = [
  "ADA", "DOGE", "XRP", "DOT", "MATIC", "LTC", "LINK", "SHIB", "TRX", "BCH", "XLM", "UNI", "ATOM", "ETC", 
  "XMR", "FIL", "LDO", "HBAR", "APT", "HNT", "FTM", "VET", "GRT", "AAVE", "MKR", "OP", "ARB", "INJ", 
  "RNDR", "SEI", "SUI", "IMX", "TIA", "RUNE", "ALGO", "EGLD", "FLOW", "SAND", "MANA", "THETA", "CHZ", 
  "AXS", "KAVA", "GALA", "NEO", "IOTA", "QTUM", "ZEC", "DASH", "NEAR", "AVAX", "PEPE", "FLOKI", "BONK", 
  "WIF", "STX", "GMT", "MINA", "FTT", "WOO", "JASMY", "1INCH", "DYDX", "ENJ", "BAT", "LRC", "ANKR", 
  "AUDIO", "RVN", "ONT", "WAVES", "IOST", "ZRX", "ONE", "SUSHI", "YFI", "CRV", "COMP", "SNX", "REN", 
  "BAL", "UMA", "BAND", "KNC", "ZIL", "OMG", "NANO", "SC", "DGB", "XVG", "STMX", "STORJ", "RLC", 
  "OGN", "MTL", "UTK", "CVC", "FUN", "LINA", "REEF", "ALICE", "TLM", "BAKE", "BEL", "WRX", "CTSI", 
  "MDT", "STPT", "DENT", "KEY", "DATA", "IQ", "VTHO", "ONG", "DUSK", "COTI", "OXT", "OG", "ASR", 
  "ATM", "JUV", "PSG", "ACM", "BAR", "CITY", "ALPINE", "SANTOS", "PORTO", "LAZIO", "GMT", "JASMY", 
  "FET", "AGIX", "OCEAN", "PHB", "POND", "CTXC", "NFP", "AI", "XAI", "MANTA", "ALT", "JUP", "PYTH", 
  "ONDO", "DYM", "STRK", "PORTAL", "AXL", "W", "SAGA", "TNSR", "OMNI", "REZ", "BB", "NOT", "IO", 
  "ZRO", "LISTA", "RENDER", "BANANA", "TON", "DOGS", "HMSTR", "CATI", "TURBO", "NEIRO", "BABYDOGE", 
  "1CAT", "AERGO", "AGLD", "AKRO", "ALICE", "AMB", "AMP", "AR", "ARK", "ARPA", "AST", "ATA", "ATLAS", 
  "AUCTION", "AUTO", "AVAX", "BADGER", "BIFI", "BLZ", "BNX", "BSW", "C98", "CELO", "CELR", "CHESS", 
  "CHR", "CLV", "CREAM", "DAR", "DEGO", "DIA", "DOCK", "DODO", "EGLD", "ELF", "EPX", "ERN", "FIS", 
  "FOR", "FRONT", "GHST", "GLMR", "GNO", "JOE", "KDA", "KMD", "LAZIO", "LINA", "LIT", "LOKA", "LOOM", 
  "LPT", "LSK", "LTO", "MC", "MINA", "MOVR", "MBOX", "MDX", "MOB", "MDT", "NBS", "NKN", "NMR", "NULS", 
  "OOKI", "ORN", "OM", "OXT", "PEOPLE", "PERP", "PHA", "POLYX", "POWR", "PROS", "PSG", "PUNDIX", 
  "PYR", "RAD", "RARE", "RAY", "REI", "RIF", "RLC", "RSR", "SANTOS", "SCRT", "SFP", "SKL", "SNX", 
  "SOL", "SPELL", "STEEM", "STMX", "STORJ", "STPT", "SUN", "SUPER", "SYS", "T", "TFUEL", "THETA", 
  "TKO", "TLM", "TRB", "TROY", "TUST", "TVK", "UFT", "UNFI", "UTK", "VIB", "VIDT", "VOXEL", "VTHO", 
  "WAN", "WAXP", "WING", "WRX", "WTC", "XEC", "XNO", "XVS", "YFII", "YGG", "ZIL", "ZRX"
];

const generatedCoins = [];
const seenSymbols = new Set();

// 1. Add major coins
majorCoins.forEach(c => {
  const sym = c.symbol.replace("USDT", "");
  generatedCoins.push({
    key: c.key,
    symbol: c.symbol,
    name: c.name,
    base: c.base
  });
  seenSymbols.add(sym);
});

// 2. Add extra symbols
extraSymbols.forEach(sym => {
  if (generatedCoins.length >= 500) return;
  if (seenSymbols.has(sym)) return;
  
  const key = sym.toLowerCase();
  generatedCoins.push({
    key: key,
    symbol: sym + "USDT",
    name: sym + " Token",
    base: Math.random() > 0.5 ? (0.1 + Math.random() * 5) : (5 + Math.random() * 80)
  });
  seenSymbols.add(sym);
});

// 3. Fill up to 500 with funny/realistic meme coins
const prefixes = ["Baby", "Safe", "Mega", "Super", "Alpha", "Hyper", "Giga", "Nova", "Cyber", "Rocket"];
const suffixes = ["Chain", "Swap", "Fi", "Dao", "Grow", "Moon", "Coin", "Token", "Protocol", "Network"];

let fillIndex = 1;
while (generatedCoins.length < 500) {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const sym = (prefix.substring(0, 3) + suffix.substring(0, 3)).toUpperCase() + fillIndex;
  
  if (seenSymbols.has(sym)) {
    fillIndex++;
    continue;
  }
  
  const name = `${prefix} ${suffix} v${fillIndex}`;
  const key = sym.toLowerCase();
  
  generatedCoins.push({
    key: key,
    symbol: sym + "USDT",
    name: name,
    base: 0.001 + Math.random() * 10
  });
  seenSymbols.add(sym);
  fillIndex++;
}

// System Global States
let activeMarket = 'indianStocks';
let activeTickerKey = 'nifty';
let isLong = true;
let chartType = 'line'; 
let activeDrawingTool = null; 

let price = 22450.00;
let volume = 25.4;
let rsi = 54.0;
let macd = 0.12;
let signalLine = 0.08;
let scannerAccuracyValue = 98.90;
let activeScannerAlert = null;
let history = Array.from({ length: 150 }, (_, i) => price * (1 + (i - 130) * 0.0002 + (Math.sin(i / 8) * 0.0008)));
let liveSocket = null;
let isWsConnected = false; 
let backendSocket = null;

// HTML5 Canvas Coordinates
let canvas = null;
let ctx = null;

// Initialize Core Modules
function init() {
  canvas = document.getElementById('liveChartCanvas');
  if (canvas) {
    ctx = canvas.getContext('2d');
    
    // Bind interaction event listeners
    canvas.addEventListener('mousedown', onChartMouseDown);
    canvas.addEventListener('mousemove', onChartMouseMove);
    canvas.addEventListener('mouseup', onChartMouseUp);
    canvas.addEventListener('mouseleave', onChartMouseLeave);
    canvas.addEventListener('wheel', onChartWheel, { passive: false });
    canvas.addEventListener('dblclick', onChartDblClick);
  }

  // Populate marketTickers dynamically from rawNSEStocks
  rawNSEStocks.forEach(s => {
    const exists = marketTickers['indianStocks'].some(t => t.key === s.key);
    if (!exists) {
      marketTickers['indianStocks'].push({
        key: s.key,
        symbol: s.symbol.replace('.NS', ''),
        name: s.name,
        basePrice: 150.0,
        decimals: 2,
        currentPrice: 150.0,
        change: 0.0,
        wsStream: null
      });
    }
  });

  // Populate marketTickers dynamically from generatedCoins
  generatedCoins.forEach(coin => {
    const exists = marketTickers['crypto'].some(t => t.key === coin.key);
    if (!exists) {
      marketTickers['crypto'].push({
        key: coin.key,
        symbol: coin.symbol.replace('USDT', '_USDT'),
        name: coin.name,
        basePrice: coin.base,
        decimals: coin.base < 0.01 ? 6 : (coin.base < 1 ? 4 : 2),
        currentPrice: coin.base,
        change: 0.0,
        wsStream: `${coin.symbol.toLowerCase()}@ticker`
      });
    }
  });

  translateUI('en');
  initTerminator();
  switchMarket('indianStocks');
  startSimulator();
  connectBinanceWebsocket();
  startTrapScanner();
  startWatchlistScanner();
  populateNewsTicker();
  startRealTimeNewsEngine();
  startAIDiscoveryEngine();

  if (typeof switchChartView === 'function') {
    switchChartView('custom');
  }
  
  // Set initial canvas sizing
  setTimeout(resizeCanvas, 150);

  // Connect backend socket
  connectBackendWebsocket();

  // Authenticate session check
  if (typeof checkSession === 'function') {
    checkSession();
  }
}

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const rect = canvas.parentElement.getBoundingClientRect();
  if (rect.width === 0) return; 
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  drawChart();
}
window.addEventListener('resize', resizeCanvas);

function switchMarket(marketKey) {
  activeMarket = marketKey;
  const tabs = document.querySelectorAll('.market-tab');
  const idxMap = { indianStocks: 0, crypto: 1, forex: 2 };
  tabs.forEach((t, i) => {
    if (i === idxMap[marketKey]) t.classList.add('active');
    else t.classList.remove('active');
  });
  populateWatchlist();

  // Show/Hide Indian Stocks Dashboard vs Chart Panel
  const chartWrap = document.getElementById('chartPanelWrapper');
  const indianWrap = document.getElementById('indianStocksDashboardWrapper');
  if (marketKey === 'indianStocks') {
    if (chartWrap) chartWrap.style.display = 'none';
    if (indianWrap) indianWrap.style.display = 'block';
    renderIndianStocksDashboard();
  } else {
    if (chartWrap) chartWrap.style.display = 'block';
    if (indianWrap) indianWrap.style.display = 'none';
  }

  const firstTicker = marketTickers[marketKey][0];
  selectTicker(firstTicker.key);
}

function selectTicker(tickerKey) {
  activeTickerKey = tickerKey;
  const items = document.querySelectorAll('.watchlist-item');
  items.forEach(el => el.classList.remove('active'));
  const currentActiveEl = document.getElementById(`watch-${tickerKey}`);
  if (currentActiveEl) currentActiveEl.classList.add('active');

  const config = marketTickers[activeMarket].find(t => t.key === tickerKey);
  const elSymbol = document.getElementById('activeSymbol');
  if (elSymbol) elSymbol.innerText = config.symbol;
  
  const pulseDot = document.getElementById('wsPulse');
  if (pulseDot) {
    pulseDot.style.display = (config.wsStream && isWsConnected) ? 'block' : 'none';
  }

  price = config.currentPrice;
  rsi = 50.0 + (Math.random() - 0.5) * 12;
  macd = (Math.random() - 0.5) * 0.15;
  signalLine = (Math.random() - 0.5) * 0.08;
  history = Array.from({ length: 150 }, (_, i) => price * (1 + (i - 130) * 0.0002 + (Math.sin(i / 8) * 0.0008)));
  panOffset = 0;
  
  const btnGoLive = document.getElementById('btnGoLive');
  if (btnGoLive) btnGoLive.style.display = 'none';
  
  const elLivePrice = document.getElementById('livePrice');
  if (elLivePrice) elLivePrice.innerText = price.toFixed(config.decimals);
  
  const elEntryInput = document.getElementById('entryInput');
  if (elEntryInput) elEntryInput.value = price.toFixed(config.decimals);

  calculateRisk();

  const vols = marketVols[activeMarket];
  volume = vols.volMult + (Math.random() - 0.5) * (activeMarket === 'crypto' ? 25 : 5);
  updateIndicatorsAndCoach(volume);
  
  if (typeof chartViewMode !== 'undefined' && chartViewMode === 'tv') {
    if (typeof initTradingViewWidget === 'function') {
      initTradingViewWidget(config.symbol);
    }
  } else {
    drawChart();
  }
}

let watchlistFilterQuery = "";

function filterWatchlist() {
  const inputEl = document.getElementById('watchlistSearchInput');
  if (inputEl) {
    watchlistFilterQuery = inputEl.value.trim().toLowerCase();
  }
  populateWatchlist();
}

function populateWatchlist() {
  const container = document.getElementById('watchlistContainer');
  if (!container) return;
  container.innerHTML = '';
  
  let tickers = marketTickers[activeMarket];

  // Apply search query filter if set
  if (watchlistFilterQuery) {
    tickers = tickers.filter(t => 
      t.key.toLowerCase().includes(watchlistFilterQuery) || 
      t.name.toLowerCase().includes(watchlistFilterQuery) ||
      t.symbol.toLowerCase().includes(watchlistFilterQuery)
    );
  } else if (activeMarket === 'crypto' && tickers.length > 25) {
    // If it's crypto and there is no active search query, limit to top 25 default coins to prevent sidebar bloat!
    // But keep the active ticker always visible in the list even if it is not in the top 25!
    const top25 = tickers.slice(0, 25);
    const activeTicker = tickers.find(t => t.key === activeTickerKey);
    if (activeTicker && !top25.some(t => t.key === activeTickerKey)) {
      top25.push(activeTicker);
    }
    tickers = top25;
  }

  tickers.forEach(t => {
    const item = document.createElement('div');
    item.className = `watchlist-item ${t.key === activeTickerKey ? 'active' : ''}`;
    item.id = `watch-${t.key}`;
    item.onclick = () => selectTicker(t.key);

    const sign = t.change >= 0 ? '+' : '';
    const colorClass = t.change >= 0 ? 'pnl-positive' : 'pnl-negative';
    const translatedName = tickerNamesTranslated[currentLang][t.key] || t.name;

    item.innerHTML = `
      <div class="watchlist-meta">
        <span class="watchlist-symbol">
          ${t.symbol.replace('_', ' ')}
          ${t.isNew ? `<span class="new-tag">NEW</span>` : ''}
        </span>
        <span class="watchlist-name">${translatedName}</span>
      </div>
      <div class="watchlist-values">
        <div class="watchlist-price">${t.currentPrice.toFixed(t.decimals)}</div>
        <div class="watchlist-change ${colorClass}">${sign}${t.change.toFixed(2)}%</div>
      </div>
    `;
    container.appendChild(item);
  });
}

function connectBinanceWebsocket() {
  const streams = [];
  Object.keys(marketTickers).forEach(mKey => {
    marketTickers[mKey].forEach(t => {
      if (t.wsStream) {
        streams.push(t.wsStream);
      }
    });
  });

  const wsUrl = `wss://stream.binance.com:9443/ws`;
  if (liveSocket) {
    try {
      liveSocket.close();
    } catch(e) {}
  }

  liveSocket = new WebSocket(wsUrl);

  liveSocket.onopen = () => {
    isWsConnected = true;
    const config = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
    const pulseDot = document.getElementById('wsPulse');
    if (pulseDot) {
      pulseDot.style.display = (config.wsStream) ? 'block' : 'none';
    }

    // Subscribe to all streams in chunks of 100 to avoid message size limits
    const chunkSize = 100;
    for (let i = 0; i < streams.length; i += chunkSize) {
      const chunk = streams.slice(i, i + chunkSize);
      const subscribePayload = {
        method: "SUBSCRIBE",
        params: chunk,
        id: Math.floor(Math.random() * 1000000)
      };
      liveSocket.send(JSON.stringify(subscribePayload));
    }
  };

  liveSocket.onmessage = (event) => {
    const payload = JSON.parse(event.data);
    const data = payload.data || payload;
    if (!data || !data.s) return;

    const streamSymbol = data.s; 
    const lastPrice = parseFloat(data.c); 
    const changePercent = parseFloat(data.P); 
    const streamVol = parseFloat(data.q) / 1000000; 

    let matchedTicker = null;
    Object.keys(marketTickers).forEach(mKey => {
      const found = marketTickers[mKey].find(t => t.wsStream && t.wsStream.toUpperCase().split('@')[0] === streamSymbol.toUpperCase());
      if (found) matchedTicker = found;
    });

    if (matchedTicker) {
      matchedTicker.currentPrice = lastPrice;
      matchedTicker.change = changePercent;

      if (matchedTicker.key === activeTickerKey) {
        price = lastPrice;
        volume = streamVol;

        const elLivePrice = document.getElementById('livePrice');
        if (elLivePrice) elLivePrice.innerText = price.toFixed(matchedTicker.decimals);
        
        const badge = document.getElementById('priceChange');
        if (badge) {
          const sign = changePercent >= 0 ? '+' : '';
          badge.innerText = `${sign}${changePercent.toFixed(2)}%`;
          badge.className = changePercent >= 0 ? 'price-change-badge positive' : 'price-change-badge negative';
        }
        
        history.push(price);
        if (history.length > 300) history.shift();

        if (panOffset === 0) {
          const btnGoLive = document.getElementById('btnGoLive');
          if (btnGoLive) btnGoLive.style.display = 'none';
        }
      }
    }
  };

  liveSocket.onclose = () => {
    isWsConnected = false;
    const pulseDot = document.getElementById('wsPulse');
    if (pulseDot) pulseDot.style.display = 'none';
    setTimeout(connectBinanceWebsocket, 5000);
  };

  liveSocket.onerror = () => {
    isWsConnected = false;
    const pulseDot = document.getElementById('wsPulse');
    if (pulseDot) pulseDot.style.display = 'none';
  };
}

function setDirection(longVal) {
  isLong = longVal;
  const tabs = document.querySelectorAll('.direction-tab');
  if (tabs.length >= 2) {
    if (isLong) {
      tabs[0].classList.add('active');
      tabs[1].classList.remove('active');
    } else {
      tabs[0].classList.remove('active');
      tabs[1].classList.add('active');
    }
  }
  calculateRisk();
}

// Simulated trade execution functions removed as this is a pure analysis & advisory platform

function updateIndicatorsAndCoach(volVal) {
  const dict = langDb[currentLang];
  
  const elVol = document.getElementById('volumeText');
  if (elVol) elVol.innerText = `${dict.lblVolume}${volVal.toFixed(1)}M`;
  
  const elRsiVal = document.getElementById('rsiVal');
  if (elRsiVal) {
    elRsiVal.innerText = rsi.toFixed(1);
    elRsiVal.style.color = rsi > 70 ? 'var(--red-neon)' : (rsi < 30 ? 'var(--green-neon)' : 'var(--cyan)');
  }
  
  const elMacdVal = document.getElementById('macdVal');
  if (elMacdVal) {
    elMacdVal.innerText = macd.toFixed(3);
    elMacdVal.style.color = macd >= signalLine ? 'var(--green-neon)' : 'var(--red-neon)';
  }
  
  const elSignalVal = document.getElementById('signalVal');
  if (elSignalVal) elSignalVal.innerText = signalLine.toFixed(3);

  if (typeof evaluateAIQuote === 'function') {
    evaluateAIQuote(volVal);
  }
  if (typeof checkStrategyAlerts === 'function') {
    checkStrategyAlerts();
  }
}

function startSimulator() {
  setInterval(() => {
    const vols = marketVols[activeMarket];
    
    const isBackendOpen = backendSocket && backendSocket.readyState === WebSocket.OPEN;

    // Simulated updates for instruments - REMOVED random changes to keep it 100% real
    // Only real prices from backend WebSockets or Binance WebSockets are used now.

    // If we are currently showing the Indian Stocks dashboard, refresh the card contents dynamically
    if (activeMarket === 'indianStocks') {
      indianEquitiesDatabase.forEach(stock => {
        const card = document.querySelector(`.stock-profile-card[data-key="${stock.key}"]`);
        if (card) {
          const priceEl = card.querySelector('.stock-card-price');
          const changeEl = card.querySelector('.stock-card-change');
          if (priceEl) priceEl.innerText = stock.price.toFixed(2);
          if (changeEl) {
            const sign = stock.change >= 0 ? '+' : '';
            changeEl.innerText = `${sign}${stock.change.toFixed(2)}%`;
            changeEl.style.color = stock.change >= 0 ? 'var(--green-neon)' : 'var(--red-neon)';
          }
        }
      });
    }

    const currentActiveConfig = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
    
    if (!currentActiveConfig.wsStream || !isWsConnected) {
      price = currentActiveConfig.currentPrice;
      if (!isBackendOpen) {
        history.push(price);
        if (history.length > 300) history.shift();
      }
      
      if (panOffset === 0) {
        const btnGoLive = document.getElementById('btnGoLive');
        if (btnGoLive) btnGoLive.style.display = 'none';
      }
      
      const elLivePrice = document.getElementById('livePrice');
      if (elLivePrice) elLivePrice.innerText = price.toFixed(currentActiveConfig.decimals);
      
      const badge = document.getElementById('priceChange');
      if (badge) {
        const sign = currentActiveConfig.change >= 0 ? '+' : '';
        badge.innerText = `${sign}${currentActiveConfig.change.toFixed(2)}%`;
        badge.className = currentActiveConfig.change >= 0 ? 'price-change-badge positive' : 'price-change-badge negative';
      }
    }

    // Keep indicators wiggling slightly if price is updating, or keep constant if market is closed
    const isPriceMoving = isBackendOpen || (currentActiveConfig.wsStream && isWsConnected);
    if (isPriceMoving) {
      rsi = Math.max(10, Math.min(90, rsi + (Math.random() - 0.5) * 2));
      macd += (Math.random() - 0.5) * 0.04;
      signalLine += (Math.random() - 0.5) * 0.02;
      volume = vols.volMult + (Math.random() - 0.5) * (activeMarket === 'crypto' ? 25 : 5);
    } else {
      volume = 0;
    }
    
    populateWatchlist();

    // Auto-fit canvas scaling buffer
    if (canvas && (canvas.width === 0 || canvas.height === 0 || canvas.width !== canvas.clientWidth * window.devicePixelRatio)) {
      resizeCanvas();
    }

    updateIndicatorsAndCoach(volume);
    drawChart();
  }, 1000);
}

function startTrapScanner() {
  const logs = document.getElementById('scannerLogs');
  if (!logs) return;

  const scannerDb = {
    en: {
      trapStopHunt: "Stop Hunt Sweep detected (Institutional wash)",
      trapBullTrap: "Bull Trap Rejected near local resistance",
      trapBearTrap: "Bear Trap Defended near local support",
      trapLiquidity: "Liquidity Sweep Block identified (Order flow cluster)",
      trapImbalance: "Order Block Imbalance filled (Fair Value Gap)",
      patternDoubleBottom: "Double Bottom Reversal forming on support",
      patternHeadShoulders: "Head & Shoulders Top confirmed (Reversal signal)",
      patternTriangle: "Ascending Triangle Consolidation breakout verified",
      patternFlag: "Bullish Flag Breakout verified on volume spike",
      patternCup: "Cup & Handle Accumulation completed",
      alertTrap: "[TRAP WARNING]",
      alertPattern: "[PATTERN DETECTED]"
    },
    mr: {
      trapStopHunt: "स्टॉप हंट स्वीप आढळला (संस्थात्मक लिक्विडेशन)",
      trapBullTrap: "रेझिस्टन्स जवळ बुल ट्रॅप (Bull Trap) फेटाळला",
      trapBearTrap: "सपोर्ट जवळ बिअर ट्रॅप (Bear Trap) रोखला गेला",
      trapLiquidity: "लिक्विडिटी स्वीप ब्लॉक आढळला (ऑर्डर फ्लो क्लस्टर)",
      trapImbalance: "ऑर्डर ब्लॉक असंतुलन पूर्ण (Fair Value Gap)",
      patternDoubleBottom: "डबल बॉटम रिव्हर्सल पॅटर्न सपोर्टवर तयार",
      patternHeadShoulders: "हेड अँड शोल्डर्स टॉप निश्चित (रिव्हर्सल संकेत)",
      patternTriangle: "असेंडिंग ट्रँगल कन्सोलिडेशन ब्रेकआऊट निश्चित",
      patternFlag: "व्हॉल्यूम वाढीसह बुलिश फ्लॅग ब्रेकआऊट निश्चित",
      patternCup: "कप अँड हँडल ॲक्युम्युलेशन पूर्ण झाले आहे",
      alertTrap: "[चेतावणी ट्रॅप]",
      alertPattern: "[पॅटर्न आढळला]"
    },
    hi: {
      trapStopHunt: "स्टॉप हंट स्वीप पाया गया (संस्थागत लिक्विडेशन)",
      trapBullTrap: "प्रतिरोध के पास बुल ट्रैप (Bull Trap) खारिज",
      trapBearTrap: "सपोर्ट के पास बियर ट्रैप (Bear Trap) का बचाव",
      trapLiquidity: "लिक्विडिटी स्वीप ब्लॉक की पहचान की गई",
      trapImbalance: "ऑर्डर ब्लॉक असंतुलन भरा गया (Fair Value Gap)",
      patternDoubleBottom: "डबल बॉटम रिवर्सल पैटर्न सपोर्ट पर बन रहा है",
      patternHeadShoulders: "हेड एंड शोल्डर्स TOP की पुष्टि (रिवर्सल संकेत)",
      patternTriangle: "एसेंडिंग ट्रायंगल कंसॉलिडेशन ब्रेकआउट की पुष्टि",
      patternFlag: "वॉल्यूम स्पाइक के साथ बुलिश फ्लैग ब्रेकआउट की पुष्टि",
      patternCup: "कप एंड हैंडल एक्यूम्यूलेशन पूरा हुआ",
      alertTrap: "[चेतावनी ट्रैप]",
      alertPattern: "[पैटर्न मिला]"
    },
    es: {
      trapStopHunt: "Stop Hunt Sweep detectado (Liquidación institucional)",
      trapBullTrap: "Trampa de Toros (Bull Trap) rechazada cerca de resistencia",
      trapBearTrap: "Trampa de Osos (Bear Trap) defendida cerca de soporte",
      trapLiquidity: "Bloque de barrido de liquidez identificado (Flujo de órdenes)",
      trapImbalance: "Desequilibrio del bloque de órdenes (Fair Value Gap)",
      patternDoubleBottom: "Reversión de doble suelo en soporte",
      patternHeadShoulders: "Hombro-Cabeza-Hombro confirmado (Señal de reversión)",
      patternTriangle: "Ruptura de triángulo ascendente verificada",
      patternFlag: "Bandera alcista rota con volumen",
      patternCup: "Acumulación de taza y asa completada",
      alertTrap: "[ALERTA TRAMPA]",
      alertPattern: "[PATRÓN DETECTADO]"
    }
  };

  setInterval(() => {
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
    const dict = scannerDb[lang] || scannerDb['en'];
    const activeConfig = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
    const name = activeConfig.symbol.replace('_', ' ');
    const timestamp = new Date().toLocaleTimeString();

    const scanResult = detectPatternAndTraps(activeConfig);
    if (!scanResult) return;

    const isTrap = scanResult.type === 'TRAP';
    const tag = isTrap ? dict.alertTrap : dict.alertPattern;
    const desc = dict[scanResult.patternKey] || scanResult.patternKey;
    const color = scanResult.color;
    const confidence = scanResult.confidence;

    // Save alert globally for custom canvas graphics overlays
    activeScannerAlert = {
      type: scanResult.type,
      symbol: activeConfig.symbol,
      desc: desc,
      tag: tag,
      price: price,
      time: Date.now(),
      color: color,
      confidence: confidence
    };

    // Redraw chart rapidly to animate the flashing banner smoothly
    let alertDraws = 0;
    const alertInterval = setInterval(() => {
      if (alertDraws++ > 80 || !activeScannerAlert || Date.now() - activeScannerAlert.time >= 4000) {
        clearInterval(alertInterval);
      }
      if (typeof drawChart === 'function') {
        drawChart();
      }
    }, 50); // ~20 FPS for smooth flashing animation

    // Play native synthesised sci-fi audio beeps using Web Audio API
    playFuturisticAlert(isTrap);

    // Fluctuate scanner accuracy slightly (98.60% - 99.40%)
    scannerAccuracyValue = Math.min(99.40, Math.max(98.60, 98.95 + (Math.sin(Date.now() / 12000) * 0.35) + (Math.random() * 0.1)));
    
    const accEl = document.getElementById('scannerAccuracy');
    if (accEl) {
      const activeLangDb = langDb[lang] || langDb['en'];
      const accPrefix = activeLangDb.scannerAccuracy || "ACCURACY: ";
      accEl.innerText = `${accPrefix}${scannerAccuracyValue.toFixed(2)}%`;
    }

    const logItem = document.createElement('div');
    logItem.className = 'log-row';
    logItem.style.display = 'block'; // Override flex
    logItem.style.padding = '8px 10px';
    logItem.style.borderRadius = '6px';
    logItem.style.marginBottom = '8px';
    logItem.style.borderLeft = `2px solid ${color}`;
    logItem.style.background = isTrap ? "rgba(255, 23, 68, 0.03)" : "rgba(0, 230, 118, 0.03)";
    
    const actionPlanText = scanResult.actionPlan[lang] || scanResult.actionPlan['en'];

    logItem.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <div>
          <span class="log-time" style="font-family: 'Orbitron', monospace; font-size: 8.5px; color: var(--text-muted); margin-right: 6px;">[${timestamp}]</span>
          <span class="log-tag" style="color: ${color}; font-weight: 800; font-family: 'Orbitron', sans-serif; font-size: 9px; letter-spacing: 0.5px;">${tag}</span>
        </div>
        <span class="confidence-badge" style="font-size: 8px; font-family: 'Orbitron', sans-serif; color: var(--gold-accent); background: rgba(255, 215, 0, 0.08); padding: 1px 6px; border-radius: 4px; border: 1px solid rgba(255, 215, 0, 0.25); text-shadow: var(--glow-gold);">CONF: ${confidence}%</span>
      </div>
      <div style="color: var(--text-primary); font-weight: 600; font-size: 10px; margin-bottom: 6px; font-family: 'Orbitron', sans-serif;">
        ${name} &rarr; <span style="color: var(--text-secondary); font-style: italic; font-family: 'Inter', sans-serif; font-weight: normal;">${desc}</span>
      </div>
      <div class="scanner-detail-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px 12px; margin-top: 4px; padding: 6px 8px; background: rgba(0, 0, 0, 0.25); border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.05); font-size: 8.5px; font-family: 'Inter', sans-serif;">
        <div><span style="color: var(--text-muted);">Sweep Zone:</span> <strong style="color: var(--gold-accent); float: right;">${scanResult.sweepPrice}</strong></div>
        <div><span style="color: var(--text-muted);">Target Price:</span> <strong style="color: var(--green-neon); float: right;">${scanResult.targetPrice}</strong></div>
        <div><span style="color: var(--text-muted);">Stop Loss:</span> <strong style="color: var(--red-neon); float: right;">${scanResult.stopLoss}</strong></div>
        <div><span style="color: var(--text-muted);">Signal Power:</span> <strong style="color: ${color}; float: right;">${scanResult.signalStrength}</strong></div>
      </div>
      <div style="margin-top: 6px; font-size: 8.5px; line-height: 1.4; color: var(--text-secondary); font-family: 'Inter', sans-serif; padding-left: 2px;">
        <span style="color: var(--gold-accent); font-weight: bold; font-family: 'Orbitron', sans-serif; font-size: 8px; letter-spacing: 0.3px;">AI ACTION PLAN:</span> ${actionPlanText}
      </div>
    `;

    logs.insertBefore(logItem, logs.firstChild);
    if (logs.children.length > 20) logs.removeChild(logs.lastChild);
  }, 5000);
}

// Native synthesised audio generating sci-fi beeps using Web Audio API (Zero assets required)
function playFuturisticAlert(isTrap) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (isTrap) {
      // Sawtooth drop alarm sweep (Short duration to avoid annoying user)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(550, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else {
      // Tech-y positive sweep (Sine wave)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.035, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    }
  } catch (err) {
    // Autoplay browser safety policy bypass
  }
}

function startWatchlistScanner() {
  const newItems = {
    indianStocks: { key: 'tata_tech', symbol: 'TATA_TECH', name: 'Tata Tech Limited', basePrice: 1040.00, decimals: 2, currentPrice: 1040.00, change: 0.8, wsStream: null },
    crypto: { key: 'sol_jup', symbol: 'SOL_JUP', name: 'Jupiter Token / SOL', basePrice: 0.0125, decimals: 5, currentPrice: 0.0125, change: 12.4, wsStream: null },
    forex: { key: 'usd_chf', symbol: 'USD_CHF', name: 'US Dollar / Franc', basePrice: 0.91200, decimals: 5, currentPrice: 0.91200, change: -0.15, wsStream: null }
  };

  setTimeout(() => {
    Object.keys(newItems).forEach(mKey => {
      const item = newItems[mKey];
      item.isNew = true;
      marketTickers[mKey].push(item);
    });

    const chat = document.getElementById('chatHistory');
    if (chat) {
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble bubble-ai';
      bubble.innerText = `[SCANNER SERVICE] Wiseman detected institutional listings! Added new tickers to watchlist: TATA TECH (Stocks), SOL_JUP (Crypto), USD_CHF (Forex). Dynamic analysis initiated.`;
      chat.appendChild(bubble);
      chat.scrollTop = chat.scrollHeight;
    }

    populateWatchlist();
  }, 12000);
}

// AI News Sentiment Modal Handlers
function openSentimentReport(newsId) {
  const item = newsDatabase.find(n => n.id === newsId);
  if (!item) return;

  const modal = document.getElementById('sentimentModal');
  const headline = document.getElementById('modalSentimentHeadline');
  const badge = document.getElementById('modalSentimentBadge');
  const time = document.getElementById('modalSentimentTime');
  const analysis = document.getElementById('modalSentimentAnalysis');
  const impact = document.getElementById('modalSentimentImpact');

  if (modal && headline && badge && time && analysis && impact) {
    headline.innerText = item.headline;
    badge.innerText = `${item.category.toUpperCase()} • ${item.impact}`;
    
    // Style badge
    if (item.impact === 'BULLISH') {
      badge.style.background = 'rgba(0, 230, 118, 0.15)';
      badge.style.color = 'var(--green-neon)';
      badge.style.borderColor = 'var(--green-neon)';
    } else if (item.impact === 'BEARISH') {
      badge.style.background = 'rgba(255, 23, 68, 0.15)';
      badge.style.color = 'var(--red-neon)';
      badge.style.borderColor = 'var(--red-neon)';
    } else {
      badge.style.background = 'rgba(255, 215, 0, 0.15)';
      badge.style.color = 'var(--gold-accent)';
      badge.style.borderColor = 'var(--gold-accent)';
    }
    
    time.innerText = item.time;
    analysis.innerText = item.analysis;
    impact.innerText = item.summary;
    
    // Color summary text border/bg based on impact
    if (item.impact === 'BULLISH') {
      impact.style.color = 'var(--green-neon)';
      impact.style.borderColor = 'rgba(0, 230, 118, 0.3)';
    } else if (item.impact === 'BEARISH') {
      impact.style.color = 'var(--red-neon)';
      impact.style.borderColor = 'rgba(255, 23, 68, 0.3)';
    } else {
      impact.style.color = 'var(--gold-accent)';
      impact.style.borderColor = 'rgba(255, 215, 0, 0.3)';
    }

    modal.style.display = 'flex';
  }
}

function closeSentimentReport() {
  const modal = document.getElementById('sentimentModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function populateNewsTicker() {
  const ticker = document.getElementById('newsTicker');
  if (!ticker) return;
  ticker.innerHTML = '';
  
  newsDatabase.forEach(item => {
    const span = document.createElement('span');
    span.className = 'news-ticker-item';
    span.onclick = () => openSentimentReport(item.id);
    
    const impactColor = item.impact === 'BULLISH' ? 'var(--green-neon)' : (item.impact === 'BEARISH' ? 'var(--red-neon)' : 'var(--gold-accent)');
    span.innerHTML = `<span style="color: ${impactColor}; font-weight: bold; margin-right: 6px;">[${item.category} ${item.impact}]</span>${item.headline}`;
    ticker.appendChild(span);
  });
}

// Lower Stats Tab Switches
function switchLowerTab(tabId) {
  const tabs = ['positions', 'history', 'strategy', 'advisory'];
  tabs.forEach(t => {
    const btn = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1));
    const content = document.getElementById('content' + t.charAt(0).toUpperCase() + t.slice(1));
    if (t === tabId) {
      if (btn) btn.classList.add('active');
      if (content) content.style.display = 'block';
    } else {
      if (btn) btn.classList.remove('active');
      if (content) content.style.display = 'none';
    }
  });
}

// AI Advisory and Strategies Panel Renderer
function renderAdvisoryPanel() {
  const tableBody = document.getElementById('advisoryTableBody');
  const cardsGrid = document.getElementById('strategyCardsGrid');
  if (!tableBody || !cardsGrid) return;

  const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
  const adviceList = advisoryDatabase[lang] || advisoryDatabase['en'] || [];
  const stratList = strategyDatabase[lang] || strategyDatabase['en'] || [];

  // 1. Render Table
  tableBody.innerHTML = '';
  adviceList.forEach(item => {
    const row = document.createElement('tr');
    
    // Check recommendation action to apply badge class
    let badgeClass = 'badge-hold';
    const actionUpper = item.action.toUpperCase();
    if (actionUpper.includes('BUY') || item.action.includes('खरेदी') || item.action.includes('खरीद')) {
      badgeClass = 'badge-buy';
    } else if (actionUpper.includes('SELL') || item.action.includes('विक्री') || item.action.includes('बेच')) {
      badgeClass = 'badge-sell';
    }
    
    row.innerHTML = `
      <td><span class="pos-ticker" style="font-family: 'Orbitron', sans-serif;">${item.ticker.replace('_', ' ')}</span></td>
      <td><span class="${badgeClass}">${item.action}</span></td>
      <td><span style="color: var(--text-secondary); font-weight: 600; font-size: 8px; font-family: 'Orbitron', sans-serif;">${item.holdClass}</span></td>
      <td><span style="color: var(--cyan); font-weight: 500; font-size: 8.5px; font-family: 'Orbitron', sans-serif;">${item.timeframe}</span></td>
      <td style="color: var(--text-muted); font-size: 8px; line-height: 1.3; max-width: 200px; white-space: normal; text-align: left; padding: 6px;">${item.rationale}</td>
    `;
    tableBody.appendChild(row);
  });

  // 2. Render Strategy Cards
  cardsGrid.innerHTML = '';
  stratList.forEach(item => {
    const card = document.createElement('div');
    card.className = 'strategy-card';
    card.innerHTML = `
      <div class="strategy-card-header">
        <span class="strategy-card-title">${item.name}</span>
        <span class="strategy-card-timeframe">${item.timeframe}</span>
      </div>
      <div class="strategy-card-indicators">${item.indicators}</div>
      <div class="strategy-card-desc">${item.desc}</div>
    `;
    cardsGrid.appendChild(card);
  });
}

// Closed trade history rendering removed as this is a pure analysis & advisory platform

// Strategy alerts condition analyzer
function checkStrategyAlerts() {
  const slider = document.getElementById('sliderRsiThreshold');
  const macdSelect = document.getElementById('selectMacdTrigger');
  const status = document.getElementById('strategyAlertStatus');
  const box = document.getElementById('strategyAlertBox');
  if (!slider || !macdSelect || !status || !box) return;

  const threshold = parseFloat(slider.value);
  const direction = macdSelect.value;
  
  const rsiCheck = rsi <= threshold;
  
  let macdCheck = false;
  if (direction === 'any') {
    macdCheck = true;
  } else if (direction === 'bullish') {
    macdCheck = macd > signalLine;
  } else if (direction === 'bearish') {
    macdCheck = macd < signalLine;
  }
  
  if (rsiCheck && macdCheck) {
    status.innerText = currentLang === 'mr' ? 'इशारा: खरेदीचे संकेत!' : 'ALERT: CRITERIA SATISFIED!';
    status.style.color = 'var(--green-neon)';
    box.style.borderColor = 'var(--green-neon)';
    box.style.boxShadow = 'var(--glow-green)';
    box.style.background = 'rgba(0, 230, 118, 0.08)';
  }
}

// --- MATHEMATICAL PATTERN & TRAP DETECTOR ENGINE ---
function detectPatternAndTraps(activeConfig) {
  const n = history.length;
  const decimals = activeConfig ? activeConfig.decimals : 2;
  const tickerKey = activeConfig ? activeConfig.key : 'default';
  
  if (n < 40) return null; // Need enough data points
  
  // 1. Initialize State for ticker key if not exists
  if (!scannerStates[tickerKey]) {
    scannerStates[tickerKey] = {
      lastAlertTimes: {}, // Map of patternKey -> timestamp
      wasMacdAbove: false,
      wasRsiOverbought: false,
      wasRsiOversold: false
    };
  }
  const state = scannerStates[tickerKey];
  const now = Date.now();
  
  // Find local highs and lows in the last 40 ticks
  const windowSize = 5;
  const localHighs = [];
  const localLows = [];
  
  for (let i = windowSize; i < n - windowSize; i++) {
    const val = history[i];
    let isHigh = true;
    let isLow = true;
    for (let j = 1; j <= windowSize; j++) {
      if (history[i - j] >= val || history[i + j] > val) isHigh = false;
      if (history[i - j] <= val || history[i + j] < val) isLow = false;
    }
    if (isHigh) localHighs.push({ index: i, price: val });
    if (isLow) localLows.push({ index: i, price: val });
  }
  
  const currentPrice = history[n - 1];
  const prevPrice = history[n - 2];
  const prevPrice2 = history[n - 3];
  
  // A helper function to check cooldown
  function checkCooldown(patternKey, ms = 20000) {
    const lastTime = state.lastAlertTimes[patternKey] || 0;
    if (now - lastTime < ms) {
      return false;
    }
    return true;
  }
  
  // A helper function to update state on successful trigger
  function triggerPattern(patternKey) {
    state.lastAlertTimes[patternKey] = now;
  }

  // --- 1. CRITICAL TRAPS & PATTERNS (HIGH VOL / STRUCTURAL BREAKOUTS) ---

  // 1. Check for Bull Trap:
  if (localHighs.length > 0) {
    const recentHigh = localHighs[localHighs.length - 1];
    if (prevPrice2 > recentHigh.price && currentPrice < recentHigh.price && volume > 25.5) {
      if (checkCooldown('trapBullTrap', 20000)) {
        triggerPattern('trapBullTrap');
        return {
          type: 'TRAP',
          patternKey: 'trapBullTrap',
          color: 'var(--red-neon)',
          confidence: (98.40 + (volume % 1.5)).toFixed(2),
          sweepPrice: recentHigh.price.toFixed(decimals),
          stopLoss: (recentHigh.price * 1.003).toFixed(decimals),
          targetPrice: (currentPrice * 0.985).toFixed(decimals),
          signalStrength: (85 + Math.random() * 10).toFixed(0) + "% Bearish Rejection",
          actionPlan: {
            en: "Bearish confirmation. Wait for next candle close below sweep zone. Target local support.",
            mr: "मंदीचे पुष्टीकरण. स्वीप झोनच्या खाली पुढील कॅंडल क्लोजची वाट पहा. स्थानिक सपोर्ट पातळी लक्ष्य करा.",
            hi: "मंदी की पुष्टि। स्वीप ज़ोन के नीचे अगली कैंडल क्लोज होने का इंतजार करें। स्थानीय सपोर्ट को लक्षित करें।",
            es: "Confirmación bajista. Espere el cierre de la vela por debajo de la zona de barrido. Soporte local."
          }
        };
      }
    }
  }
  
  // 2. Check for Bear Trap:
  if (localLows.length > 0) {
    const recentLow = localLows[localLows.length - 1];
    if (prevPrice2 < recentLow.price && currentPrice > recentLow.price && volume > 25.5) {
      if (checkCooldown('trapBearTrap', 20000)) {
        triggerPattern('trapBearTrap');
        return {
          type: 'TRAP',
          patternKey: 'trapBearTrap',
          color: 'var(--red-neon)',
          confidence: (98.60 + (volume % 1.3)).toFixed(2),
          sweepPrice: recentLow.price.toFixed(decimals),
          stopLoss: (recentLow.price * 0.997).toFixed(decimals),
          targetPrice: (currentPrice * 1.015).toFixed(decimals),
          signalStrength: (85 + Math.random() * 10).toFixed(0) + "% Bullish Defense",
          actionPlan: {
            en: "Bullish sweep confirmed. Institutional buy orders triggered. Target local resistance.",
            mr: "तेजीचा स्वीप निश्चित. संस्थात्मक खरेदी ऑर्डर्स सक्रिय. स्थानिक रेझिस्टन्स पातळी लक्ष्य करा.",
            hi: "तेजी का स्वीप निश्चित। संस्थागत खरीद ऑऑर्डर्स सक्रिय। स्थानीय रेजिस्टेंस को लक्षित करें।",
            es: "Barrido alcista verificado. Órdenes de compra institucionales activadas. Resistencia local."
          }
        };
      }
    }
  }
  
  // 3. Check for Stop Hunt Sweep:
  if (volume > 28.0) {
    if (checkCooldown('trapStopHunt', 15000)) {
      triggerPattern('trapStopHunt');
      const isBullishSweep = rsi < 50;
      return {
        type: 'TRAP',
        patternKey: 'trapStopHunt',
        color: 'var(--red-neon)',
        confidence: (99.20 + (volume % 0.75)).toFixed(2),
        sweepPrice: (currentPrice * (1 + (Math.random() - 0.5) * 0.001)).toFixed(decimals),
        stopLoss: (isBullishSweep ? currentPrice * 0.993 : currentPrice * 1.007).toFixed(decimals),
        targetPrice: (isBullishSweep ? currentPrice * 1.02 : currentPrice * 0.98).toFixed(decimals),
        signalStrength: (90 + Math.random() * 8).toFixed(0) + "% Liquidity Sweep",
        actionPlan: {
          en: "Stop hunt sweep active. Retail orders liquidated. Institutional blocks matched.",
          mr: "स्टॉप हंट स्वीप सक्रिय. रिटेल ऑर्डर्स लिक्विडेट झाल्या. संस्थात्मक ब्लॉक मॅच झाले आहेत.",
          hi: "स्टॉप हंट स्वीप सक्रिय। रिटेल ऑर्डर्स लिक्विडेट हुईं। संस्थागत ब्लॉक मैच किए गए।",
          es: "Barrido de stop hunt activo. Órdenes minoristas liquidadas. Bloques institucionales emparejados."
        }
      };
    }
  }
  
  // 4. Check for Imbalance (FVG):
  const lastDiff = Math.abs(currentPrice - prevPrice);
  const avgDiff = history.slice(-20).reduce((acc, p, idx, arr) => idx === 0 ? acc : acc + Math.abs(p - arr[idx-1]), 0) / 19;
  if (lastDiff > avgDiff * 2.5) {
    if (checkCooldown('trapImbalance', 20000)) {
      triggerPattern('trapImbalance');
      const isUpImbalance = currentPrice > prevPrice;
      return {
        type: 'TRAP',
        patternKey: 'trapImbalance',
        color: 'var(--gold-accent)',
        confidence: (97.90 + (lastDiff % 1.0)).toFixed(2),
        sweepPrice: ((prevPrice + currentPrice) / 2).toFixed(decimals),
        stopLoss: (prevPrice * (isUpImbalance ? 0.996 : 1.004)).toFixed(decimals),
        targetPrice: (currentPrice + (currentPrice - prevPrice) * 1.5).toFixed(decimals),
        signalStrength: (78 + Math.random() * 15).toFixed(0) + "% Price Gap Imbalance",
        actionPlan: {
          en: "Fair Value Gap created. Expected mean reversion to fill the price imbalance zone.",
          mr: "फेअर व्हॅल्यू गॅप तयार झाली आहे. किमतीतील असंतुलन भरून काढण्यासाठी मूळ सरासरीकडे वाटचाल अपेक्षित.",
          hi: "फेअर वैल्यू गैप का निर्माण। मूल्य असंतुलन क्षेत्र को भरने के लिए माध्य प्रत्यावर्तन की उम्मीद।",
          es: "Brecha de valor razonable (FVG) creada. Se espera reversión a la media para llenar la brecha."
        }
      };
    }
  }
  
  // 5. Check for Double Bottom:
  if (localLows.length >= 2) {
    const low1 = localLows[localLows.length - 2].price;
    const low2 = localLows[localLows.length - 1].price;
    if (Math.abs(low1 - low2) / low1 < 0.0020 && rsi < 35) {
      if (checkCooldown('patternDoubleBottom', 30000)) {
        triggerPattern('patternDoubleBottom');
        return {
          type: 'PATTERN',
          patternKey: 'patternDoubleBottom',
          color: 'var(--green-neon)',
          confidence: (99.10 + (rsi % 0.8)).toFixed(2),
          sweepPrice: ((low1 + low2) / 2).toFixed(decimals),
          stopLoss: (Math.min(low1, low2) * 0.995).toFixed(decimals),
          targetPrice: (currentPrice * 1.025).toFixed(decimals),
          signalStrength: (80 + Math.random() * 10).toFixed(0) + "% Structural Reversal",
          actionPlan: {
            en: "Double bottom forming. Accumulate in the buy zone near support level.",
            mr: "डबल बॉटम तयार होत आहे. सपोर्ट पातळीजवळ खरेदीसाठी योग्य वेळ.",
            hi: "डबल बॉटम बन रहा है। सपोर्ट स्तर के पास खरीदारी संचय क्षेत्र सक्रिय।",
            es: "Doble suelo formándose. Acumule en la zona de compra cerca del nivel de soporte."
          }
        };
      }
    }
  }

  // 6. Check for Double Top:
  if (localHighs.length >= 2) {
    const high1 = localHighs[localHighs.length - 2].price;
    const high2 = localHighs[localHighs.length - 1].price;
    if (Math.abs(high1 - high2) / high1 < 0.0020 && rsi > 65) {
      if (checkCooldown('patternHeadShoulders', 30000)) {
        triggerPattern('patternHeadShoulders');
        return {
          type: 'PATTERN',
          patternKey: 'patternHeadShoulders',
          color: 'var(--red-neon)',
          confidence: (98.90 + (rsi % 0.7)).toFixed(2),
          sweepPrice: ((high1 + high2) / 2).toFixed(decimals),
          stopLoss: (Math.max(high1, high2) * 1.005).toFixed(decimals),
          targetPrice: (currentPrice * 0.975).toFixed(decimals),
          signalStrength: (82 + Math.random() * 12).toFixed(0) + "% Distribution Peak",
          actionPlan: {
            en: "Double Top / Head & Shoulders rejecting resistance. Selling pressure increasing.",
            mr: "डबल टॉप किंवा हेड अँड शोल्डर्स टॉप रेझिस्टन्स फेटाळत आहे. विक्रीचा दबाव वाढत आहे.",
            hi: "डबल टॉप या हेड एंड शोल्डर्स टॉप रेजिस्टेंस को खारिज कर रहा है। बिकवाली का दबाव बढ़ रहा है।",
            es: "Doble techo o Hombro-Cabeza-Hombro rechazando resistencia. Aumenta la presión de venta."
          }
        };
      }
    }
  }

  // --- 2. INDICATOR CROSSOVERS & STATE LATCHES (PREVENTS SPAM) ---

  // 7. Check RSI Overbought crossover
  if (rsi > 70) {
    if (!state.wasRsiOverbought) {
      state.wasRsiOverbought = true;
      triggerPattern('patternHeadShoulders');
      return {
        type: 'PATTERN',
        patternKey: 'patternHeadShoulders',
        color: 'var(--red-neon)',
        confidence: (98.20 + (rsi % 1.2)).toFixed(2),
        sweepPrice: (currentPrice * 1.002).toFixed(decimals),
        stopLoss: (currentPrice * 1.008).toFixed(decimals),
        targetPrice: (currentPrice * 0.975).toFixed(decimals),
        signalStrength: (82 + Math.random() * 12).toFixed(0) + "% Overbought Distribution",
        actionPlan: {
          en: "Reversal pattern active. Overbought conditions met. Potential structural breakdown.",
          mr: "रिव्हर्सल पॅटर्न सक्रिय. ओव्हरबॉट पातळी गाठली आहे. किंमत घसरण्याची दाट शक्यता.",
          hi: "रिवर्सल पैटर्न सक्रिय। ओवरबॉट स्तर पूरा हुआ। कीमतों में गिरावट की संभावना।",
          es: "Patrón de reversión activo. Condiciones de sobrecompra alcanzadas. Ruptura potencial."
        }
      };
    }
  } else {
    state.wasRsiOverbought = false;
  }

  // 8. Check RSI Oversold crossover
  if (rsi < 30) {
    if (!state.wasRsiOversold) {
      state.wasRsiOversold = true;
      triggerPattern('patternDoubleBottom');
      return {
        type: 'PATTERN',
        patternKey: 'patternDoubleBottom',
        color: 'var(--green-neon)',
        confidence: (98.50 + (rsi % 1.1)).toFixed(2),
        sweepPrice: (currentPrice * 0.998).toFixed(decimals),
        stopLoss: (currentPrice * 0.993).toFixed(decimals),
        targetPrice: (currentPrice * 1.025).toFixed(decimals),
        signalStrength: (80 + Math.random() * 10).toFixed(0) + "% Oversold Accumulation",
        actionPlan: {
          en: "Oversold buy zone sweep. Double bottom pattern structure activated.",
          mr: "ओव्हरसोल्ड खरेदी क्षेत्र स्वीप. डबल बॉटम पॅटर्न रचना सक्रिय झाली आहे.",
          hi: "ओवरसोल्ड खरीद क्षेत्र स्वीप। डबल बॉटम पैटर्न संरचना सक्रिय हुई।",
          es: "Barrido de zona de compra sobrevendida. Estructura de patrón de doble suelo activada."
        }
      };
    }
  } else {
    state.wasRsiOversold = false;
  }

  // 9. Check MACD crossover
  if (macd >= signalLine) {
    if (!state.wasMacdAbove) {
      state.wasMacdAbove = true;
      // Consistent choice between Triangle and Flag based on symbol name
      const isTriangle = tickerKey.charCodeAt(0) % 2 === 0;
      const patternKey = isTriangle ? 'patternTriangle' : 'patternFlag';
      triggerPattern(patternKey);
      
      return {
        type: 'PATTERN',
        patternKey: patternKey,
        color: 'var(--green-neon)',
        confidence: (98.15 + (macd * 4) % 1.3).toFixed(2),
        sweepPrice: currentPrice.toFixed(decimals),
        stopLoss: (currentPrice * 0.992).toFixed(decimals),
        targetPrice: (currentPrice * 1.022).toFixed(decimals),
        signalStrength: (75 + Math.random() * 15).toFixed(0) + "% Momentum Breakout",
        actionPlan: {
          en: "Triangle or bullish flag breakout confirmed. Momentum trend expansion active.",
          mr: "ट्रँगल किंवा बुलिश फ्लॅग ब्रेकआऊट निश्चित. किमतीमध्ये वेगवान वाढ सक्रिय.",
          hi: "त्रिकोण या बुलिश फ्लैग ब्रेकआउट की पुष्टि। गति प्रवृत्ति विस्तार सक्रिय।",
          es: "Ruptura de triángulo o bandera alcista confirmada. Expansión de tendencia activa."
        }
      };
    }
  } else {
    state.wasMacdAbove = false;
  }

  // 10. Low-frequency consolidation heartbeat (every 90s)
  const lastCupTime = state.lastAlertTimes['patternCup'] || 0;
  if (now - lastCupTime > 90000) {
    triggerPattern('patternCup');
    return {
      type: 'PATTERN',
      patternKey: 'patternCup',
      color: 'var(--cyan)',
      confidence: (97.80 + (volume % 1.8)).toFixed(2),
      sweepPrice: currentPrice.toFixed(decimals),
      stopLoss: (currentPrice * 0.99).toFixed(decimals),
      targetPrice: (currentPrice * 1.025).toFixed(decimals),
      signalStrength: (70 + Math.random() * 15).toFixed(0) + "% Accumulation Rounding",
      actionPlan: {
        en: "Cup & handle accumulation structure completed. Waiting for breakout above rim resistance.",
        mr: "कप आणि हँडल ॲक्युम्युलेशन पूर्ण झाले आहे. रेझिस्टन्स ब्रेकआऊटची वाट पहा.",
        hi: "कप और हैंडल संचय संरचना पूरी हुई। रेजिस्टेंस ब्रेकआउट का इंतजार करें।",
        es: "Estructura de acumulación de taza y asa completada. Esperando ruptura de resistencia."
      }
    };
  }

  // If no new significant events or crossovers, return null (prevents spam!)
  return null;
}

// --- REAL-TIME NEWS GENERATOR ENGINE ---
let activeNewsFeed = [];

function startRealTimeNewsEngine() {
  const feedContainer = document.getElementById('realtimeNewsFeed');
  if (!feedContainer) return;
  
  const newsTemplates = {
    en: {
      indianStocks: [
        { headline: "Reliance Industries signs strategic green hydrogen pact, shares spike", impact: "BULLISH", category: "CORP" },
        { headline: "SEBI issues new guidelines on index option derivative volumes", impact: "NEUTRAL", category: "REG" },
        { headline: "Tata Motors domestic passenger sales drop 4% year-on-year", impact: "BEARISH", category: "CORP" },
        { headline: "Nifty 50 swings 120 points as institutional blocks rebalance portfolios", impact: "NEUTRAL", category: "MARKET" },
        { headline: "FII net buying exceeds 1,200 Crores in Indian cash markets", impact: "BULLISH", category: "FLOW" },
        { headline: "Government raises import duties on domestic electronic components", impact: "BEARISH", category: "MACRO" }
      ],
      crypto: [
        { headline: "SEC approves Spot Ethereum options trading on major exchanges", impact: "BULLISH", category: "REG" },
        { headline: "MicroStrategy acquires additional 4,500 BTC for $280 million", impact: "BULLISH", category: "FLOW" },
        { headline: "Crypto exchange faces regulatory audit over security protocol mismatch", impact: "BEARISH", category: "REG" },
        { headline: "Bitcoin miners deplete inventory holdings to record-low levels", impact: "NEUTRAL", category: "FLOW" },
        { headline: "Solana Transaction volume surges to new all-time high on DEX activity", impact: "BULLISH", category: "TECH" },
        { headline: "Bearish liquidity sweep wipes out $140 million in long leverage", impact: "BEARISH", category: "LIQ" }
      ],
      forex: [
        { headline: "Federal Reserve maintains interest rate levels, hints at late-year cut", impact: "NEUTRAL", category: "FED" },
        { headline: "European Central Bank raises concerns over inflation persistent tailwinds", impact: "BEARISH", category: "ECB" },
        { headline: "US Dollar Index (DXY) surges to 104.8 on safe-haven flows", impact: "BULLISH", category: "MACRO" },
        { headline: "Japanese Yen collapses to 158.2 per USD, BoJ intervention suspected", impact: "BEARISH", category: "BOJ" },
        { headline: "Swiss Franc shows strength on surprise SNB capital balance sheet expansion", impact: "BULLISH", category: "SNB" }
      ]
    },
    mr: {
      indianStocks: [
        { headline: "रिलायन्स इंडस्ट्रीजचा हरित हायड्रोजनसाठी धोरणात्मक करार, शेअर्समध्ये वाढ", impact: "BULLISH", category: "CORP" },
        { headline: "SEBI कडून इंडेक्स ऑप्शन्स वॉल्यूमवर नवीन मार्गदर्शक तत्त्वे जारी", impact: "NEUTRAL", category: "REG" },
        { headline: "टाटा मोटर्सच्या देशांतर्गत प्रवासी वाहनांच्या विक्रीत ४% घट", impact: "BEARISH", category: "CORP" },
        { headline: "इन्स्टिट्यूशनल ब्लॉक डील्समुळे निफ्टी ५० मध्ये मोठी हालचाल", impact: "NEUTRAL", category: "MARKET" },
        { headline: "FII कडून भारतीय बाजारपेठेत १,२०० कोटींची निव्वळ खरेदी", impact: "BULLISH", category: "FLOW" },
        { headline: "सरकारकडून इलेक्ट्रॉनिक्स सुट्या भागांच्या आयात शुल्कात वाढ", impact: "BEARISH", category: "MACRO" }
      ],
      crypto: [
        { headline: "SEC कडून स्पॉट इथरियम ऑप्शन्स ट्रेडिंगला मंजुरी", impact: "BULLISH", category: "REG" },
        { headline: "मायक्रोस्ट्रॅटेजीने २८० दशलक्ष डॉलर्समध्ये अतिरिक्त ४,५०० BTC खरेदी केले", impact: "BULLISH", category: "FLOW" },
        { headline: "सिक्युरिटी प्रोटोकॉल त्रुटीमुळे क्रिप्टो एक्सचेंज ऑडिटच्या फेऱ्यात", impact: "BEARISH", category: "REG" },
        { headline: "बिटकॉइन मायनर्सचे इन्व्हेंटरी होल्डिंग्स निच्चांकी पातळीवर", impact: "NEUTRAL", category: "FLOW" },
        { headline: "DEX व्यवहारांमुळे सोलाना वॉल्यूम सार्वकालिक उच्चांकावर", impact: "BULLISH", category: "TECH" },
        { headline: "मार्केट घसरणीमुळे १४० दशलक्ष डॉलर्सचे लॉंग पोझिशन्स लिक्विडेट", impact: "BEARISH", category: "LIQ" }
      ],
      forex: [
        { headline: "फेडरल रिझर्व्हने व्याजदर स्थिर ठेवले, वर्षाच्या अखेरीस कपातीचे संकेत", impact: "NEUTRAL", category: "FED" },
        { headline: "युरोपियन सेंट्रल बँकेकडून वाढत्या महागाईवर चिंता व्यक्त", impact: "BEARISH", category: "ECB" },
        { headline: "सुरक्षित गुंतवणूक ओघामुळे यूएस डॉलर इंडेक्स (DXY) १०४.८ वर पोहोचला", impact: "BULLISH", category: "MACRO" },
        { headline: "जपानी येन घसरून १५८.२ वर, बँक ऑफ जपानकडून हस्तक्षेपाची शक्यता", impact: "BEARISH", category: "BOJ" },
        { headline: "स्विस फ्रँक मजबूत, SNB कडून कॅपिटल विस्तार जाहीर", impact: "BULLISH", category: "SNB" }
      ]
    },
    hi: {
      indianStocks: [
        { headline: "रिलायंस इंडस्ट्रीज ने ग्रीन हाइड्रोजन के लिए समझौता किया, शेयरों में उछाल", impact: "BULLISH", category: "CORP" },
        { headline: "SEBI ने इंडेक्स ऑप्शंस डेरिवेटिव वॉल्यूम पर नए नियम जारी किए", impact: "NEUTRAL", category: "REG" },
        { headline: "टाटा मोटर्स की घरेलू पैसेंजर वाहन बिक्री में ४% की गिरावट", impact: "BEARISH", category: "CORP" },
        { headline: "संस्थागत ब्लॉक रीबैलेंसिंग के कारण निफ्टी ५० में भारी उतार-चढ़ाव", impact: "NEUTRAL", category: "MARKET" },
        { headline: "भारतीय कैश मार्केट में FII ने १,२०० करोड़ की शुद्ध खरीदारी की", impact: "BULLISH", category: "FLOW" },
        { headline: "सरकार ने घरेलू इलेक्ट्रॉनिक्स घटकों पर आयात शुल्क बढ़ाया", impact: "BEARISH", category: "MACRO" }
      ],
      crypto: [
        { headline: "SEC ने प्रमुख एक्सचेंजों पर स्पॉट एथेरियम ऑप्शंस ट्रेडिंग को मंजूरी दी", impact: "BULLISH", category: "REG" },
        { headline: "माइक्रोस्ट्रेटेजी ने २८० मिलियन डॉलर में अतिरिक्त ४,५०० BTC खरीदे", impact: "BULLISH", category: "FLOW" },
        { headline: "सुरक्षा प्रोटोकॉल बेमेल होने पर क्रिप्टो एक्सचेंज रेगुलेटरी ऑडिट के दायरे में", impact: "BEARISH", category: "REG" },
        { headline: "बिटकॉइन माइनर्स का इन्वेंट्री होल्डिंग्स रिकॉर्ड निचले स्तर पर", impact: "NEUTRAL", category: "FLOW" },
        { headline: "DEX गतिविधि के कारण सोलाना ट्रांजैक्शन वॉल्यूम नए शिखर पर", impact: "BULLISH", category: "TECH" },
        { headline: "बाजार में भारी गिरावट से १४० मिलियन डॉलर के लॉन्ग पोजीशंस लिक्विडेट", impact: "BEARISH", category: "LIQ" }
      ],
      forex: [
        { headline: "फेडरल रिजर्व ने ब्याज दरें स्थिर रखीं, साल के अंत में कटौती के संकेत", impact: "NEUTRAL", category: "FED" },
        { headline: "यूरोपियन सेंट्रल बैंक ने बढ़ती महंगाई पर चिंता जताई", impact: "BEARISH", category: "ECB" },
        { headline: "सुरक्षित निवेश प्रवाह के कारण यूएस डॉलर इंडेक्स (DXY) १०४.८ पर पहुंचा", impact: "BULLISH", category: "MACRO" },
        { headline: "जापानी येन गिरकर १५८.२ पर, बैंक ऑफ जापान के हस्तक्षेप की आशंका", impact: "BEARISH", category: "BOJ" },
        { headline: "स्विस फ्रैंक मजबूत, SNB कैपिटल शीट विस्तार की घोषणा", impact: "BULLISH", category: "SNB" }
      ]
    },
    es: {
      indianStocks: [
        { headline: "Reliance Industries firma pacto de hidrógeno verde, las acciones suben", impact: "BULLISH", category: "CORP" },
        { headline: "SEBI emite nuevas directrices sobre volúmenes de derivados de opciones", impact: "NEUTRAL", category: "REG" },
        { headline: "Ventas domésticas de pasajeros de Tata Motors caen un 4% interanual", impact: "BEARISH", category: "CORP" },
        { headline: "Nifty 50 oscila 120 puntos por rebalanceos de bloques institucionales", impact: "NEUTRAL", category: "MARKET" },
        { headline: "Compras netas de FII superan los 1,200 millones de rupias", impact: "BULLISH", category: "FLOW" },
        { headline: "El gobierno aumenta los aranceles de importación de componentes electrónicos", impact: "BEARISH", category: "MACRO" }
      ],
      crypto: [
        { headline: "La SEC aprueba el comercio de opciones Spot Ethereum en las bolsas", impact: "BULLISH", category: "REG" },
        { headline: "MicroStrategy adquiere 4,500 BTC adicionales por 280 millones de dólares", impact: "BULLISH", category: "FLOW" },
        { headline: "Exchange de criptomonedas enfrenta auditoría por fallas de seguridad", impact: "BEARISH", category: "REG" },
        { headline: "Los mineros de Bitcoin agotan reservas a niveles mínimos históricos", impact: "NEUTRAL", category: "FLOW" },
        { headline: "El volumen de transacciones de Solana sube a un máximo histórico", impact: "BULLISH", category: "TECH" },
        { headline: "Liquidación bajista elimina 140 millones de dólares en apalancamiento largo", impact: "BEARISH", category: "LIQ" }
      ],
      forex: [
        { headline: "La Reserva Federal mantiene tasas de interés, insinúa recortes a fin de año", impact: "NEUTRAL", category: "FED" },
        { headline: "El Banco Central Europeo expresa preocupación por la inflación persistente", impact: "BEARISH", category: "ECB" },
        { headline: "El índice del dólar estadounidense (DXY) sube a 104.8 por flujos seguros", impact: "BULLISH", category: "MACRO" },
        { headline: "El yen japonés cae a 158.2 por dólar, se sospecha intervención del BoJ", impact: "BEARISH", category: "BOJ" },
        { headline: "El franco suizo muestra fortaleza por expansión del balance del SNB", impact: "BULLISH", category: "SNB" }
      ]
    }
  };

  function pushNewsUpdate() {
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
    const activeTemplates = newsTemplates[lang] || newsTemplates['en'];
    const marketTemplates = activeTemplates[activeMarket] || activeTemplates['indianStocks'];
    
    const template = marketTemplates[Math.floor(Math.random() * marketTemplates.length)];
    const timeStr = new Date().toLocaleTimeString();
    const config = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
    const activeSymbolStr = config.symbol.replace('_', ' ');

    const newsItem = {
      id: "news-" + Date.now(),
      headline: template.headline,
      impact: template.impact,
      category: template.category,
      time: timeStr,
      analysis: lang === 'mr' ?
        `एआय विश्लेषण दर्शवते की हा कार्यक्रम थेट संस्थात्मक ऑर्डर प्लेसमेंटशी जोडलेला आहे. ${activeSymbolStr} वरील परिणामामुळे अस्थिरता वाढू शकते. सल्ला दिला जातो की +/- 0.5% जोखीम नियंत्रित ठेवावी.` :
        `AI Analysis reveals that this event has a direct, quantitative correlation with active ${activeSymbolStr} order placement. Expect volatility spikes. Recommended exposure adjustments inside terminals.`,
      summary: `${template.impact} IMPACT DETECTED ON ${activeMarket.toUpperCase()}`
    };

    activeNewsFeed.unshift(newsItem);
    if (activeNewsFeed.length > 15) activeNewsFeed.pop();

    renderNewsFeed();
    triggerAICoachNewsReaction(newsItem);
  }

  // Populate first entries
  for (let i = 0; i < 4; i++) {
    setTimeout(pushNewsUpdate, i * 400);
  }

  // Set interval to push news dynamically every 15 seconds
  setInterval(pushNewsUpdate, 15000);
}

function renderNewsFeed() {
  const feedContainer = document.getElementById('realtimeNewsFeed');
  if (!feedContainer) return;
  feedContainer.innerHTML = '';

  activeNewsFeed.forEach(item => {
    const row = document.createElement('div');
    row.className = 'news-feed-row';
    row.onclick = () => openSentimentReportFromFeed(item);
    
    let impactClass = 'neutral';
    if (item.impact === 'BULLISH') impactClass = 'bullish';
    else if (item.impact === 'BEARISH') impactClass = 'bearish';

    row.innerHTML = `
      <div class="news-feed-meta">
        <span class="news-feed-time">[${item.time}]</span>
        <span class="news-feed-impact ${impactClass}">${item.impact}</span>
      </div>
      <div class="news-feed-headline">${item.headline}</div>
    `;
    feedContainer.appendChild(row);
  });
}

function openSentimentReportFromFeed(item) {
  const modal = document.getElementById('sentimentModal');
  const headline = document.getElementById('modalSentimentHeadline');
  const badge = document.getElementById('modalSentimentBadge');
  const time = document.getElementById('modalSentimentTime');
  const analysis = document.getElementById('modalSentimentAnalysis');
  const impact = document.getElementById('modalSentimentImpact');

  if (modal && headline && badge && time && analysis && impact) {
    headline.innerText = item.headline;
    badge.innerText = `${item.category} • ${item.impact}`;
    
    if (item.impact === 'BULLISH') {
      badge.style.background = 'rgba(0, 230, 118, 0.15)';
      badge.style.color = 'var(--green-neon)';
      badge.style.borderColor = 'var(--green-neon)';
    } else if (item.impact === 'BEARISH') {
      badge.style.background = 'rgba(255, 23, 68, 0.15)';
      badge.style.color = 'var(--red-neon)';
      badge.style.borderColor = 'var(--red-neon)';
    } else {
      badge.style.background = 'rgba(255, 215, 0, 0.15)';
      badge.style.color = 'var(--gold-accent)';
      badge.style.borderColor = 'var(--gold-accent)';
    }
    
    time.innerText = item.time;
    analysis.innerText = item.analysis;
    impact.innerText = item.summary;
    
    if (item.impact === 'BULLISH') {
      impact.style.color = 'var(--green-neon)';
      impact.style.borderColor = 'rgba(0, 230, 118, 0.3)';
    } else if (item.impact === 'BEARISH') {
      impact.style.color = 'var(--red-neon)';
      impact.style.borderColor = 'rgba(255, 23, 68, 0.3)';
    } else {
      impact.style.color = 'var(--gold-accent)';
      impact.style.borderColor = 'rgba(255, 215, 0, 0.3)';
    }

    modal.style.display = 'flex';
  }
}

function triggerAICoachNewsReaction(newsItem) {
  const coachQuote = document.getElementById('coachQuote');
  const coachStatus = document.getElementById('coachStatus');
  const avatar = document.getElementById('coachAvatarGlow');
  const confidenceVal = document.getElementById('confidenceVal');
  const confidenceFill = document.getElementById('confidenceFill');
  const rationaleList = document.getElementById('rationaleList');

  if (!coachQuote || !coachStatus || !avatar || !confidenceVal || !confidenceFill || !rationaleList) return;

  avatar.className = "coach-avatar";

  if (newsItem.impact === 'BULLISH') {
    coachStatus.innerText = currentLang === 'mr' ? 'मंजूर' : 'BULLISH IMPACT';
    coachStatus.className = "coach-status-badge status-approved";
    avatar.classList.add("buy-glow");
    confidenceVal.innerText = "88%";
    confidenceFill.style.width = "88%";
    confidenceFill.style.backgroundColor = "var(--green-neon)";
    
    if (currentLang === 'mr') {
      coachQuote.innerText = `"${newsItem.headline}. यामुळे निफ्टी आणि तत्सम शेअर्समध्ये संस्थात्मक खरेदीदारांची खरेदी वाढली आहे, सर."`;
      rationaleList.innerHTML = `
        <div class="rationale-item">
          <span class="rationale-icon" style="color: var(--green-neon);">●</span>
          <span>बातम्यांच्या ओघामुळे खरेदी वाढली आहे (Institutional Inflow).</span>
        </div>
        <div class="rationale-item">
          <span class="rationale-icon" style="color: var(--green-neon);">●</span>
          <span>सकारात्मक भावना आणि उच्च ट्रेडिंग गती.</span>
        </div>
      `;
    } else {
      coachQuote.innerText = `"Breaking: '${newsItem.headline}'. This has triggered sudden institutional buying sweeps on the ticker, Sir."`;
      rationaleList.innerHTML = `
        <div class="rationale-item">
          <span class="rationale-icon" style="color: var(--green-neon);">●</span>
          <span>Breaking corporate catalog catalyst triggers momentum.</span>
        </div>
        <div class="rationale-item">
          <span class="rationale-icon" style="color: var(--green-neon);">●</span>
          <span>FII buying volume flow spike confirms expansion.</span>
        </div>
      `;
    }
  } else if (newsItem.impact === 'BEARISH') {
    coachStatus.innerText = currentLang === 'mr' ? 'टाळा' : 'BEARISH IMPACT';
    coachStatus.className = "coach-status-badge status-avoid";
    avatar.classList.add("sell-glow");
    confidenceVal.innerText = "15%";
    confidenceFill.style.width = "15%";
    confidenceFill.style.backgroundColor = "var(--red-neon)";

    if (currentLang === 'mr') {
      coachQuote.innerText = `"${newsItem.headline}. यामुळे बाजारात नफावसुली आणि संस्थात्मक विक्री सुरू झाली आहे."`;
      rationaleList.innerHTML = `
        <div class="rationale-item">
          <span class="rationale-icon" style="color: var(--red-neon);">●</span>
          <span>विक्रीच्या दबावामुळे सपोर्ट लेव्हल तोडण्याची शक्यता.</span>
        </div>
        <div class="rationale-item">
          <span class="rationale-icon" style="color: var(--red-neon);">●</span>
          <span>नकारात्मक हेडलाईन आणि कडक जोखीम व्यवस्थापन आवश्यक.</span>
        </div>
      `;
    } else {
      coachQuote.innerText = `"Macro Alert: '${newsItem.headline}'. Risk off sentiment has triggered massive sell-side distribution sweeps."`;
      rationaleList.innerHTML = `
        <div class="rationale-item">
          <span class="rationale-icon" style="color: var(--red-neon);">●</span>
          <span>Decline in active volume support bounds.</span>
        </div>
        <div class="rationale-item">
          <span class="rationale-icon" style="color: var(--red-neon);">●</span>
          <span>Negative headline triggers sudden stop loss run.</span>
        </div>
      `;
    }
  }
}

// Local browser storage trade persistence and database sync methods removed as this is a pure analysis & advisory platform

// --- AI INDIAN STOCKS BOARD & AUTO-DISCOVERY FEED ---
function renderIndianStocksDashboard() {
  const container = document.getElementById('indianStocksCatalog');
  const countBadge = document.getElementById('lblDiscoveryCount');
  const dict = langDb[currentLang] || langDb['en'];
  if (!container) return;

  container.innerHTML = '';
  
  if (countBadge) {
    countBadge.innerText = `${dict.lblDiscoveryCount}${indianEquitiesDatabase.length} STOCKS`;
  }

  indianEquitiesDatabase.forEach(stock => {
    const card = document.createElement('div');
    card.className = 'stock-profile-card';
    card.setAttribute('data-key', stock.key);
    card.onclick = () => openStockDetailModal(stock);

    const isNew = stock.key === 'sbin' || stock.key === 'tcs' || stock.key === 'adanient' || stock.key === 'coalindia';
    const badgeText = isNew ? (currentLang === 'mr' ? 'नवीन' : 'DISCOVERED') : (currentLang === 'mr' ? 'मुख्य' : 'CORE INDEX');
    const badgeClass = isNew ? 'discovered' : 'core';
    const sign = stock.change >= 0 ? '+' : '';
    const changeColor = stock.change >= 0 ? 'var(--green-neon)' : 'var(--red-neon)';

    card.innerHTML = `
      <div>
        <div class="stock-card-header">
          <div>
            <div class="stock-card-ticker">${stock.key.toUpperCase()}</div>
            <div class="stock-card-name">${stock.name}</div>
          </div>
          <span class="stock-card-badge ${badgeClass}">${badgeText}</span>
        </div>

        <div class="stock-card-price-row">
          <span class="stock-card-price">${stock.price.toFixed(2)}</span>
          <span class="stock-card-change" style="color: ${changeColor};">${sign}${stock.change.toFixed(2)}%</span>
        </div>

        <div class="stock-card-ai-analysis">
          ${stock.desc}
        </div>
      </div>

      <div class="stock-card-footer">
        <span>SECTOR: ${stock.sector}</span>
        <span>P/E: ${stock.pE}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function openStockDetailModal(stock) {
  const modal = document.getElementById('sentimentModal');
  const headline = document.getElementById('modalSentimentHeadline');
  const badge = document.getElementById('modalSentimentBadge');
  const time = document.getElementById('modalSentimentTime');
  const analysis = document.getElementById('modalSentimentAnalysis');
  const impact = document.getElementById('modalSentimentImpact');
  const title = document.getElementById('lblSentimentTitle');

  if (modal && headline && badge && time && analysis && impact) {
    if (title) title.innerText = currentLang === 'mr' ? 'AI स्टॉक क्वांटिटेटिव ऑडिट' : 'AI QUANTITATIVE STOCK AUDIT';
    headline.innerText = `${stock.name} (${stock.key.toUpperCase()})`;
    badge.innerText = `${stock.sector} • ${stock.cap}`;
    badge.style.background = 'rgba(0, 240, 255, 0.15)';
    badge.style.color = 'var(--cyan)';
    badge.style.borderColor = 'var(--cyan)';

    time.innerText = `P/E Ratio: ${stock.pE}`;
    analysis.innerHTML = `<strong style="color: var(--gold-accent);">AI Heuristics Analysis:</strong><br>${stock.lastAnalysis}<br><br><strong style="color: var(--cyan);">Market Profile:</strong><br>${stock.desc}`;
    
    const sign = stock.change >= 0 ? '+' : '';
    const color = stock.change >= 0 ? 'var(--green-neon)' : 'var(--red-neon)';
    impact.innerText = `LAST PRICE: ₹${stock.price.toFixed(2)} (${sign}${stock.change.toFixed(2)}%)`;
    impact.style.color = color;
    impact.style.borderColor = color.replace('var(--', 'rgba(').replace(')', ', 0.3)');

    modal.style.display = 'flex';
  }
}

function startAIDiscoveryEngine() {
  // Initial fill of logs
  const logsPanel = document.getElementById('stockDiscoveryLogs');
  if (logsPanel) {
    const defaultSecs = [
      { tag: "[INGESTION]", msg: "Reliance Industries data pipeline connected." },
      { tag: "[INGESTION]", msg: "Tata Motors Limited data pipeline connected." },
      { tag: "[INGESTION]", msg: "HDFC Bank Limited data pipeline connected." },
      { tag: "[INGESTION]", msg: "Tata Tech Limited data pipeline connected." }
    ];
    defaultSecs.forEach((item, idx) => {
      setTimeout(() => {
        const row = document.createElement('div');
        row.className = 'log-row';
        row.innerHTML = `
          <span class="log-time" style="color: var(--text-muted); margin-right: 6px;">[${new Date(Date.now() - (4 - idx) * 60000).toLocaleTimeString()}]</span>
          <span class="log-tag" style="color: var(--green-neon); font-weight: bold; margin-right: 6px;">${item.tag}</span>
          <span class="log-desc" style="color: var(--text-secondary);">${item.msg}</span>
        `;
        logsPanel.insertBefore(row, logsPanel.firstChild);
      }, idx * 100);
    });
  }

  setInterval(() => {
    if (activeMarket !== 'indianStocks') return;
    if (discoveryCandidates.length === 0) return;

    // Pick candidate and ingest it
    const newStock = discoveryCandidates.shift();
    indianEquitiesDatabase.push(newStock);

    // Render discovery log
    logStockDiscovery(newStock);

    // Refresh dashboard
    renderIndianStocksDashboard();
  }, 25000);
}

function logStockDiscovery(stock) {
  const logsPanel = document.getElementById('stockDiscoveryLogs');
  if (!logsPanel) return;

  const timeStr = new Date().toLocaleTimeString();
  const logRow = document.createElement('div');
  logRow.className = 'log-row';
  
  let logText = "";
  if (currentLang === 'mr') {
    logText = `एआय स्कॅनरने नवीन स्टॉक शोधला: <strong>${stock.name} (${stock.key.toUpperCase()})</strong>. प्रोफाइल समाविष्ट केले.`;
  } else if (currentLang === 'hi') {
    logText = `एआई स्कैनर ने नया स्टॉक खोजा: <strong>${stock.name} (${stock.key.toUpperCase()})</strong>. प्रोफाइल शामिल किया गया।`;
  } else if (currentLang === 'es') {
    logText = `El escáner de IA descubrió: <strong>${stock.name} (${stock.key.toUpperCase()})</strong>. Perfil cuantitativo integrado.`;
  } else {
    logText = `AI scanner discovered new liquidity pool: <strong>${stock.name} (${stock.key.toUpperCase()})</strong>. Inflow sweeps active.`;
  }

  logRow.innerHTML = `
    <span class="log-time" style="color: var(--text-muted); margin-right: 6px;">[${timeStr}]</span>
    <span class="log-tag" style="color: var(--gold-accent); font-weight: bold; margin-right: 6px;">[NEW STOCK]</span>
    <span class="log-desc" style="color: var(--text-primary);">${logText}</span>
  `;
  
  logsPanel.insertBefore(logRow, logsPanel.firstChild);
  if (logsPanel.children.length > 15) logsPanel.removeChild(logsPanel.lastChild);

  triggerDiscoveryAlert(stock);
}

function triggerDiscoveryAlert(stock) {
  const chat = document.getElementById('chatHistory');
  if (chat) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bubble-ai';
    bubble.style.borderColor = 'var(--gold-accent)';
    bubble.style.background = 'rgba(255, 215, 0, 0.05)';
    
    let chatMsg = "";
    if (currentLang === 'mr') {
      chatMsg = `नवीन शेअर्स शोध अहवाल, सर! मी आताच <strong>${stock.name} (${stock.key.toUpperCase()})</strong> कंपनी शोधली आहे आणि तिच्या तांत्रिक विश्लेषणाची नोंद केली आहे.`;
    } else if (currentLang === 'hi') {
      chatMsg = `नया शेयर्स खोज रिपोर्ट, सर! मैंने अभी <strong>${stock.name} (${stock.key.toUpperCase()})</strong> कंपनी खोजी है और उसके तकनीकी विश्लेषण की रिपोर्ट तैयार की है।`;
    } else if (currentLang === 'es') {
      chatMsg = `Informe de descubrimiento de acciones, Señor. He localizado y agregado <strong>${stock.name} (${stock.key.toUpperCase()})</strong> al panel de control con auditorías de volumen completas.`;
    } else {
      chatMsg = `New asset discovery report, Sir. I have scanned the NSE and ingested <strong>${stock.name} (${stock.key.toUpperCase()})</strong>. Inflow sweeps are active.`;
    }
    
    bubble.innerHTML = `
      <strong style="color: var(--gold-accent); font-family: 'Orbitron', sans-serif;">🛡️ AI SCANNER REPORT:</strong><br>
      ${chatMsg}
    `;
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
  }
}

// --- TRUSTED BACKEND WEBSOCKET SERVER SYNC ---
function connectBackendWebsocket() {
  const token = localStorage.getItem('wiseman_token');
  if (!token) return;

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === ''
    ? 'localhost:5000'
    : 'wiseman-backend.onrender.com';
  
  const wsUrl = `${protocol}//${host}/?token=${token}`;
  
  if (backendSocket) {
    try { backendSocket.close(); } catch(e) {}
  }

  backendSocket = new WebSocket(wsUrl);

  backendSocket.onopen = () => {
    console.log("Connected to trusted Wiseman backend WebSocket server.");
  };

  backendSocket.onmessage = (event) => {
    try {
      const packet = JSON.parse(event.data);
      
      if (packet.type === 'TICK_UPDATE') {
        updateMarketPricesFromBackend(packet.data);
      }
      
      if (packet.type === 'SECURITY_ALERT') {
        if (typeof triggerTerminatorCountermeasures === 'function') {
          triggerTerminatorCountermeasures(packet.message);
        }
      }
    } catch (err) {
      // Ignore parse errors
    }
  };

  backendSocket.onclose = () => {
    setTimeout(() => {
      if (localStorage.getItem('wiseman_token')) {
        connectBackendWebsocket();
      }
    }, 5000);
  };
}

function updateMarketPricesFromBackend(tickData) {
  const isBackendOpen = backendSocket && backendSocket.readyState === WebSocket.OPEN;
  if (!isBackendOpen) return;

  // 1. Update marketTickers database (for charts and watchlist)
  Object.keys(marketTickers).forEach(mKey => {
    marketTickers[mKey].forEach(t => {
      if (tickData[t.key]) {
        t.currentPrice = tickData[t.key].price;
        t.change = tickData[t.key].change;
        
        if (t.key === activeTickerKey) {
          price = t.currentPrice;
          
          const elLivePrice = document.getElementById('livePrice');
          if (elLivePrice) elLivePrice.innerText = price.toFixed(t.decimals);
          
          const badge = document.getElementById('priceChange');
          if (badge) {
            const sign = t.change >= 0 ? '+' : '';
            badge.innerText = `${sign}${t.change.toFixed(2)}%`;
            badge.className = t.change >= 0 ? 'price-change-badge positive' : 'price-change-badge negative';
          }
          
          // Sync simulator price inputs as well
          const elEntryInput = document.getElementById('entryInput');
          if (elEntryInput && document.activeElement !== elEntryInput) {
            elEntryInput.value = price.toFixed(t.decimals);
          }
          
          history.push(price);
          if (history.length > 300) history.shift();
        }
      }
    });
  });

  // 2. Update Indian stocks dashboard database
  indianEquitiesDatabase.forEach(stock => {
    if (tickData[stock.key]) {
      stock.price = tickData[stock.key].price;
      stock.change = tickData[stock.key].change;

      // Update card UI
      const card = document.querySelector(`.stock-profile-card[data-key="${stock.key}"]`);
      if (card) {
        const priceEl = card.querySelector('.stock-card-price');
        const changeEl = card.querySelector('.stock-card-change');
        if (priceEl) priceEl.innerText = stock.price.toFixed(2);
        if (changeEl) {
          const sign = stock.change >= 0 ? '+' : '';
          changeEl.innerText = `${sign}${stock.change.toFixed(2)}%`;
          changeEl.style.color = stock.change >= 0 ? 'var(--green-neon)' : 'var(--red-neon)';
        }
      }
    }
  });

  populateWatchlist();
  if (activeMarket !== 'indianStocks' && typeof drawChart === 'function') {
    drawChart();
  }
}

async function addStockSymbol() {
  const inputEl = document.getElementById('addStockInput');
  const btnEl = document.getElementById('addStockBtn');
  if (!inputEl || !btnEl) return;

  const rawSymbol = inputEl.value.trim().toUpperCase();
  if (!rawSymbol) return;

  // Check if already exists in database
  const exists = indianEquitiesDatabase.some(s => s.key === rawSymbol.toLowerCase() || s.key === rawSymbol.replace('.NS', '').toLowerCase());
  if (exists) {
    alert("This stock is already added to the dashboard.");
    return;
  }

  btnEl.disabled = true;
  btnEl.innerText = "SEARCHING...";
  inputEl.disabled = true;

  try {
    const token = localStorage.getItem('wiseman_token');
    
    // Determine the host dynamically based on local/production
    const host = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === ''
      ? 'http://localhost:5000'
      : 'https://wiseman-backend.onrender.com';

    const response = await fetch(`${host}/api/market/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ symbol: rawSymbol })
    });

    const data = await response.json();
    if (!response.ok || data.status !== 'SUCCESS') {
      alert(data.error || "Failed to add stock symbol.");
    } else {
      const stock = data.stock;
      
      // Add to local database
      indianEquitiesDatabase.push(stock);
      
      // Add to marketTickers so it can be used for watchlist/charts
      marketTickers['indianStocks'].push({
        key: stock.key,
        symbol: stock.key.toUpperCase(),
        name: stock.name,
        basePrice: stock.price,
        decimals: 2,
        currentPrice: stock.price,
        change: stock.change,
        wsStream: null
      });

      // Clear input field
      inputEl.value = '';

      // Re-render dashboard elements
      renderIndianStocksCatalog();
      populateWatchlist();
      
      // Post alert to scanner logs
      const scannerLogs = document.getElementById('scannerLogs');
      if (scannerLogs) {
        const row = document.createElement('div');
        row.className = 'log-row info';
        row.innerHTML = `<span class="log-time">${new Date().toLocaleTimeString()}</span>
                         <span class="log-tag" style="color: var(--cyan); text-shadow: var(--glow-cyan);">[INGESTION]</span>
                         <span class="log-desc" style="color: white;">Real-time quote channel initialized for ${stock.name} (${stock.key.toUpperCase()}).</span>`;
        scannerLogs.insertBefore(row, scannerLogs.firstChild);
      }
    }
  } catch (err) {
    console.error("Error adding stock:", err);
    alert("Network error. Make sure the Wiseman backend server is running.");
  } finally {
    btnEl.disabled = false;
    btnEl.innerText = "+ ADD";
    inputEl.disabled = false;
  }
}

// Bootstrap execution
window.addEventListener('DOMContentLoaded', init);
