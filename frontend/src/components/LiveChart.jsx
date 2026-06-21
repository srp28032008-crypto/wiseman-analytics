import React, { useRef, useEffect, useState } from 'react';
import { calculateBollingerBands, calculateEMA } from '../utils/indicators';
import { marketTickers } from '../config/marketData';

export default function LiveChart({
  history,
  activeMarket,
  activeTickerKey,
  chartType,
  cbBB,
  cbEMA20,
  cbEMA50,
  activeDrawingTool,
  setActiveDrawingTool,
  onSupportLineDraw,
  currentLang,
  activeScannerAlert,
  isReplayMode,
  replayIndex
}) {
  const canvasRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(60);
  const [panOffset, setPanOffset] = useState(0);
  const [drawings, setDrawings] = useState({ supports: [], trendlines: [], fibs: [] });
  const [hoverPoint, setHoverPoint] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartPanOffset, setDragStartPanOffset] = useState(0);

  // Get configuration decimals and ticker parameters
  const tickerConfig = marketTickers[activeMarket]?.find(t => t.key === activeTickerKey) || { decimals: 2, symbol: activeTickerKey.toUpperCase() };
  const decimals = tickerConfig.decimals;

  // Clear drawings helper
  useEffect(() => {
    window.clearDrawings = () => {
      setDrawings({ supports: [], trendlines: [], fibs: [] });
    };
    return () => {
      delete window.clearDrawings;
    };
  }, []);

  // Sync "GO LIVE" or snap back when history updates and we are not panning
  useEffect(() => {
    if (panOffset > 0 && history.length > 0) {
      // Keep pan offset capped
      setPanOffset(prev => Math.min(history.length - visibleCount, prev));
    }
  }, [history.length]);

  const activeHistory = isReplayMode ? history.slice(0, replayIndex) : history;

  // Helper coordinate calculations
  const getChartParams = (width, height) => {
    const N = activeHistory.length;
    if (N < 2) return null;

    const startIndex = Math.max(0, N - visibleCount - panOffset);
    const endIndex = Math.min(N, N - panOffset);
    const visibleHistory = activeHistory.slice(startIndex, endIndex);

    if (visibleHistory.length < 2) return null;

    const minPrice = Math.min(...visibleHistory);
    const maxPrice = Math.max(...visibleHistory);
    const priceRange = (maxPrice - minPrice) || 1;
    const pad = priceRange * 0.15;

    return {
      N,
      startIndex,
      endIndex,
      visibleHistory,
      minPrice,
      maxPrice,
      priceRange,
      pad,
      calcY: (val) => height - (((val - (minPrice - pad)) / (priceRange + pad * 2)) * height),
      calcValY: (y) => ((height - y) / height) * (priceRange + pad * 2) + (minPrice - pad),
      stepX: width / (visibleHistory.length - 1)
    };
  };

  // Convert logical values to canvas pixels
  const getCoordsFromValue = (globalIdx, priceVal, params, width) => {
    const localIdx = globalIdx - params.startIndex;
    const x = params.stepX * localIdx;
    const y = params.calcY(priceVal);
    return { x, y };
  };

  // Convert canvas pixels to logical values
  const getValueFromCoords = (x, y, params, width) => {
    const localIdx = Math.round(x / params.stepX);
    const globalIdx = Math.max(0, Math.min(activeHistory.length - 1, params.startIndex + localIdx));
    const priceVal = params.calcValY(y);
    return { globalIdx, priceVal };
  };

  // Handle support line sync to risk calculator
  const triggerSupportLineSync = (priceVal) => {
    if (onSupportLineDraw) {
      onSupportLineDraw(priceVal);
    }
  };

  // Canvas interaction event handlers
  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);

    const width = canvasRef.current.width / window.devicePixelRatio;
    const height = canvasRef.current.height / window.devicePixelRatio;
    const params = getChartParams(width, height);
    if (!params) return;

    const val = getValueFromCoords(x, y, params, width);

    if (activeDrawingTool) {
      if (activeDrawingTool === 'support') {
        const newSupports = [...drawings.supports, { priceVal: val.priceVal, color: '#00f0ff', width: 2 }];
        setDrawings(prev => ({ ...prev, supports: newSupports }));
        setActiveDrawingTool(null);
        triggerSupportLineSync(val.priceVal);
      } else if (!startPoint) {
        setStartPoint(val);
      } else {
        if (activeDrawingTool === 'trendline') {
          const newTL = [...drawings.trendlines, {
            gIdx1: startPoint.globalIdx,
            price1: startPoint.priceVal,
            gIdx2: val.globalIdx,
            price2: val.priceVal,
            color: '#ffd700',
            width: 2
          }];
          setDrawings(prev => ({ ...prev, trendlines: newTL }));
        } else if (activeDrawingTool === 'fib') {
          const newFibs = [...drawings.fibs, {
            priceMin: startPoint.priceVal,
            priceMax: val.priceVal,
            color: null,
            width: 1.5
          }];
          setDrawings(prev => ({ ...prev, fibs: newFibs }));
        }
        setActiveDrawingTool(null);
        setStartPoint(null);
      }
    } else {
      // Click-to-delete check
      let deletedAny = false;
      const clickTolerance = 6;

      // Check supports
      for (let i = 0; i < drawings.supports.length; i++) {
        const sY = params.calcY(drawings.supports[i].priceVal);
        if (Math.abs(y - sY) < clickTolerance) {
          const dup = [...drawings.supports];
          dup.splice(i, 1);
          setDrawings(prev => ({ ...prev, supports: dup }));
          deletedAny = true;
          break;
        }
      }

      if (!deletedAny) {
        // Check trendlines
        for (let i = 0; i < drawings.trendlines.length; i++) {
          const tl = drawings.trendlines[i];
          const p1 = getCoordsFromValue(tl.gIdx1, tl.price1, params, width);
          const p2 = getCoordsFromValue(tl.gIdx2, tl.price2, params, width);

          // Distance to segment calculation
          const getDistanceToSegment = (px, py, x1, y1, x2, y2) => {
            const l2 = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
            if (l2 === 0) return Math.sqrt(Math.pow(px - x1, 2) + Math.pow(py - y1, 2));
            let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
            t = Math.max(0, Math.min(1, t));
            return Math.sqrt(Math.pow(px - (x1 + t * (x2 - x1)), 2) + Math.pow(py - (y1 + t * (y2 - y1)), 2));
          };

          const dist = getDistanceToSegment(x, y, p1.x, p1.y, p2.x, p2.y);
          if (dist < clickTolerance) {
            const dup = [...drawings.trendlines];
            dup.splice(i, 1);
            setDrawings(prev => ({ ...prev, trendlines: dup }));
            deletedAny = true;
            break;
          }
        }
      }

      if (!deletedAny) {
        // Check fibs
        for (let i = 0; i < drawings.fibs.length; i++) {
          const fib = drawings.fibs[i];
          const yMin = params.calcY(fib.priceMin);
          const yMax = params.calcY(fib.priceMax);
          const dy = yMax - yMin;
          const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];

          for (let l of levels) {
            const yL = yMin + dy * l;
            if (Math.abs(y - yL) < clickTolerance) {
              const dup = [...drawings.fibs];
              dup.splice(i, 1);
              setDrawings(prev => ({ ...prev, fibs: dup }));
              deletedAny = true;
              break;
            }
          }
          if (deletedAny) break;
        }
      }

      if (!deletedAny) {
        setIsDragging(true);
        setDragStartX(e.clientX);
        setDragStartPanOffset(panOffset);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    setHoverPoint({ x, y });

    if (isDragging) {
      const deltaX = e.clientX - dragStartX;
      const width = canvasRef.current.width / window.devicePixelRatio;
      const stepX = width / (visibleCount - 1);
      const barsDelta = Math.round(deltaX / stepX);
      setPanOffset(Math.max(0, Math.min(activeHistory.length - visibleCount, dragStartPanOffset + barsDelta)));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoverPoint(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 3 : -3;
    setVisibleCount(prev => {
      const nextCount = Math.max(10, Math.min(150, prev + zoomFactor));
      if (panOffset > 0) {
        setPanOffset(prevPan => Math.max(0, Math.min(activeHistory.length - nextCount, prevPan + (prev - nextCount))));
      }
      return nextCount;
    });
  };

  const snapToLive = () => {
    setPanOffset(0);
  };

  // Render loop effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio || 1;

    // Responsive scaling
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * pixelRatio;
    canvas.height = rect.height * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);

    const width = rect.width;
    const height = rect.height;

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

    if (activeHistory.length < 2) return;
    const params = getChartParams(width, height);
    if (!params) return;

    const { visibleHistory, stepX, calcY, priceRange, pad, minPrice, maxPrice, startIndex, endIndex } = params;

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
      areaGrd.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
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
        const prev = visibleHistory[i - 1];
        const curr = visibleHistory[i];
        const isGreen = curr >= prev;

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
        const prev = visibleHistory[i - 1];
        const curr = visibleHistory[i];
        const isGreen = curr >= prev;

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

    // Draw Saved Supports
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
      const p1 = getCoordsFromValue(tl.gIdx1, tl.price1, params, width);
      const p2 = getCoordsFromValue(tl.gIdx2, tl.price2, params, width);
      ctx.strokeStyle = tl.color || 'rgba(255, 215, 0, 0.8)';
      ctx.lineWidth = tl.width || 1.5;
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    });

    // Draw Saved Fibs
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

    // Bollinger Bands Drawing
    if (cbBB && activeHistory.length >= 20) {
      const bb = calculateBollingerBands(activeHistory);
      ctx.strokeStyle = 'rgba(138, 43, 226, 0.45)';
      ctx.lineWidth = 1;
      
      // Upper Band
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

      // Lower Band
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

      // Middle Band
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

    // EMA 20
    if (cbEMA20 && activeHistory.length >= 20) {
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

    // EMA 50
    if (cbEMA50 && activeHistory.length >= 50) {
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

    // Draw active drawing tool preview
    if (activeDrawingTool && startPoint && hoverPoint) {
      const p1 = getCoordsFromValue(startPoint.globalIdx, startPoint.priceVal, params, width);
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

    // Institutional Order Blocks
    const obHeight = priceRange * 0.08;
    const ySupplyTop = calcY(maxPrice);
    const ySupplyBottom = calcY(maxPrice - obHeight);
    ctx.fillStyle = 'rgba(255, 23, 68, 0.06)';
    ctx.fillRect(0, ySupplyTop, width, ySupplyBottom - ySupplyTop);
    ctx.strokeStyle = 'rgba(255, 23, 68, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, ySupplyBottom); ctx.lineTo(width, ySupplyBottom); ctx.stroke();

    ctx.fillStyle = 'rgba(255, 23, 68, 0.7)';
    ctx.font = '8px Orbitron';
    ctx.textAlign = 'left';
    let supplyLabel = 'INSTITUTIONAL ORDER BLOCK (SUPPLY)';
    if (currentLang === 'mr') supplyLabel = 'संस्थात्मक ऑर्डर ब्लॉक (सप्लाय झोन)';
    else if (currentLang === 'hi') supplyLabel = 'संस्थागत ऑर्डर ब्लॉक (सप्लाई ज़ोन)';
    else if (currentLang === 'es') supplyLabel = 'BLOQUE DE ORDEN INSTITUCIONAL (OFERTA)';
    ctx.fillText(supplyLabel, 10, ySupplyBottom - 4);

    const yDemandTop = calcY(minPrice + obHeight);
    const yDemandBottom = calcY(minPrice);
    ctx.fillStyle = 'rgba(0, 230, 118, 0.06)';
    ctx.fillRect(0, yDemandTop, width, yDemandBottom - yDemandTop);
    ctx.strokeStyle = 'rgba(0, 230, 118, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, yDemandTop); ctx.lineTo(width, yDemandTop); ctx.stroke();

    ctx.fillStyle = 'rgba(0, 230, 118, 0.7)';
    ctx.font = '8px Orbitron';
    ctx.textAlign = 'left';
    let demandLabel = 'INSTITUTIONAL ORDER BLOCK (DEMAND)';
    if (currentLang === 'mr') demandLabel = 'संस्थात्मक ऑर्डर ब्लॉक (डिमांड झोन)';
    else if (currentLang === 'hi') demandLabel = 'संस्थागत ऑर्डर ब्लॉक (डिमांड ज़ोन)';
    else if (currentLang === 'es') demandLabel = 'BLOQUE DE ORDEN INSTITUCIONAL (DEMANDA)';
    ctx.fillText(demandLabel, 10, yDemandTop + 10);

    // Liquidity Pools
    const lpUpperPrice = maxPrice - priceRange * 0.16;
    const lpLowerPrice = minPrice + priceRange * 0.16;

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 5]);

    const yLpUpper = calcY(lpUpperPrice);
    ctx.beginPath(); ctx.moveTo(0, yLpUpper); ctx.lineTo(width, yLpUpper); ctx.stroke();

    const yLpLower = calcY(lpLowerPrice);
    ctx.beginPath(); ctx.moveTo(0, yLpLower); ctx.lineTo(width, yLpLower); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(255, 215, 0, 0.75)';
    ctx.font = '7.5px Orbitron';
    let lpUpperLabel = 'LIQUIDITY POOL (BUY STOPS)';
    if (currentLang === 'mr') lpUpperLabel = 'लिक्विडिटी पूल (बाय स्टॉप्स)';
    else if (currentLang === 'hi') lpUpperLabel = 'लिक्विडिटी पूल (बाय स्टॉप्स)';
    else if (currentLang === 'es') lpUpperLabel = 'POOL DE LIQUIDEZ (COMPRA STOPS)';
    ctx.fillText(lpUpperLabel, width - 180, yLpUpper - 3);

    let lpLowerLabel = 'LIQUIDITY POOL (SELL STOPS)';
    if (currentLang === 'mr') lpLowerLabel = 'लिक्विडिटी पूल (सेल स्टॉप्स)';
    else if (currentLang === 'hi') lpLowerLabel = 'लिक्विडिटी पूल (सेल स्टॉप्स)';
    else if (currentLang === 'es') lpLowerLabel = 'POOL DE LIQUIDEZ (VENTA STOPS)';
    ctx.fillText(lpLowerLabel, width - 180, yLpLower + 9);

    // Flashing Alert Banner Overlay
    if (activeScannerAlert && (Date.now() - activeScannerAlert.time < 4000)) {
      const centerX = width / 2;
      const bannerWidth = 360;
      const bannerHeight = 36;
      const bannerX = centerX - bannerWidth / 2;
      const bannerY = 12;

      let rawColor = 'rgba(0, 240, 255, 1)';
      if (activeScannerAlert.color.includes('red-neon')) rawColor = 'rgba(255, 23, 68, 1)';
      else if (activeScannerAlert.color.includes('green-neon')) rawColor = 'rgba(0, 230, 118, 1)';
      else if (activeScannerAlert.color.includes('gold-accent')) rawColor = 'rgba(255, 215, 0, 1)';
      else if (activeScannerAlert.color.includes('cyan')) rawColor = 'rgba(0, 240, 255, 1)';
      else rawColor = activeScannerAlert.color;

      const pulseAlpha = 0.35 + 0.65 * Math.abs(Math.sin(Date.now() / 150));
      const strokeColor = rawColor.replace('1)', `${pulseAlpha})`);

      ctx.shadowColor = rawColor.replace('1)', '0.5)');
      ctx.shadowBlur = 8;

      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(bannerX, bannerY, bannerWidth, bannerHeight, 8);
      } else {
        ctx.rect(bannerX, bannerY, bannerWidth, bannerHeight);
      }
      ctx.fillStyle = 'rgba(13, 14, 21, 0.96)';
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = 'bold 9px Orbitron';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'var(--cyan)';
      ctx.fillText(activeScannerAlert.symbol.replace('_', ' '), bannerX + 12, bannerY + 15);

      ctx.textAlign = 'right';
      ctx.fillStyle = rawColor;
      ctx.fillText(activeScannerAlert.tag + ` (${activeScannerAlert.confidence}%)`, bannerX + bannerWidth - 12, bannerY + 15);

      ctx.font = '8.5px Inter';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillText(activeScannerAlert.desc, centerX, bannerY + 27);
    }

    // Crosshair & Price Tag
    if (hoverPoint && !isDragging) {
      const hoveredPrice = params.calcValY(hoverPoint.y);
      const priceText = hoveredPrice.toFixed(decimals);

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      ctx.beginPath(); ctx.moveTo(0, hoverPoint.y); ctx.lineTo(width, hoverPoint.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hoverPoint.x, 0); ctx.lineTo(hoverPoint.x, height); ctx.stroke();
      ctx.setLineDash([]);

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
  }, [
    activeHistory,
    chartType,
    cbBB,
    cbEMA20,
    cbEMA50,
    drawings,
    hoverPoint,
    startPoint,
    isDragging,
    visibleCount,
    panOffset,
    activeScannerAlert,
    currentLang,
    activeMarket,
    activeTickerKey
  ]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        style={{ display: 'block', width: '100%', height: '100%', cursor: activeDrawingTool ? 'crosshair' : 'default' }}
      />
      {panOffset > 0 && (
        <button
          id="btnGoLive"
          onClick={snapToLive}
          style={{
            position: 'absolute',
            bottom: '15px',
            right: '15px',
            background: 'rgba(13, 14, 21, 0.85)',
            border: '1.5px solid var(--cyan)',
            color: 'var(--cyan)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '9px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: 'var(--glow-cyan)',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'var(--cyan)';
            e.currentTarget.style.color = '#000';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(13, 14, 21, 0.85)';
            e.currentTarget.style.color = 'var(--cyan)';
          }}
        >
          GO LIVE ◉
        </button>
      )}
    </div>
  );
}
