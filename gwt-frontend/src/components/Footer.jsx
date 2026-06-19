export default function Footer() {
  return (
    <div className="h-screen flex flex-col justify-between bg-black border-t border-[rgba(212,160,23,0.14)]">
      {/* ── ABOUT SECTION ── */}
      <section
        id="about"
        className="relative flex-1 overflow-hidden flex flex-col items-center justify-center text-center px-6 py-12 md:py-0"
      >
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-green/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[800px] w-full flex flex-col items-center">
          <p className="font-mono text-xs md:text-sm font-medium tracking-[0.16em] text-[#D4A017] uppercase mb-4">
            Grow Wealth Tech
          </p>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-[1.15] tracking-tight mb-6 max-w-[680px]">
            Smarter Market Insights.<br />Closer Than Ever.
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-[#9A9A9A] leading-relaxed mb-8 max-w-[600px]">
            We believe everyone deserve the same analytical power as major institutions. By combining rigorous quantitative modeling with advanced algorithms, Grow Wealth Tech delivers clear, actionable insights directly to you.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#methodology"
              className="bg-gold hover:bg-gold2 text-black text-sm font-semibold px-6 py-3 rounded-sm tracking-wider transition-all duration-200 hover:shadow-[0_0_18px_rgba(212,160,23,0.35)] no-underline animate-pulse-subtle"
            >
              Explore the Platform
            </a>
            <a
              href="mailto:contact@growwealth.tech"
              className="text-[#E8E8E8] text-sm font-medium px-6 py-3 border border-gold/28 rounded-sm hover:border-green hover:text-green transition-all duration-200 no-underline"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-[rgba(212,160,23,0.08)] bg-black px-6 md:px-16 lg:px-20 py-8 flex-shrink-0">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          {/* Brand */}
          <div>
            <a href="#" className="flex items-center gap-2.5 no-underline mb-2">
              <div className="w-8 h-8 bg-green2 flex items-center justify-center font-mono text-xs font-medium text-white rounded-sm">
                GWT
              </div>
              <span className="text-sm font-semibold text-[#E8E8E8] tracking-wide">
                Grow Wealth Tech
              </span>
            </a>
            <p className="text-xs text-[#555555] leading-relaxed max-w-[320px]">
              AI-powered investment insights for the informed retail investor. Not financial advice.
            </p>
          </div>
        </div>

        {/* Legal Bar */}
        <div className="max-w-[1200px] mx-auto border-t border-[rgba(212,160,23,0.14)] pt-5 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
          <span className="font-mono text-[10px] text-[#555555] tracking-[0.03em]">
            © 2026 Grow Wealth Tech, Inc. All rights reserved.
          </span>
          <span className="font-mono text-[10px] text-[#555555] tracking-[0.03em] max-w-[640px] md:text-right">
            Not investment advice · For informational purposes only · Past performance does not indicate future results
          </span>
        </div>
      </footer>
    </div>
  )
}
