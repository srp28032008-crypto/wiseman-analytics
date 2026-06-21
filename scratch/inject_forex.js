// inject_forex.js - Automatically inject 100 Forex pairs and discovery logic into frontend and backend
const fs = require('fs');
const path = require('path');

const forexDataPath = path.join(__dirname, 'forex_data.json');
const frontendPath = path.join(__dirname, '..', 'frontend', 'src', 'config', 'marketData.js');
const backendPath = path.join(__dirname, '..', 'backend', 'server.js');

if (!fs.existsSync(forexDataPath)) {
  console.error("forex_data.json not found!");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(forexDataPath, 'utf8'));
const core = data.corePairs;
const discovery = data.discoveryPairs;

// --- 1. Modify frontend/src/config/marketData.js ---
console.log("Modifying frontend/src/config/marketData.js...");
let frontendSrc = fs.readFileSync(frontendPath, 'utf8');

// Format core pairs for frontend
const frontendCorePairs = core.map(p => ({
  key: p.key,
  symbol: p.symbol,
  name: p.name,
  basePrice: p.basePrice,
  decimals: p.decimals,
  currentPrice: p.basePrice,
  change: 0,
  wsStream: null
}));

// Find forex: [ ... ] and replace it
const forexRegex = /forex:\s*\[[\s\S]*?\]\s*(?=\r?\n\s*\})/i;
const replacementStr = `forex: ${JSON.stringify(frontendCorePairs, null, 2)}`;

if (forexRegex.test(frontendSrc)) {
  frontendSrc = frontendSrc.replace(forexRegex, replacementStr);
  fs.writeFileSync(frontendPath, frontendSrc, 'utf8');
  console.log("Successfully injected core forex pairs into frontend config!");
} else {
  console.error("Could not find 'forex: [ ... ]' inside marketData.js!");
}

// --- 2. Modify backend/server.js ---
console.log("Modifying backend/server.js...");
let backendSrc = fs.readFileSync(backendPath, 'utf8');

// We want to inject:
// const rawForexPairs = [ ... ];
// And change registration, and update runAutonomousDiscovery()

// First, find and replace rawForexPairs and registration
const insertTarget = 'const marketPrices = {';
const rawForexStr = `const rawForexPairs = ${JSON.stringify(core, null, 2)};\n\n`;

if (backendSrc.includes(insertTarget) && !backendSrc.includes('const rawForexPairs')) {
  // Insert rawForexPairs above marketPrices
  backendSrc = backendSrc.replace(insertTarget, rawForexStr + insertTarget);
  console.log("Injected rawForexPairs definition into backend!");
}

// Check if registration exists, insert it below rawNSEStocks registration
const registrationTarget = 'rawNSEStocks.forEach(s => {';
const registrationEnd = '});';
const registrationRegex = /rawNSEStocks\.forEach\(s\s*=>\s*\{[\s\S]*?\}\);/;

const forexRegistrationStr = `\n\n// Populate rawForexPairs dynamically into backend registry
rawForexPairs.forEach(f => {
  yahooSymbols[f.key] = \`\${f.symbol.replace('_', '')}=X\`;
  marketPrices[f.key] = {
    symbol: \`FX:\${f.symbol}\`,
    price: f.basePrice,
    change: 0.00,
    decimals: f.decimals
  };
});`;

if (registrationRegex.test(backendSrc) && !backendSrc.includes('rawForexPairs.forEach')) {
  backendSrc = backendSrc.replace(registrationRegex, match => match + forexRegistrationStr);
  console.log("Injected rawForexPairs registration loop into backend!");
}

// Inject discovery list
const discoveryTarget = '// --- AUTONOMOUS AI DISCOVERY ENGINE ---';
const discoveryForexStr = `\nconst discoveryForex = ${JSON.stringify(discovery, null, 2)};\n`;

if (backendSrc.includes(discoveryTarget) && !backendSrc.includes('const discoveryForex')) {
  backendSrc = backendSrc.replace(discoveryTarget, discoveryTarget + discoveryForexStr);
  console.log("Injected discoveryForex list into backend!");
}

// Rewrite runAutonomousDiscovery function and its interval
const discoveryFuncRegex = /function runAutonomousDiscovery\(\)[\s\S]*?\n\}/;
const newDiscoveryFunc = `function runAutonomousDiscovery() {
  const r = Math.random();
  let market = "";
  let pool = [];
  
  if (r < 0.33) {
    market = "indianStocks";
    pool = discoveryStocks;
  } else if (r < 0.66) {
    market = "crypto";
    pool = discoveryCryptos;
  } else {
    market = "forex";
    pool = discoveryForex;
  }
  
  // Find a candidate that isn't already present
  const availableCandidates = pool.filter(c => !yahooSymbols[c.key]);
  if (availableCandidates.length === 0) return;
  
  const candidate = availableCandidates[Math.floor(Math.random() * availableCandidates.length)];
  
  console.log(\`\\x1b[35m[AI DISCOVERY] Autonomous scan discovered asset: \${candidate.name} (\${candidate.key})\\x1b[0m\`);
  
  // Register on server
  if (market === "indianStocks") {
    yahooSymbols[candidate.key] = candidate.symbol;
    marketPrices[candidate.key] = {
      symbol: \`NSE:\${candidate.symbol.replace('.NS', '')}\`,
      price: 150.00,
      change: 0.00,
      decimals: 2
    };
  } else if (market === "crypto") {
    yahooSymbols[candidate.key] = \`\${candidate.symbol.replace('USDT', '')}-USD\`;
    marketPrices[candidate.key] = {
      symbol: \`BINANCE:\${candidate.symbol}\`,
      price: candidate.basePrice,
      change: 0.00,
      decimals: candidate.decimals
    };
  } else if (market === "forex") {
    yahooSymbols[candidate.key] = \`\${candidate.symbol.replace('_', '')}=X\`;
    marketPrices[candidate.key] = {
      symbol: \`FX:\${candidate.symbol}\`,
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
      symbol: candidate.symbol,
      name: candidate.name,
      price: candidate.basePrice || 150.00,
      decimals: candidate.decimals || 2,
      wsStream: market === 'crypto' ? candidate.wsStream : null,
      sector: market === 'indianStocks' ? candidate.sector : (market === 'crypto' ? 'Crypto Assets' : 'Forex Currency Pair'),
      cap: market === 'indianStocks' ? candidate.cap : (market === 'crypto' ? 'Meme/Utility Cap' : 'Global Liquidity'),
      pE: market === 'indianStocks' ? candidate.pE : 'N/A',
      desc: market === 'indianStocks' 
        ? \`Dynamic quantitative feed connected for \${candidate.name}. High institutional block sweeps verified.\` 
        : (market === 'crypto' 
           ? \`High-velocity AI feed ingested for \${candidate.name}.\`
           : \`AI discovered breakout currency pair: \${candidate.name}. Capital flow volatility detected.\`),
      lastAnalysis: 'Initial scan completed. Long-term trend shows key support sweeps.'
    }
  });
  
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}`;

if (discoveryFuncRegex.test(backendSrc)) {
  backendSrc = backendSrc.replace(discoveryFuncRegex, newDiscoveryFunc);
  fs.writeFileSync(backendPath, backendSrc, 'utf8');
  console.log("Successfully replaced discovery logic inside backend server.js!");
} else {
  console.error("Could not find runAutonomousDiscovery function inside backend server.js!");
}
