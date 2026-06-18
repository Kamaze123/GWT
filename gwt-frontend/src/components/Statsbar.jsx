import { useEffect, useRef, useState } from "react"

const stats = [
  { count: 2847,  label: "Stats" },
  { count: 4500,  label: "Stats"  },
  { count: 14200, label: "Stats" },
  { count: 50,    label: "Stats" },
]

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)

  function start() {
    const startTime = performance.now()
    function tick(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
      else setValue(target)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])
  return { value, start }
}

function StatItem({ count, label, index }) {
  const { value, start } = useCountUp(count)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          start()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`
        flex flex-col items-center justify-center py-2
        ${index !== 0 ? "border-l border-[rgba(212,160,23,0.14)]" : ""}
      `}
    >
      <span className="font-serif text-4xl md:text-[42px] font-bold text-white leading-none mb-2">
        {value.toLocaleString()}+
      </span>
      <span className="font-mono text-[10px] text-[#555555] tracking-[0.09em] uppercase">
        {label}
      </span>
    </div>
  )
}

export default function Statsbar() {
  return (
  
    <div
      className="border-t border-b border-[rgba(212,160,23,0.14)] py-10 px-6 md:px-16 lg:px-20"
      style={{ background: "#091b17" }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8">
        {stats.map((s, i) => (
          <StatItem key={s.label} {...s} index={i} />
        ))}
      </div>
    </div>
  )
}