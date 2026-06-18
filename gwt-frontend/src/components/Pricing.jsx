export default function Pricing() {
  const plans = [
    {
      tier: "Analyst",
      price: 2499,
      desc: "For serious investors who need full signal coverage.",
      features: ["-", "-", "-", "-", "-", "-", "-"],
    },
    {
      tier: "Professional",
      price: 6499,
      desc: "For advanced investors and self-directed professionals.",
      features: ["-", "-", "-", "-", "-", "-", "-"],
    }
  ]

  return (
    <section
      id="pricing"
      className="min-h-screen md:h-screen flex flex-col justify-between border-t border-[rgba(212,160,23,0.14)]"
      style={{ background: "#091b17" }}
    >
      {/* Header */}
      <div className="px-6 md:px-16 lg:px-20 pt-28 pb-6 md:pb-0 flex flex-col justify-center flex-shrink-0 text-center md:text-left">
        <p className="font-mono text-xs md:text-sm font-medium tracking-[0.16em] text-[#D4A017] uppercase mb-3">
          Pricing
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-[52px] font-bold text-white leading-tight tracking-tight mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base md:text-lg text-[#9A9A9A] leading-relaxed max-w-[580px] mx-auto md:mx-0">
              Choose the plan that matches your investing ambition.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-16 lg:px-20 py-12 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[880px] w-full items-stretch">
          {plans.map((plan) => {
            return (
              <div
                key={plan.tier}
                className="relative flex flex-col justify-between p-8 lg:p-10 rounded-sm border bg-black border-[rgba(212,160,23,0.14)] hover:border-[rgba(212,160,23,0.28)] hover:bg-[#040f0c] transition-all duration-300 cursor-default group"
              >
                <div>
                  {/* Tier Label */}
                  <div className="font-mono text-xs font-semibold tracking-[0.14em] text-[#D4A017] uppercase mb-4">
                    {plan.tier}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline mb-4">
                    <span className="font-serif text-4xl lg:text-5xl font-bold text-white">
                      ₹{plan.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-[#555555] font-sans ml-2">
                      / month
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#9A9A9A] leading-relaxed mb-6">
                    {plan.desc}
                  </p>

                  <hr className="border-[rgba(212,160,23,0.1)] mb-6" />

                  {/* Features */}
                  <ul className="space-y-3 list-none">
                    {plan.features.map((feat, i) => (
                      <li 
                        key={i} 
                        className="text-xs lg:text-sm text-[#9A9A9A] border-b border-[rgba(212,160,23,0.04)] pb-2 group-hover:text-white transition-colors duration-200"
                      >
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
