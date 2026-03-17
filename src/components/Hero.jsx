import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import useFrameSequence from '../hooks/useFrameSequence';

const Hero = () => {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);

  // ── Scroll progress drives everything ──────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ── Text layer transforms (unchanged) ─────────────────────────
  const textOpacity    = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const textScale      = useTransform(scrollYProgress, [0, 0.12], [1, 0.5]);
  const textVisibility = useTransform(scrollYProgress, (v) => v > 0.13 ? 'hidden' : 'visible');
  const taglineOpacity = useTransform(scrollYProgress, [0.06, 0.14, 0.60, 0.70], [0, 1, 1, 0]);
  const taglineY       = useTransform(scrollYProgress, [0.22, 0.35], [30, 0]);
  const ruleScaleX     = useTransform(scrollYProgress, [0.28, 0.42], [0, 1]);

  // ── Canvas frame sequence ─────────────────────────────────────
  const { draw } = useFrameSequence(canvasRef);

  useEffect(() => {
    // Subscribe to Framer Motion's scroll progress and draw the matching frame
    const unsubscribe = scrollYProgress.on('change', draw);
    return unsubscribe;
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

        {/* Background wave graphic — very low opacity */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          backgroundImage: 'url(/assets/lochfyll-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.05,
        }} />

        {/* Canvas — replaces <video> for jank-free scroll playback */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 2,
          }}
        />

        {/* Radial vignette */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          background: 'radial-gradient(ellipse at 50% 60%, transparent 25%, rgba(10,9,6,0.55) 100%)',
        }} />

        {/* Bottom-to-black */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '100%', height: '35%', zIndex: 4,
          background: 'linear-gradient(to bottom, transparent, var(--black))',
        }} />

        {/* ── Opening title ── */}
        <motion.div
          style={{
            opacity: textOpacity, scale: textScale, visibility: textVisibility,
            willChange: 'opacity, transform',
            position: 'absolute', inset: 0, zIndex: 5,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-start',
            paddingTop: '18vh',
            textAlign: 'center',
          }}
        >
          <motion.h1
            className="brand fade-up delay-3"
            style={{
              fontSize: 'clamp(100px, 16vw, 240px)',
              color: 'var(--cream)',
              textShadow: '0 6px 20px rgba(0,0,0,0.5)',
              textAlign: 'center',
              lineHeight: '0.88',
              letterSpacing: '-0.015em',
            }}
          >
            LOCH FYLL
          </motion.h1>
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
            gap: '20px',
            pointerEvents: 'none',
          }}
        >
          <span className="section-label" style={{ color: 'var(--copper)', letterSpacing: '0.35em' }}>
            The Spirit of Skara Brae
          </span>

          <h2
            className="brand"
            style={{
              fontSize: 'clamp(44px, 7.5vw, 112px)',
              color: 'var(--cream)',
              textAlign: 'center',
              letterSpacing: '-0.02em',
              lineHeight: '0.9',
              maxWidth: '860px',
            }}
          >
            not your<br />average scotch
          </h2>

          <motion.div style={{
            width: '64px', height: '1px',
            background: 'var(--copper)',
            scaleX: ruleScaleX,
            transformOrigin: 'center',
          }} />
        </motion.div>

        {/* Copper progress bar */}
        <motion.div
          style={{
            position: 'absolute', bottom: 0, left: 0,
            height: '1px', width: '100%',
            background: 'var(--copper)',
            scaleX: scrollYProgress,
            transformOrigin: 'left',
            zIndex: 10,
            opacity: 0.6,
          }}
        />
      </div>
    </div>
  );
};

export default Hero;
