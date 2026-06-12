async function testBatch() {
  try {
    const symbols = '^NSEI,RELIANCE.NS,TATAMOTORS.NS,TATATECH.NS,HDFCBANK.NS,SBIN.NS,TCS.NS,ADANIENT.NS,COALINDIA.NS,EURUSD=X,GBPUSD=X,USDJPY=X';
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const quotes = data.quoteResponse.result;
    
    console.log(`Fetched ${quotes.length} quotes:`);
    quotes.forEach(q => {
      console.log(`- ${q.symbol}: Price = ${q.regularMarketPrice}, Change = ${q.regularMarketChangePercent?.toFixed(2)}%`);
    });
  } catch (err) {
    console.error("Batch fetch failed:", err);
  }
}
testBatch();
