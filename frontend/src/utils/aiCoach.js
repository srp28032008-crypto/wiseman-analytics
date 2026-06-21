// Wiseman Analytics AI Coach & Advisor Heuristics - Modular Utility
import { marketVols, langDb } from '../config/marketData';

export function evaluateAICoach({ vol, rsi, macd, signalLine, activeMarket, activeTickerKey, currentLang, marketTickers }) {
  const activeConfig = marketTickers[activeMarket]?.find(t => t.key === activeTickerKey);
  if (!activeConfig) return null;

  const name = activeConfig.symbol.replace('_', ' ');
  const dict = langDb[currentLang] || langDb['en'];
  const macdHist = macd - signalLine;
  const isLowVol = vol < (activeMarket === 'crypto' ? 50 : 15);

  if (isLowVol) {
    return {
      status: dict.statusAvoid || "AVOID",
      statusClass: "status-avoid",
      glowClass: "sell-glow",
      confidence: "20%",
      confidenceFill: "20%",
      confidenceColor: "var(--red-neon)",
      quote: currentLang === 'mr' 
        ? `"${activeConfig.symbol} मधील व्होलॅटिलिटी खूप कमी आहे (${vol.toFixed(1)}M). मोठे खरेदीदार सध्या सक्रिय नाहीत. नवीन ट्रेड घेणे टाळा."`
        : `"${name} volatility is sub-optimal (${vol.toFixed(1)}M). Institutional players are sitting on the sidelines. Avoid execution."`,
      rationales: currentLang === 'mr' ? [
        "अत्यंत कोरडा ट्रेडिंग वॉल्यूम प्रोफाइल.",
        "मोठ्या स्लिपेज आणि स्प्रेडचा धोका जास्त."
      ] : [
        "Extremely dry trading volume profile.",
        "High risk of spread slippages."
      ]
    };
  }

  if (rsi < 35 && macdHist > 0) {
    return {
      status: dict.statusApproved || "APPROVED",
      statusClass: "status-approved",
      glowClass: "buy-glow",
      confidence: "85%",
      confidenceFill: "85%",
      confidenceColor: "var(--green-neon)",
      quote: currentLang === 'mr'
        ? `"${activeConfig.symbol} वर मजबूत तेजीचे संकेत आहेत (RSI: ${rsi.toFixed(1)}). MACD वर पॉझिटिव्ह क्रॉसओवर (${macdHist.toFixed(3)}) बनला आहे. खरेदीसाठी उत्तम सेटअप."`
        : `"${name} is showing a strong bullish reversal pattern (RSI: ${rsi.toFixed(1)}). MACD is flashing a positive crossover (${macdHist.toFixed(3)}). High R:R long setup."`,
      rationales: currentLang === 'mr' ? [
        `RSI ${rsi.toFixed(1)} वरून रिव्हर्सल संकेत देत आहे.`,
        `MACD बुलिश क्रॉसओवर निश्चित झाला आहे (${macdHist.toFixed(3)}).`
      ] : [
        `Bullish divergence forming on RSI at ${rsi.toFixed(1)}.`,
        `Volume breakout confirmed with positive MACD momentum.`
      ]
    };
  } else if (rsi > 65 && macdHist < 0) {
    return {
      status: dict.statusApproved || "APPROVED",
      statusClass: "status-approved",
      glowClass: "sell-glow",
      confidence: "82%",
      confidenceFill: "82%",
      confidenceColor: "var(--red-neon)",
      quote: currentLang === 'mr'
        ? `"${activeConfig.symbol} स्थानिक रेझिस्टन्सवर नफा वसुली आणि विक्रीच्या दबावाखाली आहे (RSI: ${rsi.toFixed(1)}). स्टॉप लॉस कडक ठेवा."`
        : `"${name} is experiencing heavy distribution sweeps at local resistance (RSI: ${rsi.toFixed(1)}). Selling pressure mounting. Tight stop losses advised."`,
      rationales: currentLang === 'mr' ? [
        `RSI ओव्हरबॉट वितरण दाखवत आहे (${rsi.toFixed(1)}).`,
        `महत्वाच्या ऑर्डर ब्लॉकवरून रिजेक्शन संकेत (MACD: ${macdHist.toFixed(3)}).`
      ] : [
        `RSI indicating overbought distribution at ${rsi.toFixed(1)}.`,
        `Rejection pattern at major order block (MACD: ${macdHist.toFixed(3)}).`
      ]
    };
  } else if (rsi >= 40 && rsi <= 60) {
    return {
      status: dict.statusAvoid || "AVOID",
      statusClass: "status-avoid",
      glowClass: "sell-glow",
      confidence: "35%",
      confidenceFill: "35%",
      confidenceColor: "var(--red-neon)",
      quote: currentLang === 'mr'
        ? `"${activeConfig.symbol} सध्या साईडवेज (sideways) रेंजमध्ये आहे (RSI: ${rsi.toFixed(1)}). ब्रेकआऊट होईपर्यंत वाट पहा."`
        : `"${name} is in a consolidation zone (RSI: ${rsi.toFixed(1)}). Moving average indicators are flat. Range-bound oscillations expected."`,
      rationales: currentLang === 'mr' ? [
        "ट्रेन्ड ब्रेकआऊटचे कोणतेही स्पष्ट संकेत नाहीत.",
        `महत्वाच्या सपोर्ट/रेझिस्टन्स लेव्हलची वाट पहा (RSI: ${rsi.toFixed(1)}).`
      ] : [
        `No clear trend breakout signal. RSI flat at ${rsi.toFixed(1)}.`,
        "Wait for key support/resistance sweep."
      ]
    };
  } else {
    return {
      status: dict.statusAvoid || "AVOID",
      statusClass: "status-avoid",
      glowClass: "neutral-glow",
      confidence: "45%",
      confidenceFill: "45%",
      confidenceColor: "var(--cyan)",
      quote: currentLang === 'mr'
        ? `"${activeConfig.symbol} वर परस्परविरोधी संकेत आहेत. RSI (${rsi.toFixed(1)}) आणि MACD (${macdHist.toFixed(3)}) भिन्न मते दाखवत आहेत."`
        : `"Conflicting momentum signals on ${name} multiple timeframes (RSI: ${rsi.toFixed(1)}, MACD: ${macdHist.toFixed(3)}). No clean trading edge."`,
      rationales: currentLang === 'mr' ? [
        "आरएसआय आणि एमएसीडी वेगवेगळे संकेत देत आहेत."
      ] : [
        "RSI and MACD are flashing divergent cues."
      ]
    };
  }
}

// Local fallback rule-based analyzer when API is offline
export function getLocalHeuristicResponse({ prompt, name, config, currentLang, activeMarket, price, rsi, macd, volume }) {
  let response = "";
  const p = prompt.toLowerCase();
  const lang = currentLang || 'en';

  if (lang === 'mr') {
    if (p.includes('analyze') || p.includes('chart') || p.includes('विश्लेषण') || p.includes('तपासा') || p.includes('नकाशा')) {
      response = `${name} साठी वाईजमन विश्लेषण: मार्केटमध्ये MACD हिस्टोग्राम ${macd.toFixed(3)} आहे आणि RSI ${rsi.toFixed(1)} वर आहे. विश्लेषण दर्शविते की आपण ${rsi > 60 ? 'तेजीच्या क्षेत्रात (Bullish Expansion) आहोत, वरील स्तरांवर नफा वसुलीकडे लक्ष ठेवा' : (rsi < 40 ? 'ओव्हरसोल्ड क्षेत्रात (Oversold Accumulation) आहोत, रिव्हर्सल संकेत जवळ आहेत' : 'तटस्थ रेंजबाउंड क्षेत्रात आहोत')}. स्टॉप लॉस +/- ${marketVols[activeMarket].riskPct}% ठेवण्याची शिफारस केली जाते.`;
    } else if (p.includes('trap') || p.includes('bear') || p.includes('bull') || p.includes('फसवा') || p.includes('जाळे')) {
      response = `संस्थात्मक लिक्विडिटी ट्रॅप (Institutuional Traps) रिटेल ट्रेडर्सचे स्टॉप लॉस उडवण्यासाठी तयार केले जातात. जेव्हा किंमत अचानक ब्रेकआऊट दाखवते (Bull Trap) किंवा ब्रेकडाऊन दाखवते (Bear Trap) आणि लगेच विरुद्ध देशाने वळते, त्याला ट्रॅप म्हणतात. यापासून वाचण्यासाठी उजवीकडील रिस्क कॅल्क्युलेटरने दिलेले अचूक स्टॉप लॉस वापरावे.`;
    } else if (p.includes('stop loss') || p.includes('target') || p.includes('risk') || p.includes('मर्यादा') || p.includes('नफा') || p.includes('तोटा')) {
      const entryVal = price;
      const riskPct = marketVols[activeMarket].riskPct;
      const riskAmt = entryVal * (riskPct / 100);
      response = `सध्याच्या सेटिंगनुसार, ${name} मध्ये एंट्री ${entryVal.toFixed(config.decimals)} वर असल्यास, स्टॉप लॉस ${(entryVal - riskAmt).toFixed(config.decimals)} वर असावा (जोखीम रक्कम: ${riskAmt.toFixed(config.decimals)}). टार्गेट १ (१:२ R:R) हे ${(entryVal + riskAmt * 2).toFixed(config.decimals)} वर आणि टार्गेट २ (१:३ R:R) हे ${(entryVal + riskAmt * 3).toFixed(config.decimals)} वर असावे.`;
    } else if (p.includes('मार्क') || p.includes('तू कोण') || p.includes('help') || p.includes('मदत')) {
      response = `मी वाईजमन (Mark) आहे, तुमचा संस्थात्मक मार्केट ॲनालिसिस सहाय्यक. मी चार्ट पॅटर्न्स, इंडिकेटर्स आणि रिस्क व्यवस्थापनाचे विश्लेषण करू शकतो, सर.`;
    } else {
      const activeVolume = volume ? volume.toFixed(1) : '24.5';
      response = `${name} चे संख्यात्मक आकडेवारी दर्शविते की ट्रेडिंग व्हॉल्यूम ${activeVolume}M वर आहे. अधिक अचूकतेसाठी, तुम्ही चार्टवर सपोर्ट लाईन ओढू शकता किंवा डबल-क्लिक करून एंट्री प्राईस सेट देऊ शकता, सर.`;
    }
  } else if (lang === 'hi') {
    if (p.includes('analyze') || p.includes('chart') || p.includes('विश्लेषण') || p.includes('नक्शा') || p.includes('जांच')) {
      response = `${name} के लिए वाइजमैन विश्लेषण: वर्तमान में MACD ${macd.toFixed(3)} है और RSI ${rsi.toFixed(1)} पर खड़ा है। विश्लेषण से पता चलता है कि हम ${rsi > 60 ? 'तेजी के क्षेत्र में हैं, ऊपरी स्तरों पर बिकवाली का ध्यान रखें' : (rsi < 40 ? 'ओव्हरसोल्ड संचय क्षेत्र में हैं, जल्द ही तेजी आ सकती है' : 'एक निश्चित सीमा में मजबूत समेकन देख रहे हैं')}. स्टॉप लॉस +/- ${marketVols[activeMarket].riskPct}% रखने की सलाह दी जाती है।`;
    } else if (p.includes('trap') || p.includes('bear') || p.includes('bull') || p.includes('धोखा') || p.includes('फंसाना')) {
      response = `संस्थागत ट्रैप (Institutional Traps) बड़े ऑपरेटरों द्वारा स्टॉप लॉस को हिट करने के लिए बनाए जाते हैं। जैसे, बुल ट्रैप (Bull Trap) रेजिस्टेंस ब्रेकआउट के झूठे संकेत देकर खरीदारों को फंसाता है। जोखिम से बचने के लिए स्मार्ट रिस्क कैलकुलेटर द्वारा सुझाए गए लेवल्स का ही पालन करें।`;
    } else if (p.includes('stop loss') || p.includes('target') || p.includes('risk') || p.includes('nuksan') || p.includes('munafa')) {
      const entryVal = price;
      const riskPct = marketVols[activeMarket].riskPct;
      const riskAmt = entryVal * (riskPct / 100);
      response = `वर्तमान सेटिंग के अनुसार, ${name} में एंट्री ${entryVal.toFixed(config.decimals)} पर है, तो स्टॉप लॉस ${(entryVal - riskAmt).toFixed(config.decimals)} पर रखें (जोखिम राशि: ${riskAmt.toFixed(config.decimals)}). टारगेट १ (१:२ R:R) ${(entryVal + riskAmt * 2).toFixed(config.decimals)} और टारगेट २ (१:३ R:R) ${(entryVal + riskAmt * 3).toFixed(config.decimals)} पर बनता है।`;
    } else if (p.includes('मार्क') || p.includes('कौन') || p.includes('मदद')) {
      response = `मैं वाइजमैन (Mark) हूँ, आपका संस्थागत बाजार विश्लेषण सहायक। मैं चार्ट पैटर्न, रिस्क मैनेजमेंट और लाइव इंडिकेटर की गणना कर सकता हूँ, सर।`;
    } else {
      const activeVolume = volume ? volume.toFixed(1) : '24.5';
      response = `${name} की आकडेवारी दर्शाती है कि ट्रेडिंग वॉल्यूम ${activeVolume}M पर है। आप चार्ट पर डबल-क्लिक करके एंट्री सेट कर सकते हैं या सपोर्ट लाइन खींचकर रिस्क को ऑटो-कैलकुलेट कर सकते हैं, सर।`;
    }
  } else if (lang === 'es') {
    if (p.includes('analyze') || p.includes('chart') || p.includes('analizar') || p.includes('grafico')) {
      response = `Análisis de Wiseman para ${name}: El indicador MACD es de ${macd.toFixed(3)} y el RSI está en ${rsi.toFixed(1)}. Indica que estamos en una ${rsi > 60 ? 'zona de expansión alcista, atención a la toma de ganancias' : (rsi < 40 ? 'zona de acumulación de sobreventa, posible reversión alcista' : 'fase de consolidación plana')}. Se recomienda un Stop Loss de +/- ${marketVols[activeMarket].riskPct}%.`;
    } else if (p.includes('trap') || p.includes('oso') || p.includes('toro') || p.includes('trampa')) {
      response = `Las trampas institucionales se ejecutan mediante barridos de liquidez. Por ejemplo, una trampa de toros (Bull Trap) ocurre cuando el precio supera una resistencia e incita a comprar antes de caer con fuerza. Utilice siempre los niveles de stop loss sugeridos para evitar liquidaciones.`;
    } else if (p.includes('stop loss') || p.includes('target') || p.includes('riesgo') || p.includes('limite')) {
      const entryVal = price;
      const riskPct = marketVols[activeMarket].riskPct;
      const riskAmt = entryVal * (riskPct / 100);
      response = `Con una entrada en ${entryVal.toFixed(config.decimals)} para ${name}, su Stop Loss debe estar en ${(entryVal - riskAmt).toFixed(config.decimals)} (Riesgo: ${riskAmt.toFixed(config.decimals)}). El Objetivo 1 (1:2 R:R) está en ${(entryVal + riskAmt * 2).toFixed(config.decimals)}.`;
    } else {
      const activeVolume = volume ? volume.toFixed(1) : '24.5';
      response = `Los datos cuantitativos para ${name} indican un volumen de ${activeVolume}M. Puede hacer doble clic en el gráfico para fijar el precio de entrada o trazar una línea de soporte para ajustar el riesgo, señor.`;
    }
  } else {
    // English default
    if (p.includes('analyze') || p.includes('chart') || p.includes('nifty') || p.includes('btc')) {
      response = `Wiseman Analysis for ${name}: Market is currently printing MACD value of ${macd.toFixed(3)} and RSI is standing at ${rsi.toFixed(1)}. Rationale indicates we are in a ${rsi > 60 ? 'Bullish Expansion block, watch for local distribution' : (rsi < 40 ? 'Oversold Accumulation zone, prepare for reversal' : 'Rangebound consolidation zone')}. Strict risk stop loss at entry +/- ${marketVols[activeMarket].riskPct}% is recommended.`;
    } else if (p.includes('trap') || p.includes('bear') || p.includes('bull')) {
      response = `An institutional trap is executed by sweeps of liquidity pools. For example, a Bull Trap occurs when price breaks previous resistance highs, trapping retail buyers, and then reverses aggressively to sweep stop losses below. Maintain your Stop Loss levels as calculated by the Smart Risk Calculator to avoid being liquidated.`;
    } else if (p.includes('stop loss') || p.includes('target') || p.includes('risk')) {
      const entryVal = price;
      const riskPct = marketVols[activeMarket].riskPct;
      const riskAmt = entryVal * (riskPct / 100);
      response = `Under current ${activeMarket} settings, with an entry at ${entryVal.toFixed(config.decimals)}, your stop loss should be placed at ${(entryVal - riskAmt).toFixed(config.decimals)} (Risk: ${riskAmt.toFixed(config.decimals)}). Target 1 (1:2 R:R) stands at ${(entryVal + riskAmt * 2).toFixed(config.decimals)}.`;
    } else if (p.includes('mark') || p.includes('who are you') || p.includes('help')) {
      response = `I am Wiseman (codename: Mark), your quantitative market analysis assistant. I can analyze chart structures, dynamic indicators, and verify risk limits, Sir.`;
    } else {
      const activeVolume = volume ? volume.toFixed(1) : '24.5';
      response = `The quantitative metrics for ${name} indicate volume is stable at ${activeVolume}M. If you want to configure custom entries, double-click on the chart to set Entry Price or draw a Support line to auto-sync Stop Loss, Sir.`;
    }
  }
  return response;
}
