const WebSocket = require('ws');

const wsUrl = 'wss://stream.binance.com:9443/ws/!ticker@arr';
console.log(`Connecting to: ${wsUrl}`);

const ws = new WebSocket(wsUrl);

ws.on('open', () => {
  console.log('[+] Connected to Binance Global Tickers stream!');
});

ws.on('message', (data) => {
  const arr = JSON.parse(data.toString());
  console.log(`[+] Received array with ${arr.length} tickers.`);
  
  // Let's find some top tickers
  const targets = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'ADAUSDT', 'DOGEUSDT'];
  targets.forEach(sym => {
    const ticker = arr.find(t => t.s === sym);
    if (ticker) {
      console.log(`    Symbol: ${ticker.s} -> Price: ${parseFloat(ticker.c).toFixed(4)}, Change: ${parseFloat(ticker.P).toFixed(2)}%`);
    }
  });
  
  ws.close();
  process.exit(0);
});

ws.on('error', (err) => {
  console.error('[-] Error:', err.message);
  process.exit(1);
});

setTimeout(() => {
  console.error('[-] Timeout waiting for Binance.');
  ws.close();
  process.exit(1);
}, 8000);
