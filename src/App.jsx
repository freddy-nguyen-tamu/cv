import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'

function App() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = window.scrollY
      setScrollProgress((currentScroll / totalScroll) * 100)

      const gears = document.querySelectorAll(".gearSet > .gear")

      const speed = currentScroll * 0.5 // increase for stronger effect

      if (gears.length === 3) {
        gears[0].style.transform =
          `rotate(${speed}deg) scale(0.5) translate(-34px, -34px)`

        gears[1].style.transform =
          `rotate(${-speed}deg) scale(0.4) translate(0px, 44px)`

        gears[2].style.transform =
          `rotate(${speed * 1.5}deg) scale(0.3) translate(56px, 8px)`
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="App">
      <div className="gears">
        <div className="gearSet">
          <div className="gear gear1">
            <div></div><div></div><div></div><div></div><div></div><div></div>
          </div>
          <div className="gear gear2">
            <div></div><div></div><div></div><div></div><div></div><div></div>
          </div>
          <div className="gear gear3">
            <div></div><div></div><div></div><div></div><div></div><div></div>
          </div>
        </div>
      </div>
      <div 
        className="scroll-progress" 
        style={{ width: `${scrollProgress}%` }}
      />
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Contact />
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default App
