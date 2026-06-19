import { useState } from "react"

const navLinks = [
  { label: "Methodology",  href: "#methodology" },
  { label: "Features",     href: "#platform" },
  { label: "Pricing",      href: "#pricing" },
  { label: "About",        href: "#about" },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 lg:px-20 h-16 bg-black/95 backdrop-blur-xl border-b border-gold/15">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 no-underline flex-shrink-0">
          <div className="w-8 h-8 bg-green2 flex items-center justify-center font-mono text-xs font-medium text-white rounded-sm">
            GWT
          </div>
          <span className="text-sm font-semibold text-[#E8E8E8] tracking-wide">
            Grow Wealth Tech
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7 list-none">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="relative text-[#9A9A9A] text-sm py-1 border-b border-green/10 hover:text-green transition-colors duration-200 no-underline group"
              >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-green group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA + hamburger */}
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px bg-[#9A9A9A] transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-px bg-[#9A9A9A] transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-px bg-[#9A9A9A] transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-black2 border-b border-gold/15 flex flex-col px-6 py-4 gap-4 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="relative text-[#9A9A9A] text-sm py-1 border-b border-green/10 hover:text-green transition-colors duration-200 no-underline group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-green group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>
      )}
    </>
  )
}