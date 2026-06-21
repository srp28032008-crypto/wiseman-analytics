// inject_global.js - Inject Global Market arrays and discovery logic into backend server.js
const fs = require('fs');
const path = require('path');

const backendPath = path.join(__dirname, '..', 'backend', 'server.js');

if (!fs.existsSync(backendPath)) {
  console.error("server.js not found!");
  process.exit(1);
}

let backendSrc = fs.readFileSync(backendPath, 'utf8');

const rawGlobalPairs = [
  { key: "gold", symbol: "GC=F", name: "Gold Spot", decimals: 2, basePrice: 2330.50 },
  { key: "silver", symbol: "SI=F", name: "Silver Spot", decimals: 3, basePrice: 29.80 },
  { key: "crude", symbol: "CL=F", name: "Crude Oil Brent", decimals: 2, basePrice: 80.50 },
  { key: "natgas", symbol: "NG=F", name: "Natural Gas", decimals: 3, basePrice: 2.85 },
  { key: "sp500", symbol: "^GSPC", name: "S&P 500 Index", decimals: 2, basePrice: 5450.00 },
  { key: "nasdaq", symbol: "^IXIC", name: "NASDAQ 100 Index", decimals: 2, basePrice: 19650.00 },
  { key: "dow", symbol: "^DJI", name: "Dow Jones Index", decimals: 2, basePrice: 39100.00 }
];

const discoveryGlobal = [
  { key: "brent", symbol: "BZ=F", name: "Brent Crude", decimals: 2, basePrice: 85.20 },
  { key: "copper", symbol: "HG=F", name: "Copper Spot", decimals: 4, basePrice: 4.40 },
  { key: "us10y", symbol: "^TNX", name: "US 10-Year Bond Yield", decimals: 3, basePrice: 4.25 },
  { key: "ftse", symbol: "^FTSE", name: "FTSE 100 Index", decimals: 2, basePrice: 8250.00 },
  { key: "dax", symbol: "^GDAXI", name: "DAX 40 Index", decimals: 2, basePrice: 18150.00 },
  { key: "nikkei", symbol: "^N225", name: "Nikkei 225 Index", decimals: 2, basePrice: 38600.00 }
];

// 1. Inject rawGlobalPairs above rawForexPairs
const rawForexTarget = 'const rawForexPairs =';
if (backendSrc.includes(rawForexTarget) && !backendSrc.includes('const rawGlobalPairs')) {
  const rawGlobalStr = `const rawGlobalPairs = ${JSON.stringify(rawGlobalPairs, null, 2)};\n\n`;
  backendSrc = backendSrc.replace(rawForexTarget, rawGlobalStr + rawForexTarget);
  console.log("Injected rawGlobalPairs definition above rawForexPairs!");
}

// 2. Inject rawGlobalPairs registration loop below rawForexPairs registration loop
const forexRegTarget = 'rawForexPairs.forEach(f => {';
const forexRegEnd = '});';
const forexRegRegex = /rawForexPairs\.forEach\(f\s*=>\s*\{[\s\S]*?\}\);/;

const globalRegStr = `\n\n// Populate rawGlobalPairs dynamically into backend registry
rawGlobalPairs.forEach(g => {
  yahooSymbols[g.key] = g.symbol;
  let dispSym = g.symbol.startsWith('^') ? \`INDEX:\${g.key.toUpperCase()}\` : \`CMD:\${g.key.toUpperCase()}\`;
  marketPrices[g.key] = {
    symbol: dispSym,
    price: g.basePrice,
    change: 0.00,
    decimals: g.decimals
  };
});`;

if (forexRegRegex.test(backendSrc) && !backendSrc.includes('rawGlobalPairs.forEach')) {
  backendSrc = backendSrc.replace(forexRegRegex, match => match + globalRegStr);
  console.log("Injected rawGlobalPairs registration loop into backend!");
}

// 3. Inject discoveryGlobal above discoveryForex
const discoveryForexTarget = 'const discoveryForex =';
if (backendSrc.includes(discoveryForexTarget) && !backendSrc.includes('const discoveryGlobal')) {
  const discoveryGlobalStr = `const discoveryGlobal = ${JSON.stringify(discoveryGlobal, null, 2)};\n\n`;
  backendSrc = backendSrc.replace(discoveryForexTarget, discoveryGlobalStr + discoveryForexTarget);
  console.log("Injected discoveryGlobal definition above discoveryForex!");
}

// 4. Replace runAutonomousDiscovery function and its selection logic
const discoveryFuncRegex = /function runAutonomousDiscovery\(\)[\s\S]*?\n\}/;
const newDiscoveryFunc = `function runAutonomousDiscovery() {
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
  } else if (market === "globalMarket") {
    yahooSymbols[candidate.key] = candidate.symbol;
    let dispSym = candidate.symbol.startsWith('^') ? \`INDEX:\${candidate.key.toUpperCase()}\` : \`CMD:\${candidate.key.toUpperCase()}\`;
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
        ? \`Dynamic quantitative feed connected for \${candidate.name}. High institutional block sweeps verified.\` 
        : (market === 'crypto' 
           ? \`High-velocity AI feed ingested for \${candidate.name}.\`
           : (market === 'forex'
              ? \`AI discovered breakout currency pair: \${candidate.name}. Capital flow volatility detected.\`
              : \`AI discovered breakout global asset: \${candidate.name}. Volatility check passed.\`)),
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
  console.log("Successfully replaced discovery logic and arrays inside backend server.js!");
} else {
  console.error("Could not find runAutonomousDiscovery function inside backend server.js!");
}
