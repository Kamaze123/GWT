import { useState, useEffect } from "react"
import StockChart from "./StockChart"

// ── Typing Animation Headlines ──────────────────────────────────
// TODO: Edit these phrases to change the animated typing headlines.
// You can customize the strings in this array to show whatever you like!
const HEADLINES = [
  {
    line1: "Institutional-Grade Market Intelligence.",
    line2: "Now Accessible to You."
  },
  {
    line1: "Advanced Quantitative Analysis & Data.",
    line2: "Tailored to Assist Your Decisions."
  }
]

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [currentText1, setCurrentText1] = useState("")
  const [currentText2, setCurrentText2] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(80)

  useEffect(() => {
    let timer

    const fullLine1 = HEADLINES[phraseIndex].line1
    const fullLine2 = HEADLINES[phraseIndex].line2

    if (!isDeleting) {
      // Typing mode
      timer = setTimeout(() => {
        // Type line 1 first
        if (currentText1.length < fullLine1.length) {
          setCurrentText1(fullLine1.slice(0, currentText1.length + 1))
          setTypingSpeed(50) // typing speed for letters
        } 
        // Then type line 2
        else if (currentText2.length < fullLine2.length) {
          setCurrentText2(fullLine2.slice(0, currentText2.length + 1))
          setTypingSpeed(50)
        } 
        // Pause when completely typed
        else {
          timer = setTimeout(() => setIsDeleting(true), 2500) // Pause for 2.5s
        }
      }, typingSpeed)
    } else {
      // Deleting mode
      timer = setTimeout(() => {
        // Delete line 2 first
        if (currentText2.length > 0) {
          setCurrentText2(currentText2.slice(0, -1))
          setTypingSpeed(45) // slower, more natural backspacing speed
        } 
        // Then delete line 1
        else if (currentText1.length > 0) {
          setCurrentText1(currentText1.slice(0, -1))
          setTypingSpeed(45)
        } 
        // Finish deleting, move to next headline
        else {
          setIsDeleting(false)
          setPhraseIndex((prev) => (prev + 1) % HEADLINES.length)
          setTypingSpeed(150) // pause before typing next headline
        }
      }, typingSpeed)
    }

    return () => clearTimeout(timer)
  }, [currentText1, currentText2, isDeleting, phraseIndex, typingSpeed])

  return (
    <section className="min-h-[calc(100vh-64px)] mt-16 flex flex-col lg:flex-row items-center gap-12 px-6 md:px-16 lg:px-20 py-20 lg:py-24 relative overflow-hidden bg-black">

      {/* Ambient glows */}
      <div className="absolute bottom-[-120px] left-[-120px] w-[600px] h-[600px] rounded-full bg-green/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] rounded-full bg-gold/6 blur-3xl pointer-events-none" />

      {/* ── LEFT — copy ── */}
      <div className="flex-1 relative z-10 text-center lg:text-left">
        {/* Section Label */}
        <p className="font-mono text-[20px] font-medium tracking-[0.16em] text-[#D4A017] uppercase mb-4">
          Grow Wealth Tech
          </p>

        {/* Headline with Typewriter Animation */}
        {/* Note: min-h holds layout space to prevent page layout shift as text sizes change */}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-[clamp(44px,4.2vw,70px)] font-bold leading-[1.15] text-white mb-6 tracking-tight min-h-[4.2em] sm:min-h-[3.3em] lg:min-h-[3.4em] xl:min-h-[2.6em]">
          {currentText1}
          {currentText1.length >= HEADLINES[phraseIndex].line1.length && <br />}
          <span className="text-green3 font-serif">
            {currentText2}
          </span>
          {/* Blinking Typewriter Cursor */}
          <span className="inline-block w-[3px] h-[0.85em] bg-green3 ml-1.5 align-middle animate-pulse" />
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-[#9A9A9A] leading-relaxed mb-9 max-w-[580px] mx-auto lg:mx-0">
          Grow Wealth Tech combines large language models with quantitative analysis such as rolling averages, trends, and market indicators to assist you with investment insights.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
          <a
            href="#platform"
            className="bg-gold hover:bg-gold2 text-black text-sm font-semibold px-6 py-2.5 rounded-sm tracking-wider transition-all duration-200 hover:shadow-[0_0_18px_rgba(212,160,23,0.35)] no-underline"
          >
            Explore Features →
          </a>
          <a
            href="#methodology"
            className="text-[#E8E8E8] text-sm font-medium px-6 py-2.5 border border-gold/28 rounded-sm hover:border-green hover:text-green transition-all duration-200 no-underline"
          >
            See the Methodology
          </a>
        </div>
      </div>

      {/* ── RIGHT — Image/Graphic Container ── */}
      <div className="w-full lg:flex-1 flex justify-center items-center mt-12 lg:mt-0">
        <StockChart />
      </div>

    </section>
  )
}