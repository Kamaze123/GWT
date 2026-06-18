const steps = [
  {
    num: "01",
    title: "We Collect",
    body: "We continuously monitor thousands of stocks across the market in real time. Price movements, trading volumes, earnings calendars, sectoral trends, and macroeconomic indicators are all tracked and normalised before any analysis begins.",
  },
  {
    num: "02",
    title: "We Analyze",
    body: "Our engine applies rolling averages, weighted averages, momentum indicators and 10 additional quantitative factors alongside a large language model reasoning layer, working together to determine whether the market is trending up, down, or consolidating.",
  },
  {
    num: "03",
    title: "You Decide",
    body: "You receive clear insights on where the market is heading and what it means for your portfolio. The analysis is already done for you. All that's left is your decision, made with better information than ever before."
  }
]

export default function Methodology() {
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
      <div className="md:flex-1 grid grid-cols-1 md:grid-cols-3 border-t border-[rgba(212,160,23,0.14)]">
        {steps.map((step, i) => (
          <div
            key={step.num}
            className={`
              group p-8 md:p-10 lg:p-12 cursor-default
              transition-colors duration-300
              hover:bg-[#040f0c]
              flex flex-col justify-center gap-6 lg:gap-8
              ${i !== 0 ? "border-t md:border-t-0 md:border-l border-[rgba(212,160,23,0.14)]" : ""}
            `}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs md:text-sm tracking-[0.1em] text-[#D4A017]">
                {step.num}
              </span>
              <span className="h-px w-8 bg-[rgba(212,160,23,0.25)]" />
            </div>

            <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-white group-hover:text-[#4ADE80] transition-colors duration-300">
              {step.title}
            </h3>

            <p className="text-sm md:text-base lg:text-lg text-[#9A9A9A] leading-[1.7]">
              {step.body}
            </p>
          </div>
        ))}
      </div>

    </section>
  )
}