import Navbar from './components/NavBar'
import Hero from './components/Hero'
import StatsBar from './components/Statsbar'
import Methodology from './components/Methodology'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Footer from './components/Footer'

function App() {
  return (
     <main className="bg-black text-[#E8E8E8] font-sans overflow-x-hidden">
      <Navbar />
      <Hero />
      <Methodology />
      <Features />
      <Pricing />
      <Footer />
    </main>
  )
}

export default App
