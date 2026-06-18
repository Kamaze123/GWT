import { useState } from "react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) {
      setError("Please enter your email address.")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.")
      return
    }

    setError("")
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen md:h-screen flex flex-col justify-between bg-black border-t border-[rgba(212,160,23,0.14)]">
      {/* ── WAITLIST SECTION ── */}
      <section
        id="waitlist"
        className="relative flex-1 overflow-hidden flex flex-col items-center justify-center text-center px-6 py-12 md:py-0"
      >
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-green/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[800px] w-full flex flex-col items-center">
          <p className="font-mono text-xs md:text-sm font-medium tracking-[0.16em] text-[#D4A017] uppercase mb-4">
            Early Access
          </p>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-[1.15] tracking-tight mb-6 max-w-[680px]">
            Ready to Invest with<br />Greater Confidence?
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-[#9A9A9A] leading-relaxed mb-8 max-w-[580px]">
            Join investors on the waitlist. No commitment. No credit card required.
          </p>

          {submitted ? (
            <div className="w-full max-w-[480px] p-6 border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.06)] rounded-sm text-center transition-all duration-500">
              <span className="text-[#4ADE80] font-mono font-bold text-sm tracking-wider uppercase block mb-1">
                ✓ Registration Successful
              </span>
              <span className="text-white text-sm">
                You've been added to the waitlist. We'll be in touch soon!
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-[480px] flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError("")
                  }}
                  placeholder="Enter your email address"
                  className="flex-1 bg-black2 border border-[rgba(212,160,23,0.28)] focus:border-green text-[#E8E8E8] font-sans text-sm px-4 py-3 rounded-sm outline-none transition-colors duration-200"
                />
                <button
                  type="submit"
                  className="bg-gold hover:bg-gold2 text-black text-sm font-semibold px-6 py-3 rounded-sm tracking-wider transition-all duration-200 hover:shadow-[0_0_18px_rgba(212,160,23,0.35)] cursor-pointer whitespace-nowrap"
                >
                  Join Waitlist →
                </button>
              </div>
              {error && (
                <span className="text-red-500 font-mono text-xs text-left w-full mt-1">
                  {error}
                </span>
              )}
            </form>
          )}

          <p className="font-mono text-[10px] text-[#555555] tracking-[0.04em] mt-6">
            No credit card required · Cancel anytime · Launch pricing locked for early members
          </p>
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
