import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import useFrameSequence from '../hooks/useFrameSequence';

const Hero = () => {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ── Text transforms ──────────────────────────
  const titleOpacity    = useTransform(scrollYProgress, [0, 0.10], [1, 0]);
  const titleScale      = useTransform(scrollYProgress, [0, 0.10], [1, 0.92]);
  const titleY          = useTransform(scrollYProgress, [0, 0.10], [0, -40]);
  const titleVisibility = useTransform(scrollYProgress, v => v > 0.12 ? 'hidden' : 'visible');

  const taglineOpacity = useTransform(scrollYProgress, [0.08, 0.16, 0.55, 0.65], [0, 1, 1, 0]);
  const taglineY       = useTransform(scrollYProgress, [0.08, 0.22], [40, 0]);
  const eyebrowOpacity = useTransform(scrollYProgress, [0.10, 0.20], [0, 1]);

  // ── Scroll indicator fade ────────────────────
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);

  // ── Canvas frame sequence ────────────────────
  const { draw } = useFrameSequence(canvasRef);

  useEffect(() => {
    const unsub = scrollYProgress.on('change', draw);
    return unsub;
  }, [scrollYProgress, draw]);

  return (
    <div ref={containerRef} style={{ height: '380vh', position: 'relative' }}>

      {/* ── Sticky viewport ── */}
      <div style={{
        position: 'sticky', top: 0, left: 0,
        width: '100%', height: '100vh',
        overflow: 'hidden',
        background: 'var(--black)',
      }}>

        {/* Background texture */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          backgroundImage: 'url(/assets/lochfyll-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.04,
        }} />

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 2,
          }}
        />

        {/* Radial vignette — deeper */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          background: 'radial-gradient(ellipse at 50% 55%, transparent 20%, rgba(8,7,4,0.65) 100%)',
        }} />

        {/* Bottom gradient — tall, seamless */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '100%', height: '70%', zIndex: 4,
          background: 'linear-gradient(to bottom, transparent 0%, var(--black) 88%)',
        }} />

        {/* Top gradient — subtle */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '20%', zIndex: 4,
          background: 'linear-gradient(to top, transparent, rgba(8,7,4,0.4))',
        }} />

        {/* ── Opening title ── */}
        <motion.div
          style={{
            opacity: titleOpacity, scale: titleScale, y: titleY,
            visibility: titleVisibility,
            willChange: 'opacity, transform',
            position: 'absolute', inset: 0, zIndex: 5,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            paddingTop: '0vh',
            textAlign: 'center',
            gap: '24px',
          }}
        >
          <motion.span
            className="fade-up delay-1"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'var(--copper)',
            }}
          >
            Single Malt Scotch Whisky
          </motion.span>

          <motion.h1
            className="brand fade-up delay-2"
            style={{
              fontSize: 'clamp(80px, 14vw, 220px)',
              color: 'var(--cream)',
              textShadow: '0 4px 40px rgba(0,0,0,0.6)',
              textAlign: 'center',
              lineHeight: '0.85',
              letterSpacing: '-0.01em',
            }}
          >
            LOCH<br />FYLL
          </motion.h1>

          <motion.div
            className="fade-up delay-3"
            style={{ width: '40px', height: '1px', background: 'var(--copper)', opacity: 0.6 }}
          />

          <motion.span
            className="fade-up delay-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(14px, 1.8vw, 20px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--grey-300)',
              letterSpacing: '0.04em',
            }}
          >
            Orkney, Scotland
          </motion.span>
        </motion.div>

        {/* ── Mid-scroll tagline ── */}
        <motion.div
          style={{
            opacity: taglineOpacity,
            y: taglineY,
            willChange: 'opacity, transform',
            position: 'absolute', inset: 0, zIndex: 6,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '24px',
            pointerEvents: 'none',
          }}
        >
          <motion.span
            className="section-label"
            style={{ opacity: eyebrowOpacity, letterSpacing: '0.4em' }}
          >
            The Spirit of Skara Brae
          </motion.span>

          <h2
            className="brand"
            style={{
              fontSize: 'clamp(44px, 7vw, 100px)',
              color: 'var(--cream)',
              textAlign: 'center',
              letterSpacing: '-0.02em',
              lineHeight: '0.9',
              maxWidth: '800px',
            }}
          >
            not your<br />average scotch
          </h2>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          className="fade-up delay-5"
          style={{
            opacity: scrollIndicatorOpacity,
            position: 'absolute', bottom: '40px', left: '50%',
            transform: 'translateX(-50%)', zIndex: 7,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 400,
            letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--grey-500)',
          }}>
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '1px', height: '24px', background: 'linear-gradient(to bottom, var(--copper), transparent)' }}
          />
        </motion.div>

      </div>
    </div>
  );
};

export default Hero;
