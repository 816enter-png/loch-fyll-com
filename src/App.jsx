import React, { useState, useEffect } from 'react'
import './index.css'
import Header from './components/Header'
import Hero from './components/Hero'
import StorySection from './components/StorySection'
import NotFound from './components/NotFound'

function App() {
  const [page, setPage] = useState(() => {
    const path = window.location.pathname;
    return path === '/404' ? '404' : 'home';
  });

  useEffect(() => {
    const onPop = () => {
      setPage(window.location.pathname === '/404' ? '404' : 'home');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const goTo404 = (e) => {
    e.preventDefault();
    window.history.pushState({}, '', '/404');
    setPage('404');
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    window.history.pushState({}, '', '/');
    setPage('home');
    window.scrollTo(0, 0);
  };

  if (page === '404') {
    return (
      <div className="grain" style={{ width: '100%', minHeight: '100vh', background: 'var(--black)', color: 'var(--cream)' }}>
        <NotFound onBack={goHome} />
      </div>
    );
  }

  return (
    <div className="grain" style={{ width: '100%', minHeight: '100vh', background: 'var(--black)', color: 'var(--cream)' }}>
      <Header onNavigate404={goTo404} />
      <Hero onNavigate404={goTo404} />
      <StorySection onNavigate404={goTo404} />
    </div>
  )
}

export default App
