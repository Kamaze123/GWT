// ── Reusable Image Placeholder ──────────────────────────────────
// Replace the contents of this component with actual images or custom elements later on.
function ImagePlaceholder({ altText }) {
  return (
    <div className="w-full max-w-[540px] aspect-video lg:aspect-none lg:max-w-none lg:flex-1 lg:h-64 flex items-center justify-center border border-[rgba(212,160,23,0.28)] rounded-sm bg-[#091b17] mx-auto">
      {/* 
        TODO: Replace this entire placeholder block with your actual image or graphic.
        Example code:
        <img 
          src="/assets/your-screenshot.png" 
          alt={altText} 
          className="w-full h-full object-cover" 
        />
      */}
      <span className="font-mono text-xs text-[#555555] tracking-widest select-none">
        [{altText} IMAGE PLACEHOLDER]
      </span>
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
        {/* Placeholder for AI Reasoning Image/Graphic */}
        <ImagePlaceholder altText="AI REASONING LAYER" />
      </FeatRow>

      <FeatRow reverse dark>
        <FeatText
          label="SMART WATCHLIST"
          title={<>Your Watchlist,<br />Amplified by Intelligence</>}
          body="Add the stocks you care about and let our system keep an eye on them for you. When something meaningful happens, you get notified with a clear explanation of what changed and why it matters."
        />
        {/* Placeholder for Quantitative Core Image/Graphic */}
        <ImagePlaceholder altText="QUANTITATIVE CORE" />
      </FeatRow>

      <FeatRow>
        <FeatText
          label="PORTFOLIO INSIGHTS"
          title={<>Know What the Market<br />Means for Your Portfolio</>}
          body="Based on your holdings, our platform surfaces the market movements and trend shifts that are most relevant to your portfolio. You always know how current market conditions connect to the stocks you own."
        />
        {/* Placeholder for Watchlist Image/Graphic */}
        <ImagePlaceholder altText="WATCHLIST MONITOR" />
      </FeatRow>

    </div>
  )
}