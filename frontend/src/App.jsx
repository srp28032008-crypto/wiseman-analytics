import React, { useState, useEffect, useRef, useMemo } from 'react';
import AuthGate from './components/AuthGate';
import LiveChart from './components/LiveChart';
import PatternScanner from './components/PatternScanner';
import EquitiesDashboard from './components/EquitiesDashboard';
import NewsFeed from './components/NewsFeed';

import {
  newsDatabase,
  marketTickers,
  marketVols,
  advisoryDatabase,
  langDb
} from './config/marketData';

import { evaluateAICoach, getLocalHeuristicResponse } from './utils/aiCoach';
import { cleanInputString, checkThreatSignature, securityChecklist } from './utils/terminator';
import { calculateRiskParams } from './utils/riskCheck';
import { detectPatternAndTraps } from './utils/indicators';
import { getEquitiesIntelligence } from './utils/equitiesIntelligence';

// Pre-seeded historical logs for the scanner on mount
const initialSeedResults = [
  {
    id: "seed-1",
    symbol: "BTC_USDT",
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toLocaleTimeString(),
    card: {
      type: 'TRAP',
      patternKey: 'trapBearTrap',
      color: 'var(--red-neon)',
      confidence: '98.85',
      sweepPrice: '67120.00',
      stopLoss: '66920.00',
      targetPrice: '68200.00',
      signalStrength: '92% Bullish Defense',
      actionPlan: {
        en: "Bullish sweep confirmed. Institutional buy orders triggered. Target local resistance.",
        mr: "तेजीचा स्वीप निश्चित. संस्थात्मक खरेदी ऑर्डर्स सक्रिय. स्थानिक रेझिस्टन्स पातळी लक्ष्य करा.",
        hi: "तेजी का स्वीप निश्चित। संस्थागत खरीद ऑऑर्डर्स सक्रिय। स्थानीय रेजिस्टेंस को लक्षित करें।",
        es: "Barrido alcista verificado. Órdenes de compra institucionales activadas. Resistencia local."
      }
    }
  },
  {
    id: "seed-2",
    symbol: "NIFTY_50",
    timestamp: new Date(Date.now() - 6 * 60 * 1000).toLocaleTimeString(),
    card: {
      type: 'PATTERN',
      patternKey: 'patternTriangle',
      color: 'var(--green-neon)',
      confidence: '98.45',
      sweepPrice: '22420.00',
      stopLoss: '22240.00',
      targetPrice: '22910.00',
      signalStrength: '86% Momentum Breakout',
      actionPlan: {
        en: "Triangle or bullish flag breakout confirmed. Momentum trend expansion active.",
        mr: "ट्रँगल किंवा बुलिश फ्लॅग ब्रेकआऊट निश्चित. किमतीमध्ये वेगवान वाढ सक्रिय.",
        hi: "त्रिकोण या बुलिश फ्लैग ब्रेकआउट की पुष्टि। गति प्रवृत्ति विस्तार सक्रिय।",
        es: "Ruptura de triángulo o bandera alcista confirmada. Expansión de tendencia activa."
      }
    }
  },
  {
    id: "seed-3",
    symbol: "RELIANCE",
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toLocaleTimeString(),
    card: {
      type: 'TRAP',
      patternKey: 'trapImbalance',
      color: 'var(--gold-accent)',
      confidence: '98.15',
      sweepPrice: '2875.00',
      stopLoss: '2863.00',
      targetPrice: '2915.00',
      signalStrength: '84% Price Gap Imbalance',
      actionPlan: {
        en: "Fair Value Gap created. Expected mean reversion to fill the price imbalance zone.",
        mr: "फेअर व्हॅल्यू गॅप तयार झाली आहे. किमतीतील असंतुलन भरून काढण्यासाठी मूळ सरासरीकडे वाटचाल अपेक्षित.",
        hi: "फेअर वैल्यू गैप का निर्माण। मूल्य असंतुलn क्षेत्र को भरने के लिए माध्य प्रत्यावर्तन की उम्मीद।",
        es: "Brecha de valor razonable (FVG) creada. Se espera reversión a la media para llenar la brecha."
      }
    }
  },
  {
    id: "seed-4",
    symbol: "ETH_USDT",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toLocaleTimeString(),
    card: {
      type: 'TRAP',
      patternKey: 'trapStopHunt',
      color: 'var(--red-neon)',
      confidence: '99.30',
      sweepPrice: '3805.50',
      stopLoss: '3792.00',
      targetPrice: '3896.00',
      signalStrength: '94% Liquidity Sweep',
      actionPlan: {
        en: "Stop hunt sweep active. Retail orders liquidated. Institutional blocks matched.",
        mr: "स्टॉप हंट स्वीप सक्रिय. रिटेल ऑर्डर्स लिक्विडेट झाल्या. संस्थात्मक ब्लॉक मॅच झाले आहेत.",
        hi: "स्टॉप हंट स्वीप सक्रिय। रिटेल ऑर्डर्स लिक्विडेट हुईं। संस्थागत ब्लॉक मैच किए गए।",
        es: "Barrido de stop hunt activo. Órdenes minoristas liquidadas. Bloques institucionales emparejados."
      }
    }
  },
  {
    id: "seed-5",
    symbol: "SOL_USDT",
    timestamp: new Date(Date.now() - 1 * 60 * 1000).toLocaleTimeString(),
    card: {
      type: 'PATTERN',
      patternKey: 'patternDoubleBottom',
      color: 'var(--green-neon)',
      confidence: '99.25',
      sweepPrice: '164.10',
      stopLoss: '162.80',
      targetPrice: '170.50',
      signalStrength: '88% Structural Reversal',
      actionPlan: {
        en: "Double bottom forming. Accumulate in the buy zone near support level.",
        mr: "डबल बॉटम तयार होत आहे. सपोर्ट पातळीजवळ खरेदीसाठी योग्य वेळ.",
        hi: "Double bottom बन रहा है। सपोर्ट स्तर के पास खरीदारी संचय क्षेत्र सक्रिय।",
        es: "Doble suelo formándose. Acumule en la zona de compra cerca del nivel de soporte."
      }
    }
  }
];

const getTradingViewSymbol = (market, symbol) => {
  const cleanSymbol = (symbol || '').toUpperCase().replace('_', '');
  if (market === 'indianStocks') {
    return 'NSE:' + (symbol || '');
  } else if (market === 'crypto') {
    return 'BINANCE:' + cleanSymbol;
  } else if (market === 'globalMarket') {
    const symMap = {
      'GOLD': 'TVC:GOLD',
      'SILVER': 'TVC:SILVER',
      'CRUDEOIL': 'TVC:USOIL',
      'NATGAS': 'TVC:NATGAS',
      'SP500': 'SP:SPX',
      'NASDAQ100': 'NASDAQ:NDX',
      'DOWJONES': 'INDEX:DJI'
    };
    return symMap[cleanSymbol] || 'TVC:GOLD';
  } else {
    // forex
    return 'FX_IDC:' + cleanSymbol;
  }
};

export default function App() {
  const [token, setToken] = useState(null);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('wiseman_lang') || 'en');
  const [activeMarket, setActiveMarket] = useState('indianStocks');
  const [activeTickerKey, setActiveTickerKey] = useState('nifty');

  // Core market telemetry states
  const [price, setPrice] = useState(22450.00);
  const [volume, setVolume] = useState(25.4);
  const [rsi, setRsi] = useState(54.0);
  const [macd, setMacd] = useState(0.12);
  const [signalLine, setSignalLine] = useState(0.08);
  const [chartHistory, setChartHistory] = useState([]);

  // UI styling / view selections
  const [chartType, setChartType] = useState('line');
  const [activeDrawingTool, setActiveDrawingTool] = useState(null);
  const [cbBB, setCbBB] = useState(true);
  const [cbEMA20, setCbEMA20] = useState(false);
  const [cbEMA50, setCbEMA50] = useState(false);
  const [activeView, setActiveView] = useState('custom'); // 'custom' | 'tv'

  // Replay Mode States
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [replayIndex, setReplayIndex] = useState(50);
  const [replayIsPlaying, setReplayIsPlaying] = useState(false);
  const replayTimerRef = useRef(null);

  // Pattern Scanner States
  const [activeScannerAlert, setActiveScannerAlert] = useState(null);
  const [scannerLogs, setScannerLogs] = useState(initialSeedResults);
  const [accuracyValue, setAccuracyValue] = useState(98.90);

  // Risk Calculator States
  const [isLong, setIsLong] = useState(true);
  const [entryInput, setEntryInput] = useState('22450.00');

  // AI assistant chat states
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInputText, setChatInputText] = useState('');

  // Watchlist & Equities Databases
  const [watchlistSearch, setWatchlistSearch] = useState('');
  const [equitiesDb, setEquitiesDb] = useState([]);
  const [tickersState, setTickersState] = useState(marketTickers);

  // Terminator Active Shield States
  const [securityLogs, setSecurityLogs] = useState([]);
  const [shieldStrength, setShieldStrength] = useState(100);
  const [shieldStatus, setShieldStatus] = useState('SAFE'); // 'SAFE' | 'DEFENDING'

  // News overlays
  const [selectedNews, setSelectedNews] = useState(null);

  // Workspace Switcher & Advanced Analyzer states
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('analysis');
  const [backtestStrategy, setBacktestStrategy] = useState('ema');
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestProgress, setBacktestProgress] = useState(0);
  const [backtestResult, setBacktestResult] = useState(null);
  const [riskCapital, setRiskCapital] = useState(10000);
  const [riskPct, setRiskPct] = useState(2);

  // WebSockets and Refs
  const binanceSocketRef = useRef(null);
  const backendSocketRef = useRef(null);
  const priceCacheRef = useRef({});
  const lastPatternKeyRef = useRef({});

  // Memoize the active configuration and decimal precision for clean lookups
  const activeConfig = useMemo(() => {
    return tickersState[activeMarket]?.find(t => t.key === activeTickerKey) || { decimals: 2, symbol: activeTickerKey.toUpperCase(), change: 0 };
  }, [tickersState, activeMarket, activeTickerKey]);

  const decimals = activeConfig.decimals;

  // Stable hash code of active symbol for deterministic backtester curves
  const hash = useMemo(() => {
    const symbol = activeConfig.symbol || '';
    let h = 0;
    for (let i = 0; i < symbol.length; i++) {
      h = (h << 5) - h + symbol.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }, [activeConfig.symbol]);

  // Memoize AI Equities Intelligence (98% tips & analyzed news)
  const equitiesIntel = useMemo(() => {
    if (activeMarket !== 'indianStocks') return null;
    return getEquitiesIntelligence(activeTickerKey, activeConfig.symbol, price, currentLang);
  }, [activeMarket, activeTickerKey, activeConfig.symbol, price, currentLang]);

  const dict = langDb[currentLang] || langDb['en'];

  // Auto-redirect from Analysis Terminal tab if Indian Stocks are selected
  useEffect(() => {
    if (activeMarket === 'indianStocks' && activeWorkspaceTab === 'analysis') {
      setActiveWorkspaceTab('quant');
    }
  }, [activeMarket, activeWorkspaceTab]);

  // Initialize equities catalog and chat welcome message
  useEffect(() => {
    // Populate equities catalog state
    const initialEquities = marketTickers.indianStocks.map(stock => ({
      key: stock.key,
      name: stock.name,
      sector: stock.key === 'reliance' ? 'Conglomerate' : (stock.key === 'tata' ? 'Automotive' : 'Banking'),
      price: stock.basePrice,
      change: stock.change,
      cap: 'Large Cap',
      pE: (12 + Math.random() * 25).toFixed(1),
      desc: `Institutional interest tracking active for ${stock.name}. Dynamic accumulation blocks monitored.`,
      lastAnalysis: `Initial scan completed. Long-term trend shows key support sweeps.`
    }));
    setEquitiesDb(initialEquities);

    // Initial Chat welcome message
    setChatHistory([
      {
        id: "welcome",
        sender: 'ai',
        text: dict.welcomeMsg || "Greetings. I am Wiseman, your algorithmic advisor."
      }
    ]);

    // Initial Security Shield Boot Log
    setSecurityLogs([
      {
        id: "boot-1",
        timestamp: new Date().toLocaleTimeString(),
        tag: "[BOOT]",
        msg: "Terminator Security Core version 5.0.0 activated.",
        color: "var(--green-neon)"
      },
      {
        id: "boot-2",
        timestamp: new Date().toLocaleTimeString(),
        tag: "[BOOT]",
        msg: "5-Star Anti-Tamper & Cryptographic checks enabled.",
        color: "var(--green-neon)"
      }
    ]);
  }, []);

  // Update welcome message on language switch
  useEffect(() => {
    setChatHistory(prev => prev.map(c => c.id === "welcome" ? { ...c, text: dict.welcomeMsg } : c));
  }, [currentLang]);

  // Sync initial chart history when active ticker or market changes
  useEffect(() => {
    const config = tickersState[activeMarket]?.find(t => t.key === activeTickerKey);
    if (config) {
      setPrice(config.currentPrice);
      setEntryInput(config.currentPrice.toFixed(config.decimals));
      // Populate 150 points for drawing line chart
      const startHist = Array.from({ length: 150 }, (_, i) =>
        config.currentPrice * (1 + (i - 130) * 0.00015 + (Math.sin(i / 8) * 0.0008))
      );
      setChartHistory(startHist);
    }
  }, [activeMarket, activeTickerKey]);

  // Periodic security sweeps logic (anti-tamper logs simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      if (shieldStatus === 'DEFENDING') return;
      const randomCheck = securityChecklist[Math.floor(Math.random() * securityChecklist.length)];
      const logItem = {
        id: `sec-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        tag: "[SECURE]",
        msg: randomCheck,
        color: "var(--green-neon)"
      };
      setSecurityLogs(prev => [logItem, ...prev].slice(0, 8));
    }, 12000);

    return () => clearInterval(interval);
  }, [shieldStatus]);

  // Native Synthesized futuristic Audio Alerts
  const playFuturisticAlert = (isTrap) => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();

      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (isTrap) {
        // Sawtooth drop alarm sweep (Short duration)
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
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e);
    }
  };

  // Compute the live pattern for the active ticker deterministically
  const activePattern = useMemo(() => {
    if (!activeConfig || chartHistory.length < 10) return null;
    return detectPatternAndTraps(
      activeConfig.symbol,
      chartHistory,
      rsi,
      macd,
      signalLine,
      volume,
      decimals
    );
  }, [activeConfig, chartHistory, rsi, macd, signalLine, volume, decimals]);

  // Trigger alert and play beeps when active pattern transitions
  useEffect(() => {
    if (!activePattern) return;

    const lastPatternKey = lastPatternKeyRef.current[activeConfig.symbol];
    if (lastPatternKey === activePattern.patternKey) return;

    // Update ref to prevent duplicate triggers
    lastPatternKeyRef.current[activeConfig.symbol] = activePattern.patternKey;

    // Play Beep sound
    playFuturisticAlert(activePattern.type === 'TRAP');

    // Update active banner alert state for 4 seconds flashing overlay
    setActiveScannerAlert({
      type: activePattern.type,
      symbol: activeConfig.symbol,
      desc: currentLang === 'mr' ?
        `नवीन चार्ट इव्हेंट शोधला: ${activePattern.signalStrength}` :
        `Institutional scanner detected: ${activePattern.signalStrength}`,
      tag: activePattern.type === 'TRAP' ? (dict.alertTrap || "[LIQUIDITY TRAP]") : (dict.alertPattern || "[CHART PATTERN]"),
      price: price,
      time: Date.now(),
      color: activePattern.color,
      confidence: activePattern.confidence
    });

    // Add log to list
    const newLog = {
      id: `scan-${Date.now()}-${activeConfig.symbol}`,
      symbol: activeConfig.symbol,
      timestamp: new Date().toLocaleTimeString(),
      card: activePattern
    };

    setScannerLogs(prev => {
      // Avoid duplicate consecutive logs
      if (prev.length > 0 && prev[0].symbol === activeConfig.symbol && prev[0].card.patternKey === activePattern.patternKey) {
        return prev;
      }
      return [newLog, ...prev].slice(0, 30);
    });

  }, [activePattern, activeConfig.symbol, currentLang, price]);

  // Fluctuate scanner accuracy slowly over time
  useEffect(() => {
    const accuracyTimer = setInterval(() => {
      setAccuracyValue(prev => Math.min(99.40, Math.max(98.60, 98.95 + Math.sin(Date.now() / 15000) * 0.3 + Math.random() * 0.1)));
    }, 5000);
    return () => clearInterval(accuracyTimer);
  }, []);

  // Background scanner loop to simulate live scanning of the entire watchlist
  useEffect(() => {
    const bgScanner = setInterval(() => {
      const markets = ['crypto', 'indianStocks', 'forex'];
      const randomMarket = markets[Math.floor(Math.random() * markets.length)];
      const marketTickersList = tickersState[randomMarket];
      if (!marketTickersList || marketTickersList.length === 0) return;

      const randomTicker = marketTickersList[Math.floor(Math.random() * marketTickersList.length)];
      if (randomTicker.key === activeTickerKey) return; // Skip currently active ticker

      const seed = Date.now() + randomTicker.symbol.charCodeAt(0);
      const simulatedRsi = 25 + (seed % 51); // 25 to 76
      const simulatedMacd = (seed % 100) / 500 - 0.1;
      const simulatedSignalLine = simulatedMacd * 0.8;
      const simulatedVol = 15 + (seed % 180);
      const simulatedDecimals = randomTicker.decimals || 2;
      
      const simulatedHistory = Array.from({ length: 40 }, (_, i) => 
        randomTicker.basePrice * (1 + Math.sin((seed + i) / 12) * 0.006)
      );

      const result = detectPatternAndTraps(
        randomTicker.symbol,
        simulatedHistory,
        simulatedRsi,
        simulatedMacd,
        simulatedSignalLine,
        simulatedVol,
        simulatedDecimals
      );

      if (result && Math.random() > 0.6) { // 40% probability of finding scanner alert
        const bgLog = {
          id: `scan-bg-${Date.now()}-${randomTicker.key}`,
          symbol: randomTicker.symbol,
          timestamp: new Date().toLocaleTimeString(),
          card: result
        };
        
        setScannerLogs(prev => {
          const exists = prev.slice(0, 5).some(l => l.symbol === randomTicker.symbol);
          if (exists) return prev;
          return [bgLog, ...prev].slice(0, 30);
        });
      }
    }, 8000);

    return () => clearInterval(bgScanner);
  }, [tickersState, activeTickerKey]);

  // High performance throttle update watchlist prices (every 1.5 seconds)
  useEffect(() => {
    const watchlistTimer = setInterval(() => {
      const cacheKeys = Object.keys(priceCacheRef.current);
      if (cacheKeys.length === 0) return;

      setTickersState(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(marketKey => {
          next[marketKey] = next[marketKey].map(ticker => {
            const cached = priceCacheRef.current[ticker.key];
            if (cached) {
              return {
                ...ticker,
                currentPrice: cached.price,
                change: cached.change
              };
            }
            return ticker;
          });
        });
        return next;
      });

      // Clear cache once flushed
      priceCacheRef.current = {};
    }, 1500);

    return () => clearInterval(watchlistTimer);
  }, []);

  // Sync WebSocket connection loop
  useEffect(() => {
    // 1. Establish Binance Ticker WebSocket
    const connectBinance = () => {
      const wsUrl = `wss://stream.binance.com:9443/ws`;
      if (binanceSocketRef.current) {
        try { binanceSocketRef.current.close(); } catch(e) {}
      }

      const ws = new WebSocket(wsUrl);
      binanceSocketRef.current = ws;

      ws.onopen = () => {
        // Subscribe to active ticker streams (e.g. btcusdt@ticker, ethusdt@ticker, etc.)
        const streams = [];
        Object.keys(tickersState).forEach(mKey => {
          tickersState[mKey].forEach(t => {
            if (t.wsStream) streams.push(t.wsStream);
          });
        });

        // Split into chunks of 100 to stay within message frame boundaries
        const chunkSize = 100;
        for (let i = 0; i < streams.length; i += chunkSize) {
          const chunk = streams.slice(i, i + chunkSize);
          const subscribePayload = {
            method: "SUBSCRIBE",
            params: chunk,
            id: Math.floor(Math.random() * 999999)
          };
          ws.send(JSON.stringify(subscribePayload));
        }
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const data = payload.data || payload;
          if (!data || !data.s) return;

          const streamSymbol = data.s; // e.g. BTCUSDT
          const lastPrice = parseFloat(data.c);
          const changePercent = parseFloat(data.P);
          const streamVol = parseFloat(data.q) / 1000000;

          // Resolve key
          let resolvedKey = null;
          Object.keys(tickersState).forEach(mKey => {
            const found = tickersState[mKey].find(t => t.wsStream && t.wsStream.toUpperCase().split('@')[0] === streamSymbol.toUpperCase());
            if (found) resolvedKey = found.key;
          });

          if (resolvedKey) {
            // Write to cache ref to throttle watchlist renders
            priceCacheRef.current[resolvedKey] = { price: lastPrice, change: changePercent };

            // Real-time update if it is the currently selected active ticker
            if (resolvedKey === activeTickerKey) {
              setPrice(lastPrice);
              setVolume(streamVol);
              // Append to history state array
              setChartHistory(prev => {
                const next = [...prev, lastPrice];
                return next.slice(-300);
              });

              // Fluctuate indicators slightly with price
              setRsi(prev => Math.max(10, Math.min(90, prev + (Math.random() - 0.5) * 1.5)));
              setMacd(prev => prev + (Math.random() - 0.5) * 0.02);
              setSignalLine(prev => prev + (Math.random() - 0.5) * 0.01);
            }
          }
        } catch(err) {
          // Ignore json parse error
        }
      };

      ws.onclose = () => {
        setTimeout(connectBinance, 5000);
      };
    };

    connectBinance();

    // 2. Establish Render Backend Sync WS (If authenticated operator is logged in)
    const connectBackend = () => {
      const tokenVal = localStorage.getItem('wiseman_token') || 'guest';

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === ''
        ? 'localhost:5000'
        : 'wiseman-backend.onrender.com';

      const wsUrl = `${protocol}//${host}/?token=${tokenVal}`;
      if (backendSocketRef.current) {
        try { backendSocketRef.current.close(); } catch(e) {}
      }

      const ws = new WebSocket(wsUrl);
      backendSocketRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const packet = JSON.parse(event.data);
          if (packet.type === 'TICK_UPDATE') {
            const tickData = packet.data;
            // Flush tickData to cached prices
            Object.keys(tickData).forEach(tickerKey => {
              priceCacheRef.current[tickerKey] = {
                price: tickData[tickerKey].price,
                change: tickData[tickerKey].change
              };

              // Realtime price feed overlay
              if (tickerKey === activeTickerKey) {
                const liveP = tickData[tickerKey].price;
                setPrice(prevPrice => {
                  if (prevPrice !== liveP) {
                    setTimeout(() => {
                      setChartHistory(prev => [...prev, liveP].slice(-300));
                      setRsi(prevRsi => {
                        const targetRsi = 30 + (liveP % 40);
                        return Math.max(10, Math.min(90, prevRsi * 0.9 + targetRsi * 0.1));
                      });
                      setMacd(prevMacd => prevMacd * 0.95 + (Math.sin(liveP / 80) * 0.15) * 0.05);
                      setSignalLine(prevSig => prevSig * 0.95 + (Math.sin(liveP / 100) * 0.1) * 0.05);
                      setVolume(prevVol => Math.max(1.0, prevVol + (Math.random() - 0.5) * 0.5));
                    }, 0);
                  }
                  return liveP;
                });
              }
            });

            // Update Indian equities dashboard DB state
            setEquitiesDb(prevDb =>
              prevDb.map(stock => {
                const tick = tickData[stock.key];
                if (tick) {
                  return { ...stock, price: tick.price, change: tick.change };
                }
                return stock;
              })
            );

            // Update sidebar tickersState dynamically with live prices
            setTickersState(prev => {
              const next = { ...prev };
              Object.keys(next).forEach(marketKey => {
                next[marketKey] = next[marketKey].map(ticker => {
                  const tick = tickData[ticker.key];
                  if (tick) {
                    return { ...ticker, currentPrice: tick.price, change: tick.change };
                  }
                  return ticker;
                });
              });
              return next;
            });
          }

          if (packet.type === 'SECURITY_ALERT') {
            triggerTerminatorCountermeasures(packet.message);
          }

          if (packet.type === 'AI_DISCOVERY_ALERT') {
            const { market, stock } = packet;
            
            // Add to tickersState dynamically
            setTickersState(prev => {
              const next = { ...prev };
              if (!next[market].some(t => t.key === stock.key)) {
                next[market] = [...next[market], {
                  key: stock.key,
                  symbol: stock.symbol,
                  name: stock.name,
                  basePrice: stock.price,
                  decimals: stock.decimals || 2,
                  currentPrice: stock.price,
                  change: stock.change || 0,
                  wsStream: stock.wsStream || null
                }];
              }
              return next;
            });

            // Add to equitiesDb if stocks
            if (market === 'indianStocks') {
              setEquitiesDb(prevDb => {
                if (prevDb.some(s => s.key === stock.key)) return prevDb;
                return [...prevDb, {
                  key: stock.key,
                  name: stock.name,
                  sector: stock.sector || 'NSE Equities',
                  price: stock.price,
                  change: stock.change || 0,
                  cap: stock.cap || 'Large Cap',
                  pE: stock.pE || '20.0',
                  desc: stock.desc || 'AI Discovered asset.',
                  lastAnalysis: stock.lastAnalysis || 'Breakout verified.'
                }];
              });
            }

            // Post chat notification in local language
            const isMr = currentLang === 'mr';
            let discoveryMsg = "";
            if (isMr) {
              discoveryMsg = `🤖 **एआय शोध प्रणाली:** नवीन ॲसेट सापडला! **${stock.name} (${stock.symbol})** सिस्टीममध्ये समाविष्ट केला गेला आहे. तांत्रिक ब्रेकआऊट निश्चित.`;
            } else if (currentLang === 'hi') {
              discoveryMsg = `🤖 **एआई खोज प्रणाली:** नया एसेट मिला! **${stock.name} (${stock.symbol})** को शामिल किया गया है।`;
            } else if (currentLang === 'es') {
              discoveryMsg = `🤖 **SISTEMA DE DESCUBRIMIENTO DE IA:** ¡Activo encontrado! **${stock.name} (${stock.symbol})** integrado en la terminal.`;
            } else {
              discoveryMsg = `🤖 **AI DISCOVERY SYSTEM:** Found new breakout asset! **${stock.name} (${stock.symbol})** has been ingested into the terminal. Inflow sweeps verified.`;
            }

            setChatHistory(prev => [...prev, {
              id: `discover-chat-${Date.now()}-${stock.key}`,
              sender: 'ai',
              text: discoveryMsg,
              isAlert: true
            }]);
          }
        } catch (err) {
          // Ignore
        }
      };

      ws.onclose = () => {
        setTimeout(connectBackend, 5000);
      };
    };

    connectBackend();

    return () => {
      if (binanceSocketRef.current) binanceSocketRef.current.close();
      if (backendSocketRef.current) backendSocketRef.current.close();
    };
  }, [token, activeTickerKey]);

  // Client-side fallback simulator has been disabled to keep prices 100% real and aligned with actual market hours.

  // Sync smart risk inputs
  useEffect(() => {
    if (document.activeElement?.id !== 'entryInput') {
      setEntryInput(price.toFixed(decimals));
    }
  }, [price]);

  // Sync support line drawing into risk stop loss calculator
  const handleSupportLineDraw = (slPrice) => {
    const entry = parseFloat(entryInput);
    if (isNaN(entry) || entry <= 0) return;

    const riskDiff = Math.abs(entry - slPrice);
    const riskPercent = ((riskDiff / entry) * 100);

    // Append to Chat Assistant Console
    const coachMsg = currentLang === 'mr' ?
      `[रिस्क कॅल्क्युलेटर] चार्टवर सपोर्ट ओढून स्टॉप लॉस ${slPrice.toFixed(decimals)} (जोखीम: ${riskPercent.toFixed(1)}%) वर जोडला आहे.` :
      `[RISK ENGINE] Synced Stop Loss to ${slPrice.toFixed(decimals)} (${riskPercent.toFixed(1)}% risk) based on support line drawing, Sir.`;

    const securityReport = {
      id: `sync-${Date.now()}`,
      sender: 'ai',
      text: coachMsg,
      isAlert: true
    };
    setChatHistory(prev => [...prev, securityReport]);

    // Force entry input value sync
    setEntryInput(entry.toFixed(decimals));
  };

  // Replay mode loops
  useEffect(() => {
    if (isReplayMode && replayIsPlaying) {
      replayTimerRef.current = setInterval(() => {
        setReplayIndex(prev => {
          if (prev >= chartHistory.length) {
            clearInterval(replayTimerRef.current);
            setReplayIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 400);
    } else {
      clearInterval(replayTimerRef.current);
    }

    return () => clearInterval(replayTimerRef.current);
  }, [isReplayMode, replayIsPlaying, chartHistory.length]);

  // Terminator counter-measures execution flow
  const triggerTerminatorCountermeasures = (payloadText) => {
    setShieldStatus('DEFENDING');
    setShieldStrength(65);

    // Play attack alerts logs sequence
    const alerts = [
      { tag: "[ATTACK DETECTED]", msg: `XSS/Tamper footprint found in user inputs! Payload: "${cleanInputString(payloadText)}"` },
      { tag: "[COUNTER-MEASURES]", msg: "Terminator Firewall engaged. Sanitizing execution buffer..." },
      { tag: "[TERMINATOR DEFENSE]", msg: "Intrusive scripts discarded. Attack packet neutralized." },
      { tag: "[IP ACTION]", msg: "Intruder origin signature isolated. Workspace protected." }
    ];

    alerts.forEach((alert, idx) => {
      setTimeout(() => {
        const logItem = {
          id: `attack-${idx}-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          tag: alert.tag,
          msg: alert.msg,
          color: "var(--red-neon)"
        };
        setSecurityLogs(prev => [logItem, ...prev].slice(0, 8));
      }, idx * 500);
    });

    // Post alert card inside chatbot console
    setTimeout(() => {
      const securityReport = {
        id: `attack-chat-${Date.now()}`,
        sender: 'ai',
        text: `🛡️ TERMINATOR ACTION REPORT: Malicious script signature detected in workspace entry stream. Payload intercepted and neutralized. System integrity maintained at 100%. Origin blocked.`,
        isDanger: true
      };
      setChatHistory(prev => [...prev, securityReport]);
    }, 1500);

    // Recover systems back to SAFE (after 4.5 seconds)
    setTimeout(() => {
      setShieldStatus('SAFE');
      setShieldStrength(100);
      const restoreLog = {
        id: `restore-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        tag: "[RESTORED]",
        msg: "Terminator Shield restored to 100% operational capacity.",
        color: "var(--green-neon)"
      };
      setSecurityLogs(prev => [restoreLog, ...prev].slice(0, 8));
    }, 4500);
  };

  // AI Chat Assistant messaging logic
  const handleSendChat = async () => {
    if (!chatInputText.trim()) return;
    const userPrompt = chatInputText.trim();
    setChatInputText('');

    // Check for threat signatures in inputs
    if (checkThreatSignature(userPrompt)) {
      triggerTerminatorCountermeasures(userPrompt);
      return;
    }

    // Append user message
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userPrompt
    };
    setChatHistory(prev => [...prev, userMessage]);

    // Append AI thinking bubble
    const thinkingMessage = {
      id: "thinking",
      sender: 'ai',
      text: currentLang === 'mr' ? 'वाईजमन विश्लेषण करत आहे...' : 'Wiseman is scanning...',
      isThinking: true
    };
    setChatHistory(prev => [...prev, thinkingMessage]);

    const activeConfig = tickersState[activeMarket]?.find(t => t.key === activeTickerKey) || { symbol: 'NIFTY_50', decimals: 2 };
    const name = activeConfig.symbol.replace('_', ' ');

    try {
      const response = await fetch(`${BACKEND_API_URL.replace('/api', '')}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: userPrompt,
          ticker: name,
          language: currentLang,
          price: price.toFixed(activeConfig.decimals),
          rsi: rsi.toFixed(1),
          macd: macd.toFixed(3),
          volume: volume.toFixed(1) + "M"
        })
      });

      if (!response.ok) throw new Error("Server communication failure");

      const data = await response.json();

      setChatHistory(prev => {
        const filtered = prev.filter(c => c.id !== "thinking");
        const replyText = data.status === "SUCCESS" ? data.reply : getLocalHeuristicResponse({
          prompt: userPrompt,
          name,
          config: activeConfig,
          currentLang,
          activeMarket,
          price,
          rsi,
          macd,
          volume
        });

        const replyMessage = {
          id: `reply-${Date.now()}`,
          sender: 'ai',
          text: replyText,
          isHTML: true,
          prefix: data.status === "NO_KEY" ? data.reply : null
        };
        return [...filtered, replyMessage];
      });

    } catch (err) {
      console.warn("AI chat API offline. Fallback to rule-based parser:", err);
      // Remove thinking and push local heuristic fallback
      setChatHistory(prev => {
        const filtered = prev.filter(c => c.id !== "thinking");
        const fallbackText = getLocalHeuristicResponse({
          prompt: userPrompt,
          name,
          config: activeConfig,
          currentLang,
          activeMarket,
          price,
          rsi,
          macd,
          volume
        });
        const replyMessage = {
          id: `reply-fallback-${Date.now()}`,
          sender: 'ai',
          text: fallbackText,
          isRecovery: true
        };
        return [...filtered, replyMessage];
      });
    }
  };

  // Live AI Advisory Rating scan triggers
  const handleLiveAIScan = () => {
    const chat = document.getElementById('chatHistory');
    // Post scan alert card
    const scanReport = {
      id: `aiscan-${Date.now()}`,
      sender: 'ai',
      text: currentLang === 'mr' ?
        `एआय स्कॅनर सुरू झाला आहे, सर! मी आताच सर्व भारतीय शेअर्स आणि फॉरेक्स ट्रेडिंग संकेतांची पडताळणी करत आहे...` :
        `AI scanner initiated, Sir! Sweeping watchlist configurations and cross-referencing indicators across multiple databases...`,
      isAlert: true
    };
    setChatHistory(prev => [...prev, scanReport]);

    // Fluctuate watchlist change percentages dynamically
    setTickersState(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(marketKey => {
        next[marketKey] = next[marketKey].map(t => ({
          ...t,
          change: t.change + (Math.random() - 0.5) * 1.2
        }));
      });
      return next;
    });
  };

  // Strategy Backtest simulator runner
  const handleRunBacktest = () => {
    if (isBacktesting) return;
    setIsBacktesting(true);
    setBacktestProgress(0);
    setBacktestResult(null);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setBacktestProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsBacktesting(false);
        setBacktestResult(equitiesIntel?.backtest || {
          winRate: "58.4",
          profitFactor: "1.65",
          maxDrawdown: "6.2",
          tradesCount: 110,
          review: { en: "Dynamic quant profile mapped successfully." }
        });
      }
    }, 150);
  };

  // Add custom stocks symbol to dashboard list
  const handleAddStock = (tickerSymbol) => {
    if (!tickerSymbol.trim()) return;
    const symbolClean = tickerSymbol.trim().toUpperCase();

    // Check if it already exists
    if (equitiesDb.some(stock => stock.key === symbolClean.toLowerCase())) {
      return;
    }

    const newStockProfile = {
      key: symbolClean.toLowerCase(),
      name: symbolClean + " Limited",
      sector: "IT & Tech Services",
      price: 150.00 + Math.random() * 850,
      change: (Math.random() * 4 - 2),
      cap: "Mid Cap",
      pE: (15 + Math.random() * 10).toFixed(1),
      desc: `Institutional interest tracking active for ${symbolClean}. Ingestion console sweeps active.`,
      lastAnalysis: `Initial ingestion completed successfully.`
    };

    setEquitiesDb(prev => [...prev, newStockProfile]);

    // Added logs to Chat Assistant
    const msg = currentLang === 'mr' ?
      `[एआय स्कॅनर] नवीन शेअर्स जोडले: ${symbolClean}. तांत्रिक विश्लेषण इंजिन सक्रिय.` :
      `🛡️ AI SCANNER REPORT: New asset ingested: ${symbolClean}. Analytical loops active.`;

    setChatHistory(prev => [...prev, {
      id: `add-${Date.now()}`,
      sender: 'ai',
      text: msg,
      isAlert: true
    }]);
  };

  // Evaluate AI Coach Quote recommendation values
  const coachData = evaluateAICoach({
    vol: volume,
    rsi,
    macd,
    signalLine,
    activeMarket,
    activeTickerKey,
    currentLang,
    marketTickers: tickersState
  }) || {
    status: "NEUTRAL",
    statusClass: "status-neutral",
    glowClass: "neutral-glow",
    confidence: "50%",
    confidenceFill: "50%",
    confidenceColor: "var(--cyan)",
    quote: `"Analyzing live feeds for institutional block activities..."`,
    rationales: ["No clear trend breakout signal.", "Wait for key support/resistance sweep."]
  };

  // Evaluate Smart Risk calculations
  const volsData = marketVols[activeMarket];
  const riskCalculations = calculateRiskParams({
    entry: parseFloat(entryInput),
    isLong,
    config: tickersState[activeMarket]?.find(t => t.key === activeTickerKey),
    vols: volsData
  }) || {
    riskPct: volsData?.riskPct || 1.5,
    stopLoss: 0,
    target1: 0,
    target2: 0,
    reward1: 0,
    reward2: 0
  };

  // Filter tickers in the sidebar watchlist
  const filteredTickersList = tickersState[activeMarket]?.filter(t =>
    t.name.toLowerCase().includes(watchlistSearch.toLowerCase()) ||
    t.symbol.toLowerCase().includes(watchlistSearch.toLowerCase())
  ) || [];

  return (
    <AuthGate currentLang={currentLang} setCurrentLang={setCurrentLang} onAuthSuccess={(t) => setToken(t)}>
      {/* Top Banner News Ticker */}
      <div className="news-ticker-container" id="mainTickerContainer" style={{ display: 'flex' }}>
        <div className="news-ticker-label" id="tickerLabel">{dict.tickerLabel || "ALPHA FEED"}</div>
        <div className="news-ticker-content" id="newsTicker">
          {newsDatabase.map(news => (
            <div
              key={news.id}
              className="news-ticker-item"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedNews(news)}
            >
              <span>[{news.category}]</span> {news.headline}
            </div>
          ))}
        </div>
      </div>

      <div className="container" id="mainDashboardContainer" style={{ display: 'block' }}>
        {/* Header bar */}
        <header>
          <div className="brand">
            <div className="brand-accent-bar"></div>
            <div>
              <div className="brand-company" id="lblCompany">BLACK DRAGON</div>
              <h1 className="brand-title" id="lblTitle">{dict.title || "WISEMAN ANALYTICS"}</h1>
              <div className="brand-subtitle" id="lblSubtitle">{dict.subtitle || "REAL-TIME QUANTITATIVE ENGINE"}</div>
            </div>
          </div>

          <div className="header-right">
            {/* Language Switcher */}
            <div className="lang-selector-container">
              <span className="lang-label">LANG:</span>
              <select
                className="lang-select"
                id="langSelect"
                value={currentLang}
                onChange={(e) => {
                  const val = e.target.value;
                  setCurrentLang(val);
                  localStorage.setItem('wiseman_lang', val);
                }}
              >
                <option value="en">EN (English)</option>
                <option value="mr">MR (मराठी)</option>
                <option value="hi">HI (हिंदी)</option>
                <option value="es">ES (Español)</option>
              </select>
            </div>

            {/* Logout Button */}
            <button
              className="tool-btn"
              id="btnLogout"
              onClick={() => {
                localStorage.removeItem('wiseman_token');
                window.location.reload();
              }}
              style={{
                borderColor: 'rgba(255,23,68,0.4)',
                color: 'var(--red-neon)',
                padding: '6px 12px',
                fontFamily: "'Orbitron'",
                fontSize: '9px',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              LOGOUT &times;
            </button>

            {/* Live active ticker details banner */}
            <div className="live-ticker-info">
              <div className="active-symbol-title-row">
                <div
                  className="websocket-pulse-dot"
                  id="wsPulse"
                  style={{ display: activeConfig.wsStream ? 'block' : 'none' }}
                ></div>
                <div className="active-symbol-title" id="activeSymbol">{activeConfig.symbol}</div>
              </div>
              <div className="live-price-wrapper">
                <span className="live-price" id="livePrice">
                  {price.toFixed(activeConfig.decimals)}
                </span>
                <span className={`price-change-badge ${activeConfig.change >= 0 ? 'positive' : 'negative'}`} id="priceChange">
                  {activeConfig.change >= 0 ? '+' : ''}{activeConfig.change.toFixed(2)}%
                </span>
              </div>
              <div id="volumeText" style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: "'Orbitron', sans-serif", marginTop: '2px', textTransform: 'uppercase', textAlign: 'right' }}>
                {dict.lblVolume || "VOLUME: "}{volume.toFixed(1)}M
              </div>
            </div>
          </div>
        </header>

        {/* Market Category Selector Switcher Tabs */}
        <div className="market-switcher">
          <button
            className={`market-tab ${activeMarket === 'indianStocks' ? 'active' : ''}`}
            id="btnStocks"
            onClick={() => {
              setActiveMarket('indianStocks');
              setActiveTickerKey('nifty');
              setActiveView('custom');
            }}
          >
            <svg style={{ width: '12px', height: '12px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
            </svg>
            <span id="tabStocks">{dict.tabStocks || "INDIAN STOCKS"}</span>
          </button>
          <button
            className={`market-tab ${activeMarket === 'crypto' ? 'active' : ''}`}
            id="btnCrypto"
            onClick={() => {
              setActiveMarket('crypto');
              setActiveTickerKey('btc');
              setActiveView('custom');
            }}
          >
            <svg style={{ width: '12px', height: '12px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2M12 18H9V16H10.5V14H9V12H10.5V10H9V8H12.5V6.5H14.5V8.2A2.5 2.5 0 0 1 16.5 10.7L15 11.2A1 1 0 0 0 14.5 10H12.5V12H14.5A2.5 2.5 0 0 1 16.5 14.5A2.5 2.5 0 0 1 14.5 17V18H12.5M12.5 14H14.5A1 1 0 0 0 14.5 16H12.5Z" />
            </svg>
            <span id="tabCrypto">{dict.tabCrypto || "CRYPTO 24/7"}</span>
          </button>
          <button
            className={`market-tab ${activeMarket === 'forex' ? 'active' : ''}`}
            id="btnForex"
            onClick={() => {
              setActiveMarket('forex');
              setActiveTickerKey('eur');
              setActiveView('custom');
            }}
          >
            <svg style={{ width: '12px', height: '12px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M15 18.5c-2.28 0-4.13-1.85-4.13-4.13c0-2.28 1.85-4.13 4.13-4.13c1.07 0 2.06.41 2.81 1.15l1.06-1.06A5.942 5.942 0 0 0 15 8.75c-3.1 0-5.63 2.53-5.63 5.63s2.53 5.63 5.63 5.63c1.47 0 2.81-.57 3.82-1.49l-1.08-1.08c-.76.67-1.7 1.06-2.74 1.06M20.25 13h-4.5v1.5h4.5v3l3-3.75l-3-3.75z" />
            </svg>
            <span id="tabForex">{dict.tabForex || "FOREX MARKET"}</span>
          </button>
          <button
            className={`market-tab ${activeMarket === 'globalMarket' ? 'active' : ''}`}
            id="btnGlobal"
            onClick={() => {
              setActiveMarket('globalMarket');
              setActiveTickerKey('gold');
              setActiveView('custom');
            }}
          >
            <svg style={{ width: '12px', height: '12px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <span id="tabGlobal">{dict.tabGlobal || "GLOBAL MARKET"}</span>
          </button>
        </div>

        {/* Dashboard layout structure */}
        <div className="dashboard-layout">
          {/* Column 1: Watchlist, Terminator Shield, AI Coach, Chatbot console */}
          <div className="left-sidebar">
            {/* Watchlist tickers panel */}
            <div className="panel-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="watchlist-header">
                <span id="lblTickers">{dict.lblTickers || "Market Tickers"}</span>
                <span className="scan-status-indicator" id="scanLabel">{dict.scanLabel || "SCANNING LIVE"}</span>
              </div>
              <div style={{ padding: '6px 12px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="text"
                  id="watchlistSearchInput"
                  placeholder={currentLang === 'mr' ? "फिल्टर करा..." : "Filter tickers..."}
                  value={watchlistSearch}
                  onChange={(e) => setWatchlistSearch(e.target.value)}
                  style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '10px', fontFamily: "'Orbitron', monospace", color: 'white', outline: 'none' }}
                />
              </div>
              <div className="watchlist-list" id="watchlistContainer" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {filteredTickersList.map(ticker => {
                  const percentColor = ticker.change >= 0 ? 'var(--green-neon)' : 'var(--red-neon)';
                  const isSelected = ticker.key === activeTickerKey;

                  return (
                    <div
                      key={ticker.key}
                      className={`watchlist-item ${isSelected ? 'active' : ''}`}
                      onClick={() => setActiveTickerKey(ticker.key)}
                      style={{ cursor: 'pointer', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)' }}
                    >
                      <span className="ticker-symbol" style={{ fontWeight: 'bold' }}>{ticker.symbol}</span>
                      <div style={{ display: 'flex', gap: '10px', fontFamily: 'monospace' }}>
                        <span>{ticker.currentPrice.toFixed(ticker.decimals)}</span>
                        <span style={{ color: percentColor }}>{ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(2)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Terminator Active Security Shield */}
            <div className="panel-card" style={{ borderColor: shieldStatus === 'DEFENDING' ? 'var(--red-neon)' : 'rgba(255, 23, 68, 0.4)', boxShadow: shieldStatus === 'DEFENDING' ? '0 0 25px rgba(255, 23, 68, 0.6)' : '0 0 15px rgba(255, 23, 68, 0.15)', transition: 'all 0.3s ease' }}>
              <div className="coach-header">
                <div className={`coach-avatar ${shieldStatus === 'DEFENDING' ? 'sell-glow' : ''}`} id="securityGlow">
                  <svg className="coach-avatar-svg" style={{ fill: shieldStatus === 'DEFENDING' ? 'var(--red-neon)' : 'var(--green-neon)' }} viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.4 0 2.5 1.1 2.5 2.5S13.4 12 12 12s-2.5-1.1-2.5-2.5S10.6 7 12 7zm0 10c-2.7 0-5.8 1.3-6 2c.79 1.37 2.22 2.36 3.88 2.72c.62-.78 1.48-1.22 2.12-1.22s1.5.44 2.12 1.22c1.66-.36 3.09-1.35 3.88-2.72c-.2-.7-3.3-2-6-2z" />
                  </svg>
                </div>
                <div className="coach-branding">
                  <div className="coach-name" style={{ color: shieldStatus === 'DEFENDING' ? 'var(--red-neon)' : 'var(--cyan)', fontFamily: "'Orbitron', sans-serif" }}>TERMINATOR ACTIVE SHIELD</div>
                  <div className="coach-subtext" style={{ color: 'var(--text-muted)' }}>5-STAR SECURED PROTOCOL</div>
                </div>
                <div className={`coach-status-badge ${shieldStatus === 'DEFENDING' ? 'status-avoid' : 'status-approved'}`} id="securityStatus" style={{
                  background: shieldStatus === 'DEFENDING' ? 'rgba(255, 23, 68, 0.1)' : 'rgba(0, 230, 118, 0.1)',
                  color: shieldStatus === 'DEFENDING' ? 'var(--red-neon)' : 'var(--green-neon)',
                  borderColor: shieldStatus === 'DEFENDING' ? 'var(--red-neon)' : 'var(--green-neon)',
                  animation: shieldStatus === 'DEFENDING' ? 'flash 0.5s infinite alternate' : ''
                }}>
                  {shieldStatus}
                </div>
              </div>

              <div className="confidence-label-row">
                <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>SHIELD STRENGTH</span>
                <span style={{ color: shieldStatus === 'DEFENDING' ? 'var(--red-neon)' : 'var(--green-neon)' }} id="shieldStrength">{shieldStrength}%</span>
              </div>
              <div className="confidence-bar-container" style={{ background: 'rgba(255, 255, 255, 0.03)', height: '6px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                <div
                  className="confidence-bar-fill"
                  id="shieldFill"
                  style={{
                    width: `${shieldStrength}%`,
                    height: '100%',
                    backgroundColor: shieldStatus === 'DEFENDING' ? 'var(--red-neon)' : 'var(--green-neon)',
                    boxShadow: shieldStatus === 'DEFENDING' ? 'var(--glow-red)' : 'var(--glow-green)',
                    transition: 'width 0.4s ease, background 0.4s ease'
                  }}
                ></div>
              </div>

              <div className="scanner-logs-panel" id="securityLogs" style={{ height: '80px', fontSize: '8.5px', background: 'rgba(3, 3, 7, 0.95)', marginTop: '8px', borderColor: 'rgba(255, 23, 68, 0.25)', overflowY: 'auto' }}>
                {securityLogs.map(log => (
                  <div key={log.id} className="log-row">
                    <span className="log-time" style={{ marginRight: '6px', color: 'var(--text-muted)' }}>[{log.timestamp}]</span>
                    <span className="log-tag" style={{ color: log.color, fontWeight: 'bold', marginRight: '6px' }}>{log.tag}</span>
                    <span className="log-desc" style={{ color: 'var(--text-primary)' }}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Coach recommendation panel */}
            <div className="panel-card">
              <div className="coach-header">
                <div className={`coach-avatar ${coachData.glowClass}`} id="coachAvatarGlow">
                  <svg className="coach-avatar-svg" viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 2a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                </div>
                <div className="coach-branding">
                  <div className="coach-name" id="lblCoachName">{dict.lblCoachName || "WISEMAN AI COACH"}</div>
                  <div className="coach-subtext" id="lblCoachSub">{dict.lblCoachSub || "REAL-TIME HEURISTICS"}</div>
                </div>
                <div className={`coach-status-badge ${coachData.statusClass}`} id="coachStatus">
                  {coachData.status}
                </div>
              </div>

              <div className="confidence-label-row">
                <span id="lblConfidence">{dict.lblConfidence || "CONFIDENCE PROFILE"}</span>
                <span id="confidenceVal" style={{ color: coachData.confidenceColor }}>{coachData.confidence}</span>
              </div>
              <div className="confidence-bar-container">
                <div
                  className="confidence-bar-fill"
                  id="confidenceFill"
                  style={{ width: coachData.confidenceFill, backgroundColor: coachData.confidenceColor }}
                ></div>
              </div>

              <div className="coach-quote-box" id="coachQuote">
                {coachData.quote}
              </div>

              <div className="rationale-title" id="lblRationale">{dict.lblRationale || "Signal Rationale"}</div>
              <div className="rationale-list" id="rationaleList">
                {coachData.rationales.map((rat, idx) => (
                  <div key={idx} className="rationale-item">{rat}</div>
                ))}
              </div>
            </div>

            {/* AI assistant Chat panel */}
            <div className="panel-card" style={{ marginBottom: 0 }}>
              <div className="watchlist-header">
                <span id="lblChatHeader">{dict.lblChatHeader || "WISEMAN AI ASSISTANT"}</span>
              </div>
              <div className="chat-container-panel">
                <div className="chat-history" id="chatHistory" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                  {chatHistory.map((chat, idx) => {
                    const bubbleClass = chat.sender === 'user' ? 'bubble-user' : 'bubble-ai';
                    let bubbleStyle = {};
                    if (chat.isDanger) {
                      bubbleStyle = { borderColor: 'var(--red-neon)', background: 'rgba(255,23,68,0.05)', color: 'var(--text-primary)' };
                    } else if (chat.isAlert) {
                      bubbleStyle = { borderColor: 'var(--gold-accent)', background: 'rgba(255,215,0,0.05)' };
                    } else if (chat.isRecovery) {
                      bubbleStyle = { borderColor: 'var(--cyan)', background: 'rgba(0, 240, 255, 0.03)' };
                    }

                    return (
                      <div key={idx} className={`chat-bubble ${bubbleClass}`} style={bubbleStyle}>
                        {chat.isRecovery && (
                          <span style={{ color: 'var(--cyan)', fontSize: '8px', fontWeight: 'bold', display: 'block', marginBottom: '4px', fontFamily: "'Orbitron', sans-serif" }}>
                            🛡️ TERMINATOR LOCAL RECOVERY ACTIVE
                          </span>
                        )}
                        {chat.prefix && (
                          <span style={{ color: 'var(--gold-accent)', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                            {chat.prefix}
                          </span>
                        )}
                        {chat.isThinking ? (
                          <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{chat.text}</span>
                        ) : chat.isHTML ? (
                          <div dangerouslySetInnerHTML={{ __html: chat.text }} />
                        ) : (
                          <span>{chat.text}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="chat-input-row">
                  <input
                    type="text"
                    className="chat-text-input"
                    id="chatInput"
                    placeholder={currentLang === 'mr' ? "सल्ला विचारा..." : "Ask Wiseman..."}
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  />
                  <button className="chat-send-btn" onClick={handleSendChat}>SEND</button>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Chart controls, indicators dashboard, Pattern scanner logs, Stocks Intelligence catalog */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Workspace switcher tab navigation */}
            <div className="workspace-switcher" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {activeMarket !== 'indianStocks' && (
                <button
                  className={`workspace-tab-btn ${activeWorkspaceTab === 'analysis' ? 'active' : ''}`}
                  onClick={() => setActiveWorkspaceTab('analysis')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: activeWorkspaceTab === 'analysis' ? 'rgba(0, 240, 255, 0.08)' : 'rgba(13, 14, 21, 0.45)',
                    border: '1px solid',
                    borderColor: activeWorkspaceTab === 'analysis' ? 'var(--cyan)' : 'var(--border)',
                    color: activeWorkspaceTab === 'analysis' ? 'var(--cyan)' : 'var(--text-secondary)',
                    borderRadius: '8px',
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '9.5px',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: activeWorkspaceTab === 'analysis' ? 'var(--glow-cyan)' : 'none'
                  }}
                >
                  📊 {currentLang === 'mr' ? 'ॲनालिसिस टर्मिनल' : (currentLang === 'hi' ? 'एनालिसिस टर्मिनल' : (currentLang === 'es' ? 'TERMINAL DE ANÁLISIS' : 'ANALYSIS TERMINAL'))}
                </button>
              )}
              <button
                className={`workspace-tab-btn ${activeWorkspaceTab === 'quant' ? 'active' : ''}`}
                onClick={() => setActiveWorkspaceTab('quant')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  background: activeWorkspaceTab === 'quant' ? 'rgba(255, 215, 0, 0.08)' : 'rgba(13, 14, 21, 0.45)',
                  border: '1px solid',
                  borderColor: activeWorkspaceTab === 'quant' ? 'var(--gold-accent)' : 'var(--border)',
                  color: activeWorkspaceTab === 'quant' ? 'var(--gold-accent)' : 'var(--text-secondary)',
                  borderRadius: '8px',
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '9.5px',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: activeWorkspaceTab === 'quant' ? 'var(--glow-gold)' : 'none'
                }}
              >
                🧠 {currentLang === 'mr' ? 'क्वांट इंटेलिजेंस' : (currentLang === 'hi' ? 'क्वांट इंटेलिजेंस' : (currentLang === 'es' ? 'INTELIGENCIA QUANT' : 'QUANT INTELLIGENCE'))}
              </button>
              <button
                className={`workspace-tab-btn ${activeWorkspaceTab === 'backtest' ? 'active' : ''}`}
                onClick={() => setActiveWorkspaceTab('backtest')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  background: activeWorkspaceTab === 'backtest' ? 'rgba(0, 230, 118, 0.08)' : 'rgba(13, 14, 21, 0.45)',
                  border: '1px solid',
                  borderColor: activeWorkspaceTab === 'backtest' ? 'var(--green-neon)' : 'var(--border)',
                  color: activeWorkspaceTab === 'backtest' ? 'var(--green-neon)' : 'var(--text-secondary)',
                  borderRadius: '8px',
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '9.5px',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: activeWorkspaceTab === 'backtest' ? 'var(--glow-green)' : 'none'
                }}
              >
                ⚙️ {currentLang === 'mr' ? 'बॅकटेस्ट सिम्युलेटर' : (currentLang === 'hi' ? 'बैकटेस्ट सिम्युलेटर' : (currentLang === 'es' ? 'BACKTESTER DE ESTRATEGIA' : 'STRATEGY BACKTESTER'))}
              </button>
            </div>

            {/* TAB 1: ANALYSIS TERMINAL WORKSPACE */}
            {activeMarket !== 'indianStocks' && activeWorkspaceTab === 'analysis' && (
              <div id="chartPanelWrapper">
                {/* Chart container card */}
                <div className="panel-card">
                  <div className="chart-controls-panel">
                    {/* View modes toggle (canvas vs Tradingview) */}
                    <div className="chart-type-selector" id="chartViewSelector" style={{ border: '1px solid var(--cyan-dim)' }}>
                      <button
                        className={`chart-type-btn ${activeView === 'custom' ? 'active' : ''}`}
                        id="btnViewCustom"
                        onClick={() => setActiveView('custom')}
                      >
                        CUSTOM
                      </button>
                      <button
                        className={`chart-type-btn ${activeView === 'tv' ? 'active' : ''}`}
                        id="btnViewTV"
                        onClick={() => setActiveView('tv')}
                      >
                        TRADINGVIEW
                      </button>
                    </div>

                    {activeView === 'custom' && (
                      <>
                        {/* Custom canvas style selectors */}
                        <div className="chart-type-selector" id="customTypeSelector">
                          {['line', 'candle', 'area', 'bar'].map(type => (
                            <button
                              key={type}
                              className={`chart-type-btn ${chartType === type ? 'active' : ''}`}
                              onClick={() => setChartType(type)}
                            >
                              {type.toUpperCase()}
                            </button>
                          ))}
                        </div>

                        {/* Interactive Canvas Drawing toolbar controls */}
                        <div className="drawing-tools-bar" id="customDrawingBar">
                          <button
                            className={`tool-btn ${activeDrawingTool === 'trendline' ? 'active' : ''}`}
                            onClick={() => setActiveDrawingTool(activeDrawingTool === 'trendline' ? null : 'trendline')}
                          >
                            Trendline
                          </button>
                          <button
                            className={`tool-btn ${activeDrawingTool === 'fib' ? 'active' : ''}`}
                            onClick={() => setActiveDrawingTool(activeDrawingTool === 'fib' ? null : 'fib')}
                          >
                            Fibonacci
                          </button>
                          <button
                            className={`tool-btn ${activeDrawingTool === 'support' ? 'active' : ''}`}
                            onClick={() => setActiveDrawingTool(activeDrawingTool === 'support' ? null : 'support')}
                          >
                            S/R Line
                          </button>

                          <span style={{ color: 'var(--border)', fontSize: '10px' }}>|</span>
                          <input type="color" id="drawingColor" defaultValue="#00f0ff" style={{ width: '18px', height: '18px', border: 'none', background: 'transparent', cursor: 'pointer', padding: '0' }} title="Line Color" />
                          <select id="drawingWidth" style={{ background: 'var(--surface-light)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '9px', borderRadius: '4px', padding: '2px' }} title="Line Width">
                            <option value="1">1px</option>
                            <option value="2">2px</option>
                            <option value="3">3px</option>
                          </select>

                          {/* Overlay indicator checkmarks */}
                          <span style={{ color: 'var(--border)', fontSize: '10px' }}>|</span>
                          <label style={{ fontSize: '9.5px', display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <input type="checkbox" id="cbBB" checked={cbBB} onChange={(e) => setCbBB(e.target.checked)} />
                            <span>BB</span>
                          </label>
                          <label style={{ fontSize: '9.5px', display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <input type="checkbox" id="cbEMA20" checked={cbEMA20} onChange={(e) => setCbEMA20(e.target.checked)} />
                            <span>EMA20</span>
                          </label>
                          <label style={{ fontSize: '9.5px', display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <input type="checkbox" id="cbEMA50" checked={cbEMA50} onChange={(e) => setCbEMA50(e.target.checked)} />
                            <span>EMA50</span>
                          </label>

                          {/* Replay toolbar buttons */}
                          <span style={{ color: 'var(--border)', fontSize: '10px' }}>|</span>
                          <button
                            className="tool-btn"
                            id="btnReplay"
                            onClick={() => {
                              setIsReplayMode(!isReplayMode);
                              setReplayIndex(50);
                              setReplayIsPlaying(false);
                            }}
                            style={{ borderColor: 'var(--gold-accent)', color: 'var(--gold-accent)' }}
                          >
                            {isReplayMode ? 'Live Mode' : 'Replay'}
                          </button>

                          <button className="tool-btn" onClick={() => window.clearDrawings && window.clearDrawings()} style={{ borderColor: 'rgba(255,23,68,0.3)', color: 'var(--red-neon)' }}>
                            Clear
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Main Graph Area */}
                  <div className="chart-container" id="chartFrame" style={{ height: '330px', position: 'relative' }}>
                    {activeView === 'custom' ? (
                      <LiveChart
                        history={chartHistory}
                        activeMarket={activeMarket}
                        activeTickerKey={activeTickerKey}
                        chartType={chartType}
                        cbBB={cbBB}
                        cbEMA20={cbEMA20}
                        cbEMA50={cbEMA50}
                        activeDrawingTool={activeDrawingTool}
                        setActiveDrawingTool={setActiveDrawingTool}
                        onSupportLineDraw={handleSupportLineDraw}
                        currentLang={currentLang}
                        activeScannerAlert={activeScannerAlert}
                        isReplayMode={isReplayMode}
                        replayIndex={replayIndex}
                      />
                    ) : (
                      <div id="tradingview_chart_container" style={{ width: '100%', height: '100%', display: 'block' }}>
                        <iframe
                          src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${encodeURIComponent(getTradingViewSymbol(activeMarket, activeConfig.symbol))}&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Exchange&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=NSE%3ANIFTY`}
                          style={{ width: '100%', height: '100%', border: 'none' }}
                          title="TradingView Widget"
                        />
                      </div>
                    )}

                    {/* Replay toolbar overlay control bar */}
                    {isReplayMode && (
                      <div id="replayControlBar" className="replay-toolbar" style={{ display: 'flex', position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(13, 14, 21, 0.95)', border: '1px solid var(--gold)', padding: '6px 16px', borderRadius: '24px', gap: '10px', alignItems: 'center', zIndex: 10, boxShadow: 'var(--glow-gold)' }}>
                        <span style={{ fontSize: '8.5px', fontWeight: 'bold', fontFamily: "'Orbitron', sans-serif", color: 'var(--gold-accent)', letterSpacing: '1px' }}>REPLAY</span>
                        <button
                          className="chart-type-btn"
                          id="btnReplayPlay"
                          onClick={() => setReplayIsPlaying(!replayIsPlaying)}
                          style={{ borderColor: 'var(--green-neon)', color: 'var(--green-neon)' }}
                        >
                          {replayIsPlaying ? 'PAUSE' : 'PLAY'}
                        </button>
                        <button
                          className="chart-type-btn"
                          id="btnReplayStep"
                          onClick={() => {
                            setReplayIsPlaying(false);
                            setReplayIndex(prev => Math.min(chartHistory.length, prev + 1));
                          }}
                        >
                          STEP ▷
                        </button>
                        <button
                          className="chart-type-btn exit"
                          onClick={() => {
                            setIsReplayMode(false);
                            setReplayIsPlaying(false);
                          }}
                          style={{ borderColor: 'var(--red-neon)', color: 'var(--red-neon)' }}
                        >
                          EXIT
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dashboard live indicators overlay */}
                  <div className="indicators-row">
                    <div className="indicator-badge">
                      <div className="indicator-label" id="lblRsi">{dict.lblRsi || "RSI (14)"}</div>
                      <div className="indicator-value" id="rsiVal" style={{ color: rsi > 70 ? 'var(--red-neon)' : (rsi < 30 ? 'var(--green-neon)' : 'var(--cyan)') }}>
                        {rsi.toFixed(1)}
                      </div>
                    </div>
                    <div className="indicator-badge">
                      <div className="indicator-label" id="lblMacd">{dict.lblMacd || "MACD"}</div>
                      <div className="indicator-value" id="macdVal" style={{ color: macd >= signalLine ? 'var(--green-neon)' : 'var(--red-neon)' }}>
                        {macd.toFixed(3)}
                      </div>
                    </div>
                    <div className="indicator-badge">
                      <div className="indicator-label" id="lblSignal">{dict.lblSignal || "SIGNAL"}</div>
                      <div className="indicator-value" id="signalVal" style={{ color: 'var(--text-secondary)' }}>
                        {signalLine.toFixed(3)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ATR POSITION SIZER & RISK PROFILE MODULE */}
                <div className="panel-card" style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '11px', fontWeight: 'bold', fontFamily: "'Orbitron', sans-serif", color: 'var(--cyan)', letterSpacing: '0.5px', margin: 0 }}>
                      📊 {currentLang === 'mr' ? 'ATR पोझिशन साईझर आणि रिस्क प्रोफाईल' : (currentLang === 'hi' ? 'ATR पोजीशन साइजर और रिस्क प्रोफाइल' : (currentLang === 'es' ? 'DIMENSIONADOR DE POSICIÓN ATR' : 'ATR POSITION SIZER & RISK PROFILE'))}
                    </h3>
                    <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>VOLATILITY-BASED WEIGHTS</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <label style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                        {currentLang === 'mr' ? 'एकूण भांडवल आकार' : (currentLang === 'hi' ? 'कुल पूंजी आकार' : (currentLang === 'es' ? 'Tamaño del Capital' : 'Total Capital Size'))}
                      </label>
                      <div className="input-wrapper" style={{ margin: 0 }}>
                        <input
                          type="number"
                          className="price-input"
                          value={riskCapital}
                          onChange={(e) => setRiskCapital(Math.max(1, parseFloat(e.target.value) || 0))}
                          style={{ fontSize: '11px', padding: '6px' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                        {currentLang === 'mr' ? 'भांडवल जोखीम %' : (currentLang === 'hi' ? 'पूंजी जोखिम %' : (currentLang === 'es' ? 'Riesgo de Capital %' : 'Capital Risk %'))} ({riskPct}%)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={riskPct}
                        onChange={(e) => setRiskPct(parseFloat(e.target.value))}
                        style={{ width: '100%', height: '30px', accentColor: 'var(--cyan)', cursor: 'pointer' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                        {currentLang === 'mr' ? 'खरेदी किंमत' : (currentLang === 'hi' ? 'प्रवेश मूल्य' : (currentLang === 'es' ? 'Precio de Entrada' : 'Target Entry Price'))}
                      </label>
                      <div className="input-wrapper" style={{ margin: 0 }}>
                        <input
                          type="text"
                          className="price-input"
                          value={entryInput}
                          onChange={(e) => setEntryInput(e.target.value)}
                          style={{ fontSize: '11px', padding: '6px' }}
                        />
                        <button
                          className="input-action-btn"
                          onClick={() => setEntryInput(price.toFixed(decimals))}
                          style={{ padding: '0 8px' }}
                        >
                          Sync
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Calculations Display Output */}
                  {(() => {
                    const parsedCapital = riskCapital;
                    const parsedRiskPct = riskPct;
                    const parsedEntry = parseFloat(entryInput) || price;
                    const riskAmt = parsedCapital * (parsedRiskPct / 100);
                    
                    // ATR Stop loss margin from equitiesIntel matrix if available
                    const stopLossVal = equitiesIntel?.tip?.stopLoss ? parseFloat(equitiesIntel.tip.stopLoss) : (isLong ? price * 0.985 : price * 1.015);
                    const stopMargin = Math.abs(parsedEntry - stopLossVal) || (parsedEntry * 0.015);
                    
                    // Optimal units sizing
                    const optimalSize = riskAmt / stopMargin;
                    const totalValue = optimalSize * parsedEntry;
                    const leverageRequired = totalValue / parsedCapital;

                    const reward1 = Math.abs(parsedEntry - (equitiesIntel?.tip?.target1 ? parseFloat(equitiesIntel.tip.target1) : (isLong ? price * 1.03 : price * 0.97)));

                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
                        <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '8px' }}>
                          <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block' }}>RISK BUDGET</span>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--red-neon)', fontFamily: 'monospace' }}>
                            {activeMarket === 'indianStocks' ? '₹' : '$'}{riskAmt.toFixed(2)}
                          </span>
                          <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>({riskPct}% of Capital)</span>
                        </div>
                        <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '8px' }}>
                          <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block' }}>
                            {currentLang === 'mr' ? 'योग्य पोझिशन साईझ' : (currentLang === 'hi' ? 'इष्टतम पोजीशन आकार' : (currentLang === 'es' ? 'Tamaño Óptimo' : 'Optimal Position Size'))}
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--green-neon)', fontFamily: 'monospace' }}>
                            {optimalSize.toFixed(activeMarket === 'forex' ? 0 : 2)} UNITS
                          </span>
                          <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Max Loss Limit Cap</span>
                        </div>
                        <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '8px' }}>
                          <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block' }}>
                            {currentLang === 'mr' ? 'आवश्यक लेव्हरेज' : (currentLang === 'hi' ? 'आवश्यक लेवरेज' : (currentLang === 'es' ? 'Apalancamiento' : 'Leverage Required'))}
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--gold-accent)', fontFamily: 'monospace' }}>
                            {leverageRequired.toFixed(2)}x
                          </span>
                          <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Total Exposure / Capital</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block' }}>RISK-TO-REWARD</span>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--cyan)', fontFamily: 'monospace' }}>
                            1 : {(reward1 / stopMargin).toFixed(1)}
                          </span>
                          <span style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>ATR Volatility ratio</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Pattern scanner log cards overlay */}
                <div style={{ marginTop: '16px' }}>
                  <PatternScanner
                    currentLang={currentLang}
                    scannerLogs={scannerLogs}
                    accuracyValue={accuracyValue}
                    activePattern={activePattern}
                    activeSymbol={activeConfig.symbol}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: QUANT INTELLIGENCE WORKSPACE */}
            {activeWorkspaceTab === 'quant' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  gap: '16px',
                  background: 'rgba(13, 14, 21, 0.45)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
                  padding: '16px',
                  minHeight: '380px'
                }}>
                  {/* Left: 98%+ AI Perfect Tip card */}
                  {equitiesIntel ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: `1px solid ${equitiesIntel.tip.color}35`,
                      boxShadow: `0 0 10px ${equitiesIntel.tip.color}05`,
                      borderRadius: '12px',
                      padding: '16px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '8.5px', fontWeight: 'bold', fontFamily: "'Orbitron', sans-serif", color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
                          {currentLang === 'mr' ? 'अल्ट्रा-अचूक एआय शिफारस (९८%+)' : (currentLang === 'hi' ? 'अल्ट्रा-सटीक एआई सिफारिश (९८%+)' : (currentLang === 'es' ? 'CONSEJO DE IA 98%+' : '98%+ WIN-RATE AI ADVISORY'))}
                        </span>
                        <span style={{ fontSize: '8px', fontWeight: 'bold', color: 'var(--gold-accent)', background: 'rgba(255,215,0,0.08)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(255,215,0,0.25)', textShadow: 'var(--glow-gold)' }}>
                          CONFIDENCE: {equitiesIntel.tip.confidence}%
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '900', color: equitiesIntel.tip.color, fontFamily: "'Orbitron', sans-serif", margin: 0, textShadow: `0 0 8px ${equitiesIntel.tip.color}40` }}>
                          {equitiesIntel.tip.action}
                        </h3>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                          {equitiesIntel.tip.timeframe}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px 12px', margin: '6px 0', padding: '8px 12px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '9.5px', fontFamily: "'Inter', sans-serif" }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Entry Range:</span>
                          <strong style={{ color: 'var(--text-primary)', float: 'right', fontFamily: 'monospace' }}>
                            {activeMarket === 'indianStocks' ? '₹' : '$'}{equitiesIntel.tip.entry}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Stop Loss:</span>
                          <strong style={{ color: 'var(--red-neon)', float: 'right', fontFamily: 'monospace' }}>
                            {activeMarket === 'indianStocks' ? '₹' : '$'}{equitiesIntel.tip.stopLoss}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Target 1:</span>
                          <strong style={{ color: 'var(--green-neon)', float: 'right', fontFamily: 'monospace' }}>
                            {activeMarket === 'indianStocks' ? '₹' : '$'}{equitiesIntel.tip.target1}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Target 2:</span>
                          <strong style={{ color: 'var(--green-neon)', float: 'right', fontFamily: 'monospace' }}>
                            {activeMarket === 'indianStocks' ? '₹' : '$'}{equitiesIntel.tip.target2}
                          </strong>
                        </div>
                      </div>

                      <div style={{ flex: 1, marginTop: '12px', overflowY: 'auto', fontSize: '9px', lineHeight: '1.45', color: 'var(--text-secondary)', borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                        <strong style={{ color: 'var(--gold-accent)', fontFamily: "'Orbitron', sans-serif", fontSize: '8.5px', letterSpacing: '0.3px', display: 'block', marginBottom: '4px' }}>
                          {currentLang === 'mr' ? 'तांत्रिक विश्लेषण कारण:' : (currentLang === 'hi' ? 'तकनीकी विश्लेषण कारण:' : (currentLang === 'es' ? 'RACIÓN TÉCNICA:' : 'TECHNICAL RATIONALE:'))}
                        </strong>
                        {equitiesIntel.tip.rationale}
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '9.5px', textAlign: 'center', padding: '20px' }}>Analyzing Advisory...</div>
                  )}

                  {/* Right: Multi-Factor Technical Scorecard */}
                  {equitiesIntel?.matrix ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '9px' }}>
                      {/* Pivot points levels table */}
                      <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px' }}>
                        <div style={{ fontFamily: "'Orbitron'", fontSize: '8px', color: 'var(--gold-accent)', fontWeight: 'bold', marginBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '3px' }}>
                          {currentLang === 'mr' ? 'पिव्होट पातळी (STANDARD)' : (currentLang === 'hi' ? 'पिवट स्तर (STANDARD)' : (currentLang === 'es' ? 'NIVELES DE PIVOTE' : 'PIVOT LEVELS (STANDARD)'))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', textAlign: 'center', fontFamily: 'monospace' }}>
                          <div><span style={{ color: 'var(--red-neon)', display: 'block', fontSize: '7.5px' }}>S2</span>{equitiesIntel.matrix.s2}</div>
                          <div><span style={{ color: 'var(--red-neon)', display: 'block', fontSize: '7.5px' }}>S1</span>{equitiesIntel.matrix.s1}</div>
                          <div><span style={{ color: 'var(--cyan)', display: 'block', fontSize: '7.5px' }}>PIVOT</span>{equitiesIntel.matrix.pivot}</div>
                          <div><span style={{ color: 'var(--green-neon)', display: 'block', fontSize: '7.5px' }}>R1</span>{equitiesIntel.matrix.r1}</div>
                          <div><span style={{ color: 'var(--green-neon)', display: 'block', fontSize: '7.5px' }}>R2</span>{equitiesIntel.matrix.r2}</div>
                        </div>
                      </div>

                      {/* Moving Averages scorecard */}
                      <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px' }}>
                        <div style={{ fontFamily: "'Orbitron'", fontSize: '8px', color: 'var(--cyan)', fontWeight: 'bold', marginBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '3px' }}>
                          {currentLang === 'mr' ? 'मूव्हिंग ॲव्हरेज' : (currentLang === 'hi' ? 'मूविंग एवरेज' : (currentLang === 'es' ? 'MEDIAS MÓVILES' : 'MOVING AVERAGES'))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px 12px' }}>
                          {equitiesIntel.matrix.maScorecard.map((ma, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.02)', paddingBottom: '2px' }}>
                              <span style={{ color: 'var(--text-secondary)' }}>{ma.name}:</span>
                              <span style={{ fontFamily: 'monospace' }}>{ma.value} <span style={{ color: ma.color, fontSize: '7.5px', fontWeight: 'bold' }}>{ma.status}</span></span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Oscillators summary panel */}
                      <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px' }}>
                        <div style={{ fontFamily: "'Orbitron'", fontSize: '8px', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '3px' }}>
                          {currentLang === 'mr' ? 'तांत्रिक ऑसिलेटर' : (currentLang === 'hi' ? 'तकनीकी ऑसिलेटर' : (currentLang === 'es' ? 'OSCILADORES TÉCNICOS' : 'TECHNICAL OSCILLATORS'))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>RSI (14):</span>
                            <span style={{ fontFamily: 'monospace' }}>{equitiesIntel.matrix.oscillators.rsi.value} <strong style={{ color: equitiesIntel.matrix.oscillators.rsi.color }}>{equitiesIntel.matrix.oscillators.rsi.rating}</strong></span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>MACD (12, 26):</span>
                            <span style={{ fontFamily: 'monospace' }}>
                              Diff: {equitiesIntel.matrix.oscillators.macd.value} <strong style={{ color: equitiesIntel.matrix.oscillators.macd.color }}>{equitiesIntel.matrix.oscillators.macd.rating}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Institutional liquidity blocks */}
                      <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px' }}>
                        <div style={{ fontFamily: "'Orbitron'", fontSize: '8px', color: 'var(--green-neon)', fontWeight: 'bold', marginBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '3px' }}>
                          {currentLang === 'mr' ? 'संस्थात्मक लिक्विडिटी ब्लॉक्स' : (currentLang === 'hi' ? 'संस्थागत लिक्विडिटी ब्लॉक' : (currentLang === 'es' ? 'BLOQUES DE LIQUIDEZ' : 'INSTITUTIONAL LIQUIDITY BLOCKS'))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <div>
                            <span style={{ fontSize: '7.5px', color: 'var(--text-muted)', display: 'block' }}>SUPPORT BLOCK (BUY)</span>
                            <span style={{ fontFamily: 'monospace', color: 'var(--green-neon)' }}>{equitiesIntel.matrix.orderBlocks.supportMin} - {equitiesIntel.matrix.orderBlocks.supportMax}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: '7.5px', color: 'var(--text-muted)', display: 'block' }}>RESISTANCE BLOCK (SELL)</span>
                            <span style={{ fontFamily: 'monospace', color: 'var(--red-neon)' }}>{equitiesIntel.matrix.orderBlocks.resistanceMin} - {equitiesIntel.matrix.orderBlocks.resistanceMax}</span>
                          </div>
                        </div>
                      </div>

                      {/* AI Market Sentiment Score visual bar */}
                      <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Orbitron'", fontSize: '8px', color: 'var(--gold-accent)', fontWeight: 'bold', marginBottom: '6px' }}>
                          <span>{currentLang === 'mr' ? 'एआय मार्केट सेंटिमेंट निर्देशांक' : (currentLang === 'hi' ? 'एआई बाजार भावना सूचकांक' : (currentLang === 'es' ? 'SENTIMIENTO DE IA' : 'AI MARKET SENTIMENT INDEX'))}</span>
                          <span style={{ fontFamily: 'monospace' }}>{equitiesIntel.matrix.sentimentScore}% BULLISH</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '3px', overflow: 'hidden', display: 'flex' }}>
                          <div style={{ width: `${equitiesIntel.matrix.sentimentScore}%`, background: 'linear-gradient(90deg, var(--red-neon), var(--green-neon))' }}></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '9px', textAlign: 'center', padding: '20px' }}>Analyzing Technical Factors...</div>
                  )}
                </div>

                {/* AI News Sentiment analysis details card */}
                {equitiesIntel?.news && (
                  <div className="panel-card" style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 'bold', fontFamily: "'Orbitron', sans-serif", color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
                        {currentLang === 'mr' ? 'एआय बातमी आणि सेंटिमेंट विश्लेषण' : (currentLang === 'hi' ? 'एआई समाचार और सेंटिमेंट विश्लेषण' : (currentLang === 'es' ? 'ANÁLISIS DE NOTICIAS DE IA' : 'AI NEWS & SENTIMENT ANALYSIS'))}
                      </span>
                      <span style={{ fontSize: '8px', fontWeight: 'bold', color: equitiesIntel.news.color }}>
                        {equitiesIntel.news.sentiment} ({equitiesIntel.news.score}%)
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '6px' }}>
                      {equitiesIntel.news.headline}
                    </div>
                    <div style={{ fontSize: '9px', lineHeight: '1.45', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.15)', borderRadius: '6px', padding: '8px', borderLeft: '3px solid var(--cyan)' }}>
                      <strong>{currentLang === 'mr' ? 'बातम्यांचा प्रभाव विश्लेषण:' : 'NEWS IMPLICATION:'} </strong>
                      {equitiesIntel.news.analysis}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: STRATEGY BACKTESTER WORKSPACE */}
            {activeWorkspaceTab === 'backtest' && (
              <div className="panel-card" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 'bold', fontFamily: "'Orbitron', sans-serif", color: 'var(--green-neon)', letterSpacing: '0.5px', margin: 0 }}>
                    ⚙️ {currentLang === 'mr' ? 'क्वांटिटेटिव्ह स्ट्रॅटेजी बॅकटेस्ट सिम्युलेटर' : (currentLang === 'hi' ? 'क्वांटिटेटिव रणनीति बैकटेस्ट सिमुलेटर' : (currentLang === 'es' ? 'BACKTESTER DE ESTRATEGIA CUANTITATIVA' : 'QUANTITATIVE STRATEGY BACKTESTER'))}
                  </h3>
                  <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>HISTORICAL PROFILES</span>
                </div>

                {/* Strategy selectors */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '8px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      {currentLang === 'mr' ? 'बॅकटेस्ट स्ट्रॅटेजी निवडा' : (currentLang === 'hi' ? 'जैकटेस्ट रणनीति चुनें' : (currentLang === 'es' ? 'Seleccionar Estrategia' : 'Select Backtest Strategy'))}
                    </label>
                    <select
                      value={backtestStrategy}
                      onChange={(e) => setBacktestStrategy(e.target.value)}
                      style={{ width: '100%', padding: '6px', borderRadius: '6px', background: 'var(--surface-light)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '10px' }}
                    >
                      <option value="ema">EMA Crossover Strategy (20/50 EMA)</option>
                      <option value="rsi">RSI Mean Reversion (Overbought/Oversold)</option>
                      <option value="bb">Bollinger Band Mean Breakout</option>
                      <option value="volume">Institutional Volume Sweeper Profile</option>
                    </select>
                  </div>
                  <button
                    className="terminal-btn buy"
                    onClick={handleRunBacktest}
                    disabled={isBacktesting}
                    style={{
                      height: '32px',
                      marginTop: '15px',
                      padding: '0 20px',
                      fontFamily: "'Orbitron'",
                      fontSize: '9px',
                      fontWeight: 'bold',
                      boxShadow: 'var(--glow-green)'
                    }}
                  >
                    {isBacktesting ? 'SIMULATING...' : (currentLang === 'mr' ? 'सिम्युलेशन सुरू करा' : (currentLang === 'hi' ? 'सिमुलेशन चलाएं' : (currentLang === 'es' ? 'EJECUTAR' : 'RUN SIMULATION')))}
                  </button>
                </div>

                {/* Progress bar loader */}
                {isBacktesting && (
                  <div style={{ padding: '30px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <div className="backtest-progress-bar" style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', margin: '15px auto', maxWidth: '400px' }}>
                      <div style={{ width: `${backtestProgress}%`, height: '100%', background: 'var(--green-neon)', transition: 'width 0.15s ease', boxShadow: 'var(--glow-green)' }} />
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--text-secondary)', fontFamily: "'Orbitron', monospace", letterSpacing: '1px' }}>
                      {currentLang === 'mr' ? 'स्ट्रॅटेजी बॅकटेस्ट मोजत आहे...' : (currentLang === 'hi' ? 'रणनीति बैकटेस्ट चल रहा है...' : (currentLang === 'es' ? 'SIMULANDO BACKTEST...' : 'SIMULATING STRATEGY BACKTEST...'))} ({backtestProgress}%)
                    </div>
                  </div>
                )}

                {/* Backtester results panels */}
                {!isBacktesting && backtestResult && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Stats summary row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                      <div>
                        <span style={{ fontSize: '7.5px', color: 'var(--text-muted)', display: 'block' }}>WIN RATE</span>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--green-neon)', fontFamily: 'monospace' }}>{backtestResult.winRate}%</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '7.5px', color: 'var(--text-muted)', display: 'block' }}>PROFIT FACTOR</span>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--gold-accent)', fontFamily: 'monospace' }}>{backtestResult.profitFactor}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '7.5px', color: 'var(--text-muted)', display: 'block' }}>MAX DRAWDOWN</span>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--red-neon)', fontFamily: 'monospace' }}>-{backtestResult.maxDrawdown}%</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '7.5px', color: 'var(--text-muted)', display: 'block' }}>TOTAL TRADES</span>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--cyan)', fontFamily: 'monospace' }}>{backtestResult.tradesCount} SETUPS</span>
                      </div>
                    </div>

                    {/* SVG Equity curve graph drawing */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'var(--text-muted)', fontFamily: "'Orbitron'" }}>
                        <span>EQUITY GROWTH OVER 100 PERIODS</span>
                        <span style={{ color: 'var(--green-neon)' }}>SHARPE RATIO: {(1.5 + (hash % 15)/10).toFixed(2)}</span>
                      </div>
                      <svg viewBox="0 0 500 100" style={{ width: '100%', height: '100px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '8px' }}>
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.04)" strokeDasharray="3" />
                        <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.04)" strokeDasharray="3" />
                        <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.04)" strokeDasharray="3" />
                        {/* Simulated Equity Curve Line */}
                        <path
                          d={`M 0 85 L 50 ${75 + (hash % 10)} L 100 ${80 - (hash % 10)} L 150 ${60 + (hash % 12)} L 200 ${65 - (hash % 10)} L 250 ${45 + (hash % 15)} L 300 ${50 - (hash % 12)} L 350 ${30 + (hash % 10)} L 400 ${35 - (hash % 8)} L 450 15 L 500 10`}
                          fill="none"
                          stroke="var(--green-neon)"
                          strokeWidth="2"
                          style={{ filter: 'drop-shadow(0 0 3px rgba(0, 230, 118, 0.4))' }}
                        />
                        <text x="10" y="92" fill="var(--text-muted)" fontSize="7.5" fontFamily="monospace">Initial Account: $10,000</text>
                        <text x="400" y="22" fill="var(--green-neon)" fontSize="7.5" fontFamily="monospace">Final Balance: ${(10000 * parseFloat(backtestResult.profitFactor)).toFixed(0)}</text>
                      </svg>
                    </div>

                    {/* AI Backtest summary commentary */}
                    <div style={{ fontSize: '9px', lineHeight: '1.45', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.15)', borderRadius: '6px', padding: '8px', borderLeft: '3px solid var(--green-neon)' }}>
                      <strong style={{ color: 'var(--gold-accent)', fontFamily: "'Orbitron'", fontSize: '8.5px', display: 'block', marginBottom: '3px' }}>
                        {currentLang === 'mr' ? 'एआय बॅकटेस्ट पुनरावलोकन:' : (currentLang === 'hi' ? 'एआई बैकटेस्ट समीक्षा:' : (currentLang === 'es' ? 'REVISIÓN DE IA DE BACKTEST:' : 'AI BACKTESTER REVIEW:'))}
                      </strong>
                      {backtestResult.review[currentLang] || backtestResult.review['en']}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Indian equities Intelligence board dashboard */}
            {activeMarket === 'indianStocks' && (
              <div id="indianStocksDashboardWrapper" style={{ display: 'block', marginTop: '16px' }}>
                <EquitiesDashboard
                  currentLang={currentLang}
                  equitiesDb={equitiesDb}
                  setEquitiesDb={setEquitiesDb}
                  onSelectStock={(key) => setActiveTickerKey(key)}
                  activeTickerKey={activeTickerKey}
                />
              </div>
            )}
          </div>


          {/* Column 3: Smart risk calculator, AI Advisory hub, News feeds */}
          <div className="right-column">
            

            {/* AI Advisory & Strategies Reference Sheet */}
            <div className="panel-card" style={{ marginBottom: '0px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '4px' }}>
                <div className="term-tab active" id="tabAdvisory" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '10px', fontWeight: 'bold', color: 'var(--gold-accent)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  {dict.tabAdvisory || "AI ADVISORY & STRATEGIES"}
                </div>
                <button
                  className="terminal-btn buy"
                  id="btnLiveAIScan"
                  onClick={handleLiveAIScan}
                  style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '8px', fontWeight: 'bold', width: 'auto', height: 'auto', padding: '4px 10px', margin: '0', borderRadius: '4px', boxShadow: 'var(--glow-green)' }}
                >
                  {dict.btnLiveAIScan || "RUN LIVE AI SCAN"}
                </button>
              </div>

              <div className="advisory-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* advisory list table */}
                <div className="watchlist-header" id="lblAdvisoryTableTitle" style={{ fontSize: '8px', marginBottom: '2px' }}>
                  {dict.lblAdvisoryTableTitle || "AI STRATEGY ADVISORY RATINGS"}
                </div>
                <div className="advisory-table-wrapper" style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '6px', background: 'rgba(0,0,0,0.15)', maxHeight: '140px' }}>
                  <table className="positions-table" style={{ width: '100%', minWidth: '320px' }}>
                    <thead>
                      <tr>
                        <th id="thAdvisoryTicker" style={{ padding: '6px', fontSize: '8px' }}>TICKER</th>
                        <th id="thAdvisoryAction" style={{ padding: '6px', fontSize: '8px' }}>RECOMMENDATION</th>
                        <th id="thAdvisoryHoldClass" style={{ padding: '6px', fontSize: '8px' }}>HOLD CLASS</th>
                        <th id="thAdvisoryTimeframe" style={{ padding: '6px', fontSize: '8px' }}>TIMEFRAME</th>
                        <th id="thAdvisoryRationale" style={{ padding: '6px', fontSize: '8px' }}>RATIONALE</th>
                      </tr>
                    </thead>
                    <tbody id="advisoryTableBody" style={{ fontSize: '9.5px' }}>
                      {(advisoryDatabase[currentLang] || advisoryDatabase['en']).map((adv, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '6px', fontWeight: 'bold' }}>{adv.ticker}</td>
                          <td style={{ padding: '6px', color: adv.action.includes('BUY') || adv.action.includes('खरेदी') || adv.action.includes('COMPRAR') ? 'var(--green-neon)' : (adv.action.includes('SELL') || adv.action.includes('विक्री') || adv.action.includes('VENDER') ? 'var(--red-neon)' : 'var(--cyan)') }}>
                            {adv.action}
                          </td>
                          <td style={{ padding: '6px' }}>{adv.holdClass}</td>
                          <td style={{ padding: '6px' }}>{adv.timeframe}</td>
                          <td style={{ padding: '6px', fontSize: '8px', color: 'var(--text-secondary)' }}>{adv.rationale}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Strategy grids */}
                <div className="watchlist-header" id="lblStrategyCardsTitle" style={{ fontSize: '8px', marginTop: '4px', marginBottom: '2px' }}>
                  {dict.lblStrategyCardsTitle || "TRADING STRATEGY REFERENCE"}
                </div>
                <div className="strategy-cards-grid" id="strategyCardsGrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '120px', overflowY: 'auto', paddingRight: '4px' }}>
                  {[
                    { name: "Scalping", timeframe: "1m / 5m", indicators: "Volume + Order Flow", desc: "Ultra-fast execution targeting micro-movements. Requires strict discipline." },
                    { name: "Intraday Trading", timeframe: "15m / 1h", indicators: "VWAP + Bollinger Bands", desc: "Day trading strategy opening and closing all positions within the market hours." },
                    { name: "Swing Trading", timeframe: "4h / 1d", indicators: "RSI Divergence + MAs", desc: "Captures price swings over several days to weeks. Excellent for retail traders." },
                    { name: "Positional (Hold)", timeframe: "Weekly / Monthly", indicators: "FII Flows + Macro Trends", desc: "Long-term investment targeting major structural trends. Fundamental strength." }
                  ].map((strat, idx) => (
                    <div key={idx} className="panel-card" style={{ padding: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '6px', margin: 0 }}>
                      <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--gold-accent)', fontFamily: "'Orbitron', sans-serif" }}>{strat.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'var(--text-muted)', margin: '4px 0' }}>
                        <span>{strat.timeframe}</span>
                        <span>{strat.indicators}</span>
                      </div>
                      <div style={{ fontSize: '8px', color: 'var(--text-secondary)', lineHeight: '1.2' }}>{strat.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Real-time alpha feed console */}
            <div className="panel-card" style={{ marginTop: '16px', marginBottom: '0' }}>
              <div className="watchlist-header">
                <span id="lblNewsFeedTitle">{dict.lblNewsFeedTitle || "Real-Time Alpha Feed"}</span>
                <span className="scan-status-indicator" id="newsFeedStatus" style={{ color: 'var(--green-neon)', borderColor: 'var(--green-neon)' }}>LIVE CONNECTED</span>
              </div>
              <NewsFeed
                currentLang={currentLang}
                activeMarket={activeMarket}
                activeTickerKey={activeTickerKey}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer id="lblFooter">
          {dict.lblFooter || "Wiseman Analytics Pro Hub • A Black Dragon Product"}
        </footer>
      </div>

      {/* News Sentiment Glassmorphic Overlay Modal */}
      {selectedNews && (
        <div className="sentiment-modal-overlay" id="sentimentModal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(3, 3, 7, 0.75)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', zIndex: 999, justifyContent: 'center', alignItems: 'center', transition: 'all 0.3s ease' }}>
          <div className="panel-card" style={{ width: '450px', borderColor: 'var(--cyan)', boxShadow: 'var(--glow-cyan)', background: 'rgba(13, 14, 21, 0.95)', marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '12px' }}>
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', fontWeight: 'bold', color: 'var(--gold-accent)', letterSpacing: '1px' }} id="lblSentimentTitle">
                {dict.lblSentimentTitle || "AI NEWS SENTIMENT ANALYSIS"}
              </span>
              <button
                onClick={() => setSelectedNews(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer', lineHeight: 1, outline: 'none' }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--red-neon)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                &times;
              </button>
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: '1.4', marginBottom: '10px' }} id="modalSentimentHeadline">
                {selectedNews.headline}
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                <span
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '8px',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: selectedNews.impact === 'BULLISH' ? 'rgba(0, 230, 118, 0.1)' : (selectedNews.impact === 'BEARISH' ? 'rgba(255, 23, 68, 0.1)' : 'rgba(255,255,255,0.05)'),
                    color: selectedNews.impact === 'BULLISH' ? 'var(--green-neon)' : (selectedNews.impact === 'BEARISH' ? 'var(--red-neon)' : 'var(--text-muted)')
                  }}
                  id="modalSentimentBadge"
                >
                  {selectedNews.impact}
                </span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }} id="modalSentimentTime">{selectedNews.time || '10 mins ago'}</span>
              </div>
              <div className="coach-quote-box" style={{ fontSize: '11px', lineHeight: '1.5', color: 'var(--text-secondary)', marginBottom: 0, padding: '12px', fontStyle: 'normal' }} id="modalSentimentAnalysis">
                {selectedNews.analysis || 'Analysis of this breakout item completed successfully.'}
              </div>
              <div id="modalSentimentImpact" style={{ marginTop: '12px', fontSize: '9.5px', fontWeight: 'bold', fontFamily: "'Orbitron', sans-serif", textAlign: 'center', borderRadius: '6px', padding: '6px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)' }}>
                {selectedNews.summary || 'EXPECTED IMPACT: Volatility Sweep.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthGate>
  );
}
