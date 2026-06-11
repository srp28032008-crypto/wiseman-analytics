// Wiseman Analytics Smart Risk Calculator Engine

function syncCurrentPrice() {
  const config = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
  const entryInput = document.getElementById('entryInput');
  if (entryInput) {
    entryInput.value = price.toFixed(config.decimals);
    calculateRisk();
  }
}

function calculateRisk() {
  const entryInput = document.getElementById('entryInput');
  if (!entryInput) return;
  
  // Monitor inputs for threat signatures
  if (monitorSecurityThreats(entryInput.value)) {
    const config = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
    entryInput.value = price.toFixed(config.decimals);
    return;
  }

  const entry = parseFloat(entryInput.value);
  if (isNaN(entry) || entry <= 0) return;

  const config = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
  const vols = marketVols[activeMarket];
  const riskPct = vols.riskPct;
  const riskAmt = entry * (riskPct / 100);
  
  let sl, t1, t2;
  if (isLong) {
    sl = entry - riskAmt;
    t1 = entry + (riskAmt * 2);
    t2 = entry + (riskAmt * 3);
  } else {
    sl = entry + riskAmt;
    t1 = entry - (riskAmt * 2);
    t2 = entry - (riskAmt * 3);
  }

  const dict = langDb[currentLang];
  
  const elVolatility = document.getElementById('outVolatility');
  const elStopLoss = document.getElementById('outStopLoss');
  const elRiskAmt = document.getElementById('outRiskAmt');
  const elTarget1 = document.getElementById('outTarget1');
  const elReward1 = document.getElementById('outReward1');
  const elTarget2 = document.getElementById('outTarget2');
  const elReward2 = document.getElementById('outReward2');

  if (elVolatility) elVolatility.innerText = riskPct + '%';
  if (elStopLoss) elStopLoss.innerText = sl.toFixed(config.decimals);
  if (elRiskAmt) elRiskAmt.innerText = dict.riskAmtPrefix + riskAmt.toFixed(config.decimals);
  if (elTarget1) elTarget1.innerText = t1.toFixed(config.decimals);
  if (elReward1) elReward1.innerText = dict.estRetPrefix + (riskAmt * 2).toFixed(config.decimals);
  if (elTarget2) elTarget2.innerText = t2.toFixed(config.decimals);
  if (elReward2) elReward2.innerText = dict.estRetPrefix + (riskAmt * 3).toFixed(config.decimals);
}
