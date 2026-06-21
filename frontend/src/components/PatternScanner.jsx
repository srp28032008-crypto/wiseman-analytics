import React from 'react';
import { langDb } from '../config/marketData';

export default function PatternScanner({
  currentLang,
  scannerLogs,
  accuracyValue,
  activePattern,
  activeSymbol
}) {
  const dict = langDb[currentLang] || langDb['en'];
  
  // Translation dictionary for pattern/alert names
  const scannerDb = {
    en: {
      alertTrap: "[LIQUIDITY TRAP]",
      alertPattern: "[CHART PATTERN]",
      trapStopHunt: "Stop Hunt Liquidity Sweep",
      trapBullTrap: "Institutional Bull Trap Rejection",
      trapBearTrap: "Institutional Bear Trap Defense",
      trapImbalance: "Fair Value Gap (FVG) Imbalance",
      patternDoubleBottom: "Double Bottom Structural Reversal",
      patternHeadShoulders: "Double Top / Head & Shoulders Peak",
      patternTriangle: "Ascending/Descending Triangle Breakout",
      patternFlag: "Bullish/Bearish Flag Trend Expansion",
      patternCup: "Cup & Handle Accumulation Structure"
    },
    mr: {
      alertTrap: "[लिक्विडिटी ट्रॅप]",
      alertPattern: "[चार्ट पॅटर्न आढळला]",
      trapStopHunt: "स्टॉप हंट लिक्विडिटी स्वीप",
      trapBullTrap: "संस्थात्मक बुल ट्रॅप रिजेक्शन",
      trapBearTrap: "संस्थात्मक बेअर ट्रॅप डिफेन्स",
      trapImbalance: "फेअर व्हॅल्यू गॅप असंतुलन",
      patternDoubleBottom: "डबल बॉटम स्ट्रक्चरल रिव्हर्सल",
      patternHeadShoulders: "डबल टॉप / हेड अँड शोल्डर्स पीक",
      patternTriangle: "त्रिकोणी (Triangle) पॅटर्न ब्रेकआऊट",
      patternFlag: "बुलिश/बेअरिश फ्लॅग ब्रेकआऊट",
      patternCup: "कप आणि हँडल ॲक्युम्युलेशन रचना"
    },
    hi: {
      alertTrap: "[लिक्विडिटी ट्रैप]",
      alertPattern: "[चार्ट पैटर्न मिला]",
      trapStopHunt: "स्टॉप हंट लिक्विडिटी स्वीप",
      trapBullTrap: "संस्थागत बुल ट्रैप रिजेक्शन",
      trapBearTrap: "संस्थागत बियर ट्रैप डिफेंस",
      trapImbalance: "फेयर वैल्यू गैप असंतुलन",
      patternDoubleBottom: "डबल बॉटम स्ट्रक्चरल रिवर्सल",
      patternHeadShoulders: "डबल टॉप / हेड एंड शोल्डर्स पीक",
      patternTriangle: "त्रिकोण (Triangle) पैटर्न ब्रेकआउट",
      patternFlag: "बुलिश/बियरिश फ्लैग ब्रेकआउट",
      patternCup: "कप और हैंडल संचय संरचना"
    },
    es: {
      alertTrap: "[TRAMPA DE LIQUIDEZ]",
      alertPattern: "[PATRÓN DETECTADO]",
      trapStopHunt: "Barrido de Liquidez Stop Hunt",
      trapBullTrap: "Rechazo de Trampa de Toros (Bull Trap)",
      trapBearTrap: "Defensa de Trampa de Osos (Bear Trap)",
      trapImbalance: "Desequilibrio de Brecha de Valor Razonable (FVG)",
      patternDoubleBottom: "Reversión Estructural de Doble Suelo",
      patternHeadShoulders: "Pico de Doble Techo / Hombro-Cabeza-Hombro",
      patternTriangle: "Ruptura de Triángulo Ascendente/Descendente",
      patternFlag: "Expansión de Tendencia de Bandera Alcista/Bajista",
      patternCup: "Estructura de Acumulación de Taza y Asa"
    }
  };

  const textDb = scannerDb[currentLang] || scannerDb['en'];

  return (
    <div className="panel-card" style={{ marginBottom: '0px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="watchlist-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '8px' }}>
        <span id="lblScannerHeader" style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 'bold' }}>
          {dict.lblScannerHeader || "Institutional Trap & Pattern Scanner"}
        </span>
        <span id="scannerAccuracy" style={{ color: 'var(--gold-accent)', fontWeight: 'bold', textShadow: 'var(--glow-gold)' }}>
          {(dict.scannerAccuracy || "ACCURACY: ") + accuracyValue.toFixed(2)}%
        </span>
      </div>

      {/* Active Selected Asset Analysis Panel */}
      <div className="active-asset-panel" style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px dashed rgba(255, 255, 255, 0.1)' }}>
        <div style={{ fontSize: '8.5px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.8px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
          <span>LIVE TRACKING: {activeSymbol ? activeSymbol.replace('_', ' ') : 'BTC USDT'}</span>
          <span style={{ color: 'var(--cyan)', textShadow: '0 0 5px var(--cyan)' }}>● REALTIME FEED</span>
        </div>
        {activePattern ? (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              border: `1.5px solid ${activePattern.color}`,
              background: activePattern.type === 'TRAP' ? 'rgba(255, 23, 68, 0.05)' : 'rgba(0, 230, 118, 0.05)',
              boxShadow: `0 0 10px ${activePattern.color}15`,
              transition: 'all 0.3s ease-in-out'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ color: activePattern.color, fontWeight: '800', fontFamily: "'Orbitron', sans-serif", fontSize: '9px', letterSpacing: '0.5px' }}>
                {activePattern.type === 'TRAP' ? textDb.alertTrap : textDb.alertPattern}
              </span>
              <span className="confidence-badge" style={{ fontSize: '8px', fontFamily: "'Orbitron', sans-serif", color: 'var(--gold-accent)', background: 'rgba(255, 215, 0, 0.1)', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(255, 215, 0, 0.3)', textShadow: 'var(--glow-gold)' }}>
                CONF: {activePattern.confidence}%
              </span>
            </div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px', fontFamily: "'Orbitron', sans-serif" }}>
              {textDb[activePattern.patternKey] || activePattern.patternKey}
            </div>
            <div className="scanner-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 10px', margin: '4px 0', padding: '5px 8px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '8.5px', fontFamily: "'Inter', sans-serif" }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Sweep Zone:</span>
                <strong style={{ color: 'var(--gold-accent)', float: 'right', fontFamily: 'monospace' }}>{activePattern.sweepPrice}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Target Price:</span>
                <strong style={{ color: 'var(--green-neon)', float: 'right', fontFamily: 'monospace' }}>{activePattern.targetPrice}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Stop Loss:</span>
                <strong style={{ color: 'var(--red-neon)', float: 'right', fontFamily: 'monospace' }}>{activePattern.stopLoss}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Signal Power:</span>
                <strong style={{ color: activePattern.color, float: 'right', fontFamily: 'monospace' }}>{activePattern.signalStrength}</strong>
              </div>
            </div>
            <div style={{ marginTop: '5px', fontSize: '8.5px', lineHeight: '1.35', color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif" }}>
              <span style={{ color: 'var(--gold-accent)', fontWeight: 'bold', fontFamily: "'Orbitron', sans-serif", fontSize: '8px', letterSpacing: '0.3px' }}>
                AI ACTION PLAN:
              </span>{' '}
              {activePattern.actionPlan[currentLang] || activePattern.actionPlan['en']}
            </div>
          </div>
        ) : (
          <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '9px', fontFamily: "'Orbitron', sans-serif", border: '1px dashed rgba(255, 255, 255, 0.08)', borderRadius: '6px', background: 'rgba(0,0,0,0.1)' }}>
            ANALYZING ASSET TELEMETRY...
          </div>
        )}
      </div>

      {/* Global Alerts Feed Header */}
      <div style={{ fontSize: '8.5px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.8px', marginBottom: '6px' }}>
        Global Scanner Alerts Feed
      </div>

      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', maxHeight: '240px', paddingRight: '4px' }}>
        {scannerLogs.length === 0 ? (
          <div style={{ padding: '15px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '10px', fontFamily: "'Orbitron', sans-serif" }}>
            WAITING FOR LIVE MARKET PATTERNS...
          </div>
        ) : (
          scannerLogs.map((log) => {
            const card = log.card;
            const isTrap = card.type === 'TRAP';
            const tag = isTrap ? textDb.alertTrap : textDb.alertPattern;
            const desc = textDb[card.patternKey] || card.patternKey;
            const color = card.color;
            const name = log.symbol.replace('_', ' ');
            const actionPlanText = card.actionPlan[currentLang] || card.actionPlan['en'];

            return (
              <div
                key={log.id}
                className="log-row"
                style={{
                  display: 'block',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  borderLeft: `2.5px solid ${color}`,
                  background: isTrap ? 'rgba(255, 23, 68, 0.02)' : 'rgba(0, 230, 118, 0.02)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.02)',
                  borderRight: '1px solid rgba(255, 255, 255, 0.02)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div>
                    <span className="log-time" style={{ fontFamily: "'Orbitron', monospace", fontSize: '8px', color: 'var(--text-muted)', marginRight: '6px' }}>
                      [{log.timestamp}]
                    </span>
                    <span className="log-tag" style={{ color: color, fontWeight: '800', fontFamily: "'Orbitron', sans-serif", fontSize: '8.5px', letterSpacing: '0.3px' }}>
                      {tag}
                    </span>
                  </div>
                  <span className="confidence-badge" style={{ fontSize: '7.5px', fontFamily: "'Orbitron', sans-serif", color: 'var(--gold-accent)', background: 'rgba(255, 215, 0, 0.05)', padding: '1px 4px', borderRadius: '4px', border: '1px solid rgba(255, 215, 0, 0.2)', textShadow: 'var(--glow-gold)' }}>
                    CONF: {card.confidence}%
                  </span>
                </div>
                <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '9.5px', marginBottom: '4px', fontFamily: "'Orbitron', sans-serif" }}>
                  {name} &rarr; <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontFamily: "'Inter', sans-serif", fontWeight: 'normal' }}>{desc}</span>
                </div>
                <div className="scanner-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 10px', margin: '4px 0', padding: '4px 6px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.04)', fontSize: '8px', fontFamily: "'Inter', sans-serif" }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Sweep:</span>
                    <strong style={{ color: 'var(--gold-accent)', float: 'right', fontFamily: 'monospace' }}>{card.sweepPrice}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Target:</span>
                    <strong style={{ color: 'var(--green-neon)', float: 'right', fontFamily: 'monospace' }}>{card.targetPrice}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Stop Loss:</span>
                    <strong style={{ color: 'var(--red-neon)', float: 'right', fontFamily: 'monospace' }}>{card.stopLoss}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Power:</span>
                    <strong style={{ color: color, float: 'right', fontFamily: 'monospace' }}>{card.signalStrength}</strong>
                  </div>
                </div>
                <div style={{ marginTop: '4px', fontSize: '8px', lineHeight: '1.3', color: 'var(--text-secondary)', fontFamily: "'Inter', sans-serif', paddingLeft: '2px" }}>
                  <span style={{ color: 'var(--gold-accent)', fontWeight: 'bold', fontFamily: "'Orbitron', sans-serif", fontSize: '7.5px', letterSpacing: '0.3px' }}>
                    AI ACTION PLAN:
                  </span>{' '}
                  {actionPlanText}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
