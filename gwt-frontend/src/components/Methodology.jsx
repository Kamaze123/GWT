import { useState } from "react"

const steps = [
  {
    num: "01",
    title: "We Collect",
    body: "We continuously monitor stocks across the market in real time. Price movements, trading volumes, earnings calendars, sectoral trends, and macroeconomic indicators are all tracked and normalised before any analysis begins.",
  },
  {
    num: "02",
    title: "We Analyze",
    body: "Our engine applies rolling averages, weighted averages and 10 other quantitative factors alongside a large language model reasoning layer, working together to determine whether the market is trending up, down, or consolidating.",
  },
  {
    num: "03",
    title: "You Decide",
    body: "You receive clear insights on where the market is heading and what it means for your portfolio. The analysis is already done for you. All that's left is your decision, made with better information than ever before."
  }
]

export default function Methodology() {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <section
      id="methodology"
      className="min-h-screen md:h-screen md:flex md:flex-col md:justify-between border-t border-[rgba(212,160,23,0.14)]"
      style={{ background: "#091b17" }}
    >
      {/* Header */}
      <div className="px-6 md:px-16 lg:px-20 pt-28 pb-12 md:pb-0 md:h-[60vh] md:flex md:flex-col md:justify-center flex-shrink-0">
        <p className="font-mono text-xs md:text-sm font-medium tracking-[0.16em] text-[#D4A017] uppercase mb-4">
          Methodology
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] font-bold text-white leading-[1.1] tracking-tight mb-6">
          How we turn Market Data<br />Into Investment Insights
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-[#9A9A9A] leading-relaxed max-w-[720px]">
          We watch the market so you don't have to, combining quantitative models 
and AI reasoning to show you what matters.
        </p>
      </div>

      {/* Full bleed cards */}
      <div className="md:flex-1 flex flex-col md:flex-row border-t border-[rgba(212,160,23,0.14)] overflow-hidden">
        {steps.map((step, i) => {
          const isHovered = hoveredIndex === i
          const isAnyHovered = hoveredIndex !== null
          const isOtherHovered = isAnyHovered && !isHovered

          return (
            <div
              key={step.num}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                relative p-8 md:p-10 lg:p-12 cursor-default
                transition-all duration-500 ease-out
                flex flex-col justify-center
                overflow-hidden
                ${isHovered ? "md:w-full bg-[#040f0c]" : isOtherHovered ? "md:w-0 md:opacity-0 md:p-0 md:pointer-events-none" : "md:w-1/3 bg-transparent"}
                ${i !== 0 && !isAnyHovered ? "border-t md:border-t-0 md:border-l border-[rgba(212,160,23,0.14)]" : "border-transparent"}
              `}
            >
              <div 
                className={`
                  flex flex-col gap-6 lg:gap-8 w-full transition-opacity duration-300
                  ${isOtherHovered ? "opacity-0 pointer-events-none" : "opacity-100"}
                  md:min-w-[280px] lg:min-w-[320px] mx-auto
                `}
              >
                <div className="flex items-center gap-3">
                  <span 
                    className={`
                      font-mono tracking-[0.1em] text-[#D4A017] transition-all duration-500 ease-out
                      ${isHovered ? "text-sm md:text-base font-semibold" : "text-xs md:text-sm"}
                    `}
                  >
                    {step.num}
                  </span>
                  <span className="h-px w-8 bg-[rgba(212,160,23,0.25)]" />
                </div>

                <h3 
                  className={`
                    font-serif font-semibold transition-all duration-500 ease-out
                    ${isHovered ? "text-[#4ADE80] text-3xl md:text-4xl lg:text-5xl" : "text-white text-2xl md:text-3xl lg:text-4xl"}
                  `}
                >
                  {step.title}
                </h3>

                <p 
                  className={`
                    leading-[1.7] transition-all duration-500 ease-out
                    ${isHovered ? "text-white text-base md:text-lg lg:text-xl" : "text-[#9A9A9A] text-sm md:text-base lg:text-lg"}
                  `}
                >
                  {step.body}
                </p>
              </div>
            </div>
          )
        })}
      </div>

    </section>
  )
}