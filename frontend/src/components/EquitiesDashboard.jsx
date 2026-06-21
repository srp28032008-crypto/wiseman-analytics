import React, { useState, useEffect } from 'react';
import { langDb } from '../config/marketData';

const defaultSecs = [
  { tag: "[INGESTION]", msg: "Reliance Industries data pipeline connected." },
  { tag: "[INGESTION]", msg: "Tata Motors Limited data pipeline connected." },
  { tag: "[INGESTION]", msg: "HDFC Bank Limited data pipeline connected." },
  { tag: "[INGESTION]", msg: "Tata Tech Limited data pipeline connected." }
];

const discoveryCandidates = [
  { key: "m_m", name: "Mahindra & Mahindra", sector: "Automotive", price: 2350.00, change: 1.80, cap: "Large Cap", pE: "19.5", desc: "Dynamic target breakout confirmed on monthly chart.", lastAnalysis: "Strong bullish momentum. Est. target 2480." },
  { key: "baj_auto", name: "Bajaj Auto Limited", sector: "Automotive", price: 9120.00, change: 0.75, cap: "Large Cap", pE: "28.1", desc: "Symmetrical triangle breakout. Target 9500.", lastAnalysis: "Strong accumulation near 10-day EMA." },
  { key: "heromotoco", name: "Hero MotoCorp Limited", sector: "Automotive", price: 4230.00, change: -1.20, cap: "Large Cap", pE: "21.4", desc: "Consolidating near key daily moving averages.", lastAnalysis: "Wait for volume sweep below 4150 support." },
  { key: "sunpharma", name: "Sun Pharmaceutical Ind", sector: "Pharmaceuticals", price: 1540.00, change: 2.10, cap: "Large Cap", pE: "34.2", desc: "Bullish rounding bottom completed on weekly chart.", lastAnalysis: "Accumulation blocks matched. Target 1680." }
];

export default function EquitiesDashboard({
  currentLang,
  equitiesDb,
  setEquitiesDb,
  onSelectStock,
  activeTickerKey
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [discoveryLogs, setDiscoveryLogs] = useState([]);
  const [candidates, setCandidates] = useState(discoveryCandidates);

  const dict = langDb[currentLang] || langDb['en'];

  // Initialize discovery logs on mount
  useEffect(() => {
    const initialLogs = defaultSecs.map((item, idx) => ({
      id: `init-${idx}`,
      timestamp: new Date(Date.now() - (4 - idx) * 60000).toLocaleTimeString(),
      tag: item.tag,
      msg: item.msg,
      color: 'var(--green-neon)'
    }));
    setDiscoveryLogs(initialLogs);
  }, []);

  // Periodic Auto-Discovery simulation loop (every 25 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (candidates.length === 0) return;

      const nextCandidates = [...candidates];
      const newStock = nextCandidates.shift();
      setCandidates(nextCandidates);

      // Add to equities db if it doesn't already exist
      setEquitiesDb(prevDb => {
        if (prevDb.some(s => s.key === newStock.key)) return prevDb;
        return [...prevDb, newStock];
      });

      // Log the discovery card
      const timeStr = new Date().toLocaleTimeString();
      let logText = "";
      if (currentLang === 'mr') {
        logText = `एआय स्कॅनरने नवीन स्टॉक शोधला: <strong>${newStock.name} (${newStock.key.toUpperCase()})</strong>. प्रोफाइल समाविष्ट केले.`;
      } else if (currentLang === 'hi') {
        logText = `एआई स्कैनर ने नया स्टॉक खोजा: <strong>${newStock.name} (${newStock.key.toUpperCase()})</strong>. प्रोफाइल शामिल किया गया।`;
      } else if (currentLang === 'es') {
        logText = `El escáner de IA descubrió: <strong>${newStock.name} (${newStock.key.toUpperCase()})</strong>. Perfil cuantitativo integrado.`;
      } else {
        logText = `AI scanner discovered new liquidity pool: <strong>${newStock.name} (${newStock.key.toUpperCase()})</strong>. Inflow sweeps active.`;
      }

      const newLogRow = {
        id: `discover-${Date.now()}`,
        timestamp: timeStr,
        tag: '[NEW STOCK]',
        msg: logText,
        color: 'var(--gold-accent)',
        isHtml: true
      };

      setDiscoveryLogs(prevLogs => {
        const updated = [newLogRow, ...prevLogs];
        if (updated.length > 15) updated.pop();
        return updated;
      });
    }, 25000);

    return () => clearInterval(interval);
  }, [candidates, currentLang]);

  const filteredEquities = equitiesDb.filter(stock =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px', height: '100%' }}>
      {/* Left Column: Stocks Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ fontSize: '13px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.5px', color: 'var(--text-primary)', margin: 0 }}>
            {dict.lblIndianDashboardTitle || "INDIAN EQUITIES REAL-TIME CORE BOARD"}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '9px', color: 'var(--gold-accent)', fontWeight: 'bold', fontFamily: "'Orbitron', sans-serif" }}>
              {(dict.lblDiscoveryCount || "INGESTED PROFILE DATABASE: ").replace(': ', '')} ({filteredEquities.length} STOCKS)
            </span>
            <input
              type="text"
              placeholder={currentLang === 'mr' ? "शोध घ्या..." : "Search stocks..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                padding: '4px 8px',
                fontSize: '10px',
                width: '180px',
                fontFamily: "'Inter', sans-serif"
              }}
            />
          </div>
        </div>

        {/* Scrollable grid container */}
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {filteredEquities.map((stock) => {
              const sign = stock.change >= 0 ? '+' : '';
              const percentColor = stock.change >= 0 ? 'var(--green-neon)' : 'var(--red-neon)';
              const isActive = activeTickerKey === stock.key;

              return (
                <div
                  key={stock.key}
                  className="stock-profile-card panel-card"
                  onDoubleClick={() => onSelectStock(stock.key)}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    borderColor: isActive ? 'var(--gold-accent)' : 'rgba(255,255,255,0.06)',
                    background: isActive ? 'rgba(255, 215, 0, 0.02)' : 'rgba(12, 12, 14, 0.45)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '8px', color: 'var(--text-muted)', fontFamily: "'Orbitron', sans-serif" }}>
                      {stock.sector.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '8px', color: 'var(--gold-accent)', fontWeight: 'bold' }}>
                      {stock.cap}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: "'Orbitron', sans-serif", color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {stock.name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                      ₹{stock.price.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: percentColor, fontFamily: 'monospace' }}>
                      {sign}{stock.change.toFixed(2)}%
                    </span>
                  </div>
                  <div style={{ fontSize: '8.5px', color: 'var(--text-secondary)', lineHeight: '1.4', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px', marginBottom: '4px' }}>
                    {stock.desc}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>P/E: <strong style={{ color: 'var(--text-secondary)' }}>{stock.pE}</strong></span>
                    <span style={{ fontStyle: 'italic' }}>Double-click to load</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: AI Auto-Discovery Logs */}
      <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', padding: '12px', overflow: 'hidden', height: '100%', borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(12, 12, 14, 0.4)' }}>
        <h3 style={{ fontSize: '10px', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.3px', margin: '0 0 10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px', color: 'var(--gold-accent)' }}>
          {dict.lblDiscoveryFeedTitle || "AI AUTO-DISCOVERY FLOW STREAM"}
        </h3>
        <div id="stockDiscoveryLogs" className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', fontSize: '8.5px', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {discoveryLogs.map((log) => (
            <div key={log.id} className="log-row" style={{ display: 'block', paddingBottom: '4px', borderBottom: '1px dashed rgba(255,255,255,0.02)' }}>
              <span className="log-time" style={{ color: 'var(--text-muted)', marginRight: '6px' }}>[{log.timestamp}]</span>
              <span className="log-tag" style={{ color: log.color, fontWeight: 'bold', marginRight: '6px' }}>{log.tag}</span>
              {log.isHtml ? (
                <span className="log-desc" style={{ color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: log.msg }} />
              ) : (
                <span className="log-desc" style={{ color: 'var(--text-secondary)' }}>{log.msg}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
