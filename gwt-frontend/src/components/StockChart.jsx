import { useState, useEffect, useRef } from "react"

// Configuration for Indian stocks
const STOCKS_CONFIG = {
  RELIANCE: {
    ticker: "RELIANCE",
    name: "Reliance Industries Ltd.",
    basePrice: 2950.50,
    prevClose: 2915.20,
    volatility: 0.005,
    trend: 0.0008,
  },
  TCS: {
    ticker: "TCS",
    name: "Tata Consultancy Services Ltd.",
    basePrice: 4120.80,
    prevClose: 4085.00,
    volatility: 0.004,
    trend: 0.0005,
  },
  HDFCBANK: {
    ticker: "HDFCBANK",
    name: "HDFC Bank Ltd.",
    basePrice: 1645.30,
    prevClose: 1656.50,
    volatility: 0.006,
    trend: 0.0003,
  }
}

// Generate base historical data deterministically
function generateHistoricalData(config, length = 24) {
  const data = []
  let currentPrice = config.basePrice
  const startDay = new Date()
  startDay.setDate(startDay.getDate() - length)

  for (let i = 0; i < length; i++) {
    const angle = i * 2.1 + config.ticker.charCodeAt(0)
    const rand = Math.sin(angle) * 0.45 + Math.cos(angle * 1.6) * 0.55
    const percentChange = rand * config.volatility + config.trend
    currentPrice = currentPrice * (1 + percentChange)

    const dateObj = new Date(startDay)
    dateObj.setDate(startDay.getDate() + i)
    const dateStr = dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short" })

    data.push({
      date: dateStr,
      price: Math.round(currentPrice * 100) / 100
    })
  }

  return calculateIndicators(data)
}

// Calculate rolling average (SMA) and Weighted Moving Average (WMA)
function calculateIndicators(data) {
  const smaPeriod = 5
  return data.map((d, idx) => {
    let sma = d.price
    let wma = d.price

    if (idx >= smaPeriod - 1) {
      const slice = data.slice(idx - smaPeriod + 1, idx + 1).map(x => x.price)
      const sum = slice.reduce((a, b) => a + b, 0)
      sma = sum / smaPeriod

      let weightedSum = 0
      let weightSum = 0
      for (let i = 0; i < smaPeriod; i++) {
        const weight = i + 1
        weightedSum += slice[i] * weight
        weightSum += weight
      }
      wma = weightedSum / weightSum
    }

    return {
      ...d,
      sma: Math.round(sma * 100) / 100,
      wma: Math.round(wma * 100) / 100
    }
  })
}

export default function StockChart() {
  const [activeStock, setActiveStock] = useState("RELIANCE")
  const [prevStock, setPrevStock] = useState("RELIANCE")
  
  // Initialize with deterministic data
  const [stockData, setStockData] = useState(() => generateHistoricalData(STOCKS_CONFIG.RELIANCE, 25))
  
  const [showSMA, setShowSMA] = useState(true)
  const [showWMA, setShowWMA] = useState(true)
  const [hoverIndex, setHoverIndex] = useState(null)
  
  // Visual pricing tick direction flash state
  const [tickDirection, setTickDirection] = useState("neutral") // 'up' | 'down' | 'neutral'
  const svgRef = useRef(null)

  const activeConfig = STOCKS_CONFIG[activeStock]

  // Adjust state during render when activeStock changes (resolves synchronous setState linter warning)
  if (activeStock !== prevStock) {
    setPrevStock(activeStock)
    setStockData(generateHistoricalData(activeConfig, 25))
    setTickDirection("neutral")
  }

  // Real-time ticking simulation (runs entirely offline/locally)
  useEffect(() => {
    const timer = setInterval(() => {
      setStockData(prevData => {
        if (prevData.length === 0) return prevData

        const updatedData = [...prevData]
        const lastIdx = updatedData.length - 1
        const lastItem = updatedData[lastIdx]

        // Walk price by small random walk fraction
        const noise = (Math.random() - 0.44) * 0.0016
        const nextPrice = Math.round(lastItem.price * (1 + noise) * 100) / 100

        // Flash ticker indicator
        if (nextPrice > lastItem.price) {
          setTickDirection("up")
        } else if (nextPrice < lastItem.price) {
          setTickDirection("down")
        }

        updatedData[lastIdx] = {
          ...lastItem,
          price: nextPrice
        }

        return calculateIndicators(updatedData)
      })
    }, 1500)

    return () => clearInterval(timer)
  }, [activeStock])

  // Reset ticker flash back to neutral after 500ms
  useEffect(() => {
    if (tickDirection !== "neutral") {
      const resetTimer = setTimeout(() => {
        setTickDirection("neutral")
      }, 500)
      return () => clearTimeout(resetTimer)
    }
  }, [tickDirection])

  // Calculate live values
  const currentPrice = stockData[stockData.length - 1]?.price || activeConfig.basePrice
  const priceDiff = currentPrice - activeConfig.prevClose
  const priceDiffPercent = (priceDiff / activeConfig.prevClose) * 100
  const isUp = priceDiff >= 0

  // Chart coordinate mapping math
  const margin = { top: 20, right: 65, bottom: 25, left: 15 }
  const width = 500
  const height = 240
  const plotWidth = width - margin.left - margin.right
  const plotHeight = height - margin.top - margin.bottom

  let minVal = 0
  let maxVal = 100

  if (stockData.length > 0) {
    const prices = stockData.map(d => d.price)
    const smas = stockData.map(d => d.sma)
    const wmas = stockData.map(d => d.wma)

    const listToCheck = [
      ...prices,
      ...(showSMA ? smas : []),
      ...(showWMA ? wmas : [])
    ]

    minVal = Math.min(...listToCheck)
    maxVal = Math.max(...listToCheck)
    
    const range = maxVal - minVal
    minVal = minVal - range * 0.08
    maxVal = maxVal + range * 0.08
  }

  const getX = (idx) => margin.left + (idx / (stockData.length - 1)) * plotWidth
  const getY = (val) => margin.top + plotHeight - ((val - minVal) / (maxVal - minVal)) * plotHeight

  // Create paths
  let pricePath = ""
  let priceFillPath = ""
  let smaPath = ""
  let wmaPath = ""

  if (stockData.length > 0) {
    // 1. Price Path (Golden Graph Line)
    pricePath = "M " + stockData.map((d, i) => `${getX(i)},${getY(d.price)}`).join(" L ")
    priceFillPath = `${pricePath} L ${getX(stockData.length - 1)},${margin.top + plotHeight} L ${getX(0)},${margin.top + plotHeight} Z`

    // 2. SMA Path (Slate-blue Dashed Line)
    if (showSMA) {
      smaPath = "M " + stockData.map((d, i) => `${getX(i)},${getY(d.sma)}`).join(" L ")
    }

    // 3. WMA Path (Glowing Green Line)
    if (showWMA) {
      wmaPath = "M " + stockData.map((d, i) => `${getX(i)},${getY(d.wma)}`).join(" L ")
    }
  }

  // Interactive mouse handlers
  const handleMouseMove = (e) => {
    if (!svgRef.current || stockData.length === 0) return
    const rect = svgRef.current.getBoundingClientRect()
    
    const relativeX = ((e.clientX - rect.left) / rect.width) * width
    const plotX = relativeX - margin.left
    const percentX = plotX / plotWidth
    
    let index = Math.round(percentX * (stockData.length - 1))
    if (index < 0) index = 0
    if (index > stockData.length - 1) index = stockData.length - 1
    
    setHoverIndex(index)
  }

  const handleMouseLeave = () => {
    setHoverIndex(null)
  }

  const yTicks = stockData.length > 0 ? [
    minVal + (maxVal - minVal) * 0.2,
    minVal + (maxVal - minVal) * 0.5,
    minVal + (maxVal - minVal) * 0.8
  ] : []

  const hoverItem = hoverIndex !== null ? stockData[hoverIndex] : null
  const isTooltipOnRightHalf = hoverIndex > stockData.length / 2

  return (
    <div className="w-full max-w-[560px] bg-black2 border border-gold/15 rounded-sm p-5 md:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-gold/30">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── TOP: Stock Title & Live Price Ticker ── */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="font-sans font-bold text-lg text-white leading-tight">
            {activeConfig.ticker}
          </h3>
          <p className="font-sans text-xs text-[#7A7A7A] mt-0.5">{activeConfig.name}</p>
        </div>

        <div className="text-right">
          <div className={`font-sans text-xl font-bold tracking-tight transition-all duration-300 ${
            tickDirection === "up" ? "text-green shadow-[0_0_12px_rgba(34,197,94,0.25)]" :
            tickDirection === "down" ? "text-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.25)]" :
            "text-white"
          }`}>
            ₹{currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-end gap-1 mt-0.5">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${isUp ? "bg-green" : "bg-rose-500"}`} />
            <span className={`font-sans text-xs font-semibold ${isUp ? "text-green" : "text-rose-500"}`}>
              {isUp ? "▲" : "▼"} {Math.abs(priceDiff).toFixed(2)} ({isUp ? "+" : ""}{priceDiffPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* ── CHART CONTAINER (SVG Based) ── */}
      <div className="relative w-full h-[240px] select-none flex items-center justify-center">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-crosshair overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4A017" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#D4A017" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Y Axis Grid Lines & Prices */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={margin.left}
                y1={getY(tick)}
                x2={margin.left + plotWidth}
                y2={getY(tick)}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="3 3"
              />
              <text
                x={margin.left + plotWidth + 6}
                y={getY(tick) + 3}
                fill="#555555"
                className="font-sans text-[9px] fill-current"
                textAnchor="start"
              >
                ₹{Math.round(tick).toLocaleString("en-IN")}
              </text>
            </g>
          ))}

          {/* WMA Weighted Moving Average Line (Glowing Green Line) */}
          {showWMA && wmaPath && (
            <>
              {/* Outer Glow */}
              <path
                d={wmaPath}
                fill="none"
                stroke="#4ADE80"
                strokeWidth="3.5"
                opacity="0.12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Core Stroke */}
              <path
                d={wmaPath}
                fill="none"
                stroke="#4ADE80"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
              />
            </>
          )}

          {/* SMA Moving Average Line (Slate-blue Accent Line) */}
          {showSMA && smaPath && (
            <path
              d={smaPath}
              fill="none"
              stroke="#475569"
              strokeWidth="1.25"
              strokeDasharray="3 3"
              opacity="0.85"
            />
          )}

          {/* Price Area Fill (Gold Gradient Fill) */}
          {priceFillPath && (
            <path d={priceFillPath} fill="url(#priceGradient)" />
          )}

          {/* Main Price Line (Glowing Gold Graph Line) */}
          {pricePath && (
            <>
              {/* Outer Glow Stroke */}
              <path
                d={pricePath}
                fill="none"
                stroke="#D4A017"
                strokeWidth="4"
                opacity="0.08"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Core Stroke */}
              <path
                d={pricePath}
                fill="none"
                stroke="#D4A017"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* X Axis Date Labels (Show 4 dates) */}
          {stockData.length > 0 && [0, Math.floor(stockData.length / 3), Math.floor(stockData.length * 2 / 3), stockData.length - 1].map((idx) => {
            const item = stockData[idx]
            if (!item) return null
            return (
              <text
                key={idx}
                x={getX(idx)}
                y={margin.top + plotHeight + 15}
                fill="#555555"
                className="font-sans text-[9px] fill-current"
                textAnchor="middle"
              >
                {item.date}
              </text>
            )
          })}

          {/* Hover Crosshair elements */}
          {hoverIndex !== null && hoverItem && (
            <g>
              {/* Vertical Guide Line */}
              <line
                x1={getX(hoverIndex)}
                y1={margin.top}
                x2={getX(hoverIndex)}
                y2={margin.top + plotHeight}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
                strokeDasharray="2 2"
              />

              {/* WMA Hover Dot */}
              {showWMA && (
                <circle
                  cx={getX(hoverIndex)}
                  cy={getY(hoverItem.wma)}
                  r="3.5"
                  fill="#4ADE80"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                />
              )}

              {/* SMA Hover Dot */}
              {showSMA && (
                <circle
                  cx={getX(hoverIndex)}
                  cy={getY(hoverItem.sma)}
                  r="3.5"
                  fill="#475569"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                />
              )}

              {/* Main Price Hover Circle */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(hoverItem.price)}
                r="5"
                fill="#D4A017"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className="shadow-lg"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Floating Tooltip HTML Overlay */}
      {hoverIndex !== null && hoverItem && (
        <div
          className="absolute top-2 z-30 pointer-events-none bg-[#111111]/95 text-white border border-gold/20 rounded px-2.5 py-1.5 text-left text-[11px] shadow-xl backdrop-blur-sm"
          style={{
            left: isTooltipOnRightHalf
              ? `${((getX(hoverIndex) - 105 - margin.left) / plotWidth) * 100}%`
              : `${((getX(hoverIndex) + 12 - margin.left) / plotWidth) * 100}%`,
            minWidth: "95px"
          }}
        >
          <div className="font-sans font-bold text-gray-400 border-b border-gray-800 pb-0.5 mb-1 flex justify-between items-center">
            <span>{hoverItem.date}</span>
            <span className="text-[9px] px-1 font-sans rounded bg-white/5 uppercase text-gold">HISTORICAL</span>
          </div>
          <div className="font-sans text-white flex justify-between gap-3 tabular-nums">
            <span>Price:</span>
            <span className="font-bold">₹{hoverItem.price.toFixed(2)}</span>
          </div>
          {showSMA && (
            <div className="font-sans text-gold flex justify-between gap-3 tabular-nums">
              <span>SMA (5d):</span>
              <span>₹{hoverItem.sma.toFixed(2)}</span>
            </div>
          )}
          {showWMA && (
            <div className="font-sans text-[#4ADE80] flex justify-between gap-3 tabular-nums">
              <span>WMA (5d):</span>
              <span>₹{hoverItem.wma.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      {/* ── BOTTOM CONTROLS: Stock Selector & Overlay Options ── */}
      <div className="border-t border-gray-900 pt-4 mt-2 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        
        {/* Stock Selector Tabs */}
        <div className="flex items-center bg-black3 p-0.5 rounded border border-white/5 w-full sm:w-auto overflow-x-auto">
          {Object.keys(STOCKS_CONFIG).map((key) => (
            <button
              key={key}
              onClick={() => setActiveStock(key)}
              className={`flex-1 sm:flex-initial text-center px-3 py-1.5 rounded-sm font-sans text-xs font-bold tracking-normal transition-all cursor-pointer ${
                activeStock === key
                  ? "bg-gold text-black shadow-sm font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Indicators Overlay Toggle switches */}
        <div className="flex items-center gap-4 text-xs font-sans select-none">
          {/* Toggle SMA */}
          <button
            onClick={() => setShowSMA(prev => !prev)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center ${
              showSMA ? "border-gold bg-gold text-black animate-none" : "border-gray-600 bg-transparent"
            }`}>
              {showSMA && <span className="text-[10px] leading-none font-bold">✓</span>}
            </div>
            <span>Rolling SMA</span>
          </button>

          {/* Toggle Weighted Moving Average */}
          <button
            onClick={() => setShowWMA(prev => !prev)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center ${
              showWMA ? "border-white bg-white text-black" : "border-gray-600 bg-transparent"
            }`}>
              {showWMA && <span className="text-[10px] leading-none font-bold">✓</span>}
            </div>
            <span>Weighted MA</span>
          </button>

        </div>
      </div>
    </div>
  )
}
