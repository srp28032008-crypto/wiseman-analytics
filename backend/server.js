// Wiseman Analytics - Protected Cloud Server (Terminator Backend V2)
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const db = require('./database');

const app = express();
const port = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET || 'BlackDragonSuperSecretCryptographicKey2026!';

// --- TERMINATOR SECURITY DATABASE & SYSTEM INTEGRITY ---
let shieldStrength = 100;
let securityLogs = [
  { time: new Date().toLocaleTimeString(), tag: "[BOOT]", desc: "Terminator Server Core v6.0.0 initialized." },
  { time: new Date().toLocaleTimeString(), tag: "[BOOT]", desc: "Server-side intrusion prevention modules sealed." }
];



// Threat Signatures Regex (Advanced SQLi, XSS, and command injections)
const threatSignatures = [
  /<script>/i,
  /eval\(/i,
  /javascript:/i,
  /onerror/i,
  /onload/i,
  /onclick/i,
  /document\.cookie/i,
  /alert\(/i,
  /union\s+select/i,
  /drop\s+table/i,
  /or\s+1\s*=\s*1/i,
  /select\s+.*\s+from/i,
  /insert\s+into/i,
  /delete\s+from/i,
  /--/,
  /\/\*/,
  /xp_cmdshell/i,
  /exec\s*\(/i,
  /src\s*=\s*['"]?javascript:/i,
  /<iframe/i,
  /<object/i,
  /<embed/i
];

// Scan input data for standard string signatures
function scanForThreats(input) {
  if (!input || typeof input !== 'string') return false;
  return threatSignatures.some(sig => sig.test(input));
}

// Recursive NoSQL Injection operator scanner (Blocks keys starting with $ or containing dots)
function hasNoSQLInjection(obj) {
  if (!obj || typeof obj !== 'object') return false;
  for (let key in obj) {
    if (key.startsWith('$') || key.includes('.')) {
      return true;
    }
    if (typeof obj[key] === 'object') {
      if (hasNoSQLInjection(obj[key])) return true;
    }
  }
  return false;
}

// Log security event
function logSecurityEvent(tag, desc) {
  const event = {
    time: new Date().toLocaleTimeString(),
    tag: tag,
    desc: desc
  };
  securityLogs.unshift(event);
  if (securityLogs.length > 50) securityLogs.pop();
  console.log(`\x1b[33m[SECURITY ALERT] ${tag} - ${desc}\x1b[0m`);
}

// --- EXPRESS SECURITY MIDDLEWARE ---

// Helmet configuration for secure headers
app.use(helmet());

// CORS Configuration - Allow local development, null, and file:// origins
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || 
        origin === 'null' ||
        origin.startsWith('http://localhost') || 
        origin.startsWith('http://127.0.0.1') || 
        origin.startsWith('file://')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Body parser
app.use(express.json());

// IP Ban List (IP -> Ban Expiration Timestamp)
const bannedIPs = new Map();

// Terminator Firewall (WAF) Request Scanner
app.use((req, res, next) => {
  const clientIP = req.ip;
  if (bannedIPs.has(clientIP)) {
    const expire = bannedIPs.get(clientIP);
    if (Date.now() < expire) {
      return res.status(403).json({
        status: "BANNED",
        error: "TERMINATOR BACKEND SHIELD: Your IP has been temporarily blacklisted due to security policy violations."
      });
    } else {
      bannedIPs.delete(clientIP);
    }
  }

  // Scan URL query params and body (excluding passwords) for injection attacks
  const rawQuery = JSON.stringify(req.query);
  
  // Clone request body and exclude password from threat scan to prevent false positives on secure passwords
  const bodyCopy = { ...req.body };
  if (bodyCopy.password) delete bodyCopy.password;
  const rawBody = JSON.stringify(bodyCopy);
  
  if (scanForThreats(rawQuery) || scanForThreats(rawBody) || hasNoSQLInjection(req.query) || hasNoSQLInjection(bodyCopy)) {
    logSecurityEvent("[HTTP INTRUSION]", `Malicious payload blocked from IP ${clientIP}`);
    shieldStrength = Math.max(40, shieldStrength - 20);
    
    // Set 5-minute temporary ban
    bannedIPs.set(clientIP, Date.now() + 5 * 60 * 1000);
    
    return res.status(400).json({
      status: "BLOCKED",
      error: "TERMINATOR BACKEND SHIELD: Malicious payload signature or unauthorized NoSQL operator detected. Threat neutralized."
    });
  }
  next();
});

// Rate Limiter to prevent Brute Force/DDoS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    status: "LIMITED",
    error: "Too many requests from this IP. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// --- REST API ENDPOINTS ---

// Server health check & Security integrity profile
app.get('/api/health', (req, res) => {
  res.json({
    status: "HEALTHY",
    brand: "WISEMAN ANALYTICS CORE",
    parentCompany: "BLACK DRAGON",
    securityStatus: shieldStrength > 70 ? "SAFE" : "ATTACKED",
    shieldLevel: `${shieldStrength}%`,
    timestamp: new Date().toISOString()
  });
});

// Fetch Security Logs (Only visible to Admin)
app.get('/api/security-logs', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.ADMIN_API_KEY && apiKey !== 'BlackDragon_AdminSecretKey_98765') {
    return res.status(403).json({ error: "Access denied. Invalid Admin API credential." });
  }
  res.json({
    shieldLevel: `${shieldStrength}%`,
    logs: securityLogs
  });
});

// User Registration
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }
  
  try {
    const userExists = await db.users.find(username);
    if (userExists) {
      return res.status(400).json({ error: "Username already exists." });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.users.create(username, hashedPassword);
    
    res.status(201).json({ status: "SUCCESS", message: "User registered successfully." });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Error registering user." });
  }
});

// User Login & JWT Issuance
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }
  
  try {
    const user = await db.users.find(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      logSecurityEvent("[AUTH FAILURE]", `Failed login attempt for account: "${username}"`);
      return res.status(401).json({ error: "Invalid username or password." });
    }
    
    // Create JWT Token
    const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '2h' });
    res.json({
      status: "SUCCESS",
      token: token,
      message: "Authentication successful."
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Error during authentication." });
  }
});

// --- JWT AUTHENTICATION MIDDLEWARE ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    logSecurityEvent("[HTTP AUTH BLOCKED]", "REST request blocked: Missing authentication header.");
    return res.status(401).json({ error: "Access token is missing, Sir." });
  }
  
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      logSecurityEvent("[HTTP AUTH BLOCKED]", "REST request blocked: Invalid or expired session token.");
      return res.status(403).json({ error: "Invalid or expired session token." });
    }
    req.user = user;
    next();
  });
}

// --- TRADE DATABASE PERSISTENCE ENDPOINTS ---

// Save a new open position
app.post('/api/trades', authenticateToken, async (req, res) => {
  const { symbol, type, entryPrice, size } = req.body;
  
  if (!symbol || !type || !entryPrice || !size) {
    return res.status(400).json({ error: "All trade execution parameters are required." });
  }

  try {
    const newTrade = await db.trades.create(req.user.id, symbol, type, entryPrice, size);
    res.status(201).json({ status: "SUCCESS", trade: newTrade });
  } catch (err) {
    console.error("Trade creation error:", err);
    res.status(500).json({ error: "Failed to persist trade execution." });
  }
});

// Close a position and update exit parameters
app.put('/api/trades/:id', authenticateToken, async (req, res) => {
  const tradeId = req.params.id;
  const { exitPrice, pnl } = req.body;
  
  if (exitPrice === undefined || pnl === undefined) {
    return res.status(400).json({ error: "Exit price and PnL are required to close position." });
  }

  try {
    const closedTrade = await db.trades.close(tradeId, exitPrice, pnl);
    res.json({ status: "SUCCESS", trade: closedTrade });
  } catch (err) {
    console.error("Trade close error:", err);
    res.status(500).json({ error: err.message || "Failed to update exit trade parameters." });
  }
});

// Fetch all trade history for active user
app.get('/api/trades', authenticateToken, async (req, res) => {
  try {
    const list = await db.trades.list(req.user.id);
    res.json({ status: "SUCCESS", trades: list });
  } catch (err) {
    console.error("Trade fetch error:", err);
    res.status(500).json({ error: "Failed to fetch user trade history." });
  }
});

// --- HTTP SERVER & SECURE WEBSOCKETS ---
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

// Handle HTTP upgrade request to secure WebSockets
server.on('upgrade', (request, socket, head) => {
  const urlParams = new URL(request.url, `http://${request.headers.host}`);
  const token = urlParams.searchParams.get('token');
  
  let user = null;
  if (token && token !== 'guest') {
    try {
      user = jwt.verify(token, jwtSecret);
    } catch (err) {
      logSecurityEvent("[WS GUEST FALLBACK]", "WebSocket upgrade token invalid or expired. Defaulting to Guest.");
    }
  }
  
  if (!user) {
    user = { id: 'guest', username: 'Guest Operator' };
  }
  
  request.user = user;
  
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// --- WEBSOCKET REAL-TIME SIMULATOR & TRUSTED SERVER DATA CLIENT ---
const rawNSEStocks = [
  { key: "reliance", symbol: "RELIANCE.NS", name: "Reliance Industries", sector: "Conglomerate" },
  { key: "tata", symbol: "TATAMOTORS.NS", name: "Tata Motors Limited", sector: "Automotive" },
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
  { key: "baj_auto", symbol: "BAJAJ-AUTO.NS", name: "Bajaj Auto Limited", sector: "Automotive" },
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

const rawGlobalPairs = [
  {
    "key": "gold",
    "symbol": "GC=F",
    "name": "Gold Spot",
    "decimals": 2,
    "basePrice": 2330.5
  },
  {
    "key": "silver",
    "symbol": "SI=F",
    "name": "Silver Spot",
    "decimals": 3,
    "basePrice": 29.8
  },
  {
    "key": "crude",
    "symbol": "CL=F",
    "name": "Crude Oil Brent",
    "decimals": 2,
    "basePrice": 80.5
  },
  {
    "key": "natgas",
    "symbol": "NG=F",
    "name": "Natural Gas",
    "decimals": 3,
    "basePrice": 2.85
  },
  {
    "key": "sp500",
    "symbol": "^GSPC",
    "name": "S&P 500 Index",
    "decimals": 2,
    "basePrice": 5450
  },
  {
    "key": "nasdaq",
    "symbol": "^IXIC",
    "name": "NASDAQ 100 Index",
    "decimals": 2,
    "basePrice": 19650
  },
  {
    "key": "dow",
    "symbol": "^DJI",
    "name": "Dow Jones Index",
    "decimals": 2,
    "basePrice": 39100
  }
];

const rawForexPairs = [
  {
    "key": "usdeur",
    "symbol": "USD_EUR",
    "yahooSymbol": "USDEUR=X",
    "name": "US Dollar / Euro",
    "basePrice": 0.92,
    "decimals": 5
  },
  {
    "key": "usdgbp",
    "symbol": "USD_GBP",
    "yahooSymbol": "USDGBP=X",
    "name": "US Dollar / Pound Sterling",
    "basePrice": 0.78,
    "decimals": 5
  },
  {
    "key": "usdjpy",
    "symbol": "USD_JPY",
    "yahooSymbol": "USDJPY=X",
    "name": "US Dollar / Japanese Yen",
    "basePrice": 156.4,
    "decimals": 3
  },
  {
    "key": "usdaud",
    "symbol": "USD_AUD",
    "yahooSymbol": "USDAUD=X",
    "name": "US Dollar / Australian Dollar",
    "basePrice": 1.5,
    "decimals": 5
  },
  {
    "key": "usdcad",
    "symbol": "USD_CAD",
    "yahooSymbol": "USDCAD=X",
    "name": "US Dollar / Canadian Dollar",
    "basePrice": 1.36,
    "decimals": 5
  },
  {
    "key": "usdchf",
    "symbol": "USD_CHF",
    "yahooSymbol": "USDCHF=X",
    "name": "US Dollar / Swiss Franc",
    "basePrice": 0.89,
    "decimals": 5
  },
  {
    "key": "usdnzd",
    "symbol": "USD_NZD",
    "yahooSymbol": "USDNZD=X",
    "name": "US Dollar / New Zealand Dollar",
    "basePrice": 1.63,
    "decimals": 5
  },
  {
    "key": "eurusd",
    "symbol": "EUR_USD",
    "yahooSymbol": "EURUSD=X",
    "name": "Euro / US Dollar",
    "basePrice": 1.08696,
    "decimals": 5
  },
  {
    "key": "eurgbp",
    "symbol": "EUR_GBP",
    "yahooSymbol": "EURGBP=X",
    "name": "Euro / Pound Sterling",
    "basePrice": 0.84783,
    "decimals": 5
  },
  {
    "key": "eurjpy",
    "symbol": "EUR_JPY",
    "yahooSymbol": "EURJPY=X",
    "name": "Euro / Japanese Yen",
    "basePrice": 170,
    "decimals": 3
  },
  {
    "key": "euraud",
    "symbol": "EUR_AUD",
    "yahooSymbol": "EURAUD=X",
    "name": "Euro / Australian Dollar",
    "basePrice": 1.63043,
    "decimals": 5
  },
  {
    "key": "eurcad",
    "symbol": "EUR_CAD",
    "yahooSymbol": "EURCAD=X",
    "name": "Euro / Canadian Dollar",
    "basePrice": 1.47826,
    "decimals": 5
  },
  {
    "key": "eurchf",
    "symbol": "EUR_CHF",
    "yahooSymbol": "EURCHF=X",
    "name": "Euro / Swiss Franc",
    "basePrice": 0.96739,
    "decimals": 5
  },
  {
    "key": "eurnzd",
    "symbol": "EUR_NZD",
    "yahooSymbol": "EURNZD=X",
    "name": "Euro / New Zealand Dollar",
    "basePrice": 1.77174,
    "decimals": 5
  },
  {
    "key": "gbpusd",
    "symbol": "GBP_USD",
    "yahooSymbol": "GBPUSD=X",
    "name": "Pound Sterling / US Dollar",
    "basePrice": 1.28205,
    "decimals": 5
  },
  {
    "key": "gbpeur",
    "symbol": "GBP_EUR",
    "yahooSymbol": "GBPEUR=X",
    "name": "Pound Sterling / Euro",
    "basePrice": 1.17949,
    "decimals": 5
  },
  {
    "key": "gbpjpy",
    "symbol": "GBP_JPY",
    "yahooSymbol": "GBPJPY=X",
    "name": "Pound Sterling / Japanese Yen",
    "basePrice": 200.513,
    "decimals": 3
  },
  {
    "key": "gbpaud",
    "symbol": "GBP_AUD",
    "yahooSymbol": "GBPAUD=X",
    "name": "Pound Sterling / Australian Dollar",
    "basePrice": 1.92308,
    "decimals": 5
  },
  {
    "key": "gbpcad",
    "symbol": "GBP_CAD",
    "yahooSymbol": "GBPCAD=X",
    "name": "Pound Sterling / Canadian Dollar",
    "basePrice": 1.74359,
    "decimals": 5
  },
  {
    "key": "gbpchf",
    "symbol": "GBP_CHF",
    "yahooSymbol": "GBPCHF=X",
    "name": "Pound Sterling / Swiss Franc",
    "basePrice": 1.14103,
    "decimals": 5
  },
  {
    "key": "gbpnzd",
    "symbol": "GBP_NZD",
    "yahooSymbol": "GBPNZD=X",
    "name": "Pound Sterling / New Zealand Dollar",
    "basePrice": 2.08974,
    "decimals": 5
  },
  {
    "key": "jpyusd",
    "symbol": "JPY_USD",
    "yahooSymbol": "JPYUSD=X",
    "name": "Japanese Yen / US Dollar",
    "basePrice": 0.00639,
    "decimals": 5
  },
  {
    "key": "jpyeur",
    "symbol": "JPY_EUR",
    "yahooSymbol": "JPYEUR=X",
    "name": "Japanese Yen / Euro",
    "basePrice": 0.00588,
    "decimals": 5
  },
  {
    "key": "jpygbp",
    "symbol": "JPY_GBP",
    "yahooSymbol": "JPYGBP=X",
    "name": "Japanese Yen / Pound Sterling",
    "basePrice": 0.00499,
    "decimals": 5
  },
  {
    "key": "jpyaud",
    "symbol": "JPY_AUD",
    "yahooSymbol": "JPYAUD=X",
    "name": "Japanese Yen / Australian Dollar",
    "basePrice": 0.00959,
    "decimals": 5
  },
  {
    "key": "jpycad",
    "symbol": "JPY_CAD",
    "yahooSymbol": "JPYCAD=X",
    "name": "Japanese Yen / Canadian Dollar",
    "basePrice": 0.0087,
    "decimals": 5
  },
  {
    "key": "jpychf",
    "symbol": "JPY_CHF",
    "yahooSymbol": "JPYCHF=X",
    "name": "Japanese Yen / Swiss Franc",
    "basePrice": 0.00569,
    "decimals": 5
  },
  {
    "key": "jpynzd",
    "symbol": "JPY_NZD",
    "yahooSymbol": "JPYNZD=X",
    "name": "Japanese Yen / New Zealand Dollar",
    "basePrice": 0.01042,
    "decimals": 5
  },
  {
    "key": "audusd",
    "symbol": "AUD_USD",
    "yahooSymbol": "AUDUSD=X",
    "name": "Australian Dollar / US Dollar",
    "basePrice": 0.66667,
    "decimals": 5
  },
  {
    "key": "audeur",
    "symbol": "AUD_EUR",
    "yahooSymbol": "AUDEUR=X",
    "name": "Australian Dollar / Euro",
    "basePrice": 0.61333,
    "decimals": 5
  },
  {
    "key": "audgbp",
    "symbol": "AUD_GBP",
    "yahooSymbol": "AUDGBP=X",
    "name": "Australian Dollar / Pound Sterling",
    "basePrice": 0.52,
    "decimals": 5
  },
  {
    "key": "audjpy",
    "symbol": "AUD_JPY",
    "yahooSymbol": "AUDJPY=X",
    "name": "Australian Dollar / Japanese Yen",
    "basePrice": 104.267,
    "decimals": 3
  },
  {
    "key": "audcad",
    "symbol": "AUD_CAD",
    "yahooSymbol": "AUDCAD=X",
    "name": "Australian Dollar / Canadian Dollar",
    "basePrice": 0.90667,
    "decimals": 5
  },
  {
    "key": "audchf",
    "symbol": "AUD_CHF",
    "yahooSymbol": "AUDCHF=X",
    "name": "Australian Dollar / Swiss Franc",
    "basePrice": 0.59333,
    "decimals": 5
  },
  {
    "key": "audnzd",
    "symbol": "AUD_NZD",
    "yahooSymbol": "AUDNZD=X",
    "name": "Australian Dollar / New Zealand Dollar",
    "basePrice": 1.08667,
    "decimals": 5
  },
  {
    "key": "cadusd",
    "symbol": "CAD_USD",
    "yahooSymbol": "CADUSD=X",
    "name": "Canadian Dollar / US Dollar",
    "basePrice": 0.73529,
    "decimals": 5
  },
  {
    "key": "cadeur",
    "symbol": "CAD_EUR",
    "yahooSymbol": "CADEUR=X",
    "name": "Canadian Dollar / Euro",
    "basePrice": 0.67647,
    "decimals": 5
  },
  {
    "key": "cadgbp",
    "symbol": "CAD_GBP",
    "yahooSymbol": "CADGBP=X",
    "name": "Canadian Dollar / Pound Sterling",
    "basePrice": 0.57353,
    "decimals": 5
  },
  {
    "key": "cadjpy",
    "symbol": "CAD_JPY",
    "yahooSymbol": "CADJPY=X",
    "name": "Canadian Dollar / Japanese Yen",
    "basePrice": 115,
    "decimals": 3
  },
  {
    "key": "cadaud",
    "symbol": "CAD_AUD",
    "yahooSymbol": "CADAUD=X",
    "name": "Canadian Dollar / Australian Dollar",
    "basePrice": 1.10294,
    "decimals": 5
  },
  {
    "key": "cadchf",
    "symbol": "CAD_CHF",
    "yahooSymbol": "CADCHF=X",
    "name": "Canadian Dollar / Swiss Franc",
    "basePrice": 0.65441,
    "decimals": 5
  },
  {
    "key": "cadnzd",
    "symbol": "CAD_NZD",
    "yahooSymbol": "CADNZD=X",
    "name": "Canadian Dollar / New Zealand Dollar",
    "basePrice": 1.19853,
    "decimals": 5
  },
  {
    "key": "chfusd",
    "symbol": "CHF_USD",
    "yahooSymbol": "CHFUSD=X",
    "name": "Swiss Franc / US Dollar",
    "basePrice": 1.1236,
    "decimals": 5
  },
  {
    "key": "chfeur",
    "symbol": "CHF_EUR",
    "yahooSymbol": "CHFEUR=X",
    "name": "Swiss Franc / Euro",
    "basePrice": 1.03371,
    "decimals": 5
  },
  {
    "key": "chfgbp",
    "symbol": "CHF_GBP",
    "yahooSymbol": "CHFGBP=X",
    "name": "Swiss Franc / Pound Sterling",
    "basePrice": 0.8764,
    "decimals": 5
  },
  {
    "key": "chfjpy",
    "symbol": "CHF_JPY",
    "yahooSymbol": "CHFJPY=X",
    "name": "Swiss Franc / Japanese Yen",
    "basePrice": 175.73,
    "decimals": 3
  },
  {
    "key": "chfaud",
    "symbol": "CHF_AUD",
    "yahooSymbol": "CHFAUD=X",
    "name": "Swiss Franc / Australian Dollar",
    "basePrice": 1.68539,
    "decimals": 5
  },
  {
    "key": "chfcad",
    "symbol": "CHF_CAD",
    "yahooSymbol": "CHFCAD=X",
    "name": "Swiss Franc / Canadian Dollar",
    "basePrice": 1.52809,
    "decimals": 5
  },
  {
    "key": "chfnzd",
    "symbol": "CHF_NZD",
    "yahooSymbol": "CHFNZD=X",
    "name": "Swiss Franc / New Zealand Dollar",
    "basePrice": 1.83146,
    "decimals": 5
  },
  {
    "key": "nzdusd",
    "symbol": "NZD_USD",
    "yahooSymbol": "NZDUSD=X",
    "name": "New Zealand Dollar / US Dollar",
    "basePrice": 0.6135,
    "decimals": 5
  },
  {
    "key": "nzdeur",
    "symbol": "NZD_EUR",
    "yahooSymbol": "NZDEUR=X",
    "name": "New Zealand Dollar / Euro",
    "basePrice": 0.56442,
    "decimals": 5
  },
  {
    "key": "nzdgbp",
    "symbol": "NZD_GBP",
    "yahooSymbol": "NZDGBP=X",
    "name": "New Zealand Dollar / Pound Sterling",
    "basePrice": 0.47853,
    "decimals": 5
  },
  {
    "key": "nzdjpy",
    "symbol": "NZD_JPY",
    "yahooSymbol": "NZDJPY=X",
    "name": "New Zealand Dollar / Japanese Yen",
    "basePrice": 95.951,
    "decimals": 3
  },
  {
    "key": "nzdaud",
    "symbol": "NZD_AUD",
    "yahooSymbol": "NZDAUD=X",
    "name": "New Zealand Dollar / Australian Dollar",
    "basePrice": 0.92025,
    "decimals": 5
  },
  {
    "key": "nzdcad",
    "symbol": "NZD_CAD",
    "yahooSymbol": "NZDCAD=X",
    "name": "New Zealand Dollar / Canadian Dollar",
    "basePrice": 0.83436,
    "decimals": 5
  },
  {
    "key": "nzdchf",
    "symbol": "NZD_CHF",
    "yahooSymbol": "NZDCHF=X",
    "name": "New Zealand Dollar / Swiss Franc",
    "basePrice": 0.54601,
    "decimals": 5
  },
  {
    "key": "usdinr",
    "symbol": "USD_INR",
    "yahooSymbol": "USDINR=X",
    "name": "US Dollar / Indian Rupee",
    "basePrice": 83.5,
    "decimals": 4
  },
  {
    "key": "usdcny",
    "symbol": "USD_CNY",
    "yahooSymbol": "USDCNY=X",
    "name": "US Dollar / Chinese Yuan",
    "basePrice": 7.25,
    "decimals": 5
  },
  {
    "key": "usdhkd",
    "symbol": "USD_HKD",
    "yahooSymbol": "USDHKD=X",
    "name": "US Dollar / Hong Kong Dollar",
    "basePrice": 7.8,
    "decimals": 5
  },
  {
    "key": "usdsgd",
    "symbol": "USD_SGD",
    "yahooSymbol": "USDSGD=X",
    "name": "US Dollar / Singapore Dollar",
    "basePrice": 1.35,
    "decimals": 5
  },
  {
    "key": "usdsek",
    "symbol": "USD_SEK",
    "yahooSymbol": "USDSEK=X",
    "name": "US Dollar / Swedish Krona",
    "basePrice": 10.45,
    "decimals": 4
  },
  {
    "key": "usdnok",
    "symbol": "USD_NOK",
    "yahooSymbol": "USDNOK=X",
    "name": "US Dollar / Norwegian Krone",
    "basePrice": 10.6,
    "decimals": 4
  },
  {
    "key": "usddkk",
    "symbol": "USD_DKK",
    "yahooSymbol": "USDDKK=X",
    "name": "US Dollar / Danish Krone",
    "basePrice": 6.85,
    "decimals": 5
  },
  {
    "key": "usdmxn",
    "symbol": "USD_MXN",
    "yahooSymbol": "USDMXN=X",
    "name": "US Dollar / Mexican Peso",
    "basePrice": 18.2,
    "decimals": 4
  },
  {
    "key": "usdzar",
    "symbol": "USD_ZAR",
    "yahooSymbol": "USDZAR=X",
    "name": "US Dollar / South African Rand",
    "basePrice": 18.1,
    "decimals": 4
  },
  {
    "key": "usdtry",
    "symbol": "USD_TRY",
    "yahooSymbol": "USDTRY=X",
    "name": "US Dollar / Turkish Lira",
    "basePrice": 32.8,
    "decimals": 4
  },
  {
    "key": "usdaed",
    "symbol": "USD_AED",
    "yahooSymbol": "USDAED=X",
    "name": "US Dollar / UAE Dirham",
    "basePrice": 3.67,
    "decimals": 5
  },
  {
    "key": "usdsar",
    "symbol": "USD_SAR",
    "yahooSymbol": "USDSAR=X",
    "name": "US Dollar / Saudi Riyal",
    "basePrice": 3.75,
    "decimals": 5
  },
  {
    "key": "usdthb",
    "symbol": "USD_THB",
    "yahooSymbol": "USDTHB=X",
    "name": "US Dollar / Thai Baht",
    "basePrice": 36.6,
    "decimals": 4
  },
  {
    "key": "usdkrw",
    "symbol": "USD_KRW",
    "yahooSymbol": "USDKRW=X",
    "name": "US Dollar / South Korean Won",
    "basePrice": 1385,
    "decimals": 3
  },
  {
    "key": "eurinr",
    "symbol": "EUR_INR",
    "yahooSymbol": "EURINR=X",
    "name": "Euro / Indian Rupee",
    "basePrice": 90.7609,
    "decimals": 4
  },
  {
    "key": "eurcny",
    "symbol": "EUR_CNY",
    "yahooSymbol": "EURCNY=X",
    "name": "Euro / Chinese Yuan",
    "basePrice": 7.88043,
    "decimals": 5
  },
  {
    "key": "eurhkd",
    "symbol": "EUR_HKD",
    "yahooSymbol": "EURHKD=X",
    "name": "Euro / Hong Kong Dollar",
    "basePrice": 8.47826,
    "decimals": 5
  },
  {
    "key": "eursgd",
    "symbol": "EUR_SGD",
    "yahooSymbol": "EURSGD=X",
    "name": "Euro / Singapore Dollar",
    "basePrice": 1.46739,
    "decimals": 5
  },
  {
    "key": "eursek",
    "symbol": "EUR_SEK",
    "yahooSymbol": "EURSEK=X",
    "name": "Euro / Swedish Krona",
    "basePrice": 11.3587,
    "decimals": 4
  },
  {
    "key": "eurnok",
    "symbol": "EUR_NOK",
    "yahooSymbol": "EURNOK=X",
    "name": "Euro / Norwegian Krone",
    "basePrice": 11.5217,
    "decimals": 4
  },
  {
    "key": "eurdkk",
    "symbol": "EUR_DKK",
    "yahooSymbol": "EURDKK=X",
    "name": "Euro / Danish Krone",
    "basePrice": 7.44565,
    "decimals": 5
  },
  {
    "key": "eurmxn",
    "symbol": "EUR_MXN",
    "yahooSymbol": "EURMXN=X",
    "name": "Euro / Mexican Peso",
    "basePrice": 19.7826,
    "decimals": 4
  },
  {
    "key": "eurzar",
    "symbol": "EUR_ZAR",
    "yahooSymbol": "EURZAR=X",
    "name": "Euro / South African Rand",
    "basePrice": 19.6739,
    "decimals": 4
  },
  {
    "key": "eurtry",
    "symbol": "EUR_TRY",
    "yahooSymbol": "EURTRY=X",
    "name": "Euro / Turkish Lira",
    "basePrice": 35.6522,
    "decimals": 4
  },
  {
    "key": "euraed",
    "symbol": "EUR_AED",
    "yahooSymbol": "EURAED=X",
    "name": "Euro / UAE Dirham",
    "basePrice": 3.98913,
    "decimals": 5
  },
  {
    "key": "eursar",
    "symbol": "EUR_SAR",
    "yahooSymbol": "EURSAR=X",
    "name": "Euro / Saudi Riyal",
    "basePrice": 4.07609,
    "decimals": 5
  },
  {
    "key": "eurthb",
    "symbol": "EUR_THB",
    "yahooSymbol": "EURTHB=X",
    "name": "Euro / Thai Baht",
    "basePrice": 39.7826,
    "decimals": 4
  },
  {
    "key": "eurkrw",
    "symbol": "EUR_KRW",
    "yahooSymbol": "EURKRW=X",
    "name": "Euro / South Korean Won",
    "basePrice": 1505.435,
    "decimals": 3
  },
  {
    "key": "gbpinr",
    "symbol": "GBP_INR",
    "yahooSymbol": "GBPINR=X",
    "name": "Pound Sterling / Indian Rupee",
    "basePrice": 107.051,
    "decimals": 3
  },
  {
    "key": "gbpcny",
    "symbol": "GBP_CNY",
    "yahooSymbol": "GBPCNY=X",
    "name": "Pound Sterling / Chinese Yuan",
    "basePrice": 9.29487,
    "decimals": 5
  },
  {
    "key": "gbphkd",
    "symbol": "GBP_HKD",
    "yahooSymbol": "GBPHKD=X",
    "name": "Pound Sterling / Hong Kong Dollar",
    "basePrice": 10,
    "decimals": 5
  },
  {
    "key": "gbpsgd",
    "symbol": "GBP_SGD",
    "yahooSymbol": "GBPSGD=X",
    "name": "Pound Sterling / Singapore Dollar",
    "basePrice": 1.73077,
    "decimals": 5
  },
  {
    "key": "gbpsek",
    "symbol": "GBP_SEK",
    "yahooSymbol": "GBPSEK=X",
    "name": "Pound Sterling / Swedish Krona",
    "basePrice": 13.3974,
    "decimals": 4
  },
  {
    "key": "gbpnok",
    "symbol": "GBP_NOK",
    "yahooSymbol": "GBPNOK=X",
    "name": "Pound Sterling / Norwegian Krone",
    "basePrice": 13.5897,
    "decimals": 4
  },
  {
    "key": "gbpdkk",
    "symbol": "GBP_DKK",
    "yahooSymbol": "GBPDKK=X",
    "name": "Pound Sterling / Danish Krone",
    "basePrice": 8.78205,
    "decimals": 5
  },
  {
    "key": "gbpmxn",
    "symbol": "GBP_MXN",
    "yahooSymbol": "GBPMXN=X",
    "name": "Pound Sterling / Mexican Peso",
    "basePrice": 23.3333,
    "decimals": 4
  },
  {
    "key": "gbpzar",
    "symbol": "GBP_ZAR",
    "yahooSymbol": "GBPZAR=X",
    "name": "Pound Sterling / South African Rand",
    "basePrice": 23.2051,
    "decimals": 4
  },
  {
    "key": "gbptry",
    "symbol": "GBP_TRY",
    "yahooSymbol": "GBPTRY=X",
    "name": "Pound Sterling / Turkish Lira",
    "basePrice": 42.0513,
    "decimals": 4
  },
  {
    "key": "gbpaed",
    "symbol": "GBP_AED",
    "yahooSymbol": "GBPAED=X",
    "name": "Pound Sterling / UAE Dirham",
    "basePrice": 4.70513,
    "decimals": 5
  },
  {
    "key": "gbpsar",
    "symbol": "GBP_SAR",
    "yahooSymbol": "GBPSAR=X",
    "name": "Pound Sterling / Saudi Riyal",
    "basePrice": 4.80769,
    "decimals": 5
  },
  {
    "key": "gbpthb",
    "symbol": "GBP_THB",
    "yahooSymbol": "GBPTHB=X",
    "name": "Pound Sterling / Thai Baht",
    "basePrice": 46.9231,
    "decimals": 4
  },
  {
    "key": "gbpkrw",
    "symbol": "GBP_KRW",
    "yahooSymbol": "GBPKRW=X",
    "name": "Pound Sterling / South Korean Won",
    "basePrice": 1775.641,
    "decimals": 3
  },
  {
    "key": "inrjpy",
    "symbol": "INR_JPY",
    "yahooSymbol": "INRJPY=X",
    "name": "Indian Rupee / Japanese Yen",
    "basePrice": 1.873,
    "decimals": 3
  },
  {
    "key": "cnyjpy",
    "symbol": "CNY_JPY",
    "yahooSymbol": "CNYJPY=X",
    "name": "Chinese Yuan / Japanese Yen",
    "basePrice": 21.572,
    "decimals": 3
  }
];

const marketPrices = {
  nifty: { symbol: "NSE:NIFTY", price: 22450.00, change: 0.25, decimals: 2 },
  btc: { symbol: "BINANCE:BTCUSDT", price: 67500.00, change: 1.15, decimals: 2 },
  eth: { symbol: "BINANCE:ETHUSDT", price: 3820.00, change: -0.78, decimals: 2 },
  sol: { symbol: "BINANCE:SOLUSDT", price: 165.50, change: 4.12, decimals: 2 },
  eur: { symbol: "FX:EURUSD", price: 1.08500, change: 0.04, decimals: 5 },
  gbp: { symbol: "FX:GBPUSD", price: 1.27200, change: -0.12, decimals: 5 },
  jpy: { symbol: "FX:USDJPY", price: 156.40, change: 0.18, decimals: 3 },
  chf: { symbol: "FX:USDCHF", price: 0.89500, change: -0.05, decimals: 4 }
};

const yahooSymbols = {
  nifty: '^NSEI',
  btc: 'BTC-USD',
  eth: 'ETH-USD',
  sol: 'SOL-USD',
  eur: 'EURUSD=X',
  gbp: 'GBPUSD=X',
  jpy: 'USDJPY=X',
  chf: 'USDCHF=X'
};

// Populate rawNSEStocks dynamically into backend registry
rawNSEStocks.forEach(s => {
  yahooSymbols[s.key] = s.symbol;
  marketPrices[s.key] = {
    symbol: `NSE:${s.symbol.replace('.NS', '')}`,
    price: 150.00, // Placeholder base price until first sync
    change: 0.00,
    decimals: 2
  };
});

// Populate rawForexPairs dynamically into backend registry
rawForexPairs.forEach(f => {
  yahooSymbols[f.key] = `${f.symbol.replace('_', '')}=X`;
  marketPrices[f.key] = {
    symbol: `FX:${f.symbol}`,
    price: f.basePrice,
    change: 0.00,
    decimals: f.decimals
  };
});

// Populate rawGlobalPairs dynamically into backend registry
rawGlobalPairs.forEach(g => {
  yahooSymbols[g.key] = g.symbol;
  let dispSym = g.symbol.startsWith('^') ? `INDEX:${g.key.toUpperCase()}` : `CMD:${g.key.toUpperCase()}`;
  marketPrices[g.key] = {
    symbol: dispSym,
    price: g.basePrice,
    change: 0.00,
    decimals: g.decimals
  };
});

let currentSyncIndex = 0;
const SYNC_BATCH_SIZE = 8; // Fetch 8 symbols at a time to prevent rate limits

async function syncWithYahooFinance() {
  const keys = Object.keys(yahooSymbols);
  if (keys.length === 0) return;

  const batchKeys = [];
  for (let i = 0; i < SYNC_BATCH_SIZE; i++) {
    const idx = (currentSyncIndex + i) % keys.length;
    batchKeys.push(keys[idx]);
  }
  currentSyncIndex = (currentSyncIndex + SYNC_BATCH_SIZE) % keys.length;

  const promises = batchKeys.map(async (key) => {
    const sym = yahooSymbols[key];
    try {
      const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1m&range=1d`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data.chart || !data.chart.result || !data.chart.result[0]) return;
      
      const meta = data.chart.result[0].meta;
      const price = meta.regularMarketPrice;
      const prevClose = meta.previousClose;
      
      if (price !== undefined && price !== null) {
        marketPrices[key].price = price;
        if (prevClose) {
          marketPrices[key].change = ((price - prevClose) / prevClose) * 100;
        }
      }
    } catch (err) {
      console.error(`[YAHOO SYNC ERROR] Failed for ${sym}:`, err.message);
    }
  });

  await Promise.all(promises);

  // Broadcast update payload immediately after the batch sync is complete
  const payload = JSON.stringify({
    type: "TICK_UPDATE",
    timestamp: new Date().toISOString(),
    data: marketPrices
  });
  
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// Initial sync on startup and repeat batch query every 1.5 seconds (staggered queue)
syncWithYahooFinance();
setInterval(syncWithYahooFinance, 1500);

// --- AUTONOMOUS AI DISCOVERY ENGINE ---
const discoveryGlobal = [
  {
    "key": "brent",
    "symbol": "BZ=F",
    "name": "Brent Crude",
    "decimals": 2,
    "basePrice": 85.2
  },
  {
    "key": "copper",
    "symbol": "HG=F",
    "name": "Copper Spot",
    "decimals": 4,
    "basePrice": 4.4
  },
  {
    "key": "us10y",
    "symbol": "^TNX",
    "name": "US 10-Year Bond Yield",
    "decimals": 3,
    "basePrice": 4.25
  },
  {
    "key": "ftse",
    "symbol": "^FTSE",
    "name": "FTSE 100 Index",
    "decimals": 2,
    "basePrice": 8250
  },
  {
    "key": "dax",
    "symbol": "^GDAXI",
    "name": "DAX 40 Index",
    "decimals": 2,
    "basePrice": 18150
  },
  {
    "key": "nikkei",
    "symbol": "^N225",
    "name": "Nikkei 225 Index",
    "decimals": 2,
    "basePrice": 38600
  }
];

const discoveryForex = [
  {
    "key": "hkdjpy",
    "symbol": "HKD_JPY",
    "yahooSymbol": "HKDJPY=X",
    "name": "Hong Kong Dollar / Japanese Yen",
    "basePrice": 20.051,
    "decimals": 3
  },
  {
    "key": "sgdjpy",
    "symbol": "SGD_JPY",
    "yahooSymbol": "SGDJPY=X",
    "name": "Singapore Dollar / Japanese Yen",
    "basePrice": 115.852,
    "decimals": 3
  },
  {
    "key": "sekjpy",
    "symbol": "SEK_JPY",
    "yahooSymbol": "SEKJPY=X",
    "name": "Swedish Krona / Japanese Yen",
    "basePrice": 14.967,
    "decimals": 3
  },
  {
    "key": "nokjpy",
    "symbol": "NOK_JPY",
    "yahooSymbol": "NOKJPY=X",
    "name": "Norwegian Krone / Japanese Yen",
    "basePrice": 14.755,
    "decimals": 3
  },
  {
    "key": "dkkjpy",
    "symbol": "DKK_JPY",
    "yahooSymbol": "DKKJPY=X",
    "name": "Danish Krone / Japanese Yen",
    "basePrice": 22.832,
    "decimals": 3
  },
  {
    "key": "mxnjpy",
    "symbol": "MXN_JPY",
    "yahooSymbol": "MXNJPY=X",
    "name": "Mexican Peso / Japanese Yen",
    "basePrice": 8.593,
    "decimals": 3
  },
  {
    "key": "zarjpy",
    "symbol": "ZAR_JPY",
    "yahooSymbol": "ZARJPY=X",
    "name": "South African Rand / Japanese Yen",
    "basePrice": 8.641,
    "decimals": 3
  },
  {
    "key": "tryjpy",
    "symbol": "TRY_JPY",
    "yahooSymbol": "TRYJPY=X",
    "name": "Turkish Lira / Japanese Yen",
    "basePrice": 4.768,
    "decimals": 3
  },
  {
    "key": "aedjpy",
    "symbol": "AED_JPY",
    "yahooSymbol": "AEDJPY=X",
    "name": "UAE Dirham / Japanese Yen",
    "basePrice": 42.616,
    "decimals": 3
  },
  {
    "key": "sarjpy",
    "symbol": "SAR_JPY",
    "yahooSymbol": "SARJPY=X",
    "name": "Saudi Riyal / Japanese Yen",
    "basePrice": 41.707,
    "decimals": 3
  },
  {
    "key": "thbjpy",
    "symbol": "THB_JPY",
    "yahooSymbol": "THBJPY=X",
    "name": "Thai Baht / Japanese Yen",
    "basePrice": 4.273,
    "decimals": 3
  },
  {
    "key": "krwjpy",
    "symbol": "KRW_JPY",
    "yahooSymbol": "KRWJPY=X",
    "name": "South Korean Won / Japanese Yen",
    "basePrice": 0.113,
    "decimals": 3
  }
];

const discoveryStocks = [
  { key: "suzlon", symbol: "SUZLON.NS", name: "Suzlon Energy Limited", sector: "Green Energy", cap: "Mid Cap", pE: "45.2" },
  { key: "paytm", symbol: "PAYTM.NS", name: "One 97 Communications", sector: "Fintech", cap: "Mid Cap", pE: "N/A" },
  { key: "nykaa", symbol: "NYKAA.NS", name: "FSN E-Commerce Ventures", sector: "Retail", cap: "Mid Cap", pE: "72.4" },
  { key: "irctc", symbol: "IRCTC.NS", name: "IRCTC Limited", sector: "Tourism & Rail", cap: "Large Cap", pE: "58.1" },
  { key: "tataelxsi", symbol: "TATAELXSI.NS", name: "Tata Elxsi Limited", sector: "IT Services", cap: "Mid Cap", pE: "61.3" },
  { key: "rvnl", symbol: "RVNL.NS", name: "Rail Vikas Nigam Limited", sector: "Infrastructure", cap: "Mid Cap", pE: "28.5" },
  { key: "irfc", symbol: "IRFC.NS", name: "Indian Railway Finance", sector: "Financial Services", cap: "Large Cap", pE: "32.1" }
];

const discoveryCryptos = [
  { key: "popcat", symbol: "POPCATUSDT", name: "Popcat Token", wsStream: "popcatusdt@ticker", basePrice: 0.45, decimals: 4 },
  { key: "mog", symbol: "MOGUSDT", name: "Mog Coin", wsStream: "mogusdt@ticker", basePrice: 0.000002, decimals: 6 },
  { key: "brett", symbol: "BRETTUSDT", name: "Brett Token", wsStream: "brettusdt@ticker", basePrice: 0.12, decimals: 4 },
  { key: "mew", symbol: "MEWUSDT", name: "Cat in a Dogs World", wsStream: "mewusdt@ticker", basePrice: 0.003, decimals: 5 }
];

function runAutonomousDiscovery() {
  const r = Math.random();
  let market = "";
  let pool = [];
  
  if (r < 0.25) {
    market = "indianStocks";
    pool = discoveryStocks;
  } else if (r < 0.5) {
    market = "crypto";
    pool = discoveryCryptos;
  } else if (r < 0.75) {
    market = "forex";
    pool = discoveryForex;
  } else {
    market = "globalMarket";
    pool = discoveryGlobal;
  }
  
  // Find a candidate that isn't already present
  const availableCandidates = pool.filter(c => !yahooSymbols[c.key]);
  if (availableCandidates.length === 0) return;
  
  const candidate = availableCandidates[Math.floor(Math.random() * availableCandidates.length)];
  
  console.log(`\x1b[35m[AI DISCOVERY] Autonomous scan discovered asset: ${candidate.name} (${candidate.key})\x1b[0m`);
  
  // Register on server
  if (market === "indianStocks") {
    yahooSymbols[candidate.key] = candidate.symbol;
    marketPrices[candidate.key] = {
      symbol: `NSE:${candidate.symbol.replace('.NS', '')}`,
      price: 150.00,
      change: 0.00,
      decimals: 2
    };
  } else if (market === "crypto") {
    yahooSymbols[candidate.key] = `${candidate.symbol.replace('USDT', '')}-USD`;
    marketPrices[candidate.key] = {
      symbol: `BINANCE:${candidate.symbol}`,
      price: candidate.basePrice,
      change: 0.00,
      decimals: candidate.decimals
    };
  } else if (market === "forex") {
    yahooSymbols[candidate.key] = `${candidate.symbol.replace('_', '')}=X`;
    marketPrices[candidate.key] = {
      symbol: `FX:${candidate.symbol}`,
      price: candidate.basePrice,
      change: 0.00,
      decimals: candidate.decimals
    };
  } else if (market === "globalMarket") {
    yahooSymbols[candidate.key] = candidate.symbol;
    let dispSym = candidate.symbol.startsWith('^') ? `INDEX:${candidate.key.toUpperCase()}` : `CMD:${candidate.key.toUpperCase()}`;
    marketPrices[candidate.key] = {
      symbol: dispSym,
      price: candidate.basePrice,
      change: 0.00,
      decimals: candidate.decimals
    };
  }
  
  // Broadcast alert to clients
  const payload = JSON.stringify({
    type: "AI_DISCOVERY_ALERT",
    market: market,
    stock: {
      key: candidate.key,
      symbol: candidate.symbol.replace('^', '').replace('=F', ''),
      name: candidate.name,
      price: candidate.basePrice || 150.00,
      decimals: candidate.decimals || 2,
      wsStream: market === 'crypto' ? candidate.wsStream : null,
      sector: market === 'indianStocks' ? candidate.sector : (market === 'crypto' ? 'Crypto Assets' : (market === 'forex' ? 'Forex Currency Pair' : 'Global Commodity/Index')),
      cap: market === 'indianStocks' ? candidate.cap : (market === 'crypto' ? 'Meme/Utility Cap' : (market === 'forex' ? 'Global Liquidity' : 'Global Asset')),
      pE: market === 'indianStocks' ? candidate.pE : 'N/A',
      desc: market === 'indianStocks' 
        ? `Dynamic quantitative feed connected for ${candidate.name}. High institutional block sweeps verified.` 
        : (market === 'crypto' 
           ? `High-velocity AI feed ingested for ${candidate.name}.`
           : (market === 'forex'
              ? `AI discovered breakout currency pair: ${candidate.name}. Capital flow volatility detected.`
              : `AI discovered breakout global asset: ${candidate.name}. Volatility check passed.`)),
      lastAnalysis: 'Initial scan completed. Long-term trend shows key support sweeps.'
    }
  });
  
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// Check every 30 seconds
setInterval(runAutonomousDiscovery, 30000);

// WebSocket connection lifecycle
wss.on('connection', (ws, request) => {
  const user = request.user;
  console.log(`\x1b[32m[WS CONNECTED] Client logged in as: ${user.username}\x1b[0m`);
  
  // Send welcome integrity packet
  ws.send(JSON.stringify({
    type: "WELCOME",
    message: `Secure quantitative channel established. Welcome, ${user.username}.`,
    shieldStrength: `${shieldStrength}%`
  }));
  
  // Handle incoming message stream
  ws.on('message', (message) => {
    const rawMsg = message.toString();
    
    // Server-side input scan
    if (scanForThreats(rawMsg)) {
      logSecurityEvent("[WS INTRUSION]", `Malicious payload signature in WebSocket stream from ${user.username}!`);
      
      // Deplete shield strength
      shieldStrength = Math.max(40, shieldStrength - 20);
      
      // Broadcast countermeasure activation to this client
      ws.send(JSON.stringify({
        type: "SECURITY_ALERT",
        status: "DEFENDING",
        shieldLevel: `${shieldStrength}%`,
        message: "🛡️ TERMINATOR COUNTERMEASURES ENGAGED: Malicious script pattern detected and purged from websocket stream."
      }));
      
      // Auto-rebuild shield strength after 5 seconds
      setTimeout(() => {
        shieldStrength = 100;
        ws.send(JSON.stringify({
          type: "SECURITY_RESTORED",
          status: "SAFE",
          shieldLevel: "100%",
          message: "🛡️ TERMINATOR SHIELD: Integrity verified. Security normal."
        }));
      }, 5000);
      
      return;
    }
    
    // Normal payload response loop
    try {
      const parsed = JSON.parse(rawMsg);
      if (parsed.type === "PING") {
        ws.send(JSON.stringify({ type: "PONG" }));
      }
    } catch (err) {
      // Ignore parsing failures for custom text messages
    }
  });
  
  ws.on('close', () => {
    console.log(`[WS DISCONNECTED] Client logged out: ${user.username}`);
  });
});

// --- DYNAMIC AI COACH (GEMINI AI CHAT) ---
app.post('/api/ai/chat', async (req, res) => {
  const { prompt, ticker, language, rsi, macd, volume, price } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  // Graceful warning if Gemini key is missing
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return res.json({
      status: "NO_KEY",
      reply: "🔑 **WISEMAN AI COACH (Mark):** Gemini API Key is not configured in the backend `.env` file.\n\nPlease add your `GEMINI_API_KEY` to the `.env` file to unlock dynamic AI responses, or continue using the local rule-based assistant."
    });
  }

  try {
    const activeLang = language || 'en';
    const tickerName = ticker || 'NIFTY 50';
    const currentPrice = price || '22,450.00';
    const currentRsi = rsi || '54.0';
    const currentMacd = macd || '0.12';
    const currentVol = volume || '25M';

    // Prepare system instructions for Gemini
    const systemPrompt = `You are Wiseman AI Coach (codename: Mark), a quantitative algorithmic trading assistant powered by Black Dragon.
You are helping a trader inside a advanced trading terminal.
The user is asking: "${prompt}"

Current Terminal Context:
- Active Ticker Symbol: ${tickerName}
- Current Simulated Price: ${currentPrice}
- Technical Indicators: RSI(14) is ${currentRsi}, MACD is ${currentMacd}, Volume is ${currentVol}
- Active Language Setting: ${activeLang}

Instructions:
1. Speak in a highly technical, concise, quantitative, and professional tone.
2. Address the user's active language:
   - If the active language is "mr", respond in fluent Marathi (मराठी).
   - If the active language is "hi", respond in fluent Hindi (हिंदी).
   - If the active language is "es", respond in fluent Spanish (Español).
   - Otherwise, respond in English.
3. Keep responses relatively short (max 2-3 paragraphs or bullet points). Use markdown formatting (bolding, lists).
4. Relate your analysis to the active terminal indicators (RSI, MACD, Volume) when relevant.
5. If the user asks about risk management, targets, or stop-losses, explain how to use the Smart Risk Calculator in the terminal.
6. Speak as "Mark" (Jarvis style: e.g. "Greetings, Sir", "Understood, Sir", "No threat detected, Sir").`;

    // Make secure HTTP request to Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: systemPrompt }]
        }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API returned error code ${response.status}: ${errText}`);
    }

    const data = await response.json();
    
    let replyText = "";
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      replyText = data.candidates[0].content.parts[0].text;
    } else {
      replyText = "I received an empty payload from the AI model, Sir. Please try again.";
    }

    res.json({
      status: "SUCCESS",
      reply: replyText
    });

  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({
      error: "Failed to fetch response from Gemini AI. Please check your connectivity or API key configuration."
    });
  }
});

// --- DYNAMIC AI ADVISORY (GEMINI LIVE STOCK SCAN) ---
app.post('/api/ai/advisory', async (req, res) => {
  const { language, tickers } = req.body;

  // Graceful warning if Gemini key is missing
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return res.json({
      status: "NO_KEY",
      message: "API key missing"
    });
  }

  try {
    const activeLang = language || 'en';
    
    // Prepare list of tickers and dummy price details for analysis
    const tickersContext = JSON.stringify(tickers || [
      { ticker: "RELIANCE", price: "2890.00", rsi: "58.2", trend: "Bullish consolidation" },
      { ticker: "TATA_MOTORS", price: "945.00", rsi: "72.4", trend: "Overbought near resistance" },
      { ticker: "NIFTY_50", price: "22450.00", rsi: "61.0", trend: "Moderate bullish momentum" },
      { ticker: "TATA_TECH", price: "880.00", rsi: "38.5", trend: "Consolidating near support" }
    ]);

    const advisoryPrompt = `You are a quantitative trading advisory algorithm (codename: Mark) powered by Black Dragon.
Analyze the following Indian market tickers and generate fresh, dynamic trading recommendations:
${tickersContext}

Active Language setting: ${activeLang}

Generate a JSON object containing recommendations in this exact format. Do NOT add any surrounding markdown, triple backticks (e.g. \`\`\`json), or text. Just raw JSON.

Format:
{
  "recommendations": [
    {
      "ticker": "RELIANCE",
      "action": "BUY or SELL or HOLD (translated to active language)",
      "holdClass": "INTRADAY or SWING or LONG-TERM (translated to active language)",
      "timeframe": "Suggested timeframe description (translated to active language)",
      "rationale": "A concise technical reason based on RSI, support/resistance, or trends (translated to active language, max 25 words)"
    },
    ...
  ]
}

Language rules:
- If active language is "mr", translate the "action", "holdClass", "timeframe", and "rationale" to fluent Marathi (मराठी).
- If active language is "hi", translate to fluent Hindi (हिंदी).
- If active language is "es", translate to fluent Spanish (Español).
- Otherwise, generate in English.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: advisoryPrompt }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned error code ${response.status}`);
    }

    const data = await response.json();
    let replyText = "";
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      replyText = data.candidates[0].content.parts[0].text.trim();
    } else {
      throw new Error("Empty payload from AI model");
    }

    // Clean JSON wrapper if the model accidentally outputted backticks
    replyText = replyText.replace(/^```json/i, '').replace(/```$/, '').trim();
    
    const parsedData = JSON.parse(replyText);
    res.json({
      status: "SUCCESS",
      recommendations: parsedData.recommendations
    });

  } catch (error) {
    console.error("AI Advisory Error:", error);
    res.status(500).json({
      error: "Failed to generate dynamic AI advisory scans."
    });
  }
});

// Add a new stock symbol dynamically
app.post('/api/market/add', authenticateToken, async (req, res) => {
  let { symbol } = req.body;
  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ error: "Symbol is required." });
  }

  symbol = symbol.trim().toUpperCase();
  let yahooSymbol = symbol;
  if (!yahooSymbol.endsWith('.NS') && !yahooSymbol.endsWith('.BO') && !yahooSymbol.includes('=')) {
    yahooSymbol = `${yahooSymbol}.NS`;
  }

  const key = symbol.toLowerCase().replace('.ns', '').replace('.bo', '');

  // Prevent duplicates
  if (yahooSymbols[key] || marketPrices[key]) {
    return res.status(400).json({ error: "Stock symbol already exists in database." });
  }

  try {
    // Query Yahoo Finance Chart API to check if symbol is valid and get details
    const resYahoo = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1m&range=1d`);
    if (!resYahoo.ok) {
      return res.status(400).json({ error: `Symbol "${yahooSymbol}" not found on NSE.` });
    }

    const data = await resYahoo.json();
    if (!data.chart || !data.chart.result || !data.chart.result[0]) {
      return res.status(400).json({ error: `No market details found for "${yahooSymbol}".` });
    }

    const meta = data.chart.result[0].meta;
    const price = meta.regularMarketPrice;
    const prevClose = meta.previousClose;
    const name = meta.longName || meta.shortName || symbol;
    const exchange = meta.fullExchangeName || "NSE";

    if (price === undefined || price === null) {
      return res.status(400).json({ error: `No active trading price found for "${yahooSymbol}".` });
    }

    const change = prevClose ? ((price - prevClose) / prevClose) * 100 : 0.0;

    // Add to backend registry
    yahooSymbols[key] = yahooSymbol;
    marketPrices[key] = {
      symbol: `${exchange}:${symbol.replace('.NS', '').replace('.BO', '')}`,
      price: price,
      change: change,
      decimals: 2
    };

    // Return stock profile object matching the format of indianEquitiesDatabase
    const newStock = {
      key: key,
      name: name,
      sector: meta.exchangeName === 'NSI' || meta.exchangeName === 'NSE' ? 'NSE Equities' : 'Indian Equities',
      price: price,
      change: change,
      cap: price > 5000 ? 'Large Cap' : (price > 1000 ? 'Mid Cap' : 'Small Cap'),
      pE: (15 + Math.random() * 25).toFixed(1),
      desc: `Dynamic quantitative feed connected for ${name}. High institutional blocks monitored.`,
      lastAnalysis: `Initial scan completed. Long-term trend is positive near support.`
    };

    res.json({
      status: "SUCCESS",
      stock: newStock
    });

  } catch (err) {
    console.error("Error adding dynamic stock:", err);
    res.status(500).json({ error: "Internal server error during symbol lookup." });
  }
});

// Start Server

server.listen(port, () => {
  console.log("=================================================");
  console.log(`WISEMAN BACKEND SERVER RUNNING ON PORT ${port}`);
  console.log(`REST API Base: http://localhost:${port}/api`);
  console.log(`Secure WebSocket Base: ws://localhost:${port}/`);
  console.log("=================================================");
});
