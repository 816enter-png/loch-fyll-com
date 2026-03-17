import React from 'react'
import './index.css'
import Header from './components/Header'
import Hero from './components/Hero'
import StorySection from './components/StorySection'

function App() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--black)', color: 'var(--cream)' }}>
      <Header />
      <Hero />
      <StorySection />
    </div>
  )
}

export default App
