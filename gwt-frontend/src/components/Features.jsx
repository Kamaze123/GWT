import { useState, useEffect } from "react"

// ── Row 1 Widget: Market Monitoring ──────────────────────────────
function MarketMonitoringWidget() {
  const [signalIndex, setSignalIndex] = useState(0)
  
  const signals = [
    { symbol: "INFY", type: "BUY SIGNAL", change: "+2.4%", statusColor: "text-green", dotBg: "bg-green" },
    { symbol: "RELIANCE", type: "HOLD SIGNAL", change: "+0.2%", statusColor: "text-gold", dotBg: "bg-gold" },
    { symbol: "TCS", type: "SELL SIGNAL", change: "-1.5%", statusColor: "text-red-500", dotBg: "bg-red-500" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setSignalIndex((prev) => (prev + 1) % signals.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const current = signals[signalIndex]

  const tickerItems = [
    { symbol: "RELIANCE", price: "2,450.40", change: "+1.8%", up: true },
    { symbol: "TCS", price: "3,892.15", change: "-0.9%", up: false },
    { symbol: "HDFCBANK", price: "1,610.80", change: "+3.2%", up: true },
    { symbol: "WIPRO", price: "485.30", change: "-1.5%", up: false },
    { symbol: "BHARTIARTL", price: "1,142.10", change: "+2.1%", up: true },
  ]

  // Double ticker for seamless loop animation
  const scrollingTicker = [...tickerItems, ...tickerItems]

  return (
    <div className="w-full max-w-[540px] lg:max-w-none lg:flex-1 h-[320px] border border-[rgba(212,160,23,0.25)] rounded-sm bg-[#091b17]/20 mx-auto flex flex-col justify-between p-6 relative overflow-hidden">
      <style>{`
        @keyframes ticker-anim {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker-marquee {
          display: flex;
          width: max-content;
          animation: ticker-anim 20s linear infinite;
        }
      `}</style>

      {/* Title / Header */}
      <div className="flex justify-between items-center border-b border-[rgba(212,160,23,0.15)] pb-3">
        <span className="font-mono text-[10px] text-gold tracking-widest uppercase">Live Signal Monitor</span>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse"></span>
          <span className="font-mono text-[9px] text-[#777]">ACTIVE</span>
        </div>
      </div>

      {/* Central Glassmorphic Signal Card */}
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="w-full max-w-[340px] bg-[rgba(13,31,27,0.7)] border border-green/30 rounded px-6 py-4 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-500 ease-in-out">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#9A9A9A] tracking-wider">RECOMMENDED ACTION</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-lg font-bold text-white tracking-tight">{current.symbol}</span>
              <span className={`font-mono text-xs font-semibold ${current.statusColor} uppercase`}>{current.type}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-mono text-sm font-bold ${current.statusColor}`}>{current.change}</span>
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dotBg}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${current.dotBg}`}></span>
            </span>
          </div>
        </div>
      </div>

      {/* Scrolling Ticker at Bottom */}
      <div className="border-t border-[rgba(212,160,23,0.15)] pt-3 overflow-hidden select-none -mx-6 bg-black/40">
        <div className="animate-ticker-marquee">
          {scrollingTicker.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 px-4 font-mono text-[10px]">
              <span className="text-white font-medium">{item.symbol}</span>
              <span className="text-[#666]">₹{item.price}</span>
              <span className={item.up ? "text-green" : "text-red-500"}>
                {item.up ? "▲" : "▼"} {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Row 2 Widget: Smart Watchlist (Clean Alert Indicators) ───────
function SmartWatchlistWidget() {
  const stocks = [
    { symbol: "TCS", name: "TATA Consultancy Services", price: "3,945.60", change: "+1.85%", up: true, alert: "Price > 20 SMA", trigger: true },
    { symbol: "INFY", name: "Infosys", price: "1,512.30", change: "+0.65%", up: true, alert: "RSI < 30 (Oversold)", trigger: false },
    { symbol: "HDFCBANK", name: "HDFC Bank", price: "1,678.90", change: "-0.42%", up: false, alert: "Near Support (₹1,650)", trigger: true },
    { symbol: "TATAMOTORS", name: "Tata Motors", price: "940.15", change: "+2.10%", up: true, alert: "Price > 200 SMA", trigger: false },
  ]

  return (
    <div className="w-full max-w-[540px] lg:max-w-none lg:flex-1 h-[320px] border border-[rgba(212,160,23,0.25)] rounded-sm bg-[#091b17]/20 mx-auto flex flex-col p-5 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[rgba(212,160,23,0.15)] pb-2.5 mb-3">
        <span className="font-mono text-[10px] text-gold tracking-widest uppercase font-semibold">Active Watchlist Alerts</span>
        <span className="font-mono text-[9px] text-[#555] uppercase">4 Symbols</span>
      </div>

      {/* Clean Table list */}
      <div className="flex-1 flex flex-col justify-between py-1">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className="flex items-center justify-between p-2.5 rounded border border-[rgba(212,160,23,0.06)] bg-black/20"
          >
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-white">{stock.symbol}</span>
              <span className="text-[9px] text-[#666] truncate max-w-[130px] hidden sm:inline">{stock.name}</span>
            </div>

            <div className="flex items-center gap-6">
              {/* Alert condition badge */}
              
              <div className="text-right">
                <div className="font-mono text-xs text-white">₹{stock.price}</div>
                <div className={`font-mono text-[9px] font-medium ${stock.up ? "text-green" : "text-red-500"}`}>
                  {stock.change}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Row 3 Widget: Portfolio Impact Analyzer ──────────────────────
function PortfolioInsightsWidget() {
  const holdings = [
    { ticker: "RELIANCE", weight: "35%", signal: "Strong Crossover — 20MA > 50MA", signalType: "bullish", impact: "+₹12,480", positive: true },
    { ticker: "TCS", weight: "25%", signal: "Consolidating — low volume range", signalType: "consolidating", impact: "−₹3,150", positive: false },
    { ticker: "HDFCBANK", weight: "25%", signal: "Support Test (Passed) — held ₹1,620", signalType: "bullish", impact: "+₹1,840", positive: true },
    { ticker: "INFY", weight: "15%", signal: "Strong Breakout — volume surge", signalType: "bullish", impact: "+₹4,220", positive: true },
  ]

  return (
    <div className="w-full max-w-[540px] lg:max-w-none lg:flex-1 h-[320px] border border-[rgba(212,160,23,0.25)] rounded-sm bg-[#091b17]/20 mx-auto flex flex-col justify-between p-5 relative overflow-hidden">
      {/* Header Row */}
      <div className="flex justify-between items-center border-b border-[rgba(212,160,23,0.15)] pb-2.5">
        <span className="font-mono text-[10px] text-gold tracking-widest uppercase font-semibold">PORTFOLIO IMPACT ANALYZER</span>
        <span className="font-mono text-[9px] text-[#888] tracking-wider font-medium">BETA: 1.05 &nbsp; CORR: 0.82</span>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-2 bg-black/40 border border-[rgba(212,160,23,0.08)] rounded p-2.5 my-2">
        <div>
          <span className="text-[8px] font-mono text-[#777] block uppercase">Est. Value</span>
          <span className="text-xs font-mono font-bold text-white">₹45,67,890</span>
        </div>
        <div>
          <span className="text-[8px] font-mono text-[#777] block uppercase">Today's P&L</span>
          <span className="text-xs font-mono font-bold text-green">+₹15,390</span>
        </div>
        <div>
          <span className="text-[8px] font-mono text-[#777] block uppercase">Risk Rating</span>
          <span className="text-xs font-mono font-bold text-gold">Moderate-High</span>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="flex-1 flex flex-col justify-between py-1 gap-1">
        {holdings.map((hold, idx) => {
          let signalColor = "text-[#555]"
          if (hold.signalType === "bullish") signalColor = "text-green"
          else if (hold.signalType === "consolidating" || hold.signalType === "watch") signalColor = "text-gold"

          const impactColor = hold.positive ? "text-green" : "text-[#F87171]"

          return (
            <div key={idx} className="flex items-center justify-between text-[11px] border-b border-[rgba(212,160,23,0.04)] pb-1.5 last:border-0 last:pb-0 font-mono">
              {/* Ticker & Weight */}
              <div className="flex items-center gap-2 w-[85px] sm:w-[100px] shrink-0">
                <span className="font-bold text-white">{hold.ticker}</span>
                <span className="text-[8.5px] text-[#666] tracking-wide">{hold.weight} wt</span>
              </div>
              
              {/* Signal Description */}
              <span className={`font-sans text-[10.5px] truncate flex-1 px-2 ${signalColor}`}>
                {hold.signal}
              </span>

              {/* P&L Impact */}
              <span className={`font-semibold w-[70px] text-right shrink-0 ${impactColor}`}>
                {hold.impact}
              </span>
            </div>
          )
        })}
      </div>

      {/* Bottom Row */}
      <div className="border-t border-[rgba(212,160,23,0.15)] pt-2 mt-1">
        <span className="font-mono text-[8.5px] text-[#666] block leading-none">
          Signals weighted by portfolio allocation &middot; Updated 4 min ago &middot; Not financial advice
        </span>
      </div>
    </div>
  )
}

// ── Feature row wrapper ─────────────────────────────────────────
function FeatRow({ reverse, dark, children, first }) {
  return (
    <div
      className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 px-6 md:px-16 lg:px-20 py-16 lg:py-0 lg:h-[50vh] lg:min-h-[50vh] ${!first ? "border-t border-[rgba(212,160,23,0.14)]" : ""} ${reverse ? "lg:flex-row-reverse" : ""}`}
      style={{ background: dark ? "#091b17" : "#0A0A0A" }}
    >
      {children}
    </div>
  )
}

// ── Text block ──────────────────────────────────────────────────
function FeatText({ label, title, body }) {
  return (
    <div className="flex-1 min-w-0 w-full">
      {label && (
        <p className="font-mono text-xs md:text-sm font-medium tracking-[0.16em] text-[#D4A017] uppercase mb-3">
          {label}
        </p>
      )}
      <h2 className="font-serif text-3xl md:text-4xl lg:text-[40px] font-bold text-white leading-[1.15] tracking-tight mb-4">
        {title}
      </h2>
      <p className="text-base md:text-lg text-[#9A9A9A] leading-[1.7]">
        {body}
      </p>
    </div>
  )
}

export default function Features() {
  return (
    <div id="platform" className="border-t border-[rgba(212,160,23,0.14)]">

      <FeatRow first>
        <FeatText
          label="MARKET MONITORING"
          title={<>We Watch the Market<br />So You Don't Have to</>}
          body="Our platform continuously monitors thousands of stocks in real time, tracking price movements, volume shifts, momentum changes, and trend direction around the clock. You stay informed without having to stare at charts all day."
        />
        <MarketMonitoringWidget />
      </FeatRow>

      <FeatRow reverse dark>
        <FeatText
          label="SMART WATCHLIST"
          title={<>Your Watchlist,<br />Amplified by Intelligence</>}
          body="Add the stocks you care about and let our system keep an eye on them for you. When something meaningful happens, you get notified with a clear explanation of what changed and why it matters."
        />
        <SmartWatchlistWidget />
      </FeatRow>

      <FeatRow>
        <FeatText
          label="PORTFOLIO INSIGHTS"
          title={<>Know What the Market<br />Means for Your Portfolio</>}
          body="Based on your holdings, GWT surfaces the market movements and trend shifts most relevant to your portfolio — weighted by your position sizes. So instead of tracking the entire market, you only see what actually moves your numbers."
        />
        <PortfolioInsightsWidget />
      </FeatRow>

    </div>
  )
}