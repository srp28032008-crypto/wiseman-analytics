import React, { useState, useEffect } from 'react';
import { newsDatabase, marketTickers } from '../config/marketData';

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

export default function NewsFeed({ currentLang, activeMarket, activeTickerKey }) {
  const [liveNews, setLiveNews] = useState([]);

  useEffect(() => {
    // Seed initial news matching the current market
    const initialNews = newsDatabase.filter(
      item => item.category.toLowerCase() === (activeMarket === 'indianStocks' ? 'stocks' : activeMarket.toLowerCase())
    );
    setLiveNews(initialNews);
  }, [activeMarket]);

  useEffect(() => {
    const interval = setInterval(() => {
      const activeTemplates = newsTemplates[currentLang] || newsTemplates['en'];
      const marketTemplates = activeTemplates[activeMarket] || activeTemplates['indianStocks'];
      const template = marketTemplates[Math.floor(Math.random() * marketTemplates.length)];
      
      const config = marketTickers[activeMarket]?.find(t => t.key === activeTickerKey);
      const activeSymbolStr = config ? config.symbol.replace('_', ' ') : 'UNKNOWN';

      const timeStr = new Date().toLocaleTimeString();

      const newNewsItem = {
        id: "news-" + Date.now(),
        headline: template.headline,
        impact: template.impact,
        category: template.category,
        time: timeStr,
        analysis: currentLang === 'mr' ?
          `एआय विश्लेषण दर्शवते की हा कार्यक्रम थेट संस्थात्मक ऑर्डर प्लेसमेंटशी जोडलेला आहे. ${activeSymbolStr} वरील परिणामामुळे अस्थिरता वाढू शकते. सल्ला दिला जातो की +/- 0.5% जोखीम नियंत्रित ठेवावी.` :
          `AI Analysis reveals that this event has a direct, quantitative correlation with active ${activeSymbolStr} order placement. Expect volatility spikes. Recommended exposure adjustments inside terminals.`,
        summary: `${template.impact} IMPACT DETECTED ON ${activeMarket.toUpperCase()}`
      };

      setLiveNews(prevNews => {
        const updated = [newNewsItem, ...prevNews];
        if (updated.length > 20) updated.pop();
        return updated;
      });
    }, 12000); // Trigger a new news flash every 12 seconds

    return () => clearInterval(interval);
  }, [currentLang, activeMarket, activeTickerKey]);

  return (
    <div id="realtimeNewsFeed" className="news-feed-scroller">
      {liveNews.map((news) => {
        const isBullish = news.impact === 'BULLISH';
        const isBearish = news.impact === 'BEARISH';
        const tagColor = isBullish ? 'var(--green-neon)' : (isBearish ? 'var(--red-neon)' : 'var(--text-muted)');
        const bgGradient = isBullish 
          ? 'linear-gradient(90deg, rgba(0, 230, 118, 0.05) 0%, transparent 100%)'
          : (isBearish ? 'linear-gradient(90deg, rgba(255, 23, 68, 0.05) 0%, transparent 100%)' : 'none');

        return (
          <div key={news.id} className="news-feed-item" style={{ background: bgGradient, borderLeft: `2px solid ${tagColor}`, padding: '8px 10px', marginBottom: '8px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginBottom: '4px' }}>
              <span style={{ color: tagColor, fontWeight: 'bold', fontFamily: "'Orbitron', sans-serif" }}>
                [{news.category}] {news.impact}
              </span>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {news.time}
              </span>
            </div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '10px', lineHeight: '1.3' }}>
              {news.headline}
            </div>
            {news.analysis && (
              <div style={{ color: 'var(--text-secondary)', fontSize: '8.5px', marginTop: '4px', fontStyle: 'italic', lineHeight: '1.3' }}>
                {news.analysis}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
