async function testParallel() {
  const symbols = ['^NSEI', 'RELIANCE.NS', 'TATAMOTORS.NS', 'EURUSD=X'];
  const promises = symbols.map(async (sym) => {
    try {
      const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${sym}`);
      if (!res.ok) return { symbol: sym, error: res.status };
      const data = await res.json();
      const meta = data.chart.result[0].meta;
      const price = meta.regularMarketPrice;
      const prevClose = meta.previousClose;
      const change = ((price - prevClose) / prevClose) * 100;
      return { symbol: sym, price, change };
    } catch (err) {
      return { symbol: sym, error: err.message };
    }
  });
  const results = await Promise.all(promises);
  console.log("Results:", results);
}
testParallel();
