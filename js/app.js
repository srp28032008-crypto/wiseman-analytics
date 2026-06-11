// Wiseman Analytics Core Orchestrator & Coordinator

// System Global States
let activeMarket = 'indianStocks';
let activeTickerKey = 'nifty';
let isLong = true;
let chartType = 'line'; 
let activeDrawingTool = null; 

let price = 22450.00;
let volume = 25.4;
let rsi = 54.0;
let macd = 0.12;
let signalLine = 0.08;
let scannerAccuracyValue = 98.90;
let activeScannerAlert = null;
let history = Array.from({ length: 150 }, (_, i) => price * (1 + (i - 130) * 0.0002 + (Math.sin(i / 8) * 0.0008)));
let liveSocket = null;
let isWsConnected = false; 

// HTML5 Canvas Coordinates
let canvas = null;
let ctx = null;

// Initialize Core Modules
function init() {
  canvas = document.getElementById('liveChartCanvas');
  if (canvas) {
    ctx = canvas.getContext('2d');
    
    // Bind interaction event listeners
    canvas.addEventListener('mousedown', onChartMouseDown);
    canvas.addEventListener('mousemove', onChartMouseMove);
    canvas.addEventListener('mouseup', onChartMouseUp);
    canvas.addEventListener('mouseleave', onChartMouseLeave);
    canvas.addEventListener('wheel', onChartWheel, { passive: false });
    canvas.addEventListener('dblclick', onChartDblClick);
  }

  translateUI('en');
  initTerminator();
  switchMarket('indianStocks');
  startSimulator();
  connectBinanceWebsocket();
  startTrapScanner();
  startWatchlistScanner();
  populateNewsTicker();
  startRealTimeNewsEngine();

  if (typeof switchChartView === 'function') {
    switchChartView('custom');
  }
  
  // Set initial canvas sizing
  setTimeout(resizeCanvas, 150);

  // Authenticate session check
  if (typeof checkSession === 'function') {
    checkSession();
  }
}

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const rect = canvas.parentElement.getBoundingClientRect();
  if (rect.width === 0) return; 
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  drawChart();
}
window.addEventListener('resize', resizeCanvas);

function switchMarket(marketKey) {
  activeMarket = marketKey;
  const tabs = document.querySelectorAll('.market-tab');
  const idxMap = { indianStocks: 0, crypto: 1, forex: 2 };
  tabs.forEach((t, i) => {
    if (i === idxMap[marketKey]) t.classList.add('active');
    else t.classList.remove('active');
  });
  populateWatchlist();
  const firstTicker = marketTickers[marketKey][0];
  selectTicker(firstTicker.key);
}

function selectTicker(tickerKey) {
  activeTickerKey = tickerKey;
  const items = document.querySelectorAll('.watchlist-item');
  items.forEach(el => el.classList.remove('active'));
  const currentActiveEl = document.getElementById(`watch-${tickerKey}`);
  if (currentActiveEl) currentActiveEl.classList.add('active');

  const config = marketTickers[activeMarket].find(t => t.key === tickerKey);
  const elSymbol = document.getElementById('activeSymbol');
  if (elSymbol) elSymbol.innerText = config.symbol;
  
  const pulseDot = document.getElementById('wsPulse');
  if (pulseDot) {
    pulseDot.style.display = (config.wsStream && isWsConnected) ? 'block' : 'none';
  }

  price = config.currentPrice;
  rsi = 50.0 + (Math.random() - 0.5) * 12;
  macd = (Math.random() - 0.5) * 0.15;
  signalLine = (Math.random() - 0.5) * 0.08;
  history = Array.from({ length: 150 }, (_, i) => price * (1 + (i - 130) * 0.0002 + (Math.sin(i / 8) * 0.0008)));
  panOffset = 0;
  
  const btnGoLive = document.getElementById('btnGoLive');
  if (btnGoLive) btnGoLive.style.display = 'none';
  
  const elLivePrice = document.getElementById('livePrice');
  if (elLivePrice) elLivePrice.innerText = price.toFixed(config.decimals);
  
  const elEntryInput = document.getElementById('entryInput');
  if (elEntryInput) elEntryInput.value = price.toFixed(config.decimals);

  calculateRisk();

  const vols = marketVols[activeMarket];
  volume = vols.volMult + (Math.random() - 0.5) * (activeMarket === 'crypto' ? 25 : 5);
  updateIndicatorsAndCoach(volume);
  
  if (typeof chartViewMode !== 'undefined' && chartViewMode === 'tv') {
    if (typeof initTradingViewWidget === 'function') {
      initTradingViewWidget(config.symbol);
    }
  } else {
    drawChart();
  }
}

function populateWatchlist() {
  const container = document.getElementById('watchlistContainer');
  if (!container) return;
  container.innerHTML = '';
  const tickers = marketTickers[activeMarket];
  tickers.forEach(t => {
    const item = document.createElement('div');
    item.className = `watchlist-item ${t.key === activeTickerKey ? 'active' : ''}`;
    item.id = `watch-${t.key}`;
    item.onclick = () => selectTicker(t.key);

    const sign = t.change >= 0 ? '+' : '';
    const colorClass = t.change >= 0 ? 'pnl-positive' : 'pnl-negative';
    const translatedName = tickerNamesTranslated[currentLang][t.key] || t.name;

    item.innerHTML = `
      <div class="watchlist-meta">
        <span class="watchlist-symbol">
          ${t.symbol.replace('_', ' ')}
          ${t.isNew ? `<span class="new-tag">NEW</span>` : ''}
        </span>
        <span class="watchlist-name">${translatedName}</span>
      </div>
      <div class="watchlist-values">
        <div class="watchlist-price">${t.currentPrice.toFixed(t.decimals)}</div>
        <div class="watchlist-change ${colorClass}">${sign}${t.change.toFixed(2)}%</div>
      </div>
    `;
    container.appendChild(item);
  });
}

function connectBinanceWebsocket() {
  const streams = [];
  Object.keys(marketTickers).forEach(mKey => {
    marketTickers[mKey].forEach(t => {
      if (t.wsStream) {
        streams.push(t.wsStream);
      }
    });
  });

  const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams.join('/')}`;
  if (liveSocket) liveSocket.close();

  liveSocket = new WebSocket(wsUrl);

  liveSocket.onopen = () => {
    isWsConnected = true;
    const config = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
    const pulseDot = document.getElementById('wsPulse');
    if (pulseDot) {
      pulseDot.style.display = (config.wsStream) ? 'block' : 'none';
    }
  };

  liveSocket.onmessage = (event) => {
    const payload = JSON.parse(event.data);
    const data = payload.data;
    if (!data) return;

    const streamSymbol = data.s; 
    const lastPrice = parseFloat(data.c); 
    const changePercent = parseFloat(data.P); 
    const streamVol = parseFloat(data.q) / 1000000; 

    let matchedTicker = null;
    Object.keys(marketTickers).forEach(mKey => {
      const found = marketTickers[mKey].find(t => t.wsStream && t.wsStream.toUpperCase().split('@')[0] === streamSymbol.toUpperCase());
      if (found) matchedTicker = found;
    });

    if (matchedTicker) {
      matchedTicker.currentPrice = lastPrice;
      matchedTicker.change = changePercent;

      if (matchedTicker.key === activeTickerKey) {
        price = lastPrice;
        volume = streamVol;

        const elLivePrice = document.getElementById('livePrice');
        if (elLivePrice) elLivePrice.innerText = price.toFixed(matchedTicker.decimals);
        
        const badge = document.getElementById('priceChange');
        if (badge) {
          const sign = changePercent >= 0 ? '+' : '';
          badge.innerText = `${sign}${changePercent.toFixed(2)}%`;
          badge.className = changePercent >= 0 ? 'price-change-badge positive' : 'price-change-badge negative';
        }
        
        history.push(price);
        if (history.length > 300) history.shift();

        if (panOffset === 0) {
          const btnGoLive = document.getElementById('btnGoLive');
          if (btnGoLive) btnGoLive.style.display = 'none';
        }
      }
    }
  };

  liveSocket.onclose = () => {
    isWsConnected = false;
    const pulseDot = document.getElementById('wsPulse');
    if (pulseDot) pulseDot.style.display = 'none';
    setTimeout(connectBinanceWebsocket, 5000);
  };

  liveSocket.onerror = () => {
    isWsConnected = false;
    const pulseDot = document.getElementById('wsPulse');
    if (pulseDot) pulseDot.style.display = 'none';
  };
}

function setDirection(longVal) {
  isLong = longVal;
  const tabs = document.querySelectorAll('.direction-tab');
  if (tabs.length >= 2) {
    if (isLong) {
      tabs[0].classList.add('active');
      tabs[1].classList.remove('active');
    } else {
      tabs[0].classList.remove('active');
      tabs[1].classList.add('active');
    }
  }
  calculateRisk();
}

// Simulated trade execution functions removed as this is a pure analysis & advisory platform

function updateIndicatorsAndCoach(volVal) {
  const dict = langDb[currentLang];
  
  const elVol = document.getElementById('volumeText');
  if (elVol) elVol.innerText = `${dict.lblVolume}${volVal.toFixed(1)}M`;
  
  const elRsiVal = document.getElementById('rsiVal');
  if (elRsiVal) {
    elRsiVal.innerText = rsi.toFixed(1);
    elRsiVal.style.color = rsi > 70 ? 'var(--red-neon)' : (rsi < 30 ? 'var(--green-neon)' : 'var(--cyan)');
  }
  
  const elMacdVal = document.getElementById('macdVal');
  if (elMacdVal) {
    elMacdVal.innerText = macd.toFixed(3);
    elMacdVal.style.color = macd >= signalLine ? 'var(--green-neon)' : 'var(--red-neon)';
  }
  
  const elSignalVal = document.getElementById('signalVal');
  if (elSignalVal) elSignalVal.innerText = signalLine.toFixed(3);

  if (typeof evaluateAIQuote === 'function') {
    evaluateAIQuote(volVal);
  }
  if (typeof checkStrategyAlerts === 'function') {
    checkStrategyAlerts();
  }
}

function startSimulator() {
  setInterval(() => {
    const vols = marketVols[activeMarket];
    
    // Simulated updates for instruments
    Object.keys(marketTickers).forEach(mKey => {
      const configVol = marketVols[mKey].vol;
      marketTickers[mKey].forEach(t => {
        if (!t.wsStream || !isWsConnected) {
          const pct = (Math.random() - 0.49) * configVol;
          t.currentPrice = t.currentPrice * (1 + pct);
          const startVal = t.basePrice;
          t.change = ((t.currentPrice - startVal) / startVal) * 100;
        }
      });
    });

    const currentActiveConfig = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
    
    if (!currentActiveConfig.wsStream || !isWsConnected) {
      price = currentActiveConfig.currentPrice;
      history.push(price);
      if (history.length > 300) history.shift();
      
      if (panOffset === 0) {
        const btnGoLive = document.getElementById('btnGoLive');
        if (btnGoLive) btnGoLive.style.display = 'none';
      }
      
      const elLivePrice = document.getElementById('livePrice');
      if (elLivePrice) elLivePrice.innerText = price.toFixed(currentActiveConfig.decimals);
      
      const badge = document.getElementById('priceChange');
      if (badge) {
        const sign = currentActiveConfig.change >= 0 ? '+' : '';
        badge.innerText = `${sign}${currentActiveConfig.change.toFixed(2)}%`;
        badge.className = currentActiveConfig.change >= 0 ? 'price-change-badge positive' : 'price-change-badge negative';
      }
    }

    rsi = Math.max(10, Math.min(90, rsi + (Math.random() - 0.5) * 4));
    macd += (Math.random() - 0.5) * 0.08;
    signalLine += (Math.random() - 0.5) * 0.04;

    volume = vols.volMult + (Math.random() - 0.5) * (activeMarket === 'crypto' ? 25 : 5);
    
    populateWatchlist();

    // Auto-fit canvas scaling buffer
    if (canvas && (canvas.width === 0 || canvas.height === 0 || canvas.width !== canvas.clientWidth * window.devicePixelRatio)) {
      resizeCanvas();
    }

    updateIndicatorsAndCoach(volume);
    drawChart();
  }, 1000);
}

function startTrapScanner() {
  const logs = document.getElementById('scannerLogs');
  if (!logs) return;

  const scannerDb = {
    en: {
      trapStopHunt: "Stop Hunt Sweep detected (Institutional wash)",
      trapBullTrap: "Bull Trap Rejected near local resistance",
      trapBearTrap: "Bear Trap Defended near local support",
      trapLiquidity: "Liquidity Sweep Block identified (Order flow cluster)",
      trapImbalance: "Order Block Imbalance filled (Fair Value Gap)",
      patternDoubleBottom: "Double Bottom Reversal forming on support",
      patternHeadShoulders: "Head & Shoulders Top confirmed (Reversal signal)",
      patternTriangle: "Ascending Triangle Consolidation breakout verified",
      patternFlag: "Bullish Flag Breakout verified on volume spike",
      patternCup: "Cup & Handle Accumulation completed",
      alertTrap: "[TRAP WARNING]",
      alertPattern: "[PATTERN DETECTED]"
    },
    mr: {
      trapStopHunt: "स्टॉप हंट स्वीप आढळला (संस्थात्मक लिक्विडेशन)",
      trapBullTrap: "रेझिस्टन्स जवळ बुल ट्रॅप (Bull Trap) फेटाळला",
      trapBearTrap: "सपोर्ट जवळ बिअर ट्रॅप (Bear Trap) रोखला गेला",
      trapLiquidity: "लिक्विडिटी स्वीप ब्लॉक आढळला (ऑर्डर फ्लो क्लस्टर)",
      trapImbalance: "ऑर्डर ब्लॉक असंतुलन पूर्ण (Fair Value Gap)",
      patternDoubleBottom: "डबल बॉटम रिव्हर्सल पॅटर्न सपोर्टवर तयार",
      patternHeadShoulders: "हेड अँड शोल्डर्स टॉप निश्चित (रिव्हर्सल संकेत)",
      patternTriangle: "असेंडिंग ट्रँगल कन्सोलिडेशन ब्रेकआऊट निश्चित",
      patternFlag: "व्हॉल्यूम वाढीसह बुलिश फ्लॅग ब्रेकआऊट निश्चित",
      patternCup: "कप अँड हँडल ॲक्युम्युलेशन पूर्ण झाले आहे",
      alertTrap: "[चेतावणी ट्रॅप]",
      alertPattern: "[पॅटर्न आढळला]"
    },
    hi: {
      trapStopHunt: "स्टॉप हंट स्वीप पाया गया (संस्थागत लिक्विडेशन)",
      trapBullTrap: "प्रतिरोध के पास बुल ट्रैप (Bull Trap) खारिज",
      trapBearTrap: "सपोर्ट के पास बियर ट्रैप (Bear Trap) का बचाव",
      trapLiquidity: "लिक्विडिटी स्वीप ब्लॉक की पहचान की गई",
      trapImbalance: "ऑर्डर ब्लॉक असंतुलन भरा गया (Fair Value Gap)",
      patternDoubleBottom: "डबल बॉटम रिवर्सल पैटर्न सपोर्ट पर बन रहा है",
      patternHeadShoulders: "हेड एंड शोल्डर्स TOP की पुष्टि (रिवर्सल संकेत)",
      patternTriangle: "एसेंडिंग ट्रायंगल कंसॉलिडेशन ब्रेकआउट की पुष्टि",
      patternFlag: "वॉल्यूम स्पाइक के साथ बुलिश फ्लैग ब्रेकआउट की पुष्टि",
      patternCup: "कप एंड हैंडल एक्यूम्यूलेशन पूरा हुआ",
      alertTrap: "[चेतावनी ट्रैप]",
      alertPattern: "[पैटर्न मिला]"
    },
    es: {
      trapStopHunt: "Stop Hunt Sweep detectado (Liquidación institucional)",
      trapBullTrap: "Trampa de Toros (Bull Trap) rechazada cerca de resistencia",
      trapBearTrap: "Trampa de Osos (Bear Trap) defendida cerca de soporte",
      trapLiquidity: "Bloque de barrido de liquidez identificado (Flujo de órdenes)",
      trapImbalance: "Desequilibrio del bloque de órdenes (Fair Value Gap)",
      patternDoubleBottom: "Reversión de doble suelo en soporte",
      patternHeadShoulders: "Hombro-Cabeza-Hombro confirmado (Señal de reversión)",
      patternTriangle: "Ruptura de triángulo ascendente verificada",
      patternFlag: "Bandera alcista rota con volumen",
      patternCup: "Acumulación de taza y asa completada",
      alertTrap: "[ALERTA TRAMPA]",
      alertPattern: "[PATRÓN DETECTADO]"
    }
  };

  setInterval(() => {
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
    const dict = scannerDb[lang] || scannerDb['en'];
    const activeConfig = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
    const name = activeConfig.symbol.replace('_', ' ');
    const timestamp = new Date().toLocaleTimeString();

    const scanResult = detectPatternAndTraps();
    if (!scanResult) return;

    const isTrap = scanResult.type === 'TRAP';
    const tag = isTrap ? dict.alertTrap : dict.alertPattern;
    const desc = dict[scanResult.patternKey] || scanResult.patternKey;
    const color = scanResult.color;
    const confidence = scanResult.confidence;

    // Save alert globally for custom canvas graphics overlays
    activeScannerAlert = {
      type: scanResult.type,
      symbol: activeConfig.symbol,
      desc: desc,
      tag: tag,
      price: price,
      time: Date.now(),
      color: color,
      confidence: confidence
    };

    // Redraw chart rapidly to animate the flashing banner smoothly
    let alertDraws = 0;
    const alertInterval = setInterval(() => {
      if (alertDraws++ > 80 || !activeScannerAlert || Date.now() - activeScannerAlert.time >= 4000) {
        clearInterval(alertInterval);
      }
      if (typeof drawChart === 'function') {
        drawChart();
      }
    }, 50); // ~20 FPS for smooth flashing animation

    // Play native synthesised sci-fi audio beeps using Web Audio API
    playFuturisticAlert(isTrap);

    // Fluctuate scanner accuracy slightly (98.60% - 99.40%)
    scannerAccuracyValue = Math.min(99.40, Math.max(98.60, 98.95 + (Math.sin(Date.now() / 12000) * 0.35) + (Math.random() * 0.1)));
    
    const accEl = document.getElementById('scannerAccuracy');
    if (accEl) {
      const activeLangDb = langDb[lang] || langDb['en'];
      const accPrefix = activeLangDb.scannerAccuracy || "ACCURACY: ";
      accEl.innerText = `${accPrefix}${scannerAccuracyValue.toFixed(2)}%`;
    }

    const logItem = document.createElement('div');
    logItem.className = 'log-row';
    logItem.style.borderLeft = `2px solid ${color}`;
    logItem.style.background = isTrap ? "rgba(255, 23, 68, 0.02)" : "rgba(0, 230, 118, 0.02)";
    logItem.innerHTML = `
      <span class="log-time">[${timestamp}]</span>
      <span class="log-tag" style="color: ${color}; font-weight: 800;">${tag}</span>
      <span class="log-desc" style="color: var(--text-primary); font-weight: 500;">
        ${name} &rarr; <span style="color: var(--text-secondary); font-style: italic;">${desc}</span>
      </span>
      <span class="confidence-badge" style="float: right; font-size: 8px; font-family: 'Orbitron', sans-serif; color: var(--gold-accent); background: rgba(255, 215, 0, 0.08); padding: 1px 4px; border-radius: 4px; border: 1px solid rgba(255, 215, 0, 0.25);">CONF: ${confidence}%</span>
    `;
    logs.insertBefore(logItem, logs.firstChild);
    if (logs.children.length > 20) logs.removeChild(logs.lastChild);
  }, 5000);
}

// Native synthesised audio generating sci-fi beeps using Web Audio API (Zero assets required)
function playFuturisticAlert(isTrap) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (isTrap) {
      // Sawtooth drop alarm sweep (Short duration to avoid annoying user)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(550, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else {
      // Tech-y positive sweep (Sine wave)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.035, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    }
  } catch (err) {
    // Autoplay browser safety policy bypass
  }
}

function startWatchlistScanner() {
  const newItems = {
    indianStocks: { key: 'tata_tech', symbol: 'TATA_TECH', name: 'Tata Tech Limited', basePrice: 1040.00, decimals: 2, currentPrice: 1040.00, change: 0.8, wsStream: null },
    crypto: { key: 'sol_jup', symbol: 'SOL_JUP', name: 'Jupiter Token / SOL', basePrice: 0.0125, decimals: 5, currentPrice: 0.0125, change: 12.4, wsStream: null },
    forex: { key: 'usd_chf', symbol: 'USD_CHF', name: 'US Dollar / Franc', basePrice: 0.91200, decimals: 5, currentPrice: 0.91200, change: -0.15, wsStream: null }
  };

  setTimeout(() => {
    Object.keys(newItems).forEach(mKey => {
      const item = newItems[mKey];
      item.isNew = true;
      marketTickers[mKey].push(item);
    });

    const chat = document.getElementById('chatHistory');
    if (chat) {
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble bubble-ai';
      bubble.innerText = `[SCANNER SERVICE] Wiseman detected institutional listings! Added new tickers to watchlist: TATA TECH (Stocks), SOL_JUP (Crypto), USD_CHF (Forex). Dynamic analysis initiated.`;
      chat.appendChild(bubble);
      chat.scrollTop = chat.scrollHeight;
    }

    populateWatchlist();
  }, 12000);
}

// AI News Sentiment Modal Handlers
function openSentimentReport(newsId) {
  const item = newsDatabase.find(n => n.id === newsId);
  if (!item) return;

  const modal = document.getElementById('sentimentModal');
  const headline = document.getElementById('modalSentimentHeadline');
  const badge = document.getElementById('modalSentimentBadge');
  const time = document.getElementById('modalSentimentTime');
  const analysis = document.getElementById('modalSentimentAnalysis');
  const impact = document.getElementById('modalSentimentImpact');

  if (modal && headline && badge && time && analysis && impact) {
    headline.innerText = item.headline;
    badge.innerText = `${item.category.toUpperCase()} • ${item.impact}`;
    
    // Style badge
    if (item.impact === 'BULLISH') {
      badge.style.background = 'rgba(0, 230, 118, 0.15)';
      badge.style.color = 'var(--green-neon)';
      badge.style.borderColor = 'var(--green-neon)';
    } else if (item.impact === 'BEARISH') {
      badge.style.background = 'rgba(255, 23, 68, 0.15)';
      badge.style.color = 'var(--red-neon)';
      badge.style.borderColor = 'var(--red-neon)';
    } else {
      badge.style.background = 'rgba(255, 215, 0, 0.15)';
      badge.style.color = 'var(--gold-accent)';
      badge.style.borderColor = 'var(--gold-accent)';
    }
    
    time.innerText = item.time;
    analysis.innerText = item.analysis;
    impact.innerText = item.summary;
    
    // Color summary text border/bg based on impact
    if (item.impact === 'BULLISH') {
      impact.style.color = 'var(--green-neon)';
      impact.style.borderColor = 'rgba(0, 230, 118, 0.3)';
    } else if (item.impact === 'BEARISH') {
      impact.style.color = 'var(--red-neon)';
      impact.style.borderColor = 'rgba(255, 23, 68, 0.3)';
    } else {
      impact.style.color = 'var(--gold-accent)';
      impact.style.borderColor = 'rgba(255, 215, 0, 0.3)';
    }

    modal.style.display = 'flex';
  }
}

function closeSentimentReport() {
  const modal = document.getElementById('sentimentModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function populateNewsTicker() {
  const ticker = document.getElementById('newsTicker');
  if (!ticker) return;
  ticker.innerHTML = '';
  
  newsDatabase.forEach(item => {
    const span = document.createElement('span');
    span.className = 'news-ticker-item';
    span.onclick = () => openSentimentReport(item.id);
    
    const impactColor = item.impact === 'BULLISH' ? 'var(--green-neon)' : (item.impact === 'BEARISH' ? 'var(--red-neon)' : 'var(--gold-accent)');
    span.innerHTML = `<span style="color: ${impactColor}; font-weight: bold; margin-right: 6px;">[${item.category} ${item.impact}]</span>${item.headline}`;
    ticker.appendChild(span);
  });
}

// Lower Stats Tab Switches
function switchLowerTab(tabId) {
  const tabs = ['positions', 'history', 'strategy', 'advisory'];
  tabs.forEach(t => {
    const btn = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1));
    const content = document.getElementById('content' + t.charAt(0).toUpperCase() + t.slice(1));
    if (t === tabId) {
      if (btn) btn.classList.add('active');
      if (content) content.style.display = 'block';
    } else {
      if (btn) btn.classList.remove('active');
      if (content) content.style.display = 'none';
    }
  });
}

// AI Advisory and Strategies Panel Renderer
function renderAdvisoryPanel() {
  const tableBody = document.getElementById('advisoryTableBody');
  const cardsGrid = document.getElementById('strategyCardsGrid');
  if (!tableBody || !cardsGrid) return;

  const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
  const adviceList = advisoryDatabase[lang] || advisoryDatabase['en'] || [];
  const stratList = strategyDatabase[lang] || strategyDatabase['en'] || [];

  // 1. Render Table
  tableBody.innerHTML = '';
  adviceList.forEach(item => {
    const row = document.createElement('tr');
    
    // Check recommendation action to apply badge class
    let badgeClass = 'badge-hold';
    const actionUpper = item.action.toUpperCase();
    if (actionUpper.includes('BUY') || item.action.includes('खरेदी') || item.action.includes('खरीद')) {
      badgeClass = 'badge-buy';
    } else if (actionUpper.includes('SELL') || item.action.includes('विक्री') || item.action.includes('बेच')) {
      badgeClass = 'badge-sell';
    }
    
    row.innerHTML = `
      <td><span class="pos-ticker" style="font-family: 'Orbitron', sans-serif;">${item.ticker.replace('_', ' ')}</span></td>
      <td><span class="${badgeClass}">${item.action}</span></td>
      <td><span style="color: var(--text-secondary); font-weight: 600; font-size: 8px; font-family: 'Orbitron', sans-serif;">${item.holdClass}</span></td>
      <td><span style="color: var(--cyan); font-weight: 500; font-size: 8.5px; font-family: 'Orbitron', sans-serif;">${item.timeframe}</span></td>
      <td style="color: var(--text-muted); font-size: 8px; line-height: 1.3; max-width: 200px; white-space: normal; text-align: left; padding: 6px;">${item.rationale}</td>
    `;
    tableBody.appendChild(row);
  });

  // 2. Render Strategy Cards
  cardsGrid.innerHTML = '';
  stratList.forEach(item => {
    const card = document.createElement('div');
    card.className = 'strategy-card';
    card.innerHTML = `
      <div class="strategy-card-header">
        <span class="strategy-card-title">${item.name}</span>
        <span class="strategy-card-timeframe">${item.timeframe}</span>
      </div>
      <div class="strategy-card-indicators">${item.indicators}</div>
      <div class="strategy-card-desc">${item.desc}</div>
    `;
    cardsGrid.appendChild(card);
  });
}

// Closed trade history rendering removed as this is a pure analysis & advisory platform

// Strategy alerts condition analyzer
function checkStrategyAlerts() {
  const slider = document.getElementById('sliderRsiThreshold');
  const macdSelect = document.getElementById('selectMacdTrigger');
  const status = document.getElementById('strategyAlertStatus');
  const box = document.getElementById('strategyAlertBox');
  if (!slider || !macdSelect || !status || !box) return;

  const threshold = parseFloat(slider.value);
  const direction = macdSelect.value;
  
  const rsiCheck = rsi <= threshold;
  
  let macdCheck = false;
  if (direction === 'any') {
    macdCheck = true;
  } else if (direction === 'bullish') {
    macdCheck = macd > signalLine;
  } else if (direction === 'bearish') {
    macdCheck = macd < signalLine;
  }
  
  if (rsiCheck && macdCheck) {
    status.innerText = currentLang === 'mr' ? 'इशारा: खरेदीचे संकेत!' : 'ALERT: CRITERIA SATISFIED!';
    status.style.color = 'var(--green-neon)';
    box.style.borderColor = 'var(--green-neon)';
    box.style.boxShadow = 'var(--glow-green)';
    box.style.background = 'rgba(0, 230, 118, 0.08)';
  }
}

// --- MATHEMATICAL PATTERN & TRAP DETECTOR ENGINE ---
function detectPatternAndTraps() {
  const n = history.length;
  if (n < 40) return null; // Need enough data points
  
  // Find local highs and lows in the last 40 ticks
  const windowSize = 5;
  const localHighs = [];
  const localLows = [];
  
  for (let i = windowSize; i < n - windowSize; i++) {
    const val = history[i];
    let isHigh = true;
    let isLow = true;
    for (let j = 1; j <= windowSize; j++) {
      if (history[i - j] >= val || history[i + j] > val) isHigh = false;
      if (history[i - j] <= val || history[i + j] < val) isLow = false;
    }
    if (isHigh) localHighs.push({ index: i, price: val });
    if (isLow) localLows.push({ index: i, price: val });
  }
  
  const currentPrice = history[n - 1];
  const prevPrice = history[n - 2];
  const prevPrice2 = history[n - 3];
  
  // 1. Check for Bull Trap:
  // Price rose above recent resistance, but now broke back below it on volume
  if (localHighs.length > 0) {
    const recentHigh = localHighs[localHighs.length - 1];
    if (prevPrice2 > recentHigh.price && currentPrice < recentHigh.price && volume > 25.5) {
      return {
        type: 'TRAP',
        patternKey: 'trapBullTrap',
        color: 'var(--red-neon)',
        confidence: (98.40 + (volume % 1.5)).toFixed(2)
      };
    }
  }
  
  // 2. Check for Bear Trap:
  // Price fell below recent support, but now broke back above it on volume
  if (localLows.length > 0) {
    const recentLow = localLows[localLows.length - 1];
    if (prevPrice2 < recentLow.price && currentPrice > recentLow.price && volume > 25.5) {
      return {
        type: 'TRAP',
        patternKey: 'trapBearTrap',
        color: 'var(--red-neon)',
        confidence: (98.60 + (volume % 1.3)).toFixed(2)
      };
    }
  }
  
  // 3. Check for Stop Hunt Sweep:
  // Extreme volume spike indicates institutional sweep
  if (volume > 28.0) {
    return {
      type: 'TRAP',
      patternKey: 'trapStopHunt',
      color: 'var(--red-neon)',
      confidence: (99.20 + (volume % 0.75)).toFixed(2)
    };
  }
  
  // 4. Check for Imbalance (FVG):
  // Check if price difference from prev is abnormally large
  const lastDiff = Math.abs(currentPrice - prevPrice);
  const avgDiff = history.slice(-20).reduce((acc, p, idx, arr) => idx === 0 ? acc : acc + Math.abs(p - arr[idx-1]), 0) / 19;
  if (lastDiff > avgDiff * 2.5) {
    return {
      type: 'TRAP',
      patternKey: 'trapImbalance',
      color: 'var(--gold-accent)',
      confidence: (97.90 + (lastDiff % 1.0)).toFixed(2)
    };
  }
  
  // 5. Check for Double Bottom:
  // Two recent lows within a tiny margin
  if (localLows.length >= 2) {
    const low1 = localLows[localLows.length - 2].price;
    const low2 = localLows[localLows.length - 1].price;
    if (Math.abs(low1 - low2) / low1 < 0.0020 && rsi < 35) {
      return {
        type: 'PATTERN',
        patternKey: 'patternDoubleBottom',
        color: 'var(--green-neon)',
        confidence: (99.10 + (rsi % 0.8)).toFixed(2)
      };
    }
  }

  // 6. Check for Double Top:
  // Two recent highs within a tiny margin
  if (localHighs.length >= 2) {
    const high1 = localHighs[localHighs.length - 2].price;
    const high2 = localHighs[localHighs.length - 1].price;
    if (Math.abs(high1 - high2) / high1 < 0.0020 && rsi > 65) {
      return {
        type: 'PATTERN',
        patternKey: 'patternHeadShoulders', // Maps to reversal
        color: 'var(--red-neon)',
        confidence: (98.90 + (rsi % 0.7)).toFixed(2)
      };
    }
  }
  
  // Indicator breakouts fallback
  if (rsi > 70) {
    return {
      type: 'PATTERN',
      patternKey: 'patternHeadShoulders',
      color: 'var(--red-neon)',
      confidence: (98.20 + (rsi % 1.2)).toFixed(2)
    };
  }
  
  if (rsi < 30) {
    return {
      type: 'PATTERN',
      patternKey: 'patternDoubleBottom',
      color: 'var(--green-neon)',
      confidence: (98.50 + (rsi % 1.1)).toFixed(2)
    };
  }
  
  if (macd >= signalLine) {
    return {
      type: 'PATTERN',
      patternKey: Math.random() > 0.5 ? 'patternTriangle' : 'patternFlag',
      color: 'var(--green-neon)',
      confidence: (98.15 + (macd * 4) % 1.3).toFixed(2)
    };
  }
  
  // Default pattern
  return {
    type: 'PATTERN',
    patternKey: 'patternCup',
    color: 'var(--cyan)',
    confidence: (97.80 + (volume % 1.8)).toFixed(2)
  };
}

// --- REAL-TIME NEWS GENERATOR ENGINE ---
let activeNewsFeed = [];

function startRealTimeNewsEngine() {
  const feedContainer = document.getElementById('realtimeNewsFeed');
  if (!feedContainer) return;
  
  const newsTemplates = {
    en: {
      indianStocks: [
        { headline: "Reliance Industries signs strategic green hydrogen pact, shares spike", impact: "BULLISH", category: "CORP" },
        { headline: "SEBI issues new guidelines on index option derivative volumes", impact: "NEUTRAL", category: "REG" },
        { headline: "Tata Motors domestic passenger sales drop 4% year-on-year", impact: "BEARISH", category: "CORP" },
        { headline: "Nifty 50 swings 120 points as institutional blocks rebalance portfolios", impact: "NEUTRAL", category: "MARKET" },
        { headline: "FII net buying exceeds 1,200 Crores in Indian cash markets", impact: "BULLISH", category: "FLOW" },
        { headline: "Government raises import duties on domestic electronic components", impact: "BEARISH", category: "MACRO" }
      ],
      crypto: [
        { headline: "SEC approves Spot Ethereum options trading on major exchanges", impact: "BULLISH", category: "REG" },
        { headline: "MicroStrategy acquires additional 4,500 BTC for $280 million", impact: "BULLISH", category: "FLOW" },
        { headline: "Crypto exchange faces regulatory audit over security protocol mismatch", impact: "BEARISH", category: "REG" },
        { headline: "Bitcoin miners deplete inventory holdings to record-low levels", impact: "NEUTRAL", category: "FLOW" },
        { headline: "Solana Transaction volume surges to new all-time high on DEX activity", impact: "BULLISH", category: "TECH" },
        { headline: "Bearish liquidity sweep wipes out $140 million in long leverage", impact: "BEARISH", category: "LIQ" }
      ],
      forex: [
        { headline: "Federal Reserve maintains interest rate levels, hints at late-year cut", impact: "NEUTRAL", category: "FED" },
        { headline: "European Central Bank raises concerns over inflation persistent tailwinds", impact: "BEARISH", category: "ECB" },
        { headline: "US Dollar Index (DXY) surges to 104.8 on safe-haven flows", impact: "BULLISH", category: "MACRO" },
        { headline: "Japanese Yen collapses to 158.2 per USD, BoJ intervention suspected", impact: "BEARISH", category: "BOJ" },
        { headline: "Swiss Franc shows strength on surprise SNB capital balance sheet expansion", impact: "BULLISH", category: "SNB" }
      ]
    },
    mr: {
      indianStocks: [
        { headline: "रिलायन्स इंडस्ट्रीजचा हरित हायड्रोजनसाठी धोरणात्मक करार, शेअर्समध्ये वाढ", impact: "BULLISH", category: "CORP" },
        { headline: "SEBI कडून इंडेक्स ऑप्शन्स वॉल्यूमवर नवीन मार्गदर्शक तत्त्वे जारी", impact: "NEUTRAL", category: "REG" },
        { headline: "टाटा मोटर्सच्या देशांतर्गत प्रवासी वाहनांच्या विक्रीत ४% घट", impact: "BEARISH", category: "CORP" },
        { headline: "इन्स्टिट्यूशनल ब्लॉक डील्समुळे निफ्टी ५० मध्ये मोठी हालचाल", impact: "NEUTRAL", category: "MARKET" },
        { headline: "FII कडून भारतीय बाजारपेठेत १,२०० कोटींची निव्वळ खरेदी", impact: "BULLISH", category: "FLOW" },
        { headline: "सरकारकडून इलेक्ट्रॉनिक्स सुट्या भागांच्या आयात शुल्कात वाढ", impact: "BEARISH", category: "MACRO" }
      ],
      crypto: [
        { headline: "SEC कडून स्पॉट इथरियम ऑप्शन्स ट्रेडिंगला मंजुरी", impact: "BULLISH", category: "REG" },
        { headline: "मायक्रोस्ट्रॅटेजीने २८० दशलक्ष डॉलर्समध्ये अतिरिक्त ४,५०० BTC खरेदी केले", impact: "BULLISH", category: "FLOW" },
        { headline: "सिक्युरिटी प्रोटोकॉल त्रुटीमुळे क्रिप्टो एक्सचेंज ऑडिटच्या फेऱ्यात", impact: "BEARISH", category: "REG" },
        { headline: "बिटकॉइन मायनर्सचे इन्व्हेंटरी होल्डिंग्स निच्चांकी पातळीवर", impact: "NEUTRAL", category: "FLOW" },
        { headline: "DEX व्यवहारांमुळे सोलाना वॉल्यूम सार्वकालिक उच्चांकावर", impact: "BULLISH", category: "TECH" },
        { headline: "मार्केट घसरणीमुळे १४० दशलक्ष डॉलर्सचे लॉंग पोझिशन्स लिक्विडेट", impact: "BEARISH", category: "LIQ" }
      ],
      forex: [
        { headline: "फेडरल रिझर्व्हने व्याजदर स्थिर ठेवले, वर्षाच्या अखेरीस कपातीचे संकेत", impact: "NEUTRAL", category: "FED" },
        { headline: "युरोपियन सेंट्रल बँकेकडून वाढत्या महागाईवर चिंता व्यक्त", impact: "BEARISH", category: "ECB" },
        { headline: "सुरक्षित गुंतवणूक ओघामुळे यूएस डॉलर इंडेक्स (DXY) १०४.८ वर पोहोचला", impact: "BULLISH", category: "MACRO" },
        { headline: "जपानी येन घसरून १५८.२ वर, बँक ऑफ जपानकडून हस्तक्षेपाची शक्यता", impact: "BEARISH", category: "BOJ" },
        { headline: "स्विस फ्रँक मजबूत, SNB कडून कॅपिटल विस्तार जाहीर", impact: "BULLISH", category: "SNB" }
      ]
    },
    hi: {
      indianStocks: [
        { headline: "रिलायंस इंडस्ट्रीज ने ग्रीन हाइड्रोजन के लिए समझौता किया, शेयरों में उछाल", impact: "BULLISH", category: "CORP" },
        { headline: "SEBI ने इंडेक्स ऑप्शंस डेरिवेटिव वॉल्यूम पर नए नियम जारी किए", impact: "NEUTRAL", category: "REG" },
        { headline: "टाटा मोटर्स की घरेलू पैसेंजर वाहन बिक्री में ४% की गिरावट", impact: "BEARISH", category: "CORP" },
        { headline: "संस्थागत ब्लॉक रीबैलेंसिंग के कारण निफ्टी ५० में भारी उतार-चढ़ाव", impact: "NEUTRAL", category: "MARKET" },
        { headline: "भारतीय कैश मार्केट में FII ने १,२०० करोड़ की शुद्ध खरीदारी की", impact: "BULLISH", category: "FLOW" },
        { headline: "सरकार ने घरेलू इलेक्ट्रॉनिक्स घटकों पर आयात शुल्क बढ़ाया", impact: "BEARISH", category: "MACRO" }
      ],
      crypto: [
        { headline: "SEC ने प्रमुख एक्सचेंजों पर स्पॉट एथेरियम ऑप्शंस ट्रेडिंग को मंजूरी दी", impact: "BULLISH", category: "REG" },
        { headline: "माइक्रोस्ट्रेटेजी ने २८० मिलियन डॉलर में अतिरिक्त ४,५०० BTC खरीदे", impact: "BULLISH", category: "FLOW" },
        { headline: "सुरक्षा प्रोटोकॉल बेमेल होने पर क्रिप्टो एक्सचेंज रेगुलेटरी ऑडिट के दायरे में", impact: "BEARISH", category: "REG" },
        { headline: "बिटकॉइन माइनर्स का इन्वेंट्री होल्डिंग्स रिकॉर्ड निचले स्तर पर", impact: "NEUTRAL", category: "FLOW" },
        { headline: "DEX गतिविधि के कारण सोलाना ट्रांजैक्शन वॉल्यूम नए शिखर पर", impact: "BULLISH", category: "TECH" },
        { headline: "बाजार में भारी गिरावट से १४० मिलियन डॉलर के लॉन्ग पोजीशंस लिक्विडेट", impact: "BEARISH", category: "LIQ" }
      ],
      forex: [
        { headline: "फेडरल रिजर्व ने ब्याज दरें स्थिर रखीं, साल के अंत में कटौती के संकेत", impact: "NEUTRAL", category: "FED" },
        { headline: "यूरोपियन सेंट्रल बैंक ने बढ़ती महंगाई पर चिंता जताई", impact: "BEARISH", category: "ECB" },
        { headline: "सुरक्षित निवेश प्रवाह के कारण यूएस डॉलर इंडेक्स (DXY) १०४.८ पर पहुंचा", impact: "BULLISH", category: "MACRO" },
        { headline: "जापानी येन गिरकर १५८.२ पर, बैंक ऑफ जापान के हस्तक्षेप की आशंका", impact: "BEARISH", category: "BOJ" },
        { headline: "स्विस फ्रैंक मजबूत, SNB कैपिटल शीट विस्तार की घोषणा", impact: "BULLISH", category: "SNB" }
      ]
    },
    es: {
      indianStocks: [
        { headline: "Reliance Industries firma pacto de hidrógeno verde, las acciones suben", impact: "BULLISH", category: "CORP" },
        { headline: "SEBI emite nuevas directrices sobre volúmenes de derivados de opciones", impact: "NEUTRAL", category: "REG" },
        { headline: "Ventas domésticas de pasajeros de Tata Motors caen un 4% interanual", impact: "BEARISH", category: "CORP" },
        { headline: "Nifty 50 oscila 120 puntos por rebalanceos de bloques institucionales", impact: "NEUTRAL", category: "MARKET" },
        { headline: "Compras netas de FII superan los 1,200 millones de rupias", impact: "BULLISH", category: "FLOW" },
        { headline: "El gobierno aumenta los aranceles de importación de componentes electrónicos", impact: "BEARISH", category: "MACRO" }
      ],
      crypto: [
        { headline: "La SEC aprueba el comercio de opciones Spot Ethereum en las bolsas", impact: "BULLISH", category: "REG" },
        { headline: "MicroStrategy adquiere 4,500 BTC adicionales por 280 millones de dólares", impact: "BULLISH", category: "FLOW" },
        { headline: "Exchange de criptomonedas enfrenta auditoría por fallas de seguridad", impact: "BEARISH", category: "REG" },
        { headline: "Los mineros de Bitcoin agotan reservas a niveles mínimos históricos", impact: "NEUTRAL", category: "FLOW" },
        { headline: "El volumen de transacciones de Solana sube a un máximo histórico", impact: "BULLISH", category: "TECH" },
        { headline: "Liquidación bajista elimina 140 millones de dólares en apalancamiento largo", impact: "BEARISH", category: "LIQ" }
      ],
      forex: [
        { headline: "La Reserva Federal mantiene tasas de interés, insinúa recortes a fin de año", impact: "NEUTRAL", category: "FED" },
        { headline: "El Banco Central Europeo expresa preocupación por la inflación persistente", impact: "BEARISH", category: "ECB" },
        { headline: "El índice del dólar estadounidense (DXY) sube a 104.8 por flujos seguros", impact: "BULLISH", category: "MACRO" },
        { headline: "El yen japonés cae a 158.2 por dólar, se sospecha intervención del BoJ", impact: "BEARISH", category: "BOJ" },
        { headline: "El franco suizo muestra fortaleza por expansión del balance del SNB", impact: "BULLISH", category: "SNB" }
      ]
    }
  };

  function pushNewsUpdate() {
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'en';
    const activeTemplates = newsTemplates[lang] || newsTemplates['en'];
    const marketTemplates = activeTemplates[activeMarket] || activeTemplates['indianStocks'];
    
    const template = marketTemplates[Math.floor(Math.random() * marketTemplates.length)];
    const timeStr = new Date().toLocaleTimeString();
    const config = marketTickers[activeMarket].find(t => t.key === activeTickerKey);
    const activeSymbolStr = config.symbol.replace('_', ' ');

    const newsItem = {
      id: "news-" + Date.now(),
      headline: template.headline,
      impact: template.impact,
      category: template.category,
      time: timeStr,
      analysis: lang === 'mr' ?
        `एआय विश्लेषण दर्शवते की हा कार्यक्रम थेट संस्थात्मक ऑर्डर प्लेसमेंटशी जोडलेला आहे. ${activeSymbolStr} वरील परिणामामुळे अस्थिरता वाढू शकते. सल्ला दिला जातो की +/- 0.5% जोखीम नियंत्रित ठेवावी.` :
        `AI Analysis reveals that this event has a direct, quantitative correlation with active ${activeSymbolStr} order placement. Expect volatility spikes. Recommended exposure adjustments inside terminals.`,
      summary: `${template.impact} IMPACT DETECTED ON ${activeMarket.toUpperCase()}`
    };

    activeNewsFeed.unshift(newsItem);
    if (activeNewsFeed.length > 15) activeNewsFeed.pop();

    renderNewsFeed();
    triggerAICoachNewsReaction(newsItem);
  }

  // Populate first entries
  for (let i = 0; i < 4; i++) {
    setTimeout(pushNewsUpdate, i * 400);
  }

  // Set interval to push news dynamically every 15 seconds
  setInterval(pushNewsUpdate, 15000);
}

function renderNewsFeed() {
  const feedContainer = document.getElementById('realtimeNewsFeed');
  if (!feedContainer) return;
  feedContainer.innerHTML = '';

  activeNewsFeed.forEach(item => {
    const row = document.createElement('div');
    row.className = 'news-feed-row';
    row.onclick = () => openSentimentReportFromFeed(item);
    
    let impactClass = 'neutral';
    if (item.impact === 'BULLISH') impactClass = 'bullish';
    else if (item.impact === 'BEARISH') impactClass = 'bearish';

    row.innerHTML = `
      <div class="news-feed-meta">
        <span class="news-feed-time">[${item.time}]</span>
        <span class="news-feed-impact ${impactClass}">${item.impact}</span>
      </div>
      <div class="news-feed-headline">${item.headline}</div>
    `;
    feedContainer.appendChild(row);
  });
}

function openSentimentReportFromFeed(item) {
  const modal = document.getElementById('sentimentModal');
  const headline = document.getElementById('modalSentimentHeadline');
  const badge = document.getElementById('modalSentimentBadge');
  const time = document.getElementById('modalSentimentTime');
  const analysis = document.getElementById('modalSentimentAnalysis');
  const impact = document.getElementById('modalSentimentImpact');

  if (modal && headline && badge && time && analysis && impact) {
    headline.innerText = item.headline;
    badge.innerText = `${item.category} • ${item.impact}`;
    
    if (item.impact === 'BULLISH') {
      badge.style.background = 'rgba(0, 230, 118, 0.15)';
      badge.style.color = 'var(--green-neon)';
      badge.style.borderColor = 'var(--green-neon)';
    } else if (item.impact === 'BEARISH') {
      badge.style.background = 'rgba(255, 23, 68, 0.15)';
      badge.style.color = 'var(--red-neon)';
      badge.style.borderColor = 'var(--red-neon)';
    } else {
      badge.style.background = 'rgba(255, 215, 0, 0.15)';
      badge.style.color = 'var(--gold-accent)';
      badge.style.borderColor = 'var(--gold-accent)';
    }
    
    time.innerText = item.time;
    analysis.innerText = item.analysis;
    impact.innerText = item.summary;
    
    if (item.impact === 'BULLISH') {
      impact.style.color = 'var(--green-neon)';
      impact.style.borderColor = 'rgba(0, 230, 118, 0.3)';
    } else if (item.impact === 'BEARISH') {
      impact.style.color = 'var(--red-neon)';
      impact.style.borderColor = 'rgba(255, 23, 68, 0.3)';
    } else {
      impact.style.color = 'var(--gold-accent)';
      impact.style.borderColor = 'rgba(255, 215, 0, 0.3)';
    }

    modal.style.display = 'flex';
  }
}

function triggerAICoachNewsReaction(newsItem) {
  const coachQuote = document.getElementById('coachQuote');
  const coachStatus = document.getElementById('coachStatus');
  const avatar = document.getElementById('coachAvatarGlow');
  const confidenceVal = document.getElementById('confidenceVal');
  const confidenceFill = document.getElementById('confidenceFill');
  const rationaleList = document.getElementById('rationaleList');

  if (!coachQuote || !coachStatus || !avatar || !confidenceVal || !confidenceFill || !rationaleList) return;

  avatar.className = "coach-avatar";

  if (newsItem.impact === 'BULLISH') {
    coachStatus.innerText = currentLang === 'mr' ? 'मंजूर' : 'BULLISH IMPACT';
    coachStatus.className = "coach-status-badge status-approved";
    avatar.classList.add("buy-glow");
    confidenceVal.innerText = "88%";
    confidenceFill.style.width = "88%";
    confidenceFill.style.backgroundColor = "var(--green-neon)";
    
    if (currentLang === 'mr') {
      coachQuote.innerText = `"${newsItem.headline}. यामुळे निफ्टी आणि तत्सम शेअर्समध्ये संस्थात्मक खरेदीदारांची खरेदी वाढली आहे, सर."`;
      rationaleList.innerHTML = `
        <div class="rationale-item">
          <span class="rationale-icon" style="color: var(--green-neon);">●</span>
          <span>बातम्यांच्या ओघामुळे खरेदी वाढली आहे (Institutional Inflow).</span>
        </div>
        <div class="rationale-item">
          <span class="rationale-icon" style="color: var(--green-neon);">●</span>
          <span>सकारात्मक भावना आणि उच्च ट्रेडिंग गती.</span>
        </div>
      `;
    } else {
      coachQuote.innerText = `"Breaking: '${newsItem.headline}'. This has triggered sudden institutional buying sweeps on the ticker, Sir."`;
      rationaleList.innerHTML = `
        <div class="rationale-item">
          <span class="rationale-icon" style="color: var(--green-neon);">●</span>
          <span>Breaking corporate catalog catalyst triggers momentum.</span>
        </div>
        <div class="rationale-item">
          <span class="rationale-icon" style="color: var(--green-neon);">●</span>
          <span>FII buying volume flow spike confirms expansion.</span>
        </div>
      `;
    }
  } else if (newsItem.impact === 'BEARISH') {
    coachStatus.innerText = currentLang === 'mr' ? 'टाळा' : 'BEARISH IMPACT';
    coachStatus.className = "coach-status-badge status-avoid";
    avatar.classList.add("sell-glow");
    confidenceVal.innerText = "15%";
    confidenceFill.style.width = "15%";
    confidenceFill.style.backgroundColor = "var(--red-neon)";

    if (currentLang === 'mr') {
      coachQuote.innerText = `"${newsItem.headline}. यामुळे बाजारात नफावसुली आणि संस्थात्मक विक्री सुरू झाली आहे."`;
      rationaleList.innerHTML = `
        <div class="rationale-item">
          <span class="rationale-icon" style="color: var(--red-neon);">●</span>
          <span>विक्रीच्या दबावामुळे सपोर्ट लेव्हल तोडण्याची शक्यता.</span>
        </div>
        <div class="rationale-item">
          <span class="rationale-icon" style="color: var(--red-neon);">●</span>
          <span>नकारात्मक हेडलाईन आणि कडक जोखीम व्यवस्थापन आवश्यक.</span>
        </div>
      `;
    } else {
      coachQuote.innerText = `"Macro Alert: '${newsItem.headline}'. Risk off sentiment has triggered massive sell-side distribution sweeps."`;
      rationaleList.innerHTML = `
        <div class="rationale-item">
          <span class="rationale-icon" style="color: var(--red-neon);">●</span>
          <span>Decline in active volume support bounds.</span>
        </div>
        <div class="rationale-item">
          <span class="rationale-icon" style="color: var(--red-neon);">●</span>
          <span>Negative headline triggers sudden stop loss run.</span>
        </div>
      `;
    }
  }
}

// Local browser storage trade persistence and database sync methods removed as this is a pure analysis & advisory platform

// Bootstrap execution
window.addEventListener('DOMContentLoaded', init);
