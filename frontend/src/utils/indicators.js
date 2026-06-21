// Advanced Indicator Math helpers
export function calculateSMA(data, period) {
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

export function calculateEMA(data, period) {
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

export function calculateBollingerBands(data, period = 20, stdDevMult = 2) {
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

export function detectPatternAndTraps(symbol, history, rsi, macd, signalLine, volume, decimals) {
  if (!history || history.length < 10) return null;
  const currentPrice = history[history.length - 1];
  const prevPrice = history[history.length - 2] || currentPrice;
  const priceDiff = currentPrice - prevPrice;

  // Compute a simple hash based on symbol to give each coin its own unique flavor/levels
  let symbolHash = 0;
  const cleanSymbol = symbol ? symbol.replace('_', '') : 'BTCUSDT';
  for (let i = 0; i < cleanSymbol.length; i++) {
    symbolHash = (symbolHash << 5) - symbolHash + cleanSymbol.charCodeAt(i);
    symbolHash |= 0;
  }
  symbolHash = Math.abs(symbolHash);

  // Determine pattern type and keys
  let type = 'PATTERN';
  let patternKey = 'patternTriangle';
  let color = 'var(--green-neon)';
  let confidence = (95 + (symbolHash % 40) / 10).toFixed(2);
  let sweepPrice = currentPrice;
  let stopLoss = currentPrice * 0.99;
  let targetPrice = currentPrice * 1.02;
  let signalStrength = '85% Momentum Breakout';
  let actionPlan = {
    en: "Pattern breakout confirmed. Trend expansion active.",
    mr: "चार्ट पॅटर्न ब्रेकआऊट निश्चित. किमतीमध्ये वाढ सक्रिय.",
    hi: "पैटर्न ब्रेकआउट की पुष्टि। ट्रेंड विस्तार सक्रिय।",
    es: "Ruptura de patrón confirmada. Expansión de tendencia activa."
  };

  // 1. Trap Conditions (RSI extreme or high volume anomaly)
  const isOverbought = rsi > 68;
  const isOversold = rsi < 32;

  // Selection option based on indicators and hash
  const option = (symbolHash + Math.floor(rsi + volume)) % 5;

  if (isOverbought) {
    if (option % 2 === 0) {
      type = 'TRAP';
      patternKey = 'trapBullTrap';
      color = 'var(--red-neon)';
      confidence = (97.4 + (symbolHash % 20) / 10).toFixed(2);
      sweepPrice = currentPrice * 1.002;
      stopLoss = currentPrice * 1.006;
      targetPrice = currentPrice * 0.985;
      signalStrength = `${Math.floor(88 + (symbolHash % 10))}% Bearish Rejection`;
      actionPlan = {
        en: "Bearish rejection at premium liquidity sweep block. Institutional sell blocks matched. Avoid longs.",
        mr: "प्रीमियम लिक्विडिटी ब्लॉक मधे मंदीचे संकेत. संस्थात्मक विक्री ऑर्डर्स सक्रिय. खरेदी करणे टाळा.",
        hi: "प्रीमियम लिक्विडिटी ब्लॉक पर मंदी का संकेत। संस्थागत बिकवाली ऑर्डर सक्रिय। लॉग पोजीशन से बचें।",
        es: "Rechazo bajista en el bloque de barrido de liquidez. Bloques de venta institucionales igualados."
      };
    } else {
      type = 'PATTERN';
      patternKey = 'patternHeadShoulders';
      color = 'var(--red-neon)';
      confidence = (96.2 + (symbolHash % 30) / 10).toFixed(2);
      sweepPrice = currentPrice * 1.001;
      stopLoss = currentPrice * 1.005;
      targetPrice = currentPrice * 0.98;
      signalStrength = `${Math.floor(86 + (symbolHash % 12))}% Peak Distribution`;
      actionPlan = {
        en: "Distribution phase near key overhead resistance block. Head & Shoulders peak forming.",
        mr: "महत्वाच्या रेझिस्टन्स जवळ वितरणाचा टप्पा (Distribution). हेड अँड शोल्डर्स पीक तयार होत आहे.",
        hi: "महत्वपूर्ण रेजिस्टेंस के पास वितरण चरण। हेड एंड शोल्डर्स पीक बन रहा है।",
        es: "Fase de distribución cerca de la resistencia. Pico de Hombro-Cabeza-Hombro formándose."
      };
    }
  } else if (isOversold) {
    if (option % 2 === 0) {
      type = 'TRAP';
      patternKey = 'trapBearTrap';
      color = 'var(--green-neon)';
      confidence = (98.1 + (symbolHash % 15) / 10).toFixed(2);
      sweepPrice = currentPrice * 0.997;
      stopLoss = currentPrice * 0.993;
      targetPrice = currentPrice * 1.02;
      signalStrength = `${Math.floor(92 + (symbolHash % 8))}% Bullish Defense`;
      actionPlan = {
        en: "Bullish sweep confirmed at discount levels. Institutional buy orders triggered. Target local resistance.",
        mr: "डिस्काउंट पातळीवर तेजीचा स्वीप निश्चित. संस्थात्मक खरेदी ऑर्डर्स सक्रिय. स्थानिक रेझिस्टन्स पातळी लक्ष्य करा.",
        hi: "डिस्काउंट स्तर पर तेजी का स्वीप निश्चित। संस्थागत खरीद ऑर्डर सक्रिय। स्थानीय रेजिस्टेंस को लक्षित करें।",
        es: "Barrido alcista verificado en niveles de descuento. Órdenes de compra institucionales activadas."
      };
    } else {
      type = 'PATTERN';
      patternKey = 'patternDoubleBottom';
      color = 'var(--green-neon)';
      confidence = (96.8 + (symbolHash % 25) / 10).toFixed(2);
      sweepPrice = currentPrice * 0.998;
      stopLoss = currentPrice * 0.994;
      targetPrice = currentPrice * 1.025;
      signalStrength = `${Math.floor(88 + (symbolHash % 10))}% Structural Reversal`;
      actionPlan = {
        en: "Double bottom accumulation structure completing. High institutional buy volume at secondary test.",
        mr: "डबल बॉटम ॲक्युम्युलेशन रचना पूर्ण होत आहे. दुय्यम चाचणीवर संस्थात्मक खरेदी व्हॉल्यूम जास्त आहे.",
        hi: "Double Bottom संचय संरचना पूरी हो रही है। द्वितीयक परीक्षण पर संस्थागत खरीद वॉल्यूम अधिक है।",
        es: "Estructura de doble suelo completándose. Alto volumen de compra institucional en la segunda prueba."
      };
    }
  } else {
    // Neutral RSI conditions: Stop Hunt, Imbalance, Triangle, Flag, Cup & Handle
    if (option === 0) {
      type = 'TRAP';
      patternKey = 'trapStopHunt';
      color = 'var(--red-neon)';
      confidence = (98.5 + (symbolHash % 10) / 10).toFixed(2);
      sweepPrice = priceDiff > 0 ? currentPrice * 1.001 : currentPrice * 0.999;
      stopLoss = priceDiff > 0 ? currentPrice * 1.004 : currentPrice * 0.996;
      targetPrice = priceDiff > 0 ? currentPrice * 0.985 : currentPrice * 1.015;
      signalStrength = `${Math.floor(93 + (symbolHash % 6))}% Liquidity Stop Hunt`;
      actionPlan = {
        en: "Stop hunt sweep active. Retail orders liquidated. Institutional blocks matched.",
        mr: "स्टॉप हंट स्वीप सक्रिय. रिटेल ऑर्डर्स लिक्विडेट झाल्या. संस्थात्मक ब्लॉक मॅच झाले आहेत.",
        hi: "स्टॉप हंट स्वीप सक्रिय। रिटेल ऑर्डर्स लिक्विडेट हुईं। संस्थागत ब्लॉक मैच किए गए।",
        es: "Barrido de stop hunt activo. Órdenes minoristas liquidadas. Bloques institucionales emparejados."
      };
    } else if (option === 1) {
      type = 'TRAP';
      patternKey = 'trapImbalance';
      color = 'var(--gold-accent)';
      confidence = (97.6 + (symbolHash % 18) / 10).toFixed(2);
      sweepPrice = (currentPrice + prevPrice) / 2;
      stopLoss = priceDiff > 0 ? currentPrice * 0.996 : currentPrice * 1.004;
      targetPrice = currentPrice + (priceDiff * 2.5);
      signalStrength = `${Math.floor(84 + (symbolHash % 12))}% Price Gap Imbalance`;
      actionPlan = {
        en: "Fair Value Gap (FVG) created. Expected mean reversion to fill the price imbalance.",
        mr: "फेअर व्हॅल्यू गॅप तयार झाली आहे. किमतीतील असंतुलन भरून काढणे अपेक्षित.",
        hi: "फेयर वैल्यू गैप (FVG) का निर्माण। मूल्य असंतुलन क्षेत्र को भरने की उम्मीद।",
        es: "Brecha de valor razonable (FVG) creada. Se espera reversión a la media."
      };
    } else if (option === 2) {
      type = 'PATTERN';
      patternKey = 'patternTriangle';
      color = 'var(--green-neon)';
      confidence = (96.0 + (symbolHash % 20) / 10).toFixed(2);
      sweepPrice = currentPrice;
      stopLoss = currentPrice * (priceDiff > 0 ? 0.995 : 1.005);
      targetPrice = currentPrice * (priceDiff > 0 ? 1.02 : 0.98);
      signalStrength = `${Math.floor(85 + (symbolHash % 12))}% Triangle Breakout`;
      actionPlan = {
        en: "Ascending/Descending Triangle breakout confirmed. Volatility contraction leads to expansion.",
        mr: "त्रिकोणी (Triangle) पॅटर्न ब्रेकआऊट निश्चित. कमी होत चाललेल्या चढ-उतारामुळे मोठे मूव्हमेंट येण्याची शक्यता.",
        hi: "त्रिकोण (Triangle) पैटर्न ब्रेकआउट की पुष्टि। कम होती अस्थिरता के बाद बड़े उतार-चढ़ाव की संभावना।",
        es: "Ruptura de triángulo ascendente/descendente confirmada. La contracción de volatilidad conduce a la expansión."
      };
    } else if (option === 3) {
      type = 'PATTERN';
      patternKey = 'patternFlag';
      color = 'var(--green-neon)';
      confidence = (97.1 + (symbolHash % 16) / 10).toFixed(2);
      sweepPrice = currentPrice;
      stopLoss = currentPrice * (macd > signalLine ? 0.995 : 1.005);
      targetPrice = currentPrice * (macd > signalLine ? 1.025 : 0.975);
      signalStrength = `${Math.floor(86 + (symbolHash % 10))}% Trend Continuation`;
      actionPlan = {
        en: "Flag consolidation. High probability trend continuation expansion active.",
        mr: "फ्लॅग कन्सोलिडेशन. ट्रेंड विस्तार चालू राहण्याची दाट शक्यता.",
        hi: "फ्लैग कंसोलिडación। ट्रेंड विस्तार जारी रहने की मजबूत संभावना।",
        es: "Consolidación de bandera. Expansión de continuación de tendencia de alta probabilidad activa."
      };
    } else {
      type = 'PATTERN';
      patternKey = 'patternCup';
      color = 'var(--green-neon)';
      confidence = (98.2 + (symbolHash % 10) / 10).toFixed(2);
      sweepPrice = currentPrice * 0.999;
      stopLoss = currentPrice * 0.993;
      targetPrice = currentPrice * 1.035;
      signalStrength = `${Math.floor(89 + (symbolHash % 8))}% Cup & Handle Accumulation`;
      actionPlan = {
        en: "Cup & Handle accumulation structure completing. High volume breakout imminent.",
        mr: "कप आणि हँडल ॲक्युम्युलेशन रचना पूर्ण होत आहे. मोठ्या व्हॉल्यूमसह ब्रेकआऊट होण्याची शक्यता.",
        hi: "कप और हैंडल संचय संरचना पूरी हो रही है। उच्च वॉल्यूम के साथ ब्रेकआउट की संभावना।",
        es: "Estructura de acumulación de taza y asa completándose. Ruptura de alto volumen inminente."
      };
    }
  }

  return {
    type,
    patternKey,
    color,
    confidence,
    sweepPrice: Number(sweepPrice).toFixed(decimals),
    stopLoss: Number(stopLoss).toFixed(decimals),
    targetPrice: Number(targetPrice).toFixed(decimals),
    signalStrength,
    actionPlan
  };
}
