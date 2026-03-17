import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      // Show nav logo after hero title has scrolled out (~15% of hero's 380vh)
      setShowLogo(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-50 transition-all duration-700"
        style={{
          padding: scrolled ? '16px 40px' : '28px 40px',
          background: scrolled
            ? 'rgba(10,9,6,0.92)'
            : 'linear-gradient(to bottom, rgba(10,9,6,0.75) 0%, transparent 100%)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(184,131,42,0.15)' : 'none',
        }}
      >
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Logo */}
          <a href="#" style={{
            fontFamily: 'var(--font-brand)', fontSize: '28px', color: 'var(--cream)',
            textDecoration: 'none', letterSpacing: '0.05em', lineHeight: 1,
            opacity: showLogo ? 1 : 0,
            transition: 'opacity 0.5s ease',
            pointerEvents: showLogo ? 'auto' : 'none',
          }}>
            LOCH FYLL
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {['Our Story', 'Heritage', 'The Whisky', 'Contact'].map((item, i) => (
              <a key={i} href={`#${item.toLowerCase().replace(' ', '-')}`} className="nav-link">{item}</a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-6">
            <span className="section-label" style={{ fontSize: '9px' }}>Age Verified</span>
            <a href="#our-story" className="btn-copper" style={{ padding: '10px 24px' }}>
              Discover
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block', width: '22px', height: '1px',
                background: 'var(--cream)',
                transition: 'all 0.3s ease',
                transform: menuOpen && i === 0 ? 'rotate(45deg) translateY(8px)' :
                           menuOpen && i === 1 ? 'scaleX(0)' :
                           menuOpen && i === 2 ? 'rotate(-45deg) translateY(-8px)' : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 md:hidden"
            style={{ background: 'var(--black)' }}
          >
            {['Our Story', 'Heritage', 'The Whisky', 'Contact'].map((item, i) => (
              <a
                key={i}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="brand"
                style={{ fontSize: '56px', color: 'var(--cream)', textDecoration: 'none' }}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
