// Wiseman Analytics Global Configurations & Localizations
let currentLang = 'en';
const RENDER_BACKEND_URL = "https://wiseman-backend.onrender.com"; // Replace with your actual Render URL if different
const BACKEND_API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "")
  ? "http://localhost:5000/api"
  : `${RENDER_BACKEND_URL}/api`;

const newsDatabase = [
  {
    id: 1,
    headline: "US Federal Reserve hints at interest rate cuts in upcoming monetary policy review",
    category: "Forex",
    impact: "BULLISH",
    time: "10 mins ago",
    analysis: "The Federal Reserve's dovish pivot suggests an upcoming injection of liquidity into global markets. Lower interest rates typically weaken the US Dollar index (DXY) while boosting risk assets like equities and cryptocurrencies.",
    summary: "EXPECTED IMPACT: High positive volatility for BTC, EUR/USD, and Nifty 50."
  },
  {
    id: 2,
    headline: "Binance receives regulatory clearance in European jurisdictions, boosting volume metrics",
    category: "Crypto",
    impact: "BULLISH",
    time: "25 mins ago",
    analysis: "European compliance clears regulatory bottlenecks for institutional flow. This increases retail confidence and ensures steady capital inflows into core trading pools for BTC, ETH, and SOL.",
    summary: "EXPECTED IMPACT: Strongly Bullish for Crypto markets."
  },
  {
    id: 3,
    headline: "Reliance Industries announces massive green energy expansion project with key global partners",
    category: "Stocks",
    impact: "BULLISH",
    time: "45 mins ago",
    analysis: "This capital-efficient green project positions Reliance as a key ESG leader. FII (Foreign Institutional Investor) allocations are expected to increase over the next fiscal quarter, creating strong buy orders.",
    summary: "EXPECTED IMPACT: Bullish for RELIANCE shares."
  },
  {
    id: 4,
    headline: "Inflation numbers report beats consensus expectations, triggering tight monetary fear concerns",
    category: "Forex",
    impact: "BEARISH",
    time: "1 hour ago",
    analysis: "Higher-than-expected inflation metrics force central banks to maintain restrictive higher-for-longer interest rates. This decreases retail credit flows and triggers stock market distributions.",
    summary: "EXPECTED IMPACT: Bearish pressure on Nifty 50 and BTC."
  },
  {
    id: 5,
    headline: "Securities regulator initiates compliance sweeps on high-frequency algorithmic desks",
    category: "Stocks",
    impact: "NEUTRAL",
    time: "2 hours ago",
    analysis: "Strict audits of HFT desks will limit short-term spreads and reduce flash-crash risks. While liquidity will be slightly lower during the sweep, long-term market structure remains intact.",
    summary: "EXPECTED IMPACT: Neutral short-term consolidation for Indian stocks."
  }
];

const langDb = {
  en: {
    title: "WISEMAN ANALYTICS",
    subtitle: "REAL-TIME QUANTITATIVE ENGINE",
    tabStocks: "INDIAN STOCKS",
    tabCrypto: "CRYPTO 24/7",
    tabForex: "FOREX MARKET",
    tabGlobal: "GLOBAL MARKET",
    lblTickers: "Market Tickers",
    lblChartTitle: "LIVE CHARTS & INTERACTIVE INDICATORS",
    lblCoachName: "WISEMAN AI COACH",
    lblCoachSub: "REAL-TIME HEURISTICS",
    lblConfidence: "CONFIDENCE PROFILE",
    lblRationale: "Signal Rationale",
    lblRiskTitle: "SMART RISK CALCULATOR",
    btnLong: "BUY / LONG",
    btnShort: "SELL / SHORT",
    lblEntryPrice: "Entry Price",
    lblVolatility: "Volatility Buffer",
    lblStopMargin: "Dynamic Stop Margin",
    lblStopLoss: "Stop Loss",
    lblTarget1: "Target 1 (1:2 R:R)",
    lblTarget2: "Target 2 (1:3 R:R)",
    lblTerminalTitle: "TRADE EXECUTION TERMINAL",
    lblTradeSize: "Trade Size",
    lblExecType: "Execution Type",
    lblLivePos: "Live Open Positions",
    thSymbol: "Symbol",
    thType: "Type",
    thEntry: "Entry",
    thPnL: "PnL",
    thAction: "Action",
    emptyPos: "No active executions",
    lblFooter: "Wiseman Analytics Pro Hub • A Black Dragon Product",
    tickerLabel: "ALPHA FEED",
    lblVolume: "VOLUME: ",
    lblRsi: "RSI (14)",
    lblMacd: "MACD",
    lblSignal: "SIGNAL",
    optMarket: "MARKET",
    optLimit: "LIMIT",
    btnExecuteBuy: "EXECUTE BUY ORDER",
    btnExecuteSell: "EXECUTE SELL ORDER",
    btnTableClose: "CLOSE",
    riskAmtPrefix: "Risk Amount: ",
    estRetPrefix: "Est. Return: ",
    scanLabel: "SCANNING LIVE",
    lblChatHeader: "WISEMAN AI ASSISTANT",
    lblScannerHeader: "Institutional Trap & Pattern Scanner",
    scannerAccuracy: "ACCURACY: ",
    lblNewsFeedTitle: "Real-Time Alpha Feed",
    welcomeMsg: "Greetings. I am Wiseman, your algorithmic advisor (powered by Black Dragon). How may I assist you with your charting strategy or risk limits today?",
    patternAlert: "[SCANNER] Pattern Detected on ",
    trapAlert: "[TRAP WARNING] Liquidity Sweep detected on ",
    statusApproved: "APPROVED",
    statusAvoid: "AVOID",
    statusNeutral: "NEUTRAL",
    msgLowVol: "Market volatility is sub-optimal. Institutional players are sitting on the sidelines. Avoid execution.",
    reasonLowVol1: "Extremely dry trading volume profile.",
    reasonLowVol2: "Risk of high spread slippages.",
    msgBullish: "Strong bullish reversal patterns emerging with rising institutional volume backing. High risk/reward long setup.",
    reasonBullish1: "Bullish divergence forming on RSI.",
    reasonBullish2: "Volume breakout confirmed.",
    msgBearish: "Heavy distribution sweeps detected at local resistance. Selling pressure mounting. Tight stop losses advised.",
    reasonBearish1: "RSI indicating overbought distribution.",
    reasonBearish2: "Rejection pattern at major order block.",
    msgNeutral: "Consolidation zone detected. Moving average indicators are flat. Range-bound oscillations.",
    reasonNeutral1: "No clear trend breakout signal.",
    reasonNeutral2: "Wait for key support/resistance sweep.",
    msgConflicting: "Conflicting momentum signals on multiple timeframes. No clean trading edge at present.",
    reasonConflicting: "RSI and MACD are flashing divergent cues.",
    
    // V2 Keys
    lblSentimentTitle: "AI NEWS SENTIMENT ANALYSIS",
    lblReplayTitle: "REPLAY MODE",
    tabPositions: "POSITIONS",
    tabHistory: "STATS & HISTORY",
    tabStrategy: "STRATEGY BUILDER",
    tabAdvisory: "AI ADVISORY",
    statWinRate: "WIN RATE",
    statNetProfit: "NET RETURN",
    emptyHistory: "No closed executions",
    lblRsiBuy: "RSI BUY TRIGGER",
    lblMacdDir: "MACD DIRECTION",
    lblStrategyEngine: "STRATEGY ENGINE STATUS",
    statusMonitoring: "MONITORING FEEDS",
    statusTriggered: "ALERT: CRITERIA SATISFIED!",
    lblAdvisoryTableTitle: "AI STRATEGY ADVISORY RATINGS",
    lblStrategyCardsTitle: "TRADING STRATEGY SHEET REFERENCE",
    thAdvisoryTicker: "TICKER",
    thAdvisoryAction: "RECOMMENDATION",
    thAdvisoryHoldClass: "HOLD CLASS",
    thAdvisoryTimeframe: "TIMEFRAME",
    thAdvisoryRationale: "RATIONALE",
    btnLiveAIScan: "RUN LIVE AI SCAN",
    lblAIScanStatus: "Scanning markets with AI...",
    lblIndianDashboardTitle: "AI EQUITIES INTELLIGENCE BOARD",
    lblScannerLiveBadge: "SCANNING NSE/BSE LIVE",
    lblDiscoveryFeedTitle: "AI REAL-TIME DISCOVERY & INGESTION CONSOLE",
    lblDiscoveryCount: "ACTIVE AUDITS: "
  },
  mr: {
    title: "वाईजमन ॲनालिटिक्स",
    subtitle: "रिअल-टाइम क्वांटिटेटिव्ह इंजिन",
    tabStocks: "भारतीय शेअर्स",
    tabCrypto: "क्रिप्टो २४/७",
    tabForex: "फॉरेक्स मार्केट",
    tabGlobal: "जागतिक बाजार (GLOBAL)",
    lblTickers: "मार्केट टिकर्स",
    lblChartTitle: "लाइव्ह चार्ट आणि इंडिकेटर्स",
    lblCoachName: "वाईजमन AI कोच",
    lblCoachSub: "रिअल-टाइम विश्लेषण",
    lblConfidence: "विश्वासार्हता प्रोफाइल",
    lblRationale: "सिग्नलचे कारण",
    lblRiskTitle: "स्मार्ट रिस्क कॅल्क्युलेटर",
    btnLong: "खरेदी / LONG",
    btnShort: "विक्री / SHORT",
    lblEntryPrice: "प्रवेश किंमत (Entry)",
    lblVolatility: "व्होलॅटिलिटी बफर",
    lblStopMargin: "डायनॅमिक स्टॉप मार्जिन",
    lblStopLoss: "स्टॉप लॉस",
    lblTarget1: "लक्ष्य १ (१:२ R:R)",
    lblTarget2: "लक्ष्य २ (१:३ R:R)",
    lblTerminalTitle: "ट्रेड एक्झिक्यूशन टर्मिनल",
    lblTradeSize: "ट्रेड संख्या",
    lblExecType: "ट्रेड प्रकार",
    lblLivePos: "सक्रिय पोझिशन्स",
    thSymbol: "चिन्ह",
    thType: "प्रकार",
    thEntry: "किंमत",
    thPnL: "नफा/तोटा",
    thAction: "कृती",
    emptyPos: "कोणतेही सक्रिय ट्रेड्स नाहीत",
    lblFooter: "वाईजमन ॲनालिटिक्स प्रो हब • ब्लॅक ड्रॅगन प्रॉडक्ट",
    tickerLabel: "लाइव्ह फीड",
    lblVolume: "व्हॉल्यूम: ",
    lblRsi: "आरएसआय (14)",
    lblMacd: "एमएसीडी",
    lblSignal: "सिग्नल",
    optMarket: "बाजार (MARKET)",
    optLimit: "मर्यादा (LIMIT)",
    btnExecuteBuy: "खरेदी ऑर्डर पूर्ण करा",
    btnExecuteSell: "विक्री ऑर्डर पूर्ण करा",
    btnTableClose: "बंद करा",
    riskAmtPrefix: "जोखीम रक्कम: ",
    estRetPrefix: "अंदाजे परतावा: ",
    scanLabel: "लाइव्ह स्कॅनिंग सुरू",
    lblChatHeader: "वाईजमन AI सहाय्यक",
    lblScannerHeader: "ट्रॅप आणि चार्ट पॅटर्न स्कॅनर",
    scannerAccuracy: "अचूकता: ",
    lblNewsFeedTitle: "रिअल-टाइम अल्फा फीड",
    welcomeMsg: "नमस्कार. मी वाईजमन आहे (ब्लॅक ड्रॅगन द्वारे समर्थित). आज तुम्हाला ट्रेडिंग आणि रिस्क व्यवस्थापनात काय मदत हवी आहे?",
    patternAlert: "[स्कॅनर] चार्ट पॅटर्न आढळला - ",
    trapAlert: "[चेतावणी] लिक्विडिटी ट्रॅप आढळला - ",
    statusApproved: "मंजूर (BUY)",
    statusAvoid: "टाळा (AVOID)",
    statusNeutral: "तटस्थ (NEUTRAL)",
    msgLowVol: "बाजारातील चढ-उतार कमी आहे. संस्थात्मक गुंतवणूकदार सक्रिय नाहीत. नवीन ट्रेड घेणे टाळा.",
    reasonLowVol1: "अत्यंत कमी ट्रेडिंग व्हॉल्यूम प्रोफाइल.",
    reasonLowVol2: "स्लिपेज आणि स्प्रेडचा धोका जास्त आहे.",
    msgBullish: "वाढत्या व्हॉल्यूमच्या पाठिंब्यासह तेजीचे रिव्हर्सल संकेत. चांगला खरेदीचा (Long) सेटअप.",
    reasonBullish1: "आरएसआय (RSI) वर तेजीचे संकेत (Bullish divergence).",
    reasonBullish2: "व्हॉल्यूम ब्रेकआऊट निश्चित झाला आहे.",
    msgBearish: "स्थानिक रेझिस्टन्सवर मोठ्या प्रमाणात विक्रीचे संकेत. स्टॉप लॉस अत्यंत कडक ठेवा.",
    reasonBearish1: "आरएसआय ओव्हरबॉट झोन दाखवत आहे.",
    reasonBearish2: "महत्वाच्या ऑर्डर ब्लॉकवर विक्रीचा दबाव.",
    msgNeutral: "मार्केट एकाच रेंजमध्ये फिरत आहे. मूव्हिंग ॲव्हरेज सपाट आहेत.",
    reasonNeutral1: "ट्रेन्ड ब्रेकआऊटचे स्पष्ट संकेत नाहीत.",
    reasonNeutral2: "महत्वाच्या सपोर्ट/रेझिस्टन्स लेव्हलची वाट पहा.",
    msgConflicting: "वेगवेगळ्या टाईमफ्रेमवर परस्परविरोधी संकेत आहेत. सध्या कोणताही स्पष्ट ट्रेड नाही.",
    reasonConflicting: "आरएसआय आणि एमएसीडी वेगवेगळे संकेत देत आहेत.",
    
    // V2 Keys
    lblSentimentTitle: "AI बातम्यांचे विश्लेषण",
    lblReplayTitle: "बॅकटेस्टिंग रिप्ले",
    tabPositions: "ट्रेड्स (LIVE)",
    tabHistory: "इतिहास आणि आकडेवारी",
    tabStrategy: "स्ट्रॅटेजी बिल्डर",
    tabAdvisory: "AI सल्लागार आणि रणनीती",
    statWinRate: "विन रेट (WIN %)",
    statNetProfit: "एकूण नफा",
    emptyHistory: "कोणतेही बंद ट्रेड्स नाहीत",
    lblRsiBuy: "RSI खरेदी मर्यादा",
    lblMacdDir: "MACD दिशा",
    lblStrategyEngine: "स्ट्रॅटेजी इंजिन स्थिती",
    statusMonitoring: "मार्केट स्कॅनिंग सुरू...",
    statusTriggered: "इशारा: खरेदीचे संकेत!",
    lblAdvisoryTableTitle: "AI ट्रेडिंग सल्लागार रेटिंग",
    lblStrategyCardsTitle: "ट्रेडिंग धोरण संदर्भ (STRATEGY SHEET)",
    thAdvisoryTicker: "टिकर",
    thAdvisoryAction: "शिफारस",
    thAdvisoryHoldClass: "होल्डिंग प्रकार",
    thAdvisoryTimeframe: "कालावधी",
    thAdvisoryRationale: "स्पष्टीकरण",
    btnLiveAIScan: "थेट AI स्कॅनिंग सुरू करा",
    lblAIScanStatus: "AI द्वारे मार्केट स्कॅन सुरू आहे...",
    lblIndianDashboardTitle: "AI शेअर्स इंटेलिजन्स बोर्ड",
    lblScannerLiveBadge: "NSE/BSE लाइव्ह स्कॅनिंग सुरू",
    lblDiscoveryFeedTitle: "AI रिअल-टाइम शोध आणि डेटा फीड",
    lblDiscoveryCount: "सक्रिय ऑडिट्स: "
  },
  hi: {
    title: "वाइजमैन एनालिटिक्स",
    subtitle: "रियल-टाइम क्वांटिटेटिव इंजन",
    tabStocks: "भारतीय स्टॉक्स",
    tabCrypto: "क्रिप्टो २४/७",
    tabForex: "फॉरेक्स संकेत",
    tabGlobal: "वैश्विक बाजार",
    lblTickers: "Market Tickers",
    lblChartTitle: "लाइव चार्ट और इंडिकेटर्स",
    lblCoachName: "वाइजमैन AI कोच",
    lblCoachSub: "रियल-टाइम विश्लेषण",
    lblConfidence: "विश्वसनीयता प्रोफाइल",
    lblRationale: "सिग्नल का कारण",
    lblRiskTitle: "स्मार्ट रिस्क कैलकुलेटर",
    btnLong: "खरीदें / LONG",
    btnShort: "बेचें / SHORT",
    lblEntryPrice: "प्रवेश मूल्य (Entry)",
    lblVolatility: "वोलैटिलिटी बफर",
    lblStopMargin: "डायनेमिक स्टॉप मार्जिन",
    lblStopLoss: "स्टॉप लॉस",
    lblTarget1: "लक्ष्य १ (१:२ R:R)",
    lblTarget2: "लक्ष्य २ (१:३ R:R)",
    lblTerminalTitle: "ट्रेड निष्पादन टर्मिनल",
    lblTradeSize: "ट्रेड मात्रा",
    lblExecType: "ट्रेड का प्रकार",
    lblLivePos: "सक्रिय पोजीशन्स",
    thSymbol: "प्रतीक",
    thType: "प्रकार",
    thEntry: "प्रवेश",
    thPnL: "लाभ/हानि",
    thAction: "कार्रवाई",
    emptyPos: "कोई सक्रिय ट्रेड नहीं हैं",
    lblFooter: "वाइजमैन एनालिटिक्स प्रो हब • ब्लैक ड्रैगन प्रॉडक्ट",
    tickerLabel: "लाइव फीड",
    lblVolume: "वॉल्यूम: ",
    lblRsi: "आरसआई (14)",
    lblMacd: "एमएसीडी",
    lblSignal: "सिग्नल",
    optMarket: "बाजार (MARKET)",
    optLimit: "सीमा (LIMIT)",
    btnExecuteBuy: "खरीद ऑर्डर पूर्ण करें",
    btnExecuteSell: "बिक्री ऑर्डर पूर्ण करें",
    btnTableClose: "बंद करें",
    riskAmtPrefix: "जोखिम राशि: ",
    estRetPrefix: "अनुमानित लाभ: ",
    scanLabel: "लाइव स्कैनिंग सक्रिय",
    lblChatHeader: "वाइजमैन AI सहायक",
    lblScannerHeader: "ट्रैप और चार्ट पैटर्न स्कैनर",
    scannerAccuracy: "सटीकता: ",
    lblNewsFeedTitle: "रियल-टाइम अल्फा फीड",
    welcomeMsg: "नमस्कार। मैं वाइजमैन हूँ (ब्लैक ड्रैगन द्वारा संचालित)। आज चार्टिंग रणनीतियों और जोखिम नियंत्रण में आपको मुझसे क्या सलाह चाहिए?",
    patternAlert: "[स्कैनर] चार्ट पैटर्न मिला - ",
    trapAlert: "[चेतावनी] लिक्विडिटी ट्रैप मिला - ",
    statusApproved: "स्वीकृत (BUY)",
    statusAvoid: "बचें (AVOID)",
    statusNeutral: "तटस्थ (NEUTRAL)",
    msgLowVol: "बाजार में उतार-चढ़ाव काफी कम है। बड़े संस्थागत खरीदार अभी सक्रिय नहीं हैं। ट्रेड करने से बचें।",
    reasonLowVol1: "ट्रेडिंग वॉल्यूम का स्तर बहुत ही सामान्य है।",
    reasonLowVol2: "बड़ी स्लिपेज का जोखिम बना हुआ है।",
    msgBullish: "बढ़ते वॉल्यूम के समर्थन के साथ मजबूत तेजी (Bullish Reversal) के संकेत। खरीदारी का बेहतरीन मौका।",
    reasonBullish1: "RSI पर तेजी का डायवर्जेंस बन रहा है।",
    reasonBullish2: "वॉल्यूम突破 की पुष्टि हो चुकी है।",
    msgBearish: "रेसिस्टेंस स्तर पर बिकवाली का दबाव देखा जा रहा है। सख्त स्टॉप लॉस लगाने की सलाह दी जाती है।",
    reasonBearish1: "RSI ओवरबॉट वितरण की ओर इशारा कर रहा है।",
    reasonBearish2: "मुख्य ऑर्डर ब्लॉक पर रिजेक्शन पैटर्न।",
    msgNeutral: "बाजार कंसोलिडेशन जोन में है। मूविंग एवरेज सपाट बने हुए हैं।",
    reasonNeutral1: "स्पष्ट ट्रेंड ब्रेकआउट का कोई संकेत नहीं।",
    reasonNeutral2: "महत्वपूर्ण सपोर्ट या रेसिस्टेंस ब्रेक होने का इंतजार करें।",
    msgConflicting: "विभिन्न टाइमफ्रेम पर परस्पर विरोधी संकेत। वर्तमान में कोई स्पष्ट ट्रेड संकेत नहीं है।",
    reasonConflicting: "RSI और MACD अलग-अलग संकेत दे रहे हैं।",
    
    // V2 Keys
    lblSentimentTitle: "AI समाचार विश्लेषण",
    lblReplayTitle: "बैकटेस्टिंग रीप्ले",
    tabPositions: "ट्रेड्स (LIVE)",
    tabHistory: "इतिहास और आंकड़े",
    tabStrategy: "रणनीति बिल्डर",
    tabAdvisory: "AI सलाहकार",
    statWinRate: "जीत दर (WIN %)",
    statNetProfit: "कुल लाभ",
    emptyHistory: "कोई बंद ट्रेड नहीं हैं",
    lblRsiBuy: "RSI खरीद सीमा",
    lblMacdDir: "MACD दिशा",
    lblStrategyEngine: "रणनीति इंजन स्थिति",
    statusMonitoring: "बाजार स्कैनिंग जारी...",
    statusTriggered: "चेतावनी: खरीद संकेत!",
    lblAdvisoryTableTitle: "AI ट्रेडिंग सलाहकार रेटिंग",
    lblStrategyCardsTitle: "ट्रेडिंग रणनीति संदर्भ पत्रक",
    thAdvisoryTicker: "टिकर",
    thAdvisoryAction: "सिफारिश",
    thAdvisoryHoldClass: "होल्डिंग प्रकार",
    thAdvisoryTimeframe: "समय सीमा",
    thAdvisoryRationale: "तर्क",
    btnLiveAIScan: "सक्रिय AI स्कैन शुरू करें",
    lblAIScanStatus: "AI द्वारा बाजार स्कैन जारी...",
    lblIndianDashboardTitle: "AI शेयर्स इंटेलिजेंस बोर्ड",
    lblScannerLiveBadge: "NSE/BSE लाइव स्कैन जारी",
    lblDiscoveryFeedTitle: "AI रियल-टाइम खोज और डेटा फीड",
    lblDiscoveryCount: "सक्रिय ऑडिट: "
  },
  es: {
    title: "WISEMAN ANALYTICS",
    subtitle: "MOTOR CUANTITATIVO EN TIEMPO REAL",
    tabStocks: "ACCIONES INDIAS",
    tabCrypto: "CRIPTOMONEDAS 24/7",
    tabForex: "MERCADO FOREX",
    tabGlobal: "MERCADO GLOBAL",
    lblTickers: "Cotizaciones",
    lblChartTitle: "GRÁFICOS EN VIVO E INDICADORES INTERACTIVOS",
    lblCoachName: "ENTRENADOR DE IA WISEMAN",
    lblCoachSub: "HEURÍSTICA EN TIEMPO REAL",
    lblConfidence: "PERFIL DE CONFIANZA",
    lblRationale: "Razonamiento de Señal",
    lblRiskTitle: "CALCULADORA DE RIESGO INTELIGENTE",
    btnLong: "COMPRA / LARGO",
    btnShort: "VENTA / CORTO",
    lblEntryPrice: "Precio de Entrada",
    lblVolatility: "Buffer de Volatilidad",
    lblStopMargin: "Margen de Stop Dinámico",
    lblStopLoss: "Límite de Pérdida (SL)",
    lblTarget1: "Objetivo 1 (1:2 R:R)",
    lblTarget2: "Objetivo 2 (1:3 R:R)",
    lblTerminalTitle: "TERMINAL DE EJECUCIÓN DE TRADES",
    lblTradeSize: "Tamaño del Trade",
    lblExecType: "Tipo de Ejecución",
    lblLivePos: "Posiciones Abiertas en Vivo",
    thSymbol: "Símbolo",
    thType: "Tipo",
    thEntry: "Entrada",
    thPnL: "Ganancia/Pérdida",
    thAction: "Acción",
    emptyPos: "Sin posiciones activas",
    lblFooter: "Wiseman Analytics Pro Hub • Un Producto de Black Dragon",
    tickerLabel: "NOTICIAS",
    lblVolume: "VOLUMEN: ",
    lblRsi: "RSI (14)",
    lblMacd: "MACD",
    lblSignal: "SEÑAL",
    optMarket: "MERCADO",
    optLimit: "LÍMITE",
    btnExecuteBuy: "EJECUTAR COMPRA",
    btnExecuteSell: "EJECUTAR VENTA",
    btnTableClose: "CERRAR",
    riskAmtPrefix: "Monto de Riesgo: ",
    estRetPrefix: "Retorno Est.: ",
    scanLabel: "ESCANEO EN VIVO",
    lblChatHeader: "ASISTENTE DE IA WISEMAN",
    lblScannerHeader: "Escáner de Trampas y Patrones",
    scannerAccuracy: "PRECISIÓN: ",
    lblNewsFeedTitle: "Feed Alfa en Tiempo Real",
    welcomeMsg: "Saludos. Soy Wiseman, su asesor financiero (con tecnología de Black Dragon). ¿En qué puedo ayudarle hoy con sus límites de riesgo o análisis?",
    patternAlert: "[ESCÁNER] Patrón detectado en ",
    trapAlert: "[ALERTA] Barrido de liquidez en ",
    statusApproved: "APROBADO",
    statusAvoid: "EVITAR",
    statusNeutral: "NEUTRAL",
    msgLowVol: "La volatilidad del mercado es baja. Los participantes institucionales están al margen. Evite operar.",
    reasonLowVol1: "Perfil de volumen extremadamente bajo.",
    reasonLowVol2: "Riesgo de deslizamientos por spreads altos.",
    msgBullish: "Patrones de reversión alcista con aumento de volumen institucional. Configuración óptima para compra.",
    reasonBullish1: "Divergencia alcista formándose en el RSI.",
    reasonBullish2: "Ruptura de volumen confirmada.",
    msgBearish: "Fuerte distribución detectada en la resistencia local. Presión de venta aumentando. Se sugieren stop loss ajustados.",
    reasonBearish1: "RSI indica distribución de sobrecompra.",
    reasonBearish2: "Patrón de rechazo en bloque de órdenes clave.",
    msgNeutral: "Zona de consolidación detectada. Los promedios móviles se mantienen planos.",
    reasonNeutral1: "Sin señal clara de ruptura de tendencia.",
    reasonNeutral2: "Espere el barrido de soporte/resistencia clave.",
    msgConflicting: "Señales de impulso en conflicto en múltiples marcos temporales. Sin ventaja operativa clara.",
    reasonConflicting: "RSI y MACD muestran señales divergentes.",
    
    // V2 Keys
    lblSentimentTitle: "ANÁLISIS DE SENTIMIENTO DE IA",
    lblReplayTitle: "MODO DE REPRODUCCIÓN",
    tabPositions: "POSICIONES (LIVE)",
    tabHistory: "HISTORIAL Y ESTADÍSTICAS",
    tabStrategy: "CREADOR DE ESTRATEGIAS",
    tabAdvisory: "ASESORÍA DE IA",
    statWinRate: "TASA DE GANANCIA",
    statNetProfit: "RETORNO NETO",
    emptyHistory: "Sin ejecuciones cerradas",
    lblRsiBuy: "LÍMITE DE COMPRA RSI",
    lblMacdDir: "DIRECCIÓN MACD",
    lblStrategyEngine: "ESTADO DEL MOTOR DE ESTRATEGIA",
    statusMonitoring: "MONITOREANDO FEEDS",
    statusTriggered: "ALERTA: ¡CRITERIO SATISFECHO!",
    lblAdvisoryTableTitle: "CALIFICACIONES DE ASESORÍA DE IA",
    lblStrategyCardsTitle: "HOJA DE ESTRATEGIAS DE TRADING",
    thAdvisoryTicker: "TICKER",
    thAdvisoryAction: "RECOMENDACIÓN",
    thAdvisoryHoldClass: "CLASE DE MANTENIMIENTO",
    thAdvisoryTimeframe: "MARCO DE TIEMPO",
    thAdvisoryRationale: "RAZÓN",
    btnLiveAIScan: "INICIAR ESCANEO DE IA",
    lblAIScanStatus: "Escaneando mercados con IA...",
    lblIndianDashboardTitle: "PANEL DE INTELIGENCIA DE ACCIONES DE IA",
    lblScannerLiveBadge: "ESCANEO DE NSE/BSE EN VIVO",
    lblDiscoveryFeedTitle: "CONSOLA DE DESCUBRIMIENTO Y REGISTRO EN TIEMPO REAL DE IA",
    lblDiscoveryCount: "AUDITORÍAS ACTIVAS: "
  }
};

const tickerNamesTranslated = {
  en: {
    nifty: 'Nifty 50 Index', reliance: 'Reliance Industries', tata: 'Tata Motors Limited',
    btc: 'Bitcoin / US Dollar', eth: 'Ethereum / US Dollar', sol: 'Solana / US Dollar',
    eur: 'Euro / US Dollar', gbp: 'Pound / US Dollar', jpy: 'US Dollar / Yen',
    tata_tech: 'Tata Tech Limited', sol_jup: 'Jupiter Token / SOL', usd_chf: 'US Dollar / Franc'
  },
  mr: {
    nifty: 'निफ्टी ५० इंडेक्स', reliance: 'रिलायन्स इंडस्ट्रीज', tata: 'टाटा मोटर्स लिमिटेड',
    btc: 'बिटकॉइन / यूएस डॉलर', eth: 'इथेरियम / यूएस डॉलर', sol: 'सोलाना / यूएस डॉलर',
    eur: 'युरो / यूएस डॉलर', gbp: 'पाउंड / यूएस डॉलर', jpy: 'यूएस डॉलर / येन',
    tata_tech: 'टाटा टेक लिमिटेड', sol_jup: 'ज्युपिटर टोकन / SOL', usd_chf: 'यूएस डॉलर / फ्रँक'
  },
  hi: {
    nifty: 'निफ्टी ५० इंडेक्स', reliance: 'रिलायंस इंडस्ट्रीज', tata: 'टाटा मोटर्स लिमिटेड',
    btc: 'बिटकॉइन / यूएस डॉलर', eth: 'इथेरियम / यूएस डॉलर', sol: 'सोलाना / यूएस डॉलर',
    eur: 'यूरो / यूएस डॉलर', gbp: 'पाउंड / यूएस डॉलर', jpy: 'यूएस डॉलर / येन',
    tata_tech: 'टाटा टेक लिमिटेड', sol_jup: 'जुपिटर टोकन / SOL', usd_chf: 'यूएस डॉलर / फ्रैंक'
  },
  es: {
    nifty: 'Índice Nifty 50', reliance: 'Reliance Industries', tata: 'Tata Motors Limitada',
    btc: 'Bitcoin / Dólar US', eth: 'Ethereum / Dólar US', sol: 'Solana / Dólar US',
    eur: 'Euro / Dólar US', gbp: 'Libra / Dólar US', jpy: 'Dólar US / Yen',
    tata_tech: 'Tata Tech Limitada', sol_jup: 'Token Jupiter / SOL', usd_chf: 'Dólar US / Franco'
  }
};

const majorCoins = [
  { key: "btc", symbol: "BTCUSDT", name: "Bitcoin", base: 63000 },
  { key: "eth", symbol: "ETHUSDT", name: "Ethereum", base: 3500 },
  { key: "sol", symbol: "SOLUSDT", name: "Solana", base: 150 },
  { key: "ada", symbol: "ADAUSDT", name: "Cardano", base: 0.5 },
  { key: "doge", symbol: "DOGEUSDT", name: "Dogecoin", base: 0.12 },
  { key: "xrp", symbol: "XRPUSDT", name: "Ripple", base: 0.60 },
  { key: "dot", symbol: "DOTUSDT", name: "Polkadot", base: 6.5 },
  { key: "matic", symbol: "MATICUSDT", name: "Polygon", base: 0.75 },
  { key: "ltc", symbol: "LTCUSDT", name: "Litecoin", base: 85 },
  { key: "link", symbol: "LINKUSDT", name: "Chainlink", base: 15 },
  { key: "shib", symbol: "SHIBUSDT", name: "Shiba Inu", base: 0.00002 },
  { key: "trx", symbol: "TRXUSDT", name: "TRON", base: 0.11 },
  { key: "bch", symbol: "BCHUSDT", name: "Bitcoin Cash", base: 450 },
  { key: "xlm", symbol: "XLMUSDT", name: "Stellar Lumens", base: 0.12 },
  { key: "uni", symbol: "UNIUSDT", name: "Uniswap", base: 7.5 },
  { key: "atom", symbol: "ATOMUSDT", name: "Cosmos", base: 9.0 },
  { key: "etc", symbol: "ETCUSDT", name: "Ethereum Classic", base: 28 },
  { key: "xmr", symbol: "XMRUSDT", name: "Monero", base: 140 },
  { key: "fil", symbol: "FILUSDT", name: "Filecoin", base: 5.5 },
  { key: "ldo", symbol: "LDOUSDT", name: "Lido DAO", base: 2.2 },
  { key: "hbar", symbol: "HBARUSDT", name: "Hedera", base: 0.08 },
  { key: "apt", symbol: "APTUSDT", name: "Aptos", base: 9.5 },
  { key: "hnt", symbol: "HNTUSDT", name: "Helium", base: 4.8 },
  { key: "ftm", symbol: "FTMUSDT", name: "Fantom", base: 0.80 },
  { key: "vet", symbol: "VETUSDT", name: "VeChain", base: 0.03 },
  { key: "grt", symbol: "GRTUSDT", name: "The Graph", base: 0.25 },
  { key: "aave", symbol: "AAVEUSDT", name: "Aave", base: 95 },
  { key: "mkr", symbol: "MKRUSDT", name: "Maker", base: 2500 },
  { key: "op", symbol: "OPUSDT", name: "Optimism", base: 2.8 },
  { key: "arb", symbol: "ARBUSDT", name: "Arbitrum", base: 1.15 },
  { key: "inj", symbol: "INJUSDT", name: "Injective", base: 28 },
  { key: "rndr", symbol: "RNDRUSDT", name: "Render Token", base: 8.5 },
  { key: "sei", symbol: "SEIUSDT", name: "Sei", base: 0.65 },
  { key: "sui", symbol: "SUIUSDT", name: "Sui", base: 1.25 },
  { key: "imx", symbol: "IMXUSDT", name: "Immutable", base: 2.1 },
  { key: "tia", symbol: "TIAUSDT", name: "Celestia", base: 11.2 },
  { key: "rune", symbol: "RUNEUSDT", name: "THORChain", base: 5.8 },
  { key: "algo", symbol: "ALGOUSDT", name: "Algorand", base: 0.18 },
  { key: "egld", symbol: "EGLDUSDT", name: "MultiversX", base: 42 },
  { key: "flow", symbol: "FLOWUSDT", name: "Flow", base: 0.95 },
  { key: "sand", symbol: "SANDUSDT", name: "The Sandbox", base: 0.45 },
  { key: "mana", symbol: "MANAUSDT", name: "Decentraland", base: 0.48 },
  { key: "theta", symbol: "THETAUSDT", name: "Theta Network", base: 2.1 },
  { key: "chz", symbol: "CHZUSDT", name: "Chiliz", base: 0.12 },
  { key: "axs", symbol: "AXSUSDT", name: "Axie Infinity", base: 7.2 },
  { key: "kava", symbol: "KAVAUSDT", name: "Kava", base: 0.72 },
  { key: "gala", symbol: "GALAUSDT", name: "Gala", base: 0.04 },
  { key: "neo", symbol: "NEOUSDT", name: "Neo", base: 14.5 },
  { key: "iota", symbol: "IOTAUSDT", name: "IOTA", base: 0.22 },
  { key: "qtum", symbol: "QTUMUSDT", name: "Qtum", base: 3.8 },
  { key: "zec", symbol: "ZECUSDT", name: "Zcash", base: 26 },
  { key: "dash", symbol: "DASHUSDT", name: "Dash", base: 30 },
  { key: "near", symbol: "NEARUSDT", name: "NEAR Protocol", base: 5.5 },
  { key: "avax", symbol: "AVAXUSDT", name: "Avalanche", base: 32 },
  { key: "pepe", symbol: "PEPEUSDT", name: "Pepe Coin", base: 0.000008 },
  { key: "floki", symbol: "FLOKIUSDT", name: "Floki", base: 0.00018 },
  { key: "bonk", symbol: "BONKUSDT", name: "Bonk", base: 0.000024 },
  { key: "wif", symbol: "WIFUSDT", name: "dogwifhat", base: 2.6 },
  { key: "stx", symbol: "STXUSDT", name: "Stacks", base: 1.8 },
  { key: "gmt", symbol: "GMTUSDT", name: "STEPN", base: 0.22 },
  { key: "mina", symbol: "MINAUSDT", name: "Mina Protocol", base: 0.65 },
  { key: "ftt", symbol: "FTTUSDT", name: "FTX Token", base: 1.4 },
  { key: "woo", symbol: "WOOUSDT", name: "WOO Network", base: 0.28 },
  { key: "jasmy", symbol: "JASMYUSDT", name: "JasmyCoin", base: 0.02 },
  { key: "1inch", symbol: "1INCHUSDT", name: "1inch Network", base: 0.38 },
  { key: "dydx", symbol: "DYDXUSDT", name: "dYdX", base: 2.1 },
  { key: "enj", symbol: "ENJUSDT", name: "Enjin Coin", base: 0.32 },
  { key: "bat", symbol: "BATUSDT", name: "Basic Attention Token", base: 0.24 },
  { key: "lrc", symbol: "LRCUSDT", name: "Loopring", base: 0.26 },
  { key: "ankr", symbol: "ANKRUSDT", name: "Ankr", base: 0.04 },
  { key: "audio", symbol: "AUDIOUSDT", name: "Audius", base: 0.18 },
  { key: "rvn", symbol: "RVNUSDT", name: "Ravencoin", base: 0.02 },
  { key: "ont", symbol: "ONTUSDT", name: "Ontology", base: 0.28 },
  { key: "waves", symbol: "WAVESUSDT", name: "Waves", base: 2.2 },
  { key: "iost", symbol: "IOSTUSDT", name: "IOST", base: 0.01 },
  { key: "zrx", symbol: "ZRXUSDT", name: "0x", base: 0.42 },
  { key: "one", symbol: "ONEUSDT", name: "Harmony", base: 0.018 }
];

const extraSymbols = [
  "ADA", "DOGE", "XRP", "DOT", "MATIC", "LTC", "LINK", "SHIB", "TRX", "BCH", "XLM", "UNI", "ATOM", "ETC", 
  "XMR", "FIL", "LDO", "HBAR", "APT", "HNT", "FTM", "VET", "GRT", "AAVE", "MKR", "OP", "ARB", "INJ", 
  "RNDR", "SEI", "SUI", "IMX", "TIA", "RUNE", "ALGO", "EGLD", "FLOW", "SAND", "MANA", "THETA", "CHZ", 
  "AXS", "KAVA", "GALA", "NEO", "IOTA", "QTUM", "ZEC", "DASH", "NEAR", "AVAX", "PEPE", "FLOKI", "BONK", 
  "WIF", "STX", "GMT", "MINA", "FTT", "WOO", "JASMY", "1INCH", "DYDX", "ENJ", "BAT", "LRC", "ANKR", 
  "AUDIO", "RVN", "ONT", "WAVES", "IOST", "ZRX", "ONE", "SUSHI", "YFI", "CRV", "COMP", "SNX", "REN", 
  "BAL", "UMA", "BAND", "KNC", "ZIL", "OMG", "NANO", "SC", "DGB", "XVG", "STMX", "STORJ", "RLC", 
  "OGN", "MTL", "UTK", "CVC", "FUN", "LINA", "REEF", "ALICE", "TLM", "BAKE", "BEL", "WRX", "CTSI", 
  "MDT", "STPT", "DENT", "KEY", "DATA", "IQ", "VTHO", "ONG", "DUSK", "COTI", "OXT", "OG", "ASR", 
  "ATM", "JUV", "PSG", "ACM", "BAR", "CITY", "ALPINE", "SANTOS", "PORTO", "LAZIO", "GMT", "JASMY", 
  "FET", "AGIX", "OCEAN", "PHB", "POND", "CTXC", "NFP", "AI", "XAI", "MANTA", "ALT", "JUP", "PYTH", 
  "ONDO", "DYM", "STRK", "PORTAL", "AXL", "W", "SAGA", "TNSR", "OMNI", "REZ", "BB", "NOT", "IO", 
  "ZRO", "LISTA", "RENDER", "BANANA", "TON", "DOGS", "HMSTR", "CATI", "TURBO", "NEIRO", "BABYDOGE", 
  "1CAT", "AERGO", "AGLD", "AKRO", "ALICE", "AMB", "AMP", "AR", "ARK", "ARPA", "AST", "ATA", "ATLAS", 
  "AUCTION", "AUTO", "AVAX", "BADGER", "BIFI", "BLZ", "BNX", "BSW", "C98", "CELO", "CELR", "CHESS", 
  "CHR", "CLV", "CREAM", "DAR", "DEGO", "DIA", "DOCK", "DODO", "EGLD", "ELF", "EPX", "ERN", "FIS", 
  "FOR", "FRONT", "GHST", "GLMR", "GNO", "JOE", "KDA", "KMD", "LAZIO", "LINA", "LIT", "LOKA", "LOOM", 
  "LPT", "LSK", "LTO", "MC", "MINA", "MOVR", "MBOX", "MDX", "MOB", "MDT", "NBS", "NKN", "NMR", "NULS", 
  "OOKI", "ORN", "OM", "OXT", "PEOPLE", "PERP", "PHA", "POLYX", "POWR", "PROS", "PSG", "PUNDIX", 
  "PYR", "RAD", "RARE", "RAY", "REI", "RIF", "RLC", "RSR", "SANTOS", "SCRT", "SFP", "SKL", "SNX", 
  "SOL", "SPELL", "STEEM", "STMX", "STORJ", "STPT", "SUN", "SUPER", "SYS", "T", "TFUEL", "THETA", 
  "TKO", "TLM", "TRB", "TROY", "TUST", "TVK", "UFT", "UNFI", "UTK", "VIB", "VIDT", "VOXEL", "VTHO", 
  "WAN", "WAXP", "WING", "WRX", "WTC", "XEC", "XNO", "XVS", "YFII", "YGG", "ZIL", "ZRX"
];

const generatedCoins = [];
const seenSymbols = new Set();

// 1. Add major coins
majorCoins.forEach(c => {
  const sym = c.symbol.replace("USDT", "");
  generatedCoins.push({
    key: c.key,
    symbol: c.symbol.replace('USDT', '_USDT'),
    name: c.name + " / US Dollar",
    basePrice: c.base,
    decimals: c.base < 0.1 ? 5 : (c.base < 10 ? 4 : 2),
    currentPrice: c.base,
    change: (Math.random() * 6 - 3),
    wsStream: c.symbol.toLowerCase() + '@ticker'
  });
  seenSymbols.add(sym);
});

// 2. Add extra symbols
extraSymbols.forEach(sym => {
  if (generatedCoins.length >= 500) return;
  if (seenSymbols.has(sym)) return;
  
  const key = sym.toLowerCase();
  const base = Math.random() > 0.5 ? (0.1 + Math.random() * 5) : (5 + Math.random() * 80);
  generatedCoins.push({
    key: key,
    symbol: sym + "_USDT",
    name: sym + " Token / US Dollar",
    basePrice: base,
    decimals: base < 0.1 ? 5 : (base < 10 ? 4 : 2),
    currentPrice: base,
    change: (Math.random() * 6 - 3),
    wsStream: (sym + "usdt").toLowerCase() + '@ticker'
  });
  seenSymbols.add(sym);
});

// 3. Fill up to 500 with funny/realistic meme coins
const prefixes = ["Baby", "Safe", "Mega", "Super", "Alpha", "Hyper", "Giga", "Nova", "Cyber", "Rocket"];
const suffixes = ["Chain", "Swap", "Fi", "Dao", "Grow", "Moon", "Coin", "Token", "Protocol", "Network"];

let fillIndex = 1;
while (generatedCoins.length < 500) {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const sym = (prefix.substring(0, 3) + suffix.substring(0, 3)).toUpperCase() + fillIndex;
  
  if (seenSymbols.has(sym)) {
    fillIndex++;
    continue;
  }
  
  const name = `${prefix} ${suffix} v${fillIndex} / US Dollar`;
  const key = sym.toLowerCase();
  const base = 0.001 + Math.random() * 10;
  
  generatedCoins.push({
    key: key,
    symbol: sym + "_USDT",
    name: name,
    basePrice: base,
    decimals: base < 0.1 ? 5 : (base < 10 ? 4 : 2),
    currentPrice: base,
    change: (Math.random() * 6 - 3),
    wsStream: (sym + "usdt").toLowerCase() + '@ticker'
  });
  seenSymbols.add(sym);
  fillIndex++;
}

const marketTickers = {
  indianStocks: [
    {
      "key": "nifty",
      "symbol": "NIFTY_50",
      "name": "Nifty 50 Index",
      "basePrice": 22450,
      "decimals": 2,
      "currentPrice": 22450,
      "change": 0.25,
      "wsStream": null
    },
    {
      "key": "reliance",
      "symbol": "RELIANCE",
      "name": "Reliance Industries",
      "basePrice": 150,
      "decimals": 2,
      "currentPrice": 150,
      "change": 1.25,
      "wsStream": null
    },
    {
      "key": "tata",
      "symbol": "TATA_MOTORS",
      "name": "Tata Motors Limited",
      "basePrice": 150,
      "decimals": 2,
      "currentPrice": 150,
      "change": -0.85,
      "wsStream": null
    },
    {
      "key": "tata_tech",
      "symbol": "TATATECH",
      "name": "Tata Tech Limited",
      "basePrice": 150,
      "decimals": 2,
      "currentPrice": 150,
      "change": 0.15,
      "wsStream": null
    },
    {
      "key": "hdfc",
      "symbol": "HDFCBANK",
      "name": "HDFC Bank Limited",
      "basePrice": 150,
      "decimals": 2,
      "currentPrice": 150,
      "change": 0.15,
      "wsStream": null
    },
    {
      "key": "sbin",
      "symbol": "SBIN",
      "name": "State Bank of India",
      "basePrice": 150,
      "decimals": 2,
      "currentPrice": 150,
      "change": 0.15,
      "wsStream": null
    },
    {
      "key": "tcs",
      "symbol": "TCS",
      "name": "Tata Consultancy Services",
      "basePrice": 150,
      "decimals": 2,
      "currentPrice": 150,
      "change": 0.15,
      "wsStream": null
    },
    {
      "key": "adanient",
      "symbol": "ADANIENT",
      "name": "Adani Enterprises",
      "basePrice": 150,
      "decimals": 2,
      "currentPrice": 150,
      "change": 0.15,
      "wsStream": null
    },
    {
      "key": "coalindia",
      "symbol": "COALINDIA",
      "name": "Coal India Limited",
      "basePrice": 150,
      "decimals": 2,
      "currentPrice": 150,
      "change": 0.15,
      "wsStream": null
    },
    {
      "key": "infy",
      "symbol": "INFY",
      "name": "Infosys Limited",
      "basePrice": 150,
      "decimals": 2,
      "currentPrice": 150,
      "change": 0.15,
      "wsStream": null
    },
    {
      "key": "icicibank",
      "symbol": "ICICIBANK",
      "name": "ICICI Bank Limited",
      "basePrice": 150,
      "decimals": 2,
      "currentPrice": 150,
      "change": 0.15,
      "wsStream": null
    },
    {
      "key": "itc",
      "symbol": "ITC",
      "name": "ITC Limited",
      "basePrice": 150,
      "decimals": 2,
      "currentPrice": 150,
      "change": 0.15,
      "wsStream": null
    },
    {
      "key": "bhartiartl",
      "symbol": "BHARTIARTL",
      "name": "Bharti Airtel Limited",
      "basePrice": 150,
      "decimals": 2,
      "currentPrice": 150,
      "change": 0.15,
      "wsStream": null
    },
    {
      "key": "lt",
      "symbol": "LT",
      "name": "Larsen & Toubro Limited",
      "basePrice": 150,
      "decimals": 2,
      "currentPrice": 150,
      "change": 0.15,
      "wsStream": null
    },
    {
      "key": "maruti",
      "symbol": "MARUTI",
      "name": "Maruti Suzuki Limited",
      "basePrice": 150,
      "decimals": 2,
      "currentPrice": 150,
      "change": 0.15,
      "wsStream": null
    },
    {
      "key": "axisbank",
      "symbol": "AXISBANK",
      "name": "Axis Bank Limited",
      "basePrice": 150,
      "decimals": 2,
      "currentPrice": 150,
      "change": 0.15,
      "wsStream": null
    },
    {
      "key": "kotakbank",
      "symbol": "KOTAKBANK",
      "name": "Kotak Mahindra Bank",
      "basePrice": 1720,
      "decimals": 2,
      "currentPrice": 1720,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "bajfinance",
      "symbol": "BAJFINANCE",
      "name": "Bajaj Finance Limited",
      "basePrice": 6850,
      "decimals": 2,
      "currentPrice": 6850,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "bajajfinsv",
      "symbol": "BAJAJFINSV",
      "name": "Bajaj Finserv Limited",
      "basePrice": 1580,
      "decimals": 2,
      "currentPrice": 1580,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "indusindbk",
      "symbol": "INDUSINDBK",
      "name": "IndusInd Bank Limited",
      "basePrice": 1450,
      "decimals": 2,
      "currentPrice": 1450,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "pnb",
      "symbol": "PNB",
      "name": "Punjab National Bank",
      "basePrice": 125,
      "decimals": 2,
      "currentPrice": 125,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "bob",
      "symbol": "BANKBARODA",
      "name": "Bank of Baroda",
      "basePrice": 255,
      "decimals": 2,
      "currentPrice": 255,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "canbk",
      "symbol": "CANBK",
      "name": "Canara Bank",
      "basePrice": 115,
      "decimals": 2,
      "currentPrice": 115,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "idfcfirstb",
      "symbol": "IDFCFIRSTB",
      "name": "IDFC First Bank Limited",
      "basePrice": 78,
      "decimals": 2,
      "currentPrice": 78,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "federalbnk",
      "symbol": "FEDERALBNK",
      "name": "Federal Bank Limited",
      "basePrice": 165,
      "decimals": 2,
      "currentPrice": 165,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "yesbank",
      "symbol": "YESBANK",
      "name": "Yes Bank Limited",
      "basePrice": 24,
      "decimals": 2,
      "currentPrice": 24,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "bandhanbnk",
      "symbol": "BANDHANBNK",
      "name": "Bandhan Bank Limited",
      "basePrice": 185,
      "decimals": 2,
      "currentPrice": 185,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "recltd",
      "symbol": "RECLTD",
      "name": "REC Limited",
      "basePrice": 510,
      "decimals": 2,
      "currentPrice": 510,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "pfc",
      "symbol": "PFC",
      "name": "Power Finance Corporation",
      "basePrice": 480,
      "decimals": 2,
      "currentPrice": 480,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "lichsgltd",
      "symbol": "LICHSGFIN",
      "name": "LIC Housing Finance",
      "basePrice": 670,
      "decimals": 2,
      "currentPrice": 670,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "sbilife",
      "symbol": "SBILIFE",
      "name": "SBI Life Insurance",
      "basePrice": 1420,
      "decimals": 2,
      "currentPrice": 1420,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "hdfclife",
      "symbol": "HDFCLIFE",
      "name": "HDFC Life Insurance",
      "basePrice": 560,
      "decimals": 2,
      "currentPrice": 560,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "icicipruli",
      "symbol": "ICICIPRULI",
      "name": "ICICI Prudential Life",
      "basePrice": 590,
      "decimals": 2,
      "currentPrice": 590,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "cholafin",
      "symbol": "CHOLAFIN",
      "name": "Cholamandalam Investment",
      "basePrice": 1210,
      "decimals": 2,
      "currentPrice": 1210,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "muthootfin",
      "symbol": "MUTHOOTFIN",
      "name": "Muthoot Finance Limited",
      "basePrice": 1640,
      "decimals": 2,
      "currentPrice": 1640,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "m_mfin",
      "symbol": "M&MFIN",
      "name": "M&M Financial Services",
      "basePrice": 300,
      "decimals": 2,
      "currentPrice": 300,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "lic",
      "symbol": "LICI",
      "name": "Life Insurance Corp of India",
      "basePrice": 980,
      "decimals": 2,
      "currentPrice": 980,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "hcltech",
      "symbol": "HCLTECH",
      "name": "HCL Technologies Limited",
      "basePrice": 1320,
      "decimals": 2,
      "currentPrice": 1320,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "wipro",
      "symbol": "WIPRO",
      "name": "Wipro Limited",
      "basePrice": 460,
      "decimals": 2,
      "currentPrice": 460,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "techm",
      "symbol": "TECHM",
      "name": "Tech Mahindra Limited",
      "basePrice": 1250,
      "decimals": 2,
      "currentPrice": 1250,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "ltim",
      "symbol": "LTIM",
      "name": "LTIMindtree Limited",
      "basePrice": 4750,
      "decimals": 2,
      "currentPrice": 4750,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "ofss",
      "symbol": "OFSS",
      "name": "Oracle Financial Services",
      "basePrice": 8700,
      "decimals": 2,
      "currentPrice": 8700,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "persistent",
      "symbol": "PERSISTENT",
      "name": "Persistent Systems",
      "basePrice": 3750,
      "decimals": 2,
      "currentPrice": 3750,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "coforge",
      "symbol": "COFORGE",
      "name": "Coforge Limited",
      "basePrice": 5120,
      "decimals": 2,
      "currentPrice": 5120,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "kpittech",
      "symbol": "KPITTECH",
      "name": "KPIT Technologies",
      "basePrice": 1480,
      "decimals": 2,
      "currentPrice": 1480,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "ltts",
      "symbol": "LTTS",
      "name": "L&T Technology Services",
      "basePrice": 4680,
      "decimals": 2,
      "currentPrice": 4680,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "idea",
      "symbol": "IDEA",
      "name": "Vodafone Idea Limited",
      "basePrice": 16,
      "decimals": 2,
      "currentPrice": 16,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "tatacomm",
      "symbol": "TATACOMM",
      "name": "Tata Communications",
      "basePrice": 1850,
      "decimals": 2,
      "currentPrice": 1850,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "m_m",
      "symbol": "M&M",
      "name": "Mahindra & Mahindra",
      "basePrice": 2350,
      "decimals": 2,
      "currentPrice": 2350,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "baj_auto",
      "symbol": "BAJAJ-AUTO",
      "name": "Bajaj Auto Limited",
      "basePrice": 9120,
      "decimals": 2,
      "currentPrice": 9120,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "heromotoco",
      "symbol": "HEROMOTOCO",
      "name": "Hero MotoCorp Limited",
      "basePrice": 4750,
      "decimals": 2,
      "currentPrice": 4750,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "eichermot",
      "symbol": "EICHERMOT",
      "name": "Eicher Motors Limited",
      "basePrice": 4650,
      "decimals": 2,
      "currentPrice": 4650,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "ashokley",
      "symbol": "ASHOKLEY",
      "name": "Ashok Leyland Limited",
      "basePrice": 220,
      "decimals": 2,
      "currentPrice": 220,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "tvsmotor",
      "symbol": "TVSMOTOR",
      "name": "TVS Motor Company",
      "basePrice": 2150,
      "decimals": 2,
      "currentPrice": 2150,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "bharatforg",
      "symbol": "BHARATFORG",
      "name": "Bharat Forge Limited",
      "basePrice": 1220,
      "decimals": 2,
      "currentPrice": 1220,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "balkrisind",
      "symbol": "BALKRISIND",
      "name": "Balkrishna Industries",
      "basePrice": 3120,
      "decimals": 2,
      "currentPrice": 3120,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "mrf",
      "symbol": "MRF",
      "name": "MRF Limited",
      "basePrice": 128000,
      "decimals": 1,
      "currentPrice": 128000,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "apollotyre",
      "symbol": "APOLLOTYRE",
      "name": "Apollo Tyres Limited",
      "basePrice": 475,
      "decimals": 2,
      "currentPrice": 475,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "ongc",
      "symbol": "ONGC",
      "name": "Oil & Natural Gas Corp",
      "basePrice": 275,
      "decimals": 2,
      "currentPrice": 275,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "ntpc",
      "symbol": "NTPC",
      "name": "NTPC Limited",
      "basePrice": 360,
      "decimals": 2,
      "currentPrice": 360,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "powergrid",
      "symbol": "POWERGRID",
      "name": "Power Grid Corporation",
      "basePrice": 285,
      "decimals": 2,
      "currentPrice": 285,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "bpcl",
      "symbol": "BPCL",
      "name": "Bharat Petroleum Corp",
      "basePrice": 610,
      "decimals": 2,
      "currentPrice": 610,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "ioc",
      "symbol": "IOC",
      "name": "Indian Oil Corporation",
      "basePrice": 165,
      "decimals": 2,
      "currentPrice": 165,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "hpcl",
      "symbol": "HPCL",
      "name": "Hindustan Petroleum Corp",
      "basePrice": 520,
      "decimals": 2,
      "currentPrice": 520,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "gail",
      "symbol": "GAIL",
      "name": "GAIL (India) Limited",
      "basePrice": 210,
      "decimals": 2,
      "currentPrice": 210,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "oil",
      "symbol": "OIL",
      "name": "Oil India Limited",
      "basePrice": 620,
      "decimals": 2,
      "currentPrice": 620,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "mgl",
      "symbol": "MGL",
      "name": "Mahanagar Gas Limited",
      "basePrice": 1420,
      "decimals": 2,
      "currentPrice": 1420,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "igl",
      "symbol": "IGL",
      "name": "Indraprastha Gas Limited",
      "basePrice": 430,
      "decimals": 2,
      "currentPrice": 430,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "gujgasltd",
      "symbol": "GUJGASLTD",
      "name": "Gujarat Gas Limited",
      "basePrice": 550,
      "decimals": 2,
      "currentPrice": 550,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "adanigreen",
      "symbol": "ADANIGREEN",
      "name": "Adani Green Energy",
      "basePrice": 1850,
      "decimals": 2,
      "currentPrice": 1850,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "adanipower",
      "symbol": "ADANIPOWER",
      "name": "Adani Power Limited",
      "basePrice": 620,
      "decimals": 2,
      "currentPrice": 620,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "tatapower",
      "symbol": "TATAPOWER",
      "name": "Tata Power Company",
      "basePrice": 430,
      "decimals": 2,
      "currentPrice": 430,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "jswenergy",
      "symbol": "JSWENERGY",
      "name": "JSW Energy Limited",
      "basePrice": 590,
      "decimals": 2,
      "currentPrice": 590,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "nhpc",
      "symbol": "NHPC",
      "name": "NHPC Limited",
      "basePrice": 105,
      "decimals": 2,
      "currentPrice": 105,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "sjvn",
      "symbol": "SJVN",
      "name": "SJVN Limited",
      "basePrice": 135,
      "decimals": 2,
      "currentPrice": 135,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "tatasteel",
      "symbol": "TATASTEEL",
      "name": "Tata Steel Limited",
      "basePrice": 165,
      "decimals": 2,
      "currentPrice": 165,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "jswsteel",
      "symbol": "JSWSTEEL",
      "name": "JSW Steel Limited",
      "basePrice": 880,
      "decimals": 2,
      "currentPrice": 880,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "hindalco",
      "symbol": "HINDALCO",
      "name": "Hindalco Industries",
      "basePrice": 620,
      "decimals": 2,
      "currentPrice": 620,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "vedl",
      "symbol": "VEDL",
      "name": "Vedanta Limited",
      "basePrice": 450,
      "decimals": 2,
      "currentPrice": 450,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "nmdc",
      "symbol": "NMDC",
      "name": "NMDC Limited",
      "basePrice": 240,
      "decimals": 2,
      "currentPrice": 240,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "sail",
      "symbol": "SAIL",
      "name": "Steel Authority of India",
      "basePrice": 155,
      "decimals": 2,
      "currentPrice": 155,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "nationalum",
      "symbol": "NATIONALUM",
      "name": "National Aluminium Co",
      "basePrice": 190,
      "decimals": 2,
      "currentPrice": 190,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "jindalstel",
      "symbol": "JINDALSTEL",
      "name": "Jindal Steel & Power",
      "basePrice": 980,
      "decimals": 2,
      "currentPrice": 980,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "sunpharma",
      "symbol": "SUNPHARMA",
      "name": "Sun Pharmaceutical Ind",
      "basePrice": 1540,
      "decimals": 2,
      "currentPrice": 1540,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "cipla",
      "symbol": "CIPLA",
      "name": "Cipla Limited",
      "basePrice": 1420,
      "decimals": 2,
      "currentPrice": 1420,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "drreddy",
      "symbol": "DRREDDY",
      "name": "Dr Reddy's Laboratories",
      "basePrice": 6120,
      "decimals": 2,
      "currentPrice": 6120,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "divislab",
      "symbol": "DIVISLAB",
      "name": "Divi's Laboratories",
      "basePrice": 3850,
      "decimals": 2,
      "currentPrice": 3850,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "apollohosp",
      "symbol": "APOLLOHOSP",
      "name": "Apollo Hospitals Enterprise",
      "basePrice": 5980,
      "decimals": 2,
      "currentPrice": 5980,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "auroharma",
      "symbol": "AUROPHARMA",
      "name": "Aurobindo Pharma",
      "basePrice": 1220,
      "decimals": 2,
      "currentPrice": 1220,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "lupin",
      "symbol": "LUPIN",
      "name": "Lupin Limited",
      "basePrice": 1580,
      "decimals": 2,
      "currentPrice": 1580,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "biocon",
      "symbol": "BIOCON",
      "name": "Biocon Limited",
      "basePrice": 250,
      "decimals": 2,
      "currentPrice": 250,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "torrentph",
      "symbol": "TORNTPHARM",
      "name": "Torrent Pharmaceuticals",
      "basePrice": 2650,
      "decimals": 2,
      "currentPrice": 2650,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "zyduslife",
      "symbol": "ZYDUSLIFE",
      "name": "Zydus Lifesciences",
      "basePrice": 950,
      "decimals": 2,
      "currentPrice": 950,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "maxhealth",
      "symbol": "MAXHEALTH",
      "name": "Max Healthcare Institute",
      "basePrice": 790,
      "decimals": 2,
      "currentPrice": 790,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "lalpathlab",
      "symbol": "LALPATHLAB",
      "name": "Dr Lal PathLabs",
      "basePrice": 2350,
      "decimals": 2,
      "currentPrice": 2350,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "hindunilvr",
      "symbol": "HINDUNILVR",
      "name": "Hindustan Unilever",
      "basePrice": 2350,
      "decimals": 2,
      "currentPrice": 2350,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "nestleind",
      "symbol": "NESTLEIND",
      "name": "Nestle India Limited",
      "basePrice": 2480,
      "decimals": 2,
      "currentPrice": 2480,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "britannia",
      "symbol": "BRITANNIA",
      "name": "Britannia Industries",
      "basePrice": 4850,
      "decimals": 2,
      "currentPrice": 4850,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "vbl",
      "symbol": "VBL",
      "name": "Varun Beverages Limited",
      "basePrice": 1420,
      "decimals": 2,
      "currentPrice": 1420,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "tataconsum",
      "symbol": "TATACONSUM",
      "name": "Tata Consumer Products",
      "basePrice": 1120,
      "decimals": 2,
      "currentPrice": 1120,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "colpal",
      "symbol": "COLPAL",
      "name": "Colgate Palmolive India",
      "basePrice": 2650,
      "decimals": 2,
      "currentPrice": 2650,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "marico",
      "symbol": "MARICO",
      "name": "Marico Limited",
      "basePrice": 520,
      "decimals": 2,
      "currentPrice": 520,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "dabur",
      "symbol": "DABUR",
      "name": "Dabur India Limited",
      "basePrice": 510,
      "decimals": 2,
      "currentPrice": 510,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "godrejcp",
      "symbol": "GODREJCP",
      "name": "Godrej Consumer Products",
      "basePrice": 1180,
      "decimals": 2,
      "currentPrice": 1180,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "godrejprop",
      "symbol": "GODREJPROP",
      "name": "Godrej Properties",
      "basePrice": 2550,
      "decimals": 2,
      "currentPrice": 2550,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "dlf",
      "symbol": "DLF",
      "name": "DLF Limited",
      "basePrice": 820,
      "decimals": 2,
      "currentPrice": 820,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "oberoirlty",
      "symbol": "OBEROIRLTY",
      "name": "Oberoi Realty Limited",
      "basePrice": 1520,
      "decimals": 2,
      "currentPrice": 1520,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "dmart",
      "symbol": "DMART",
      "name": "Avenue Supermarts (DMart)",
      "basePrice": 4350,
      "decimals": 2,
      "currentPrice": 4350,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "trent",
      "symbol": "TRENT",
      "name": "Trent Limited (Tata)",
      "basePrice": 4620,
      "decimals": 2,
      "currentPrice": 4620,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "zomato",
      "symbol": "ZOMATO",
      "name": "Zomato Limited",
      "basePrice": 180,
      "decimals": 2,
      "currentPrice": 180,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "titan",
      "symbol": "TITAN",
      "name": "Titan Company Limited",
      "basePrice": 3250,
      "decimals": 2,
      "currentPrice": 3250,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "asianpaint",
      "symbol": "ASIANPAINT",
      "name": "Asian Paints Limited",
      "basePrice": 2850,
      "decimals": 2,
      "currentPrice": 2850,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "bergerpaint",
      "symbol": "BERGERPAINT",
      "name": "Berger Paints India",
      "basePrice": 520,
      "decimals": 2,
      "currentPrice": 520,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "pidilitind",
      "symbol": "PIDILITIND",
      "name": "Pidilite Industries",
      "basePrice": 2750,
      "decimals": 2,
      "currentPrice": 2750,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "ultracemco",
      "symbol": "ULTRACEMCO",
      "name": "UltraTech Cement Limited",
      "basePrice": 9650,
      "decimals": 2,
      "currentPrice": 9650,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "grasim",
      "symbol": "GRASIM",
      "name": "Grasim Industries",
      "basePrice": 2250,
      "decimals": 2,
      "currentPrice": 2250,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "shreecem",
      "symbol": "SHREECEM",
      "name": "Shree Cements Limited",
      "basePrice": 25400,
      "decimals": 1,
      "currentPrice": 25400,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "ambujacem",
      "symbol": "AMBUJACEM",
      "name": "Ambuja Cements Limited",
      "basePrice": 610,
      "decimals": 2,
      "currentPrice": 610,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "acc",
      "symbol": "ACC",
      "name": "ACC Limited",
      "basePrice": 2450,
      "decimals": 2,
      "currentPrice": 2450,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "bhel",
      "symbol": "BHEL",
      "name": "Bharat Heavy Electricals",
      "basePrice": 280,
      "decimals": 2,
      "currentPrice": 280,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "bel",
      "symbol": "BEL",
      "name": "Bharat Electronics Limited",
      "basePrice": 225,
      "decimals": 2,
      "currentPrice": 225,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "hal",
      "symbol": "HAL",
      "name": "Hindustan Aeronautics",
      "basePrice": 4120,
      "decimals": 2,
      "currentPrice": 4120,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "siemens",
      "symbol": "SIEMENS",
      "name": "Siemens India Limited",
      "basePrice": 6750,
      "decimals": 2,
      "currentPrice": 6750,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "abb",
      "symbol": "ABB",
      "name": "ABB India Limited",
      "basePrice": 7850,
      "decimals": 2,
      "currentPrice": 7850,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "cumminsind",
      "symbol": "CUMMINSIND",
      "name": "Cummins India Limited",
      "basePrice": 3250,
      "decimals": 2,
      "currentPrice": 3250,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "gmrinfra",
      "symbol": "GMRINFRA",
      "name": "GMR Infrastructure",
      "basePrice": 85,
      "decimals": 2,
      "currentPrice": 85,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "adaniports",
      "symbol": "ADANIPORTS",
      "name": "Adani Ports & SEZ",
      "basePrice": 1280,
      "decimals": 2,
      "currentPrice": 1280,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "concor",
      "symbol": "CONCOR",
      "name": "Container Corp of India",
      "basePrice": 950,
      "decimals": 2,
      "currentPrice": 950,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "upl",
      "symbol": "UPL",
      "name": "UPL Limited",
      "basePrice": 510,
      "decimals": 2,
      "currentPrice": 510,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "srf",
      "symbol": "SRF",
      "name": "SRF Limited",
      "basePrice": 2250,
      "decimals": 2,
      "currentPrice": 2250,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "tatachem",
      "symbol": "TATACHEM",
      "name": "Tata Chemicals Limited",
      "basePrice": 1050,
      "decimals": 2,
      "currentPrice": 1050,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "deepakntr",
      "symbol": "DEEPAKNTR",
      "name": "Deepak Nitrite Limited",
      "basePrice": 2150,
      "decimals": 2,
      "currentPrice": 2150,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "piind",
      "symbol": "PIIND",
      "name": "PI Industries Limited",
      "basePrice": 3550,
      "decimals": 2,
      "currentPrice": 3550,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "polycab",
      "symbol": "POLYCAB",
      "name": "Polycab India Limited",
      "basePrice": 6350,
      "decimals": 2,
      "currentPrice": 6350,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "havells",
      "symbol": "HAVELLS",
      "name": "Havells India Limited",
      "basePrice": 1520,
      "decimals": 2,
      "currentPrice": 1520,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "voltas",
      "symbol": "VOLTAS",
      "name": "Voltas Limited (Tata)",
      "basePrice": 1420,
      "decimals": 2,
      "currentPrice": 1420,
      "change": 0,
      "wsStream": null
    },
    {
      "key": "dixon",
      "symbol": "DIXON",
      "name": "Dixon Technologies",
      "basePrice": 9150,
      "decimals": 2,
      "currentPrice": 9150,
      "change": 0,
      "wsStream": null
    }
  ],
  crypto: generatedCoins,
  forex: [
  {
    "key": "usdeur",
    "symbol": "USD_EUR",
    "name": "US Dollar / Euro",
    "basePrice": 0.92,
    "decimals": 5,
    "currentPrice": 0.92,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdgbp",
    "symbol": "USD_GBP",
    "name": "US Dollar / Pound Sterling",
    "basePrice": 0.78,
    "decimals": 5,
    "currentPrice": 0.78,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdjpy",
    "symbol": "USD_JPY",
    "name": "US Dollar / Japanese Yen",
    "basePrice": 156.4,
    "decimals": 3,
    "currentPrice": 156.4,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdaud",
    "symbol": "USD_AUD",
    "name": "US Dollar / Australian Dollar",
    "basePrice": 1.5,
    "decimals": 5,
    "currentPrice": 1.5,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdcad",
    "symbol": "USD_CAD",
    "name": "US Dollar / Canadian Dollar",
    "basePrice": 1.36,
    "decimals": 5,
    "currentPrice": 1.36,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdchf",
    "symbol": "USD_CHF",
    "name": "US Dollar / Swiss Franc",
    "basePrice": 0.89,
    "decimals": 5,
    "currentPrice": 0.89,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdnzd",
    "symbol": "USD_NZD",
    "name": "US Dollar / New Zealand Dollar",
    "basePrice": 1.63,
    "decimals": 5,
    "currentPrice": 1.63,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eurusd",
    "symbol": "EUR_USD",
    "name": "Euro / US Dollar",
    "basePrice": 1.08696,
    "decimals": 5,
    "currentPrice": 1.08696,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eurgbp",
    "symbol": "EUR_GBP",
    "name": "Euro / Pound Sterling",
    "basePrice": 0.84783,
    "decimals": 5,
    "currentPrice": 0.84783,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eurjpy",
    "symbol": "EUR_JPY",
    "name": "Euro / Japanese Yen",
    "basePrice": 170,
    "decimals": 3,
    "currentPrice": 170,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "euraud",
    "symbol": "EUR_AUD",
    "name": "Euro / Australian Dollar",
    "basePrice": 1.63043,
    "decimals": 5,
    "currentPrice": 1.63043,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eurcad",
    "symbol": "EUR_CAD",
    "name": "Euro / Canadian Dollar",
    "basePrice": 1.47826,
    "decimals": 5,
    "currentPrice": 1.47826,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eurchf",
    "symbol": "EUR_CHF",
    "name": "Euro / Swiss Franc",
    "basePrice": 0.96739,
    "decimals": 5,
    "currentPrice": 0.96739,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eurnzd",
    "symbol": "EUR_NZD",
    "name": "Euro / New Zealand Dollar",
    "basePrice": 1.77174,
    "decimals": 5,
    "currentPrice": 1.77174,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpusd",
    "symbol": "GBP_USD",
    "name": "Pound Sterling / US Dollar",
    "basePrice": 1.28205,
    "decimals": 5,
    "currentPrice": 1.28205,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpeur",
    "symbol": "GBP_EUR",
    "name": "Pound Sterling / Euro",
    "basePrice": 1.17949,
    "decimals": 5,
    "currentPrice": 1.17949,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpjpy",
    "symbol": "GBP_JPY",
    "name": "Pound Sterling / Japanese Yen",
    "basePrice": 200.513,
    "decimals": 3,
    "currentPrice": 200.513,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpaud",
    "symbol": "GBP_AUD",
    "name": "Pound Sterling / Australian Dollar",
    "basePrice": 1.92308,
    "decimals": 5,
    "currentPrice": 1.92308,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpcad",
    "symbol": "GBP_CAD",
    "name": "Pound Sterling / Canadian Dollar",
    "basePrice": 1.74359,
    "decimals": 5,
    "currentPrice": 1.74359,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpchf",
    "symbol": "GBP_CHF",
    "name": "Pound Sterling / Swiss Franc",
    "basePrice": 1.14103,
    "decimals": 5,
    "currentPrice": 1.14103,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpnzd",
    "symbol": "GBP_NZD",
    "name": "Pound Sterling / New Zealand Dollar",
    "basePrice": 2.08974,
    "decimals": 5,
    "currentPrice": 2.08974,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "jpyusd",
    "symbol": "JPY_USD",
    "name": "Japanese Yen / US Dollar",
    "basePrice": 0.00639,
    "decimals": 5,
    "currentPrice": 0.00639,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "jpyeur",
    "symbol": "JPY_EUR",
    "name": "Japanese Yen / Euro",
    "basePrice": 0.00588,
    "decimals": 5,
    "currentPrice": 0.00588,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "jpygbp",
    "symbol": "JPY_GBP",
    "name": "Japanese Yen / Pound Sterling",
    "basePrice": 0.00499,
    "decimals": 5,
    "currentPrice": 0.00499,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "jpyaud",
    "symbol": "JPY_AUD",
    "name": "Japanese Yen / Australian Dollar",
    "basePrice": 0.00959,
    "decimals": 5,
    "currentPrice": 0.00959,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "jpycad",
    "symbol": "JPY_CAD",
    "name": "Japanese Yen / Canadian Dollar",
    "basePrice": 0.0087,
    "decimals": 5,
    "currentPrice": 0.0087,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "jpychf",
    "symbol": "JPY_CHF",
    "name": "Japanese Yen / Swiss Franc",
    "basePrice": 0.00569,
    "decimals": 5,
    "currentPrice": 0.00569,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "jpynzd",
    "symbol": "JPY_NZD",
    "name": "Japanese Yen / New Zealand Dollar",
    "basePrice": 0.01042,
    "decimals": 5,
    "currentPrice": 0.01042,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "audusd",
    "symbol": "AUD_USD",
    "name": "Australian Dollar / US Dollar",
    "basePrice": 0.66667,
    "decimals": 5,
    "currentPrice": 0.66667,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "audeur",
    "symbol": "AUD_EUR",
    "name": "Australian Dollar / Euro",
    "basePrice": 0.61333,
    "decimals": 5,
    "currentPrice": 0.61333,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "audgbp",
    "symbol": "AUD_GBP",
    "name": "Australian Dollar / Pound Sterling",
    "basePrice": 0.52,
    "decimals": 5,
    "currentPrice": 0.52,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "audjpy",
    "symbol": "AUD_JPY",
    "name": "Australian Dollar / Japanese Yen",
    "basePrice": 104.267,
    "decimals": 3,
    "currentPrice": 104.267,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "audcad",
    "symbol": "AUD_CAD",
    "name": "Australian Dollar / Canadian Dollar",
    "basePrice": 0.90667,
    "decimals": 5,
    "currentPrice": 0.90667,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "audchf",
    "symbol": "AUD_CHF",
    "name": "Australian Dollar / Swiss Franc",
    "basePrice": 0.59333,
    "decimals": 5,
    "currentPrice": 0.59333,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "audnzd",
    "symbol": "AUD_NZD",
    "name": "Australian Dollar / New Zealand Dollar",
    "basePrice": 1.08667,
    "decimals": 5,
    "currentPrice": 1.08667,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "cadusd",
    "symbol": "CAD_USD",
    "name": "Canadian Dollar / US Dollar",
    "basePrice": 0.73529,
    "decimals": 5,
    "currentPrice": 0.73529,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "cadeur",
    "symbol": "CAD_EUR",
    "name": "Canadian Dollar / Euro",
    "basePrice": 0.67647,
    "decimals": 5,
    "currentPrice": 0.67647,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "cadgbp",
    "symbol": "CAD_GBP",
    "name": "Canadian Dollar / Pound Sterling",
    "basePrice": 0.57353,
    "decimals": 5,
    "currentPrice": 0.57353,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "cadjpy",
    "symbol": "CAD_JPY",
    "name": "Canadian Dollar / Japanese Yen",
    "basePrice": 115,
    "decimals": 3,
    "currentPrice": 115,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "cadaud",
    "symbol": "CAD_AUD",
    "name": "Canadian Dollar / Australian Dollar",
    "basePrice": 1.10294,
    "decimals": 5,
    "currentPrice": 1.10294,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "cadchf",
    "symbol": "CAD_CHF",
    "name": "Canadian Dollar / Swiss Franc",
    "basePrice": 0.65441,
    "decimals": 5,
    "currentPrice": 0.65441,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "cadnzd",
    "symbol": "CAD_NZD",
    "name": "Canadian Dollar / New Zealand Dollar",
    "basePrice": 1.19853,
    "decimals": 5,
    "currentPrice": 1.19853,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "chfusd",
    "symbol": "CHF_USD",
    "name": "Swiss Franc / US Dollar",
    "basePrice": 1.1236,
    "decimals": 5,
    "currentPrice": 1.1236,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "chfeur",
    "symbol": "CHF_EUR",
    "name": "Swiss Franc / Euro",
    "basePrice": 1.03371,
    "decimals": 5,
    "currentPrice": 1.03371,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "chfgbp",
    "symbol": "CHF_GBP",
    "name": "Swiss Franc / Pound Sterling",
    "basePrice": 0.8764,
    "decimals": 5,
    "currentPrice": 0.8764,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "chfjpy",
    "symbol": "CHF_JPY",
    "name": "Swiss Franc / Japanese Yen",
    "basePrice": 175.73,
    "decimals": 3,
    "currentPrice": 175.73,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "chfaud",
    "symbol": "CHF_AUD",
    "name": "Swiss Franc / Australian Dollar",
    "basePrice": 1.68539,
    "decimals": 5,
    "currentPrice": 1.68539,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "chfcad",
    "symbol": "CHF_CAD",
    "name": "Swiss Franc / Canadian Dollar",
    "basePrice": 1.52809,
    "decimals": 5,
    "currentPrice": 1.52809,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "chfnzd",
    "symbol": "CHF_NZD",
    "name": "Swiss Franc / New Zealand Dollar",
    "basePrice": 1.83146,
    "decimals": 5,
    "currentPrice": 1.83146,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "nzdusd",
    "symbol": "NZD_USD",
    "name": "New Zealand Dollar / US Dollar",
    "basePrice": 0.6135,
    "decimals": 5,
    "currentPrice": 0.6135,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "nzdeur",
    "symbol": "NZD_EUR",
    "name": "New Zealand Dollar / Euro",
    "basePrice": 0.56442,
    "decimals": 5,
    "currentPrice": 0.56442,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "nzdgbp",
    "symbol": "NZD_GBP",
    "name": "New Zealand Dollar / Pound Sterling",
    "basePrice": 0.47853,
    "decimals": 5,
    "currentPrice": 0.47853,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "nzdjpy",
    "symbol": "NZD_JPY",
    "name": "New Zealand Dollar / Japanese Yen",
    "basePrice": 95.951,
    "decimals": 3,
    "currentPrice": 95.951,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "nzdaud",
    "symbol": "NZD_AUD",
    "name": "New Zealand Dollar / Australian Dollar",
    "basePrice": 0.92025,
    "decimals": 5,
    "currentPrice": 0.92025,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "nzdcad",
    "symbol": "NZD_CAD",
    "name": "New Zealand Dollar / Canadian Dollar",
    "basePrice": 0.83436,
    "decimals": 5,
    "currentPrice": 0.83436,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "nzdchf",
    "symbol": "NZD_CHF",
    "name": "New Zealand Dollar / Swiss Franc",
    "basePrice": 0.54601,
    "decimals": 5,
    "currentPrice": 0.54601,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdinr",
    "symbol": "USD_INR",
    "name": "US Dollar / Indian Rupee",
    "basePrice": 83.5,
    "decimals": 4,
    "currentPrice": 83.5,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdcny",
    "symbol": "USD_CNY",
    "name": "US Dollar / Chinese Yuan",
    "basePrice": 7.25,
    "decimals": 5,
    "currentPrice": 7.25,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdhkd",
    "symbol": "USD_HKD",
    "name": "US Dollar / Hong Kong Dollar",
    "basePrice": 7.8,
    "decimals": 5,
    "currentPrice": 7.8,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdsgd",
    "symbol": "USD_SGD",
    "name": "US Dollar / Singapore Dollar",
    "basePrice": 1.35,
    "decimals": 5,
    "currentPrice": 1.35,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdsek",
    "symbol": "USD_SEK",
    "name": "US Dollar / Swedish Krona",
    "basePrice": 10.45,
    "decimals": 4,
    "currentPrice": 10.45,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdnok",
    "symbol": "USD_NOK",
    "name": "US Dollar / Norwegian Krone",
    "basePrice": 10.6,
    "decimals": 4,
    "currentPrice": 10.6,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usddkk",
    "symbol": "USD_DKK",
    "name": "US Dollar / Danish Krone",
    "basePrice": 6.85,
    "decimals": 5,
    "currentPrice": 6.85,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdmxn",
    "symbol": "USD_MXN",
    "name": "US Dollar / Mexican Peso",
    "basePrice": 18.2,
    "decimals": 4,
    "currentPrice": 18.2,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdzar",
    "symbol": "USD_ZAR",
    "name": "US Dollar / South African Rand",
    "basePrice": 18.1,
    "decimals": 4,
    "currentPrice": 18.1,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdtry",
    "symbol": "USD_TRY",
    "name": "US Dollar / Turkish Lira",
    "basePrice": 32.8,
    "decimals": 4,
    "currentPrice": 32.8,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdaed",
    "symbol": "USD_AED",
    "name": "US Dollar / UAE Dirham",
    "basePrice": 3.67,
    "decimals": 5,
    "currentPrice": 3.67,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdsar",
    "symbol": "USD_SAR",
    "name": "US Dollar / Saudi Riyal",
    "basePrice": 3.75,
    "decimals": 5,
    "currentPrice": 3.75,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdthb",
    "symbol": "USD_THB",
    "name": "US Dollar / Thai Baht",
    "basePrice": 36.6,
    "decimals": 4,
    "currentPrice": 36.6,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "usdkrw",
    "symbol": "USD_KRW",
    "name": "US Dollar / South Korean Won",
    "basePrice": 1385,
    "decimals": 3,
    "currentPrice": 1385,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eurinr",
    "symbol": "EUR_INR",
    "name": "Euro / Indian Rupee",
    "basePrice": 90.7609,
    "decimals": 4,
    "currentPrice": 90.7609,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eurcny",
    "symbol": "EUR_CNY",
    "name": "Euro / Chinese Yuan",
    "basePrice": 7.88043,
    "decimals": 5,
    "currentPrice": 7.88043,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eurhkd",
    "symbol": "EUR_HKD",
    "name": "Euro / Hong Kong Dollar",
    "basePrice": 8.47826,
    "decimals": 5,
    "currentPrice": 8.47826,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eursgd",
    "symbol": "EUR_SGD",
    "name": "Euro / Singapore Dollar",
    "basePrice": 1.46739,
    "decimals": 5,
    "currentPrice": 1.46739,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eursek",
    "symbol": "EUR_SEK",
    "name": "Euro / Swedish Krona",
    "basePrice": 11.3587,
    "decimals": 4,
    "currentPrice": 11.3587,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eurnok",
    "symbol": "EUR_NOK",
    "name": "Euro / Norwegian Krone",
    "basePrice": 11.5217,
    "decimals": 4,
    "currentPrice": 11.5217,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eurdkk",
    "symbol": "EUR_DKK",
    "name": "Euro / Danish Krone",
    "basePrice": 7.44565,
    "decimals": 5,
    "currentPrice": 7.44565,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eurmxn",
    "symbol": "EUR_MXN",
    "name": "Euro / Mexican Peso",
    "basePrice": 19.7826,
    "decimals": 4,
    "currentPrice": 19.7826,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eurzar",
    "symbol": "EUR_ZAR",
    "name": "Euro / South African Rand",
    "basePrice": 19.6739,
    "decimals": 4,
    "currentPrice": 19.6739,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eurtry",
    "symbol": "EUR_TRY",
    "name": "Euro / Turkish Lira",
    "basePrice": 35.6522,
    "decimals": 4,
    "currentPrice": 35.6522,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "euraed",
    "symbol": "EUR_AED",
    "name": "Euro / UAE Dirham",
    "basePrice": 3.98913,
    "decimals": 5,
    "currentPrice": 3.98913,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eursar",
    "symbol": "EUR_SAR",
    "name": "Euro / Saudi Riyal",
    "basePrice": 4.07609,
    "decimals": 5,
    "currentPrice": 4.07609,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eurthb",
    "symbol": "EUR_THB",
    "name": "Euro / Thai Baht",
    "basePrice": 39.7826,
    "decimals": 4,
    "currentPrice": 39.7826,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "eurkrw",
    "symbol": "EUR_KRW",
    "name": "Euro / South Korean Won",
    "basePrice": 1505.435,
    "decimals": 3,
    "currentPrice": 1505.435,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpinr",
    "symbol": "GBP_INR",
    "name": "Pound Sterling / Indian Rupee",
    "basePrice": 107.051,
    "decimals": 3,
    "currentPrice": 107.051,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpcny",
    "symbol": "GBP_CNY",
    "name": "Pound Sterling / Chinese Yuan",
    "basePrice": 9.29487,
    "decimals": 5,
    "currentPrice": 9.29487,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbphkd",
    "symbol": "GBP_HKD",
    "name": "Pound Sterling / Hong Kong Dollar",
    "basePrice": 10,
    "decimals": 5,
    "currentPrice": 10,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpsgd",
    "symbol": "GBP_SGD",
    "name": "Pound Sterling / Singapore Dollar",
    "basePrice": 1.73077,
    "decimals": 5,
    "currentPrice": 1.73077,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpsek",
    "symbol": "GBP_SEK",
    "name": "Pound Sterling / Swedish Krona",
    "basePrice": 13.3974,
    "decimals": 4,
    "currentPrice": 13.3974,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpnok",
    "symbol": "GBP_NOK",
    "name": "Pound Sterling / Norwegian Krone",
    "basePrice": 13.5897,
    "decimals": 4,
    "currentPrice": 13.5897,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpdkk",
    "symbol": "GBP_DKK",
    "name": "Pound Sterling / Danish Krone",
    "basePrice": 8.78205,
    "decimals": 5,
    "currentPrice": 8.78205,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpmxn",
    "symbol": "GBP_MXN",
    "name": "Pound Sterling / Mexican Peso",
    "basePrice": 23.3333,
    "decimals": 4,
    "currentPrice": 23.3333,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpzar",
    "symbol": "GBP_ZAR",
    "name": "Pound Sterling / South African Rand",
    "basePrice": 23.2051,
    "decimals": 4,
    "currentPrice": 23.2051,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbptry",
    "symbol": "GBP_TRY",
    "name": "Pound Sterling / Turkish Lira",
    "basePrice": 42.0513,
    "decimals": 4,
    "currentPrice": 42.0513,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpaed",
    "symbol": "GBP_AED",
    "name": "Pound Sterling / UAE Dirham",
    "basePrice": 4.70513,
    "decimals": 5,
    "currentPrice": 4.70513,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpsar",
    "symbol": "GBP_SAR",
    "name": "Pound Sterling / Saudi Riyal",
    "basePrice": 4.80769,
    "decimals": 5,
    "currentPrice": 4.80769,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpthb",
    "symbol": "GBP_THB",
    "name": "Pound Sterling / Thai Baht",
    "basePrice": 46.9231,
    "decimals": 4,
    "currentPrice": 46.9231,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "gbpkrw",
    "symbol": "GBP_KRW",
    "name": "Pound Sterling / South Korean Won",
    "basePrice": 1775.641,
    "decimals": 3,
    "currentPrice": 1775.641,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "inrjpy",
    "symbol": "INR_JPY",
    "name": "Indian Rupee / Japanese Yen",
    "basePrice": 1.873,
    "decimals": 3,
    "currentPrice": 1.873,
    "change": 0,
    "wsStream": null
  },
  {
    "key": "cnyjpy",
    "symbol": "CNY_JPY",
    "name": "Chinese Yuan / Japanese Yen",
    "basePrice": 21.572,
    "decimals": 3,
    "currentPrice": 21.572,
    "change": 0,
    "wsStream": null
  }
],
globalMarket: [
  { key: "gold", symbol: "GOLD", name: "Gold Spot", basePrice: 2330.50, decimals: 2, currentPrice: 2330.50, change: 0, wsStream: null },
  { key: "silver", symbol: "SILVER", name: "Silver Spot", basePrice: 29.80, decimals: 3, currentPrice: 29.80, change: 0, wsStream: null },
  { key: "crude", symbol: "CRUDE_OIL", name: "Crude Oil Brent", basePrice: 80.50, decimals: 2, currentPrice: 80.50, change: 0, wsStream: null },
  { key: "natgas", symbol: "NAT_GAS", name: "Natural Gas", basePrice: 2.85, decimals: 3, currentPrice: 2.85, change: 0, wsStream: null },
  { key: "sp500", symbol: "S&P_500", name: "S&P 500 Index", basePrice: 5450.00, decimals: 2, currentPrice: 5450.00, change: 0, wsStream: null },
  { key: "nasdaq", symbol: "NASDAQ_100", name: "NASDAQ 100 Index", basePrice: 19650.00, decimals: 2, currentPrice: 19650.00, change: 0, wsStream: null },
  { key: "dow", symbol: "DOW_JONES", name: "Dow Jones Index", basePrice: 39100.00, decimals: 2, currentPrice: 39100.00, change: 0, wsStream: null }
]
};

const marketVols = {
  indianStocks: { vol: 0.0005, riskPct: 1.5, volMult: 25.4 },
  crypto: { vol: 0.0018, riskPct: 4.5, volMult: 120.5 },
  forex: { vol: 0.0001, riskPct: 0.4, volMult: 12.2 },
  globalMarket: { vol: 0.0006, riskPct: 1.2, volMult: 45.2 }
};

const advisoryDatabase = {
  en: [
    { ticker: "RELIANCE", action: "BUY", holdClass: "SWING", timeframe: "1-2 Weeks", rationale: "RSI divergence combined with strong volume breakout at key support level." },
    { ticker: "TATA_MOTORS", action: "SELL", holdClass: "INTRADAY", timeframe: "15m - 1h", rationale: "Severe overhead resistance block met on high volume, potential pullback expected." },
    { ticker: "NIFTY_50", action: "BUY", holdClass: "LONG-TERM", timeframe: "Holding", rationale: "FII inflows accelerating, bullish macro backdrop with positive rate cut expectations." },
    { ticker: "TATA_TECH", action: "HOLD", holdClass: "SWING", timeframe: "Consolidating", rationale: "Moving averages are flat. Awaiting volume sweep of the recent trading range." }
  ],
  mr: [
    { ticker: "RELIANCE", action: "खरेदी (BUY)", holdClass: "स्विंग (SWING)", timeframe: "१-२ आठवडे", rationale: "महत्वाच्या सपोर्ट लेव्हलवर वाढत्या व्हॉल्यूमसह आरएसआय तेजीचे संकेत (RSI divergence)." },
    { ticker: "TATA_MOTORS", action: "विक्री (SELL)", holdClass: "इंट्राडे (INTRADAY)", timeframe: "१५ मि. - १ तास", rationale: "उच्च व्हॉल्यूमवर वरच्या स्तरावर जोरदार रेझिस्टन्स ब्लॉक, लहान पुलबॅकची अपेक्षा." },
    { ticker: "NIFTY_50", action: "खरेदी (BUY)", holdClass: "दीर्घकालीन (LONG-TERM)", timeframe: "होल्डिंग", rationale: "FII गुंतवणूक वाढत आहे, व्याजदर कपातीची शक्यता असल्याने मार्केटमध्ये तेजीचे वातावरण." },
    { ticker: "TATA_TECH", action: "तटस्थ (HOLD)", holdClass: "स्विंग (SWING)", timeframe: "कंसॉलिडेशन", rationale: "मूव्हिंग ॲव्हरेज सपाट आहेत. ट्रेडिंग रेंजच्या ब्रेकआऊटची वाट पहावी." }
  ],
  hi: [
    { ticker: "RELIANCE", action: "खरीदें (BUY)", holdClass: "स्विंग (SWING)", timeframe: "1-2 सप्ताह", rationale: "महत्वपूर्ण सपोर्ट स्तर पर वोल्यूम ब्रेकआउट और RSI डायवर्जेंस।" },
    { ticker: "TATA_MOTORS", action: "बेचें (SELL)", holdClass: "इंट्राडे (INTRADAY)", timeframe: "15मि - 1घंटा", rationale: "उच्च स्तर पर भारी बिकवाली का दबाव, छोटा पुलबैक संभावित है।" },
    { ticker: "NIFTY_50", action: "खरीदें (BUY)", holdClass: "दीर्घकालीन (LONG-TERM)", timeframe: "होल्डिंग", rationale: "FII प्रवाह बढ़ रहा है, अनुकूल वृहद आर्थिक कारकों से बाजार में तेजी।" },
    { ticker: "TATA_TECH", action: "होल्ड (HOLD)", holdClass: "स्विंग (SWING)", timeframe: "कंसॉलिडेशन", rationale: "मूविंग एवरेज सपाट हैं। नई रेंज के ब्रेकआउट की प्रतीक्षा करें।" }
  ],
  es: [
    { ticker: "RELIANCE", action: "COMPRAR", holdClass: "SWING", timeframe: "1-2 Semanas", rationale: "Divergencia alcista del RSI combinada con ruptura de volumen en soporte clave." },
    { ticker: "TATA_MOTORS", action: "VENDER", holdClass: "INTRADAY", timeframe: "15m - 1h", rationale: "Fuerte resistencia superior detectada con alto volumen, se espera retroceso." },
    { ticker: "NIFTY_50", action: "COMPRAR", holdClass: "LARGO PLAZO", timeframe: "Mantener", rationale: "Entrada de capital institucional acelerándose, entorno macroeconómico alcista." },
    { ticker: "TATA_TECH", action: "MANTENER", holdClass: "SWING", timeframe: "Consolidando", rationale: "Promedios móviles planos. Esperando ruptura del rango actual." }
  ]
};

const strategyDatabase = {
  en: [
    { name: "Scalping", timeframe: "1m / 5m", indicators: "Volume + Order Flow", desc: "Ultra-fast execution targeting micro-movements. Requires strict discipline." },
    { name: "Intraday Trading", timeframe: "15m / 1h", indicators: "VWAP + Bollinger Bands", desc: "Day trading strategy opening and closing all positions within the market hours." },
    { name: "Swing Trading", timeframe: "4h / 1d", indicators: "RSI Divergence + MAs", desc: "Captures price swings over several days to weeks. Excellent for retail traders." },
    { name: "Positional (Hold)", timeframe: "Weekly / Monthly", indicators: "FII Flows + Macro Trends", desc: "Long-term investment targeting major structural trends. Fundamental strength." }
  ],
  mr: [
    { name: "स्कॅल्पिंग (Scalping)", timeframe: "१ मि. / ५ मि.", indicators: "व्हॉल्यूम + ऑर्डर फ्लो", desc: "बाजारातील अगदी सूक्ष्म हालचालींवरून जलद गतीने नफा मिळवण्याचे धोरण. कडक शिस्त आवश्यक." },
    { name: "इंट्राडे ट्रेडिंग (Intraday)", timeframe: "१५ मि. / १ तास", indicators: "VWAP + बोलिंगर बँड्स", desc: "बाजार सुरू असतानाच सर्व व्यवहार उघडून बंद करणे. दैनंदिन व्हॉलॅटिलिटीवर आधारित." },
    { name: "स्विंग ट्रेडिंग (Swing)", timeframe: "४ तास / १ दिवस", indicators: "RSI डायव्हर्जेंस + MAs", desc: "काही दिवस ते आठवड्यांच्या कालावधीत किंमतीतील चढ-उतार पकडणे. सतत वॉच न करणाऱ्यांसाठी योग्य." },
    { name: "पोझिशनल होल्ड (Positional)", timeframe: "साप्ताहिक / मासिक", indicators: "FII फ्लो + मॅक्रो ट्रेन्ड्स", desc: "दीर्घकालीन गुंतवणूक जी प्रमुख रचनात्मक ट्रेन्ड्सवर लक्ष केंद्रित करते." }
  ],
  hi: [
    { name: "स्कैल्पिंग (Scalping)", timeframe: "1मि / 5मि", indicators: "वॉल्यूम + ऑर्डर फ्लो", desc: "सूक्ष्म-मूवमेंट को लक्षित करने वाले तीव्र ट्रेड। सख्त अनुशासन की आवश्यकता होती है।" },
    { name: "इंट्राडे ट्रेडिंग (Intraday)", timeframe: "15मि / 1घंटा", indicators: "VWAP + बोलिंजर बैंड्स", desc: "बाजार के समय के भीतर सभी पोजीशन खोलना और बंद करना। दैनिक उतार-चढ़ाव पर निर्भर।" },
    { name: "स्विंग ट्रेडिंग (Swing)", timeframe: "4घंटा / 1दिन", indicators: "RSI डायवर्जेंस + MAs", desc: "कई दिनों से हफ्तों तक के मूल्य स्विंग्स को किसे भी समय कैप्चर करना।" },
    { name: "पोजीशनल होल्ड (Positional)", timeframe: "साप्ताहिक / मासिक", indicators: "FII प्रवाह + व्यापक आर्थिक रुझान", desc: "दीर्घकालिक निवेश जो प्रमुख संरचनात्मक रुझानों को लक्षित करता है।" }
  ],
  es: [
    { name: "Scalping", timeframe: "1m / 5m", indicators: "Volumen + Flujo de Órdenes", desc: "Ejecución ultrarrápida dirigida a micro-movimientos. Requiere estricta disciplina." },
    { name: "Trading Intradía", timeframe: "15m / 1h", indicators: "VWAP + Bandas de Bollinger", desc: "Estrategia de trading diario que abre y cierra todas las posiciones en el mismo día." },
    { name: "Trading de Swing", timeframe: "4h / 1d", indicators: "Divergencia RSI + MAs", desc: "Captura oscilaciones de precios durante varios días o semanas. Excelente para minoristas." },
    { name: "Posicional (Mantener)", timeframe: "Semanal / Mensual", indicators: "Flujos FII + Tendencias Macro", desc: "Inversión a largo plazo dirigida a grandes tendencias estructurales de mercado." }
  ]
};

export {
  newsDatabase,
  marketTickers,
  marketVols,
  advisoryDatabase,
  langDb,
  BACKEND_API_URL,
  RENDER_BACKEND_URL
};

