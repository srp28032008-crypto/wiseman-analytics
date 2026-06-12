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
  
  if (!token) {
    logSecurityEvent("[WS BLOCKED]", "WebSocket upgrade rejected: Missing auth token.");
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }
  
  try {
    const decoded = jwt.verify(token, jwtSecret);
    request.user = decoded; // Attach user payload to request object
    
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } catch (err) {
    logSecurityEvent("[WS BLOCKED]", "WebSocket upgrade rejected: Invalid or expired token.");
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
  }
});

// --- WEBSOCKET REAL-TIME SIMULATOR & TRUSTED SERVER DATA CLIENT ---
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
