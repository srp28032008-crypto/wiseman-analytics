// ================================================================
// WISEMAN ANALYTICS - Core Signal Engine v2.0
// Institutional-Grade Trap & Signal Pre-Detection System
// Algorithms: Swing, FVG, RSI Divergence, MACD Momentum,
//             Liquidity Zones, Multi-Factor Confluence
// ================================================================
import { calculateEMA, calculateSMA } from './indicators';

// 1. SWING HIGH/LOW DETECTION
export function detectSwingLevels(prices, lookback = 5) {
  const highs = [], lows = [];
  if (!prices || prices.length < lookback * 2 + 1) return { highs, lows };
  for (let i = lookback; i < prices.length - lookback; i++) {
    const slice = prices.slice(i - lookback, i + lookback + 1);
    const peak = Math.max(...slice);
    const trough = Math.min(...slice);
    if (prices[i] === peak && slice.filter(p => p === peak).length === 1)
      highs.push({ index: i, price: prices[i] });
    if (prices[i] === trough && slice.filter(p => p === trough).length === 1)
      lows.push({ index: i, price: prices[i] });
  }
  return { highs, lows };
}

// 2. FAIR VALUE GAP (FVG / IMBALANCE) DETECTION
// Bearish FVG: 3-bar gap down - top of bar i-2 > bottom of bar i
// Bullish FVG: 3-bar gap up - bottom of bar i-2 < top of bar i
export function detectFVG(prices) {
  if (!prices || prices.length < 5) return { bullishFVG: null, bearishFVG: null };
  const n = prices.length;
  let bullishFVG = null, bearishFVG = null;
  const scanStart = Math.max(2, n - 30);
  for (let i = n - 1; i >= scanStart; i--) {
    const c0 = prices[i - 2], c1 = prices[i - 1], c2 = prices[i];
    const r0 = c0 * 0.003, r2 = c2 * 0.003;
    const c0High = c0 + r0, c0Low = c0 - r0;
    const c2High = c2 + r2, c2Low = c2 - r2;
    if (!bullishFVG && c0High < c2Low && c2 > c1 && c1 > c0) {
      bullishFVG = {
        topPrice: c2Low, bottomPrice: c0High,
        midPrice: (c2Low + c0High) / 2,
        barIndex: i,
        strength: parseFloat(((c2Low - c0High) / c0 * 100).toFixed(3))
      };
    }
    if (!bearishFVG && c0Low > c2High && c2 < c1 && c1 < c0) {
      bearishFVG = {
        topPrice: c0Low, bottomPrice: c2High,
        midPrice: (c0Low + c2High) / 2,
        barIndex: i,
        strength: parseFloat(((c0Low - c2High) / c0 * 100).toFixed(3))
      };
    }
    if (bullishFVG && bearishFVG) break;
  }
  return { bullishFVG, bearishFVG };
}

// 3. RSI DIVERGENCE DETECTION
// Bullish: Price lower low + RSI higher low = REVERSAL SIGNAL
// Bearish: Price higher high + RSI lower high = TOP SIGNAL
export function detectRSIDivergence(prices, rsiHistory) {
  if (!prices || !rsiHistory || prices.length < 20 || rsiHistory.length < 20)
    return { bullish: false, bearish: false, strength: 0 };
  const lookback = Math.min(Math.min(prices.length, rsiHistory.length), 40);
  const rP = prices.slice(-lookback), rR = rsiHistory.slice(-lookback);
  let pL1 = -1, pL2 = -1, pH1 = -1, pH2 = -1;
  for (let i = lookback - 3; i >= 2; i--) {
    if (rP[i] < rP[i - 1] && rP[i] < rP[i + 1]) {
      if (pL2 === -1) pL2 = i; else if (pL1 === -1) { pL1 = i; break; }
    }
  }
  for (let i = lookback - 3; i >= 2; i--) {
    if (rP[i] > rP[i - 1] && rP[i] > rP[i + 1]) {
      if (pH2 === -1) pH2 = i; else if (pH1 === -1) { pH1 = i; break; }
    }
  }
  let bullish = false, bearish = false, strength = 0;
  if (pL1 !== -1 && pL2 !== -1 && pL1 < pL2 && rP[pL2] < rP[pL1] && rR[pL2] > rR[pL1]) {
    bullish = true; strength = Math.abs(rR[pL2] - rR[pL1]);
  }
  if (pH1 !== -1 && pH2 !== -1 && pH1 < pH2 && rP[pH2] > rP[pH1] && rR[pH2] < rR[pH1]) {
    bearish = true; strength = Math.abs(rR[pH2] - rR[pH1]);
  }
  return { bullish, bearish, strength: parseFloat(strength.toFixed(2)) };
}

// 4. MACD MOMENTUM (Histogram slope + crossover detection)
export function detectMACDMomentum(macd, signalLine, macdHistory = []) {
  const hist = macd - signalLine;
  let slope = 0;
  if (macdHistory.length >= 3) {
    const r = macdHistory.slice(-3);
    slope = (r[2] - r[0]) / 2;
  }
  const prevHist = macdHistory.length > 0 ? (macdHistory[macdHistory.length - 1] - signalLine) : hist;
  return {
    histogram: parseFloat(hist.toFixed(6)),
    slope: parseFloat(slope.toFixed(6)),
    acceleratingUp: slope > 0 && hist > 0,
    acceleratingDn: slope < 0 && hist < 0,
    crossingUp: hist > 0 && prevHist <= 0,
    crossingDn: hist < 0 && prevHist >= 0,
  };
}

// 5. LIQUIDITY ZONE DETECTION
// Buy-side liquidity: above recent highs (retail shorts stops)
// Sell-side liquidity: below recent lows (retail longs stops)
export function detectLiquidityZones(prices, atr) {
  if (!prices || prices.length < 20) return { buySide: null, sellSide: null, high52: null, low52: null };
  const recent = prices.slice(-50);
  const h = Math.max(...recent), l = Math.min(...recent);
  const safeATR = atr > 0 ? atr : prices[prices.length - 1] * 0.015;
  return {
    buySide: parseFloat((h + safeATR * 0.5).toFixed(4)),
    sellSide: parseFloat((l - safeATR * 0.5).toFixed(4)),
    high52: parseFloat(h.toFixed(4)),
    low52: parseFloat(l.toFixed(4))
  };
}

// 6. TREND STRENGTH via EMA alignment
export function detectTrendStrength(prices) {
  if (!prices || prices.length < 55) return { score: 0, trend: 'SIDEWAYS', ema20: null, ema50: null };
  const e20a = calculateEMA(prices, 20), e50a = calculateEMA(prices, 50);
  const ema20 = e20a[e20a.length - 1], ema50 = e50a[e50a.length - 1];
  const cp = prices[prices.length - 1];
  if (!ema20 || !ema50) return { score: 0, trend: 'SIDEWAYS', ema20, ema50 };
  let s = 0;
  if (cp > ema20) s++; if (cp > ema50) s++; if (ema20 > ema50) s++;
  if (cp < ema20) s--; if (cp < ema50) s--; if (ema20 < ema50) s--;
  return {
    score: s,
    trend: s >= 2 ? 'UPTREND' : s <= -2 ? 'DOWNTREND' : 'SIDEWAYS',
    ema20: parseFloat(ema20.toFixed(6)),
    ema50: parseFloat(ema50.toFixed(6))
  };
}

// 7. MASTER CONFLUENCE SIGNAL ENGINE
// This is the brain - combines all signals into one actionable verdict
export function computeSignal({ prices, rsi, macd, signalLine, stochK, stochD, atr, volume, rsiHistory, macdHistory, market, decimals }) {
  rsiHistory = rsiHistory || [];
  macdHistory = macdHistory || [];
  market = market || 'crypto';
  decimals = decimals || 2;

  if (!prices || prices.length < 30) return { direction: 'NEUTRAL', confidence: 0, score: 0, reasons: [], trap: null };
  const cp = prices[prices.length - 1];
  let score = 0;
  const reasons = [];

  // RSI Score (-2 to +2)
  if (rsi < 25)      { score += 2; reasons.push({ text: 'RSI ' + rsi.toFixed(1) + ' — Extreme Oversold zone STRONG BUY', type: 'bull' }); }
  else if (rsi < 35) { score += 1; reasons.push({ text: 'RSI ' + rsi.toFixed(1) + ' — Oversold Buy Zone active', type: 'bull' }); }
  else if (rsi > 75) { score -= 2; reasons.push({ text: 'RSI ' + rsi.toFixed(1) + ' — Extreme Overbought STRONG SELL', type: 'bear' }); }
  else if (rsi > 65) { score -= 1; reasons.push({ text: 'RSI ' + rsi.toFixed(1) + ' — Overbought Sell Zone active', type: 'bear' }); }
  else               { reasons.push({ text: 'RSI ' + rsi.toFixed(1) + ' — Neutral (no directional edge)', type: 'neutral' }); }

  // MACD Score (-2 to +2)
  const mm = detectMACDMomentum(macd, signalLine, macdHistory);
  if (mm.crossingUp)           { score += 2; reasons.push({ text: 'MACD Bullish Crossover — Momentum BUY confirmed', type: 'bull' }); }
  else if (mm.crossingDn)      { score -= 2; reasons.push({ text: 'MACD Bearish Crossover — Momentum SELL confirmed', type: 'bear' }); }
  else if (mm.acceleratingUp)  { score += 1; reasons.push({ text: 'MACD Histogram expanding UP — Bulls in control', type: 'bull' }); }
  else if (mm.acceleratingDn)  { score -= 1; reasons.push({ text: 'MACD Histogram expanding DOWN — Bears in control', type: 'bear' }); }
  else                         { reasons.push({ text: 'MACD flat — no momentum confirmation', type: 'neutral' }); }

  // Stochastic Score (-1 to +1)
  if      (stochK < 20 && stochK > stochD) { score += 1; reasons.push({ text: 'Stoch ' + stochK.toFixed(0) + ' Oversold + crossing UP — Buy trigger', type: 'bull' }); }
  else if (stochK > 80 && stochK < stochD) { score -= 1; reasons.push({ text: 'Stoch ' + stochK.toFixed(0) + ' Overbought + crossing DOWN — Sell trigger', type: 'bear' }); }

  // Trend Score (-3 to +3)
  const td = detectTrendStrength(prices);
  score += td.score;
  if (td.trend === 'UPTREND')   reasons.push({ text: 'Trend: UPTREND — EMA20 > EMA50 fully aligned bullish', type: 'bull' });
  if (td.trend === 'DOWNTREND') reasons.push({ text: 'Trend: DOWNTREND — EMA20 < EMA50 fully aligned bearish', type: 'bear' });
  if (td.trend === 'SIDEWAYS')  reasons.push({ text: 'Trend: SIDEWAYS — no clear directional bias', type: 'neutral' });

  // RSI Divergence Score (-2 to +2)
  const div = detectRSIDivergence(prices, rsiHistory);
  if (div.bullish) { score += 2; reasons.push({ text: 'BULLISH RSI DIVERGENCE strength ' + div.strength + ' — REVERSAL IMMINENT', type: 'bull' }); }
  if (div.bearish) { score -= 2; reasons.push({ text: 'BEARISH RSI DIVERGENCE strength ' + div.strength + ' — TOP FORMING', type: 'bear' }); }

  // FVG Score (-1 to +1)
  const fvg = detectFVG(prices);
  let activeFVG = null;
  if (fvg.bullishFVG && cp > fvg.bullishFVG.midPrice * 0.998) {
    score += 1;
    const bfvg = fvg.bullishFVG;
    reasons.push({ text: 'Bullish FVG imbalance ' + bfvg.bottomPrice.toFixed(decimals) + '-' + bfvg.topPrice.toFixed(decimals) + ' — price in buy zone', type: 'bull' });
    activeFVG = { type: 'BULL', ...bfvg };
  }
  if (fvg.bearishFVG && cp < fvg.bearishFVG.midPrice * 1.002) {
    score -= 1;
    const bfvg = fvg.bearishFVG;
    reasons.push({ text: 'Bearish FVG imbalance ' + bfvg.bottomPrice.toFixed(decimals) + '-' + bfvg.topPrice.toFixed(decimals) + ' — price in sell zone', type: 'bear' });
    activeFVG = { type: 'BEAR', ...bfvg };
  }

  // ATR Volatility Filter
  const safeATR = atr > 0 ? atr : cp * 0.015;
  const atrPct = (safeATR / cp) * 100;
  const volMult = atrPct < 0.4 ? 0.65 : 1.0;
  if (atrPct < 0.4) reasons.push({ text: 'Low Volatility ATR ' + atrPct.toFixed(2) + '% — signal strength reduced 35%', type: 'neutral' });

  // Liquidity Zone / Stop Hunt / Trap Detection
  const liq = detectLiquidityZones(prices, safeATR);
  let trap = null;
  if (liq.high52 && cp > liq.high52 * 0.999 && score < 0) {
    trap = { type: 'BULL_TRAP', desc: 'Buy-side liquidity swept above ' + liq.high52.toFixed(decimals) + ' — Stop hunt complete', color: 'var(--red-neon)' };
    score -= 1;
    reasons.push({ text: 'BULL TRAP: Stop hunt above ' + liq.high52.toFixed(decimals) + ' — Retail longs being liquidated NOW', type: 'bear' });
  }
  if (liq.low52 && cp < liq.low52 * 1.001 && score > 0) {
    trap = { type: 'BEAR_TRAP', desc: 'Sell-side liquidity swept below ' + liq.low52.toFixed(decimals) + ' — Stop hunt complete', color: 'var(--green-neon)' };
    score += 1;
    reasons.push({ text: 'BEAR TRAP: Stop hunt below ' + liq.low52.toFixed(decimals) + ' — Retail shorts being squeezed NOW', type: 'bull' });
  }

  // Final confidence
  const rawConf = Math.min(98.5, 50 + Math.abs(score) * 7.5) * volMult;
  const confidence = parseFloat(rawConf.toFixed(1));

  let direction = 'NEUTRAL';
  if (score >= 5)       direction = 'STRONG_BUY';
  else if (score >= 3)  direction = 'BUY';
  else if (score >= 1)  direction = 'MILD_BUY';
  else if (score <= -5) direction = 'STRONG_SELL';
  else if (score <= -3) direction = 'SELL';
  else if (score <= -1) direction = 'MILD_SELL';

  const isBull  = score > 0;
  const entry   = cp;
  const stopLoss = isBull ? parseFloat((entry - safeATR * 1.5).toFixed(decimals)) : parseFloat((entry + safeATR * 1.5).toFixed(decimals));
  const target1  = isBull ? parseFloat((entry + safeATR * 2.0).toFixed(decimals)) : parseFloat((entry - safeATR * 2.0).toFixed(decimals));
  const target2  = isBull ? parseFloat((entry + safeATR * 3.5).toFixed(decimals)) : parseFloat((entry - safeATR * 3.5).toFixed(decimals));
  const rrRatio  = parseFloat((Math.abs(target1 - entry) / Math.max(0.0001, Math.abs(entry - stopLoss))).toFixed(2));

  return {
    direction, score, confidence, reasons, trap,
    fvg: activeFVG, liqZones: liq, trendData: td, divergence: div,
    entryPrice: entry, stopLoss, target1, target2, rrRatio,
    atrPct: parseFloat(atrPct.toFixed(3)), safeATR: parseFloat(safeATR.toFixed(decimals))
  };
}
