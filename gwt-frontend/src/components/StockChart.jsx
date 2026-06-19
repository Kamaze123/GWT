import { useState, useEffect, useRef } from "react"

// Configuration for Indian stocks
const STOCKS_CONFIG = {
  RELIANCE: {
    ticker: "RELIANCE",
    name: "Reliance Industries Ltd.",
    basePrice: 2950.50,
    prevClose: 2915.20,
    volatility: 0.006,
    trend: 0.001,
  },
  TCS: {
    ticker: "TCS",
    name: "Tata Consultancy Services Ltd.",
    basePrice: 4120.80,
    prevClose: 4085.00,
    volatility: 0.005,
    trend: 0.0008,
  },
  HDFCBANK: {
    ticker: "HDFCBANK",
    name: "HDFC Bank Ltd.",
    basePrice: 1645.30,
    prevClose: 1656.50,
    volatility: 0.007,
    trend: 0.0005,
  }
}

// Generate base historical data deterministically on initial load
function generateHistoricalData(config, length = 24) {
  const data = []
  let currentPrice = config.basePrice
  const startDay = new Date()
  startDay.setDate(startDay.getDate() - length)

  for (let i = 0; i < length; i++) {
    // Generate pseudo-random deterministic walks for baseline consistency
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

// Calculate rolling average (SMA) and Bollinger Bands
function calculateIndicators(data) {
  const smaPeriod = 5
  return data.map((d, idx) => {
    let sma = d.price
    let upperBand = d.price * 1.015
    let lowerBand = d.price * 0.985

    if (idx >= smaPeriod - 1) {
      const slice = data.slice(idx - smaPeriod + 1, idx + 1).map(x => x.price)
      const sum = slice.reduce((a, b) => a + b, 0)
      sma = sum / smaPeriod

      // Standard Deviation
      const mean = sma
      const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / smaPeriod
      const stdDev = Math.sqrt(variance)

      // Bollinger Bands (1.6 standard deviations for visual aesthetics)
      upperBand = sma + 1.6 * stdDev
      lowerBand = sma - 1.6 * stdDev
    }

    return {
      ...d,
      sma: Math.round(sma * 100) / 100,
      upperBand: Math.round(upperBand * 100) / 100,
      lowerBand: Math.round(lowerBand * 100) / 100
    }
  })
}

export default function StockChart() {
  const [activeStock, setActiveStock] = useState("RELIANCE")
  const [prevStock, setPrevStock] = useState("RELIANCE")
  const [stockData, setStockData] = useState(() => generateHistoricalData(STOCKS_CONFIG.RELIANCE, 25))
  const [showSMA, setShowSMA] = useState(true)
  const [showBands, setShowBands] = useState(true)
  const [hoverIndex, setHoverIndex] = useState(null)
  
  // Visual pricing tick direction flash state
  const [tickDirection, setTickDirection] = useState("neutral") // 'up' | 'down' | 'neutral'
  const svgRef = useRef(null)

  const activeConfig = STOCKS_CONFIG[activeStock]

  // Adjust state during render when activeStock changes (resolves synchronous setState linter error)
  if (activeStock !== prevStock) {
    setPrevStock(activeStock)
    setStockData(generateHistoricalData(activeConfig, 25))
    setTickDirection("neutral")
  }

  // Live ticking simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setStockData(prevData => {
        if (prevData.length === 0) return prevData

        const updatedData = [...prevData]
        const lastIdx = updatedData.length - 1
        const lastItem = updatedData[lastIdx]

        // Walk price by small fraction (-0.12% to +0.15% to simulate market noise)
        const noise = (Math.random() - 0.44) * 0.002
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
    }, 2000)

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
    const uppers = stockData.map(d => d.upperBand)
    const lowers = stockData.map(d => d.lowerBand)

    const listToCheck = [
      ...prices,
      ...(showSMA ? smas : []),
      ...(showBands ? [...uppers, ...lowers] : [])
    ]

    minVal = Math.min(...listToCheck)
    maxVal = Math.max(...listToCheck)
    
    // Add small buffer to top/bottom
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
  let bandsPath = ""

  if (stockData.length > 0) {
    // 1. Price Path
    pricePath = "M " + stockData.map((d, i) => `${getX(i)},${getY(d.price)}`).join(" L ")
    priceFillPath = `${pricePath} L ${getX(stockData.length - 1)},${margin.top + plotHeight} L ${getX(0)},${margin.top + plotHeight} Z`

    // 2. SMA Path
    if (showSMA) {
      smaPath = "M " + stockData.map((d, i) => `${getX(i)},${getY(d.sma)}`).join(" L ")
    }

    // 3. Bollinger Bands closed polygon
    if (showBands) {
      const upperPoints = stockData.map((d, i) => `${getX(i)},${getY(d.upperBand)}`)
      const lowerPoints = [...stockData].reverse().map((d, i) => {
        const revIdx = stockData.length - 1 - i
        return `${getX(revIdx)},${getY(d.lowerBand)}`
      })
      bandsPath = "M " + upperPoints.concat(lowerPoints).join(" L ") + " Z"
    }
  }

  // Interactive mouse handlers
  const handleMouseMove = (e) => {
    if (!svgRef.current || stockData.length === 0) return
    const rect = svgRef.current.getBoundingClientRect()
    
    // Support correct scaling since viewBox is hardcoded and DOM size varies
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

  // Generate grid values for 3 intervals
  const yTicks = stockData.length > 0 ? [
    minVal + (maxVal - minVal) * 0.2,
    minVal + (maxVal - minVal) * 0.5,
    minVal + (maxVal - minVal) * 0.8
  ] : []

  // Check if we should shift tooltip to left
  const hoverItem = hoverIndex !== null ? stockData[hoverIndex] : null
  const isTooltipOnRightHalf = hoverIndex > stockData.length / 2

  return (
    <div className="w-full max-w-[560px] bg-black2 border border-gold/15 rounded-sm p-5 md:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-gold/30">
      
      {/* Background Decorative Grid Line & Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-green/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── TOP: Stock Title & Live Price Ticker ── */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-sans font-bold text-lg text-white leading-tight flex items-center gap-2">
            {activeConfig.ticker}
            <span className="font-mono text-[9px] uppercase tracking-wider bg-gold/10 text-gold px-1.5 py-0.5 rounded border border-gold/15">
              LIVE INDEX
            </span>
          </h3>
          <p className="font-sans text-xs text-[#7A7A7A] mt-0.5">{activeConfig.name}</p>
        </div>

        <div className="text-right">
          <div className={`font-mono text-xl font-bold tracking-tight transition-all duration-300 ${
            tickDirection === "up" ? "text-green shadow-[0_0_12px_rgba(34,197,94,0.25)]" :
            tickDirection === "down" ? "text-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.25)]" :
            "text-white"
          }`}>
            ₹{currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-end gap-1 mt-0.5">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${isUp ? "bg-green animate-pulse" : "bg-rose-500 animate-pulse"}`} />
            <span className={`font-mono text-xs font-semibold ${isUp ? "text-green" : "text-rose-500"}`}>
              {isUp ? "▲" : "▼"} {Math.abs(priceDiff).toFixed(2)} ({isUp ? "+" : ""}{priceDiffPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* ── CHART CONTAINER (SVG Based) ── */}
      <div className="relative w-full h-[240px] select-none">
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
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.0" />
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
                className="font-mono text-[9px] fill-current"
                textAnchor="start"
              >
                ₹{Math.round(tick).toLocaleString("en-IN")}
              </text>
            </g>
          ))}

          {/* Bollinger Bands Shading */}
          {showBands && bandsPath && (
            <path
              d={bandsPath}
              fill="rgba(34, 197, 94, 0.035)"
              stroke="rgba(34, 197, 94, 0.08)"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          )}

          {/* SMA Moving Average Line */}
          {showSMA && smaPath && (
            <path
              d={smaPath}
              fill="none"
              stroke="#D4A017"
              strokeWidth="1.25"
              strokeDasharray="4 2.5"
              opacity="0.8"
            />
          )}

          {/* Price Area Fill */}
          {priceFillPath && (
            <path d={priceFillPath} fill="url(#priceGradient)" />
          )}

          {/* Main Price Line */}
          {pricePath && (
            <>
              {/* Outer Glow Stroke */}
              <path
                d={pricePath}
                fill="none"
                stroke="#22C55E"
                strokeWidth="4"
                opacity="0.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Core Stroke */}
              <path
                d={pricePath}
                fill="none"
                stroke="#22C55E"
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
                className="font-mono text-[9px] fill-current"
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
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1"
                strokeDasharray="2 2"
              />

              {/* Bollinger Upper/Lower Hover Dots */}
              {showBands && (
                <>
                  <circle cx={getX(hoverIndex)} cy={getY(hoverItem.upperBand)} r="3" fill="#22C55E" opacity="0.4" />
                  <circle cx={getX(hoverIndex)} cy={getY(hoverItem.lowerBand)} r="3" fill="#22C55E" opacity="0.4" />
                </>
              )}

              {/* SMA Hover Dot */}
              {showSMA && (
                <circle
                  cx={getX(hoverIndex)}
                  cy={getY(hoverItem.sma)}
                  r="3.5"
                  fill="#D4A017"
                  stroke="#0A0A0A"
                  strokeWidth="1"
                />
              )}

              {/* Main Price Hover Circle */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(hoverItem.price)}
                r="5"
                fill="#22C55E"
                stroke="#0A0A0A"
                strokeWidth="1.5"
                className="shadow-lg"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip HTML Overlay */}
        {hoverIndex !== null && hoverItem && (
          <div
            className="absolute top-1 z-30 pointer-events-none bg-[#111111]/95 border border-gold/20 rounded px-2.5 py-1.5 text-left text-[11px] shadow-xl backdrop-blur-sm"
            style={{
              left: isTooltipOnRightHalf
                ? `${((getX(hoverIndex) - 105 - margin.left) / plotWidth) * 100}%`
                : `${((getX(hoverIndex) + 12 - margin.left) / plotWidth) * 100}%`,
              minWidth: "95px"
            }}
          >
            <div className="font-sans font-bold text-gray-400 border-b border-gray-800 pb-0.5 mb-1 flex justify-between items-center">
              <span>{hoverItem.date}</span>
              <span className="text-[9px] px-1 font-mono rounded bg-white/5 uppercase text-gold">HISTORICAL</span>
            </div>
            <div className="font-mono text-white flex justify-between gap-3">
              <span>Price:</span>
              <span className="font-bold">₹{hoverItem.price.toFixed(2)}</span>
            </div>
            {showSMA && (
              <div className="font-mono text-gold flex justify-between gap-3">
                <span>SMA (5d):</span>
                <span>₹{hoverItem.sma.toFixed(2)}</span>
              </div>
            )}
            {showBands && (
              <div className="font-mono text-green3 flex justify-between gap-3 text-[10px]">
                <span>Bands:</span>
                <span>{Math.round(hoverItem.lowerBand)} - {Math.round(hoverItem.upperBand)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── BOTTOM CONTROLS: Stock Selector & Overlay Options ── */}
      <div className="border-t border-gray-900 pt-4 mt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Stock Selector Tabs */}
        <div className="flex items-center bg-black3 p-0.5 rounded border border-white/5 w-full sm:w-auto overflow-x-auto">
          {Object.keys(STOCKS_CONFIG).map((key) => (
            <button
              key={key}
              onClick={() => setActiveStock(key)}
              className={`flex-1 sm:flex-initial text-center px-3 py-1.5 rounded-sm font-sans text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeStock === key
                  ? "bg-gold text-black shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Indicators Overlay Toggle switches */}
        <div className="flex items-center gap-4 text-xs font-mono select-none">
          {/* Toggle SMA */}
          <button
            onClick={() => setShowSMA(prev => !prev)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center ${
              showSMA ? "border-gold bg-gold text-black" : "border-gray-600"
            }`}>
              {showSMA && <span className="text-[10px] leading-none font-bold">✓</span>}
            </div>
            <span>Rolling SMA</span>
          </button>

          {/* Toggle Bollinger Bands */}
          <button
            onClick={() => setShowBands(prev => !prev)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center ${
              showBands ? "border-green bg-green text-black" : "border-gray-600"
            }`}>
              {showBands && <span className="text-[10px] leading-none font-bold">✓</span>}
            </div>
            <span>Bollinger Bands</span>
          </button>

        </div>
      </div>
    </div>
  )
}
