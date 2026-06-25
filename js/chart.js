// Chart state variables
let visibleCount = 60;
let panOffset = 0;
let drawings = { trendlines: [], fibs: [], supports: [] };
let isDragging = false;
let dragStartX = 0;
let dragStartPanOffset = 0;
let hoverPoint = null;
let startPoint = null;

// Replay Mode States
let isReplayMode = false;
let replayIndex = 50;
let replayTimer = null;
let replayIsPlaying = false;

function getCoordsFromValue(globalIdx, priceVal) {
  const width = canvas.width / window.devicePixelRatio;
  const height = canvas.height / window.devicePixelRatio;
  
  const activeHistory = isReplayMode ? history.slice(0, replayIndex) : history;
  const startIndex = Math.max(0, activeHistory.length - visibleCount - panOffset);
  const endIndex = Math.min(activeHistory.length, activeHistory.length - panOffset);
  const visibleHistory = activeHistory.slice(startIndex, endIndex);
  
  const minPrice = Math.min(...visibleHistory);
  const maxPrice = Math.max(...visibleHistory);
  const priceRange = (maxPrice - minPrice) || 1;
  const pad = priceRange * 0.15;
  
  const calcY = (val) => height - (((val - (minPrice - pad)) / (priceRange + pad * 2)) * height);
  const stepX = width / (visibleHistory.length - 1);
  
  const sliceIdx = globalIdx - startIndex;
  const x = stepX * sliceIdx;
  const y = calcY(priceVal);
  
  return { x, y };
}

function getValueFromCoords(x, y) {
  const width = canvas.width / window.devicePixelRatio;
  const height = canvas.height / window.devicePixelRatio;
  
  const activeHistory = isReplayMode ? history.slice(0, replayIndex) : history;
  const startIndex = Math.max(0, activeHistory.length - visibleCount - panOffset);
  const endIndex = Math.min(activeHistory.length, activeHistory.length - panOffset);
  const visibleHistory = activeHistory.slice(startIndex, endIndex);
  
  const minPrice = Math.min(...visibleHistory);
  const maxPrice = Math.max(...visibleHistory);
  const priceRange = (maxPrice - minPrice) || 1;
  const pad = priceRange * 0.15;
  
  const stepX = width / (visibleHistory.length - 1);
  
  const sliceIdx = x / stepX;
  const globalIdx = Math.round(sliceIdx + startIndex);
  const priceVal = ((height - y) / height) * (priceRange + pad * 2) + (minPrice - pad);
  
  return { globalIdx, priceVal };
}

function getActiveDrawingStyles() {
  const colorEl = document.getElementById('drawingColor');
  const widthEl = document.getElementById('drawingWidth');
  return {
    color: colorEl ? colorEl.value : 'rgba(0, 240, 255, 0.7)',
    width: widthEl ? parseInt(widthEl.value) : 1.5
  };
}

function onChartDblClick(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const val = getValueFromCoords(x, y);
  const entryInput = document.getElementById('entryInput');
  if (entryInput) {
    const config = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
    const priceStr = val.priceVal.toFixed(config.decimals);
    entryInput.value = priceStr;
    if (typeof calculateRisk === 'function') {
      calculateRisk();
    }
    
    const chat = document.getElementById('chatHistory');
    if (chat) {
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble bubble-ai';
      bubble.style.borderColor = 'var(--cyan)';
      bubble.innerText = currentLang === 'mr' ? 
        `[रिस्क कॅल्क्युलेटर] चार्टवर डबल-क्लिक करून एंट्री प्राईस ${priceStr} वर सेट केली आहे, सर.` : 
        `[RISK ENGINE] Synced entry price to ${priceStr} via chart double-click, Sir.`;
      chat.appendChild(bubble);
      chat.scrollTop = chat.scrollHeight;
    }
  }
}

function onChartMouseDown(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (activeDrawingTool) {
    const val = getValueFromCoords(x, y);
    const styles = getActiveDrawingStyles();
    
    if (activeDrawingTool === 'support') {
      drawings.supports.push({ priceVal: val.priceVal, color: styles.color, width: styles.width });
      activeDrawingTool = null;
      const el = document.getElementById('toolSupport');
      if (el) el.classList.remove('active');
      
      // Sync Support directly as a Stop Loss inside Smart Risk Calculator
      const entryInput = document.getElementById('entryInput');
      if (entryInput) {
        const entry = parseFloat(entryInput.value);
        if (!isNaN(entry) && entry > 0) {
          const config = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
          const slPrice = val.priceVal;
          const riskDiff = Math.abs(entry - slPrice);
          const riskPct = ((riskDiff / entry) * 100);

          const elStopLoss = document.getElementById('outStopLoss');
          const elRiskAmt = document.getElementById('outRiskAmt');
          const elTarget1 = document.getElementById('outTarget1');
          const elReward1 = document.getElementById('outReward1');
          const elTarget2 = document.getElementById('outTarget2');
          const elReward2 = document.getElementById('outReward2');
          const dict = langDb[currentLang];

          if (elStopLoss) elStopLoss.innerText = slPrice.toFixed(config.decimals);
          if (elRiskAmt) elRiskAmt.innerText = dict.riskAmtPrefix + riskDiff.toFixed(config.decimals) + ` (${riskPct.toFixed(1)}%)`;

          let t1, t2;
          if (isLong) {
            t1 = entry + (riskDiff * 2);
            t2 = entry + (riskDiff * 3);
          } else {
            t1 = entry - (riskDiff * 2);
            t2 = entry - (riskDiff * 3);
          }

          if (elTarget1) elTarget1.innerText = t1.toFixed(config.decimals);
          if (elReward1) elReward1.innerText = dict.estRetPrefix + (riskDiff * 2).toFixed(config.decimals);
          if (elTarget2) elTarget2.innerText = t2.toFixed(config.decimals);
          if (elReward2) elReward2.innerText = dict.estRetPrefix + (riskDiff * 3).toFixed(config.decimals);

          const chat = document.getElementById('chatHistory');
          if (chat) {
            const bubble = document.createElement('div');
            bubble.className = 'chat-bubble bubble-ai';
            bubble.style.borderColor = 'var(--red-neon)';
            bubble.innerText = currentLang === 'mr' ? 
              `[रिस्क कॅल्क्युलेटर] चार्टवर सपोर्ट लाईन ओढून स्टॉप लॉस ${slPrice.toFixed(config.decimals)} (जोखीम: ${riskPct.toFixed(1)}%) वर सेट केला आहे.` : 
              `[RISK ENGINE] Synced Stop Loss to ${slPrice.toFixed(config.decimals)} (${riskPct.toFixed(1)}% risk) based on support line drawing, Sir.`;
            chat.appendChild(bubble);
            chat.scrollTop = chat.scrollHeight;
          }
        }
      }
      
      drawChart();
    } else if (!startPoint) {
      startPoint = val;
    } else {
      if (activeDrawingTool === 'trendline') {
        drawings.trendlines.push({
          gIdx1: startPoint.globalIdx,
          price1: startPoint.priceVal,
          gIdx2: val.globalIdx,
          price2: val.priceVal,
          color: styles.color,
          width: styles.width
        });
        const el = document.getElementById('toolTrendline');
        if (el) el.classList.remove('active');
      } else if (activeDrawingTool === 'fib') {
        drawings.fibs.push({
          priceMin: startPoint.priceVal,
          priceMax: val.priceVal,
          color: styles.color,
          width: styles.width
        });
        const el = document.getElementById('toolFib');
        if (el) el.classList.remove('active');
      }
      activeDrawingTool = null;
      startPoint = null;
      drawChart();
    }
  } else {
    // Click-to-delete check
    let deletedAny = false;
    const clickTolerance = 6;
    const height = canvas.height / window.devicePixelRatio;
    
    const activeHistory = isReplayMode ? history.slice(0, replayIndex) : history;
    const startIndex = Math.max(0, activeHistory.length - visibleCount - panOffset);
    const endIndex = Math.min(activeHistory.length, activeHistory.length - panOffset);
    const visibleHistory = activeHistory.slice(startIndex, endIndex);
    
    if (visibleHistory.length >= 2) {
      const minPrice = Math.min(...visibleHistory);
      const maxPrice = Math.max(...visibleHistory);
      const priceRange = (maxPrice - minPrice) || 1;
      const pad = priceRange * 0.15;
      const calcY = (val) => height - (((val - (minPrice - pad)) / (priceRange + pad * 2)) * height);

      // Check supports
      for (let i = 0; i < drawings.supports.length; i++) {
        const sY = calcY(drawings.supports[i].priceVal);
        if (Math.abs(y - sY) < clickTolerance) {
          drawings.supports.splice(i, 1);
          deletedAny = true;
          break;
        }
      }

      if (!deletedAny) {
        // Check trendlines
        for (let i = 0; i < drawings.trendlines.length; i++) {
          const tl = drawings.trendlines[i];
          const p1 = getCoordsFromValue(tl.gIdx1, tl.price1);
          const p2 = getCoordsFromValue(tl.gIdx2, tl.price2);
          
          const dist = getDistanceToSegment(x, y, p1.x, p1.y, p2.x, p2.y);
          if (dist < clickTolerance) {
            drawings.trendlines.splice(i, 1);
            deletedAny = true;
            break;
          }
        }
      }
      
      if (!deletedAny) {
        // Check fibs
        for (let i = 0; i < drawings.fibs.length; i++) {
          const fib = drawings.fibs[i];
          const yMin = calcY(fib.priceMin);
          const yMax = calcY(fib.priceMax);
          const dy = yMax - yMin;
          const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
          
          for (let l of levels) {
            const yL = yMin + dy * l;
            if (Math.abs(y - yL) < clickTolerance) {
              drawings.fibs.splice(i, 1);
              deletedAny = true;
              break;
            }
          }
          if (deletedAny) break;
        }
      }
    }

    if (deletedAny) {
      drawChart();
    } else {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartPanOffset = panOffset;
    }
  }
}

function onChartMouseMove(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  hoverPoint = { x, y };

  if (isDragging) {
    const deltaX = e.clientX - dragStartX;
    const width = canvas.width / window.devicePixelRatio;
    const stepX = width / (visibleCount - 1);
    const barsDelta = Math.round(deltaX / stepX);
    panOffset = Math.max(0, Math.min(history.length - visibleCount, dragStartPanOffset + barsDelta));
    
    const btnGoLive = document.getElementById('btnGoLive');
    if (btnGoLive) {
      btnGoLive.style.display = panOffset > 0 ? 'block' : 'none';
    }
  }
  drawChart();
}

function onChartMouseUp(e) {
  isDragging = false;
}

function onChartMouseLeave(e) {
  isDragging = false;
  hoverPoint = null;
  drawChart();
}

function onChartWheel(e) {
  e.preventDefault();
  const zoomFactor = e.deltaY > 0 ? 3 : -3;
  const prevVisibleCount = visibleCount;
  visibleCount = Math.max(10, Math.min(150, visibleCount + zoomFactor));
  
  if (panOffset > 0) {
    panOffset = Math.max(0, Math.min(history.length - visibleCount, panOffset + (prevVisibleCount - visibleCount)));
  }
  drawChart();
}

function snapToLive() {
  panOffset = 0;
  const btnGoLive = document.getElementById('btnGoLive');
  if (btnGoLive) btnGoLive.style.display = 'none';
  drawChart();
}

function drawChart() {
  if (!canvas || canvas.width === 0 || canvas.height === 0) return;
  const width = canvas.width / window.devicePixelRatio;
  const height = canvas.height / window.devicePixelRatio;
  ctx.clearRect(0, 0, width, height);

  // Draw Grid Lines
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 1;
  const gridCount = 5;
  for (let i = 1; i < gridCount; i++) {
    const y = (height / gridCount) * i;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }
  for (let i = 1; i < 7; i++) {
    const x = (width / 7) * i;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }

  const activeHistory = isReplayMode ? history.slice(0, replayIndex) : history;
  if (activeHistory.length < 2) return;

  // Slice history to the current visible window
  const N = activeHistory.length;
  const startIndex = Math.max(0, N - visibleCount - panOffset);
  const endIndex = Math.min(N, N - panOffset);
  const visibleHistory = activeHistory.slice(startIndex, endIndex);

  if (visibleHistory.length < 2) return;

  const minPrice = Math.min(...visibleHistory);
  const maxPrice = Math.max(...visibleHistory);
  const priceRange = (maxPrice - minPrice) || 1;
  const pad = priceRange * 0.15;
  
  const calcY = (val) => height - (((val - (minPrice - pad)) / (priceRange + pad * 2)) * height);
  const stepX = width / (visibleHistory.length - 1);
  
  // Draw Chart based on type
  if (chartType === 'line') {
    ctx.beginPath();
    for (let i = 0; i < visibleHistory.length; i++) {
      const x = stepX * i;
      const y = calcY(visibleHistory[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (chartType === 'area') {
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let i = 0; i < visibleHistory.length; i++) {
      ctx.lineTo(stepX * i, calcY(visibleHistory[i]));
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    const areaGrd = ctx.createLinearGradient(0, 0, 0, height);
    areaGrd.addColorStop(0, 'rgba(0, 240, 255, 0.2)');
    areaGrd.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = areaGrd;
    ctx.fill();

    ctx.beginPath();
    for (let i = 0; i < visibleHistory.length; i++) {
      if (i === 0) ctx.moveTo(0, calcY(visibleHistory[0]));
      else ctx.lineTo(stepX * i, calcY(visibleHistory[i]));
    }
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (chartType === 'candle') {
    for (let i = 1; i < visibleHistory.length; i++) {
      const x = stepX * i;
      const prev = visibleHistory[i-1];
      const curr = visibleHistory[i];
      const isGreen = curr >= prev;
      
      // Stable pseudo-random high/low wick values
      const globalIdx = startIndex + i;
      const seed = Math.sin(globalIdx) * 10000;
      const randomFactor = seed - Math.floor(seed);
      const wickSpread = (priceRange * 0.03) * randomFactor;
      const high = Math.max(prev, curr) + wickSpread;
      const low = Math.min(prev, curr) - wickSpread;
      
      ctx.strokeStyle = isGreen ? '#00e676' : '#ff1744';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, calcY(high));
      ctx.lineTo(x, calcY(low));
      ctx.stroke();
      
      ctx.fillStyle = isGreen ? '#00e676' : '#ff1744';
      ctx.fillRect(x - 3, calcY(Math.max(prev, curr)), 6, Math.max(1, Math.abs(calcY(prev) - calcY(curr))));
    }
  } else if (chartType === 'bar') {
    for (let i = 1; i < visibleHistory.length; i++) {
      const x = stepX * i;
      const prev = visibleHistory[i-1];
      const curr = visibleHistory[i];
      const isGreen = curr >= prev;
      
      // Stable pseudo-random high/low values
      const globalIdx = startIndex + i;
      const seed = Math.sin(globalIdx) * 10000;
      const randomFactor = seed - Math.floor(seed);
      const wickSpread = (priceRange * 0.025) * randomFactor;
      const high = Math.max(prev, curr) + wickSpread;
      const low = Math.min(prev, curr) - wickSpread;
      
      ctx.strokeStyle = isGreen ? '#00e676' : '#ff1744';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, calcY(high));
      ctx.lineTo(x, calcY(low));
      ctx.stroke();
      
      ctx.beginPath(); ctx.moveTo(x - 3, calcY(prev)); ctx.lineTo(x, calcY(prev)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, calcY(curr)); ctx.lineTo(x + 3, calcY(curr)); ctx.stroke();
    }
  }

  ctx.shadowBlur = 0;
  
  // Draw Saved Support & Resistance lines
  drawings.supports.forEach(sup => {
    const y = calcY(sup.priceVal);
    ctx.strokeStyle = sup.color || 'rgba(0, 240, 255, 0.7)';
    ctx.lineWidth = sup.width || 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    ctx.setLineDash([]);
  });

  // Draw Saved Trendlines
  drawings.trendlines.forEach(tl => {
    const p1 = getCoordsFromValue(tl.gIdx1, tl.price1);
    const p2 = getCoordsFromValue(tl.gIdx2, tl.price2);
    ctx.strokeStyle = tl.color || 'rgba(255, 215, 0, 0.8)';
    ctx.lineWidth = tl.width || 1.5;
    ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
  });

  // Draw Saved Fibonacci Retracements
  drawings.fibs.forEach(fib => {
    const yMin = calcY(fib.priceMin);
    const yMax = calcY(fib.priceMax);
    const dy = yMax - yMin;
    const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
    const colors = ['#ff1744', '#ff7300', '#ffd700', '#00e676', '#00f0ff', '#8a2be2', '#ffffff'];
    
    levels.forEach((l, idx) => {
      const yLevel = yMin + dy * l;
      ctx.strokeStyle = fib.color || colors[idx];
      ctx.lineWidth = fib.width || 0.8;
      ctx.setLineDash([2, 2]);
      ctx.beginPath(); ctx.moveTo(0, yLevel); ctx.lineTo(width, yLevel); ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = fib.color || colors[idx];
      ctx.font = '8px Orbitron';
      ctx.fillText((l * 100).toFixed(1) + '%', 10, yLevel - 2);
    });
  });

  // Bollinger Bands drawing overlay
  const isBBChecked = document.getElementById('cbBB')?.checked;
  if (isBBChecked && activeHistory.length >= 20) {
    const bb = calculateBollingerBands(activeHistory);
    
    // Draw Upper Band
    ctx.strokeStyle = 'rgba(138, 43, 226, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    let first = true;
    for (let i = startIndex; i < endIndex; i++) {
      if (bb.upper[i] === null) continue;
      const x = stepX * (i - startIndex);
      const y = calcY(bb.upper[i]);
      if (first) { ctx.moveTo(x, y); first = false; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw Lower Band
    ctx.beginPath();
    first = true;
    for (let i = startIndex; i < endIndex; i++) {
      if (bb.lower[i] === null) continue;
      const x = stepX * (i - startIndex);
      const y = calcY(bb.lower[i]);
      if (first) { ctx.moveTo(x, y); first = false; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw Middle Band
    ctx.strokeStyle = 'rgba(138, 43, 226, 0.25)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    first = true;
    for (let i = startIndex; i < endIndex; i++) {
      if (bb.middle[i] === null) continue;
      const x = stepX * (i - startIndex);
      const y = calcY(bb.middle[i]);
      if (first) { ctx.moveTo(x, y); first = false; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // EMA 20 drawing overlay
  const isEMA20Checked = document.getElementById('cbEMA20')?.checked;
  if (isEMA20Checked && activeHistory.length >= 20) {
    const ema20 = calculateEMA(activeHistory, 20);
    ctx.strokeStyle = 'rgba(255, 115, 0, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    let first = true;
    for (let i = startIndex; i < endIndex; i++) {
      if (ema20[i] === null) continue;
      const x = stepX * (i - startIndex);
      const y = calcY(ema20[i]);
      if (first) { ctx.moveTo(x, y); first = false; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // EMA 50 drawing overlay
  const isEMA50Checked = document.getElementById('cbEMA50')?.checked;
  if (isEMA50Checked && activeHistory.length >= 50) {
    const ema50 = calculateEMA(activeHistory, 50);
    ctx.strokeStyle = 'rgba(255, 23, 68, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    let first = true;
    for (let i = startIndex; i < endIndex; i++) {
      if (ema50[i] === null) continue;
      const x = stepX * (i - startIndex);
      const y = calcY(ema50[i]);
      if (first) { ctx.moveTo(x, y); first = false; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Draw Drawing Tool Preview
  if (activeDrawingTool && startPoint && hoverPoint) {
    const p1 = getCoordsFromValue(startPoint.globalIdx, startPoint.priceVal);
    if (activeDrawingTool === 'trendline') {
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(hoverPoint.x, hoverPoint.y);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (activeDrawingTool === 'fib') {
      const yMin = p1.y;
      const yMax = hoverPoint.y;
      const dy = yMax - yMin;
      const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
      const colors = ['rgba(255,23,68,0.4)', 'rgba(255,115,0,0.4)', 'rgba(255,215,0,0.4)', 'rgba(0,230,118,0.4)', 'rgba(0,240,255,0.4)', 'rgba(138,43,226,0.4)', 'rgba(255,255,255,0.4)'];
      
      levels.forEach((l, idx) => {
        const yLevel = yMin + dy * l;
        ctx.strokeStyle = colors[idx];
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(0, yLevel); ctx.lineTo(width, yLevel); ctx.stroke();
        ctx.fillStyle = colors[idx];
        ctx.font = '8px Orbitron';
        ctx.fillText((l * 100).toFixed(1) + '%', 10, yLevel - 2);
      });
    }
  }

  // 1. Draw Institutional Order Blocks
  const obHeight = priceRange * 0.08;
  
  // Supply Zone (Red overlay at the top)
  const ySupplyTop = calcY(maxPrice);
  const ySupplyBottom = calcY(maxPrice - obHeight);
  ctx.fillStyle = 'rgba(255, 23, 68, 0.06)';
  ctx.fillRect(0, ySupplyTop, width, ySupplyBottom - ySupplyTop);
  ctx.strokeStyle = 'rgba(255, 23, 68, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, ySupplyBottom);
  ctx.lineTo(width, ySupplyBottom);
  ctx.stroke();
  
  // Supply Zone Label
  ctx.fillStyle = 'rgba(255, 23, 68, 0.7)';
  ctx.font = '8px Orbitron';
  ctx.textAlign = 'left';
  let supplyLabel = 'INSTITUTIONAL ORDER BLOCK (SUPPLY)';
  if (currentLang === 'mr') supplyLabel = 'संस्थात्मक ऑर्डर ब्लॉक (सप्लाय झोन)';
  else if (currentLang === 'hi') supplyLabel = 'संस्थागत ऑर्डर ब्लॉक (सप्लाई ज़ोन)';
  else if (currentLang === 'es') supplyLabel = 'BLOQUE DE ORDEN INSTITUCIONAL (OFERTA)';
  ctx.fillText(supplyLabel, 10, ySupplyBottom - 4);

  // Demand Zone (Green overlay at the bottom)
  const yDemandTop = calcY(minPrice + obHeight);
  const yDemandBottom = calcY(minPrice);
  ctx.fillStyle = 'rgba(0, 230, 118, 0.06)';
  ctx.fillRect(0, yDemandTop, width, yDemandBottom - yDemandTop);
  ctx.strokeStyle = 'rgba(0, 230, 118, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, yDemandTop);
  ctx.lineTo(width, yDemandTop);
  ctx.stroke();
  
  // Demand Zone Label
  ctx.fillStyle = 'rgba(0, 230, 118, 0.7)';
  ctx.font = '8px Orbitron';
  ctx.textAlign = 'left';
  let demandLabel = 'INSTITUTIONAL ORDER BLOCK (DEMAND)';
  if (currentLang === 'mr') demandLabel = 'संस्थात्मक ऑर्डर ब्लॉक (डिमांड झोन)';
  else if (currentLang === 'hi') demandLabel = 'संस्थागत ऑर्डर ब्लॉक (डिमांड ज़ोन)';
  else if (currentLang === 'es') demandLabel = 'BLOQUE DE ORDEN INSTITUCIONAL (DEMANDA)';
  ctx.fillText(demandLabel, 10, yDemandTop + 10);

  // 2. Draw Liquidity Pools (Dotted lines slightly inside swing high / low)
  const lpUpperPrice = maxPrice - priceRange * 0.16;
  const lpLowerPrice = minPrice + priceRange * 0.16;
  
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 5]);
  
  // Upper LP Line
  const yLpUpper = calcY(lpUpperPrice);
  ctx.beginPath();
  ctx.moveTo(0, yLpUpper);
  ctx.lineTo(width, yLpUpper);
  ctx.stroke();
  
  // Lower LP Line
  const yLpLower = calcY(lpLowerPrice);
  ctx.beginPath();
  ctx.moveTo(0, yLpLower);
  ctx.lineTo(width, yLpLower);
  ctx.stroke();
  
  ctx.setLineDash([]);
  
  // Upper LP Label
  ctx.fillStyle = 'rgba(255, 215, 0, 0.75)';
  ctx.font = '7.5px Orbitron';
  let lpUpperLabel = 'LIQUIDITY POOL (BUY STOPS)';
  if (currentLang === 'mr') lpUpperLabel = 'लिक्विडिटी पूल (बाय स्टॉप्स)';
  else if (currentLang === 'hi') lpUpperLabel = 'लिक्विडिटी पूल (बाय स्टॉप्स)';
  else if (currentLang === 'es') lpUpperLabel = 'POOL DE LIQUIDEZ (COMPRA STOPS)';
  ctx.fillText(lpUpperLabel, width - 150, yLpUpper - 3);

  // Lower LP Label
  let lpLowerLabel = 'LIQUIDITY POOL (SELL STOPS)';
  if (currentLang === 'mr') lpLowerLabel = 'लिक्विडिटी पूल (सेल स्टॉप्स)';
  else if (currentLang === 'hi') lpLowerLabel = 'लिक्विडिटी पूल (सेल स्टॉप्स)';
  else if (currentLang === 'es') lpLowerLabel = 'POOL DE LIQUIDEZ (VENTA STOPS)';
  ctx.fillText(lpLowerLabel, width - 150, yLpLower + 9);

  // 3. Render Flashing Trap Alert Banner (top-center)
  if (typeof activeScannerAlert !== 'undefined' && activeScannerAlert && (Date.now() - activeScannerAlert.time < 4000)) {
    const centerX = width / 2;
    const bannerWidth = 360;
    const bannerHeight = 36;
    const bannerX = centerX - bannerWidth / 2;
    const bannerY = 12;
    
    // Determine raw color and glowing styles
    let rawColor = 'rgba(0, 240, 255, 1)';
    if (activeScannerAlert.color.includes('red-neon')) rawColor = 'rgba(255, 23, 68, 1)';
    else if (activeScannerAlert.color.includes('green-neon')) rawColor = 'rgba(0, 230, 118, 1)';
    else if (activeScannerAlert.color.includes('gold-accent')) rawColor = 'rgba(255, 215, 0, 1)';
    else if (activeScannerAlert.color.includes('cyan')) rawColor = 'rgba(0, 240, 255, 1)';
    else rawColor = activeScannerAlert.color;

    const pulseAlpha = 0.35 + 0.65 * Math.abs(Math.sin(Date.now() / 150));
    const strokeColor = rawColor.replace('1)', `${pulseAlpha})`);
    
    // Draw Glassmorphic capsule shadow/glow
    ctx.shadowColor = rawColor.replace('1)', '0.5)');
    ctx.shadowBlur = 8;
    
    ctx.beginPath();
    // Modern canvas roundRect support
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(bannerX, bannerY, bannerWidth, bannerHeight, 8);
    } else {
      ctx.rect(bannerX, bannerY, bannerWidth, bannerHeight);
    }
    ctx.fillStyle = 'rgba(13, 14, 21, 0.96)';
    ctx.fill();
    
    ctx.shadowBlur = 0; // Reset shadow
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Draw Banner Header (Ticker & Alert Tag)
    ctx.font = 'bold 9px Orbitron';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'var(--cyan)';
    ctx.fillText(activeScannerAlert.symbol.replace('_', ' '), bannerX + 12, bannerY + 15);
    
    ctx.textAlign = 'right';
    ctx.fillStyle = rawColor;
    ctx.fillText(activeScannerAlert.tag + ` (${activeScannerAlert.confidence}%)`, bannerX + bannerWidth - 12, bannerY + 15);
    
    // Draw Banner Body (Description)
    ctx.font = '8.5px Inter';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillText(activeScannerAlert.desc, centerX, bannerY + 27);
  }

  // Draw Interactive Crosshair & Price Axis Tag
  if (hoverPoint && !isDragging) {
    const hoveredPrice = ((height - hoverPoint.y) / height) * (priceRange + pad * 2) + (minPrice - pad);
    const config = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
    const priceText = hoveredPrice.toFixed(config.decimals);
    
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, hoverPoint.y);
    ctx.lineTo(width, hoverPoint.y);
    ctx.stroke();
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(hoverPoint.x, 0);
    ctx.lineTo(hoverPoint.x, height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Price axis capsule on right
    ctx.fillStyle = 'rgba(13, 14, 21, 0.9)';
    ctx.fillRect(width - 70, hoverPoint.y - 8, 70, 16);
    ctx.strokeStyle = 'var(--cyan)';
    ctx.lineWidth = 1;
    ctx.strokeRect(width - 70, hoverPoint.y - 8, 70, 16);
    
    ctx.fillStyle = 'var(--cyan)';
    ctx.font = '9px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText(priceText, width - 35, hoverPoint.y + 4);
  }
}

function setChartType(type) {
  chartType = type;
  const btns = document.querySelectorAll('.chart-type-btn');
  const types = ['line', 'candle', 'area', 'bar'];
  btns.forEach((b, i) => {
    if (types[i] === type) b.classList.add('active');
    else b.classList.remove('active');
  });
  drawChart();
}

function toggleDrawingTool(tool) {
  if (activeDrawingTool === tool) {
    activeDrawingTool = null;
    const el = document.getElementById(`tool${tool.charAt(0).toUpperCase() + tool.slice(1)}`);
    if (el) el.classList.remove('active');
  } else {
    if (activeDrawingTool) {
      const prevEl = document.getElementById(`tool${activeDrawingTool.charAt(0).toUpperCase() + activeDrawingTool.slice(1)}`);
      if (prevEl) prevEl.classList.remove('active');
    }
    activeDrawingTool = tool;
    const el = document.getElementById(`tool${tool.charAt(0).toUpperCase() + tool.slice(1)}`);
    if (el) el.classList.add('active');
  }
}

function clearDrawings() {
  drawings = { trendlines: [], fibs: [], supports: [] };
  drawChart();
}

let chartViewMode = 'custom'; // 'custom' or 'tv'
let tvWidget = null;

function switchChartView(mode) {
  chartViewMode = mode;
  
  const btnCustom = document.getElementById('btnViewCustom');
  const btnTV = document.getElementById('btnViewTV');
  const canvasEl = document.getElementById('liveChartCanvas');
  const tvContainer = document.getElementById('tradingview_chart_container');
  const customControls = document.getElementById('customTypeSelector');
  const customDrawings = document.getElementById('customDrawingBar');
  const btnGoLive = document.getElementById('btnGoLive');

  if (mode === 'custom') {
    if (btnCustom) btnCustom.classList.add('active');
    if (btnTV) btnTV.classList.remove('active');
    if (canvasEl) canvasEl.style.display = 'block';
    if (tvContainer) tvContainer.style.display = 'none';
    if (customControls) customControls.style.display = 'flex';
    if (customDrawings) customDrawings.style.display = 'flex';
    if (btnGoLive) btnGoLive.style.display = (panOffset > 0) ? 'block' : 'none';
    drawChart();
  } else {
    if (btnCustom) btnCustom.classList.remove('active');
    if (btnTV) btnTV.classList.add('active');
    if (canvasEl) canvasEl.style.display = 'none';
    if (tvContainer) tvContainer.style.display = 'block';
    if (customControls) customControls.style.display = 'none';
    if (customDrawings) customDrawings.style.display = 'none';
    if (btnGoLive) btnGoLive.style.display = 'none';
    
    const config = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
    initTradingViewWidget(config.symbol);
  }
}

function initTradingViewWidget(symbol) {
  if (typeof TradingView === 'undefined') {
    const tvContainer = document.getElementById('tradingview_chart_container');
    if (tvContainer) {
      tvContainer.innerHTML = `<div style="padding: 40px; text-align: center; color: var(--text-muted); font-family: 'Orbitron', sans-serif;">
        <p style="color: var(--red-neon); margin-bottom: 10px;">TRADINGVIEW CONNECTIVITY ERROR</p>
        <p style="font-size: 11px;">Unable to load TradingView scripting library. Please check your internet connection.</p>
      </div>`;
    }
    return;
  }

  // Clear previous widget iframe to prevent overlapping and symbol glitches
  const tvChartDiv = document.getElementById('tradingview_chart');
  if (tvChartDiv) {
    tvChartDiv.innerHTML = '';
  }
  
  // Map standard symbols to TradingView symbols
  let tvSymbol = "FOREXCOM:IN50";
  const sym = (symbol || '').toUpperCase().trim();
  const symClean = sym.replace('_', '');
  
  if (sym === "NIFTY_50" || sym === "NIFTY") {
    tvSymbol = "FOREXCOM:IN50";
  } else if (sym === "RELIANCE") {
    tvSymbol = "BSE:RELIANCE";
  } else if (sym === "TATA_MOTORS" || sym === "TATA") {
    tvSymbol = "BSE:TATAMOTORS";
  } else if (sym === "TATA_TECH") {
    tvSymbol = "BSE:TATATECH";
  } else if (sym === "GOLD") {
    tvSymbol = "TVC:GOLD";
  } else if (sym === "SILVER") {
    tvSymbol = "TVC:SILVER";
  } else if (sym === "CRUDE_OIL" || sym === "CRUDE") {
    tvSymbol = "TVC:USOIL";
  } else if (sym === "NAT_GAS" || sym === "NATGAS") {
    tvSymbol = "TVC:NATGAS";
  } else if (sym === "S&P_500" || sym === "SP500") {
    tvSymbol = "SP:SPX";
  } else if (sym === "NASDAQ_100" || sym === "NASDAQ") {
    tvSymbol = "NASDAQ:NDX";
  } else if (sym === "DOW_JONES" || sym === "DOW") {
    tvSymbol = "INDEX:DJI";
  } else if (sym === "BTC" || sym === "ETH" || sym === "SOL" || sym.endsWith('_USDT')) {
    const coin = sym.endsWith('_USDT') ? symClean : sym + "USDT";
    tvSymbol = "BINANCE:" + coin;
  } else {
    // default/forex fallback
    tvSymbol = "FX_IDC:" + symClean;
  }

  // Update the symbol indicator badge in the UI
  const indicator = document.getElementById('tvSymbolIndicator');
  if (indicator) {
    indicator.innerText = `Symbol: ${tvSymbol}`;
  }

  // Check if we are running under file:// protocol
  const isLocalFile = window.location.protocol === 'file:';

  if (isLocalFile && (tvSymbol.startsWith('BSE:') || tvSymbol.startsWith('FOREXCOM:'))) {
    if (tvChartDiv) {
      if (currentLang === 'mr') {
        tvChartDiv.innerHTML = `
          <div style="padding: 30px; text-align: center; color: var(--text-secondary); font-family: 'Inter', sans-serif; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(13, 14, 21, 0.95); border: 1.5px dashed var(--border); border-radius: 12px; box-shadow: var(--glow-gold); box-sizing: border-box;">
            <p style="color: var(--gold-accent); font-family: 'Orbitron', sans-serif; font-weight: 900; margin-bottom: 12px; font-size: 11px; letter-spacing: 1px;">स्थानिक फाईल प्रोटोकॉल मर्यादा (INDIAN STOCKS BLOCKED)</p>
            <p style="font-size: 10.5px; max-width: 400px; line-height: 1.6; margin-bottom: 8px;">
              TradingView सुरक्षा नियमांनुसार स्थानिक फाईल्सवर (<code>file://</code>) भारतीय शेअर बाजाराचे चार्ट्स ब्लॉक केले जातात.
            </p>
            <p style="font-size: 10px; max-width: 400px; line-height: 1.6; color: var(--text-muted);">
              हे चार्ट्स पाहण्यासाठी कृपया लोकल सर्व्हर सुरू करा. (उदा. प्रोजेक्ट फोल्डरमध्ये <code>serve.ps1</code> चालवून ब्राउझरमध्ये <code>http://localhost:8000</code> उघडा).
            </p>
            <p style="font-size: 9px; color: var(--cyan); font-family: 'Orbitron', sans-serif; margin-top: 14px; letter-spacing: 0.5px;">
              टिप: क्रिप्टो आणि फॉरेक्स चार्ट्स स्थानिक फाईलवर देखील सुरू राहतील.
            </p>
          </div>`;
      } else {
        tvChartDiv.innerHTML = `
          <div style="padding: 30px; text-align: center; color: var(--text-secondary); font-family: 'Inter', sans-serif; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(13, 14, 21, 0.95); border: 1.5px dashed var(--border); border-radius: 12px; box-shadow: var(--glow-gold); box-sizing: border-box;">
            <p style="color: var(--gold-accent); font-family: 'Orbitron', sans-serif; font-weight: 900; margin-bottom: 12px; font-size: 11px; letter-spacing: 1px;">LOCAL FILE PROTOCOL LIMITATION (INDIAN STOCKS BLOCKED)</p>
            <p style="font-size: 10.5px; max-width: 400px; line-height: 1.6; margin-bottom: 8px;">
              TradingView blocks Indian Stock Exchange charts when running directly from local HTML files (<code>file://</code>).
            </p>
            <p style="font-size: 10px; max-width: 400px; line-height: 1.6; color: var(--text-muted);">
              To display Indian stock charts, please run a local web server (e.g., run <code>serve.ps1</code> in the project directory and open <code>http://localhost:8000</code>).
            </p>
            <p style="font-size: 9px; color: var(--cyan); font-family: 'Orbitron', sans-serif; margin-top: 14px; letter-spacing: 0.5px;">
              NOTE: CRYPTO AND FOREX CHARTS WILL CONTINUE TO LOAD NORMALLY UNDER FILE://.
            </p>
          </div>`;
      }
    }
    return;
  }

  tvWidget = new TradingView.widget({
    "width": "100%",
    "height": "100%",
    "symbol": tvSymbol,
    "interval": "5",
    "timezone": "Asia/Kolkata",
    "theme": "dark",
    "style": "1",
    "locale": "en",
    "enable_publishing": false,
    "hide_side_toolbar": false,
    "allow_symbol_change": true,
    "container_id": "tradingview_chart"
  });
}

// Replay Mode Core Handlers
function toggleReplayMode() {
  if (chartViewMode === 'tv') return;
  isReplayMode = !isReplayMode;
  
  const replayBar = document.getElementById('replayControlBar');
  const btnReplay = document.getElementById('btnReplay');
  const customControls = document.getElementById('customTypeSelector');
  const btnGoLive = document.getElementById('btnGoLive');

  if (isReplayMode) {
    if (replayBar) replayBar.style.display = 'flex';
    if (btnReplay) btnReplay.classList.add('active');
    if (customControls) customControls.style.display = 'none';
    if (btnGoLive) btnGoLive.style.display = 'none';
    
    // Pause live simulator
    replayIndex = Math.max(30, history.length - 40);
    replayIsPlaying = false;
    if (replayTimer) clearInterval(replayTimer);
    document.getElementById('btnReplayPlay').innerText = 'PLAY';
  } else {
    if (replayBar) replayBar.style.display = 'none';
    if (btnReplay) btnReplay.classList.remove('active');
    if (customControls) customControls.style.display = 'flex';
    
    replayIsPlaying = false;
    if (replayTimer) clearInterval(replayTimer);
  }
  
  drawChart();
}

function replayPlay() {
  const btn = document.getElementById('btnReplayPlay');
  replayIsPlaying = !replayIsPlaying;
  
  if (replayIsPlaying) {
    btn.innerText = 'PAUSE';
    btn.style.color = 'var(--red-neon)';
    btn.style.borderColor = 'var(--red-neon)';
    
    replayTimer = setInterval(() => {
      if (replayIndex < history.length) {
        replayIndex++;
        // Update live stats based on replay prices
        price = history[replayIndex - 1];
        const elLivePrice = document.getElementById('livePrice');
        const config = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
        if (elLivePrice) elLivePrice.innerText = price.toFixed(config.decimals);
        if (typeof calculateRisk === 'function') calculateRisk();
        if (typeof checkStrategyAlerts === 'function') checkStrategyAlerts();
        
        drawChart();
      } else {
        clearInterval(replayTimer);
        replayIsPlaying = false;
        btn.innerText = 'PLAY';
        btn.style.color = 'var(--green-neon)';
        btn.style.borderColor = 'var(--green-neon)';
      }
    }, 1000);
  } else {
    btn.innerText = 'PLAY';
    btn.style.color = 'var(--green-neon)';
    btn.style.borderColor = 'var(--green-neon)';
    if (replayTimer) clearInterval(replayTimer);
  }
}

function replayStep() {
  if (replayIsPlaying) {
    replayPlay(); // Pause first
  }
  if (replayIndex < history.length) {
    replayIndex++;
    price = history[replayIndex - 1];
    const elLivePrice = document.getElementById('livePrice');
    const config = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
    if (elLivePrice) elLivePrice.innerText = price.toFixed(config.decimals);
    if (typeof calculateRisk === 'function') calculateRisk();
    if (typeof checkStrategyAlerts === 'function') checkStrategyAlerts();
    
    drawChart();
  }
}

// Distance from point P to line segment P1-P2
function getDistanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) {
    return Math.sqrt(Math.pow(px - x1, 2) + Math.pow(py - y1, 2));
  }
  
  let t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
  t = Math.max(0, Math.min(1, t));
  
  const closestX = x1 + t * dx;
  const closestY = y1 + t * dy;
  
  return Math.sqrt(Math.pow(px - closestX, 2) + Math.pow(py - closestY, 2));
}

// Advanced Indicator Math helpers
function calculateSMA(data, period) {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j];
      }
      sma.push(sum / period);
    }
  }
  return sma;
}

function calculateEMA(data, period) {
  const ema = [];
  if (data.length === 0) return ema;
  
  let sum = 0;
  const actPeriod = Math.min(period, data.length);
  for (let i = 0; i < actPeriod; i++) {
    sum += data[i];
  }
  let prevEma = sum / actPeriod;
  const k = 2 / (period + 1);
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      ema.push(null);
    } else if (i === period - 1) {
      ema.push(prevEma);
    } else {
      const val = (data[i] - prevEma) * k + prevEma;
      ema.push(val);
      prevEma = val;
    }
  }
  return ema;
}

function calculateBollingerBands(data, period = 20, stdDevMult = 2) {
  const sma = calculateSMA(data, period);
  const upper = [];
  const lower = [];
  
  for (let i = 0; i < data.length; i++) {
    if (sma[i] === null) {
      upper.push(null);
      lower.push(null);
    } else {
      let sumSqDiff = 0;
      for (let j = 0; j < period; j++) {
        sumSqDiff += Math.pow(data[i - j] - sma[i], 2);
      }
      const stdDev = Math.sqrt(sumSqDiff / period);
      upper.push(sma[i] + stdDev * stdDevMult);
      lower.push(sma[i] - stdDev * stdDevMult);
    }
  }
  return { middle: sma, upper, lower };
}
