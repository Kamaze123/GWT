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
      className="min-h-screen md:h-screen md:flex md:flex-col md:justify-between border-t border-[rgba(212,160,23,0.14)] md:overflow-hidden"
      style={{ background: "#091b17" }}
    >
      {/* Header - exactly 50vh on desktop */}
      <div className="px-6 md:px-16 lg:px-20 pt-28 pb-12 md:py-0 md:h-[50vh] md:flex md:flex-col md:justify-center flex-shrink-0">
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

      {/* Full bleed cards - exactly 50vh on desktop */}
      <div className="md:h-[50vh] flex flex-col md:flex-row border-t border-[rgba(212,160,23,0.14)] overflow-hidden flex-shrink-0">
        {steps.map((step, i) => {
          const isHovered = hoveredIndex === i

          return (
            <div
              key={step.num}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                relative p-8 md:py-6 md:px-8 lg:py-8 lg:px-10 xl:py-10 xl:px-12 cursor-default
                transition-all duration-500 ease-out
                flex flex-col justify-center
                overflow-hidden
                w-full md:w-1/3
                ${isHovered ? "bg-[#040f0c]" : "bg-transparent"}
                ${i !== 0 ? "border-t md:border-t-0 md:border-l border-[rgba(212,160,23,0.14)]" : ""}
              `}
            >
              {/* Gold top accent line on hover (desktop only) */}
              <div 
                className={`absolute top-0 left-0 h-[2px] bg-[#D4A017] transition-all duration-500 ease-out hidden md:block ${
                  isHovered ? "w-full opacity-100" : "w-0 opacity-0"
                }`}
              />

              <div 
                className={`
                  flex flex-col gap-6 lg:gap-8 w-full transition-all duration-500 ease-out
                  ${isHovered ? "md:-translate-y-2" : "translate-y-0"}
                  mx-auto
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs md:text-xs lg:text-sm tracking-[0.1em] text-[#D4A017]">
                    {step.num}
                  </span>
                  <span className="h-px w-8 bg-[rgba(212,160,23,0.25)]" />
                </div>

                <h3 
                  className={`
                    font-serif font-semibold text-2xl md:text-xl lg:text-2xl xl:text-3xl transition-all duration-500 ease-out
                    ${isHovered ? "text-[#4ADE80]" : "text-white"}
                  `}
                >
                  {step.title}
                </h3>

                <p 
                  className={`
                    leading-[1.6] text-sm md:text-xs lg:text-sm xl:text-base transition-all duration-500 ease-out
                    ${isHovered ? "text-white" : "text-[#9A9A9A]"}
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