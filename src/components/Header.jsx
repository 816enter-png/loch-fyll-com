import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Story', href: '#our-story' },
  { label: 'Heritage', href: '#heritage' },
  { label: 'The Whisky', href: '#the-whisky' },
  { label: 'Contact', href: '#contact' },
];

const DESKTOP = 768;

const Header = ({ onNavigate404 }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' && window.innerWidth >= DESKTOP);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setShowLogo(window.scrollY > window.innerHeight * 0.5);
    };
    const onResize = () => {
      setIsDesktop(window.innerWidth >= DESKTOP);
      if (window.innerWidth >= DESKTOP) setMenuOpen(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 50,
        padding: scrolled ? '14px 48px' : '32px 48px',
        background: scrolled
          ? 'rgba(8,7,4,0.88)'
          : 'linear-gradient(to bottom, rgba(8,7,4,0.6) 0%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(184,131,42,0.08)' : 'none',
        transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          maxWidth: '1440px', margin: '0 auto',
        }}>
          {/* Logo */}
          <a href="#" style={{
            fontFamily: 'var(--font-brand)',
            fontSize: '24px',
            color: 'var(--cream)',
            textDecoration: 'none',
            letterSpacing: '0.06em',
            lineHeight: 1,
            opacity: showLogo ? 1 : 0,
            transform: showLogo ? 'translateY(0)' : 'translateY(-8px)',
            transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: showLogo ? 'auto' : 'none',
          }}>
            LOCH FYLL
          </a>

          {/* Desktop nav */}
          {isDesktop && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              {navItems.map(({ label, href }) => (
                <a key={label} href={href} className="nav-link">{label}</a>
              ))}
              <a href="/404" onClick={onNavigate404} className="btn-copper" style={{ padding: '10px 28px', fontSize: '9px', marginLeft: '16px' }}>
                Discover
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </nav>
          )}

          {/* Mobile hamburger */}
          {!isDesktop && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: '5px', padding: '8px',
              }}
            >
              {[0, 1].map(i => (
                <span key={i} style={{
                  display: 'block', width: '24px', height: '1px',
                  background: 'var(--cream)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: menuOpen && i === 0 ? 'rotate(45deg) translateY(3px)' :
                             menuOpen && i === 1 ? 'rotate(-45deg) translateY(-3px)' : 'none',
                }} />
              ))}
            </button>
          )}
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 45,
              background: 'var(--black)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '48px',
            }}
          >
            {navItems.map(({ label, href }, i) => (
              <motion.a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-brand)',
                  fontSize: 'clamp(40px, 10vw, 64px)',
                  color: 'var(--cream)',
                  textDecoration: 'none',
                  lineHeight: 1,
                }}
              >
                {label}
              </motion.a>
            ))}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '48px', height: '1px', background: 'var(--copper)', transformOrigin: 'center' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
