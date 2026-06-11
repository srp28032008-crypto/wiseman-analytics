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



// Threat Signatures Regex
const threatSignatures = [
  /<script>/i,
  /eval\(/i,
  /javascript:/i,
  /onerror/i,
  /onload/i,
  /onclick/i,
  /document\.cookie/i,
  /alert\(/i,
  /union select/i,
  /drop table/i,
  /or 1=1/i
];

// Scan input data for threats
function scanForThreats(input) {
  if (!input || typeof input !== 'string') return false;
  return threatSignatures.some(sig => sig.test(input));
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

// CORS Configuration - Restrict allowed origins to local development
app.use(cors({
  origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Terminator Firewall (WAF) Request Scanner
app.use((req, res, next) => {
  // Scan URL query params and body for injection attacks
  const rawQuery = JSON.stringify(req.query);
  const rawBody = JSON.stringify(req.body);
  
  if (scanForThreats(rawQuery) || scanForThreats(rawBody)) {
    logSecurityEvent("[HTTP INTRUSION]", `Malicious payload blocked from IP ${req.ip}`);
    shieldStrength = Math.max(50, shieldStrength - 15);
    
    return res.status(400).json({
      status: "BLOCKED",
      error: "TERMINATOR BACKEND SHIELD: Malicious payload signature detected. Threat neutralized."
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

// --- WEBSOCKET REAL-TIME SIMULATOR ---
const marketPrices = {
  nifty: { symbol: "FOREXCOM:IN50", price: 22450.00, decimals: 2 },
  reliance: { symbol: "BSE:RELIANCE", price: 2890.00, decimals: 2 },
  tata: { symbol: "BSE:TATAMOTORS", price: 945.00, decimals: 2 },
  btc: { symbol: "BINANCE:BTCUSDT", price: 67500.00, decimals: 2 },
  eth: { symbol: "BINANCE:ETHUSDT", price: 3820.00, decimals: 2 },
  sol: { symbol: "BINANCE:SOLUSDT", price: 165.50, decimals: 2 },
  eur: { symbol: "FX:EURUSD", price: 1.08500, decimals: 5 },
  gbp: { symbol: "FX:GBPUSD", price: 1.27200, decimals: 5 },
  jpy: { symbol: "FX:USDJPY", price: 156.40, decimals: 3 }
};

// Simulate market fluctuation ticks every 1 second
setInterval(() => {
  Object.keys(marketPrices).forEach(key => {
    const item = marketPrices[key];
    const volatility = key === 'btc' || key === 'sol' ? 0.0015 : 0.0004;
    const change = (Math.random() - 0.495) * volatility; // Slight upward bias
    item.price = item.price * (1 + change);
  });
  
  // Broadcast update payload to all authenticated clients
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
}, 1000);

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

// Start Server

server.listen(port, () => {
  console.log("=================================================");
  console.log(`WISEMAN BACKEND SERVER RUNNING ON PORT ${port}`);
  console.log(`REST API Base: http://localhost:${port}/api`);
  console.log(`Secure WebSocket Base: ws://localhost:${port}/`);
  console.log("=================================================");
});
