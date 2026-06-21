// Wiseman Analytics Smart Risk Calculator Engine - Pure functions
export function calculateRiskParams({ entry, isLong, config, vols }) {
  if (isNaN(entry) || entry <= 0 || !config || !vols) return null;

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

  return {
    riskPct,
    riskAmt,
    stopLoss: sl,
    target1: t1,
    reward1: riskAmt * 2,
    target2: t2,
    reward2: riskAmt * 3
  };
}
