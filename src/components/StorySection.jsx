import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import useFrameSequence from '../hooks/useFrameSequence';

// ── Lightweight fade-in: single IntersectionObserver per element,
//    CSS transition does the work — zero per-frame JS cost.
const FadeIn = ({ children, delay = 0, style = {} }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        willChange: 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const StorySection = () => {
  const capSectionRef = useRef(null);
  const capCanvasRef  = useRef(null);

  // ── Cap animation — scroll-linked frame sequence ───────────────
  const { draw: drawCap } = useFrameSequence(capCanvasRef, {
    path: '/frames/cap',
    prefix: 'cap',
    total: 192,
    ext: 'webp',
  });

  const { scrollYProgress: capScroll } = useScroll({
    target: capSectionRef,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    const unsubscribe = capScroll.on('change', drawCap);
    return unsubscribe;
  }, [capScroll, drawCap]);

  return (
    <>
      {/* ══ STORY + HERITAGE WRAPPER — single bg image ═════════════ */}
      <div style={{
        position: 'relative',
        background: 'var(--black)',
        overflow: 'hidden',
      }}>
        {/* Fade-in from hero above */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '120px',
          background: 'linear-gradient(to bottom, var(--black), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        {/* Wave bg — spans both sections */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/assets/lochfyll-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: 0.04,
          pointerEvents: 'none',
        }} />

      {/* ══ INTRO TEXT BAND ══════════════════════════════════════════ */}
      <section
        id="our-story"
        style={{
          padding: '140px 40px 120px',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Headline */}
          <FadeIn delay={0.05}>
            <h2 style={{
              fontFamily: 'var(--font-brand)',
              fontSize: 'clamp(40px, 6vw, 80px)',
              lineHeight: '1.1',
              color: 'var(--cream)',
              letterSpacing: '-0.02em',
              marginBottom: '0',
              textAlign: 'center',
            }}>
              a story carved in stone and distilled in time
            </h2>
          </FadeIn>

          {/* Artifacts image — centered with gentle float */}
          <style>{`
            @keyframes artifact-float {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-8px) rotate(0.5deg); }
            }
          `}</style>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '0',
            filter: 'drop-shadow(0 50px 120px rgba(0,0,0,1))',
          }}>
            <motion.img
              src="/assets/skara-brae-artifacts.png"
              alt="Skara Brae stone artifacts"
              style={{
                height: 'clamp(315px, 38.5vw, 560px)',
                objectFit: 'contain',
                animation: 'artifact-float 6s ease-in-out infinite',
              }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 0.85, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: '-50px' }}
            />
          </div>

          {/* Two-column body copy */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
          }}>
            <FadeIn delay={0.08}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '17px',
                lineHeight: '1.85',
                fontWeight: 300,
                color: 'var(--grey-200)',
              }}>
                In the northern winds of Orkney, where stone whispers the language of time, lies the ancient village of Skara Brae — a Neolithic site older than the Pyramids. It was here, among the carved stones and windswept lochs, that the inspiration for Loch Fyll was born.
                <br /><br />
                Every bottle is a tribute to Scotland's enduring spirit — a blend of nature, craft, and heritage. The whisky's character is shaped by the same patience and precision that defined those early stone artisans.
              </p>
            </FadeIn>
            <FadeIn delay={0.14}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '17px',
                lineHeight: '1.85',
                fontWeight: 300,
                color: 'var(--grey-200)',
              }}>
                The distinctive stone-textured cap draws from the mysterious artifacts of Skara Brae — symbolic of craftsmanship that transcends millennia. Its sculpted contours reflect Scotland's elemental beauty: rugged cliffs, rolling mists, and rippling lochs.
                <br /><br />
                Each sip of Loch Fyll celebrates the deep cultural connection of Scotland, merging ancient artistry with modern mastery. The result is a whisky of quiet power and exquisite smoothness — a spirit that bridges the ages.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ CAP DETAIL FEATURE ════════════════════════════════════════ */}
      <section
        ref={capSectionRef}
        id="heritage"
        style={{
          padding: '320px 40px 120px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Copper strip left edge */}
        <div style={{
          position: 'absolute', left: 0, top: 0,
          width: '3px', height: '100%',
          background: 'linear-gradient(to bottom, transparent, var(--copper), transparent)',
        }} />

        {/* Cap animation — anchored to section bottom edge */}
        <FadeIn style={{
          position: 'absolute',
          bottom: 0, left: 0,
          width: '50%',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1,
        }}>
          <canvas
            ref={capCanvasRef}
            style={{
              width: '100%',
              maxWidth: '1080px',
              display: 'block',
              filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.7))',
            }}
          />
        </FadeIn>

        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}>
          {/* Spacer for left column (canvas is absolutely positioned) */}
          <div />

          {/* Copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <FadeIn>
              <h2 style={{
                fontFamily: 'var(--font-brand)',
                fontSize: 'clamp(36px, 4.5vw, 64px)',
                lineHeight: '1.0',
                color: 'var(--cream)',
                letterSpacing: '-0.02em',
                marginTop: '40px',
              }}>
                Heritage &amp; Craft
              </h2>
            </FadeIn>
            <FadeIn delay={0.10}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '17px',
                lineHeight: '1.85',
                fontWeight: 300,
                color: 'var(--grey-200)',
              }}>
                Skara Brae's mysterious stone artifacts — buttons, beads, and carved objects — are among the most enigmatic relics in the world. Dating to 3200 BC, they are older than Stonehenge. Our cap is a direct homage: hand-sculpted to mirror their tactile, time-worn texture, connecting every pour to five thousand years of Scottish heritage.
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div style={{ display: 'flex', gap: '48px', marginTop: '8px' }}>
                {[
                  { num: '5000', label: 'Years of heritage' },
                  { num: '12+', label: 'Years matured' },
                  { num: '100%', label: 'Scottish malt' },
                ].map(({ num, label }, i) => (
                  <div key={i}>
                    <div className="stat-number">{num}</div>
                    <div className="stat-label">{label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      </div>{/* end story + heritage wrapper */}

      {/* ══ BOTTLE FULLBLEED SECTION ══════════════════════════════════ */}
      <section
        id="the-whisky"
        style={{
          background: 'var(--black)',
          padding: '140px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Radial copper glow behind bottle */}
        <div style={{
          position: 'absolute',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(184,131,42,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
        }}>
          {/* Copy left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <FadeIn delay={0.05}>
              <h2 style={{
                fontFamily: 'var(--font-brand)',
                fontSize: 'clamp(48px, 6vw, 96px)',
                lineHeight: '0.9',
                color: 'var(--cream)',
                letterSpacing: '-0.02em',
              }}>
                SMOOTH<br />ON LOCH.
              </h2>
            </FadeIn>
            <FadeIn delay={0.10}>
              <div style={{ width: '48px', height: '1px', background: 'var(--copper)' }} />
            </FadeIn>
            <FadeIn delay={0.12}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                lineHeight: '1.85',
                fontWeight: 300,
                color: 'var(--grey-200)',
              }}>
                Rich and unhurried. Notes of heather honey, oak, and salt-kissed peat unfold with time. A long, warming finish that lingers like the last light over a Scottish loch.
              </p>
            </FadeIn>
            {/* Tasting notes */}
            <FadeIn delay={0.18}>
              <div style={{
                borderTop: '1px solid rgba(184,131,42,0.15)',
                paddingTop: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}>
                {[
                  { label: 'Nose', value: 'Heather honey, vanilla, light smoke' },
                  { label: 'Palate', value: 'Dark fruit, toasted oak, sea salt' },
                  { label: 'Finish', value: 'Long, warm, with a peat whisper' },
                ].map(({ label, value }, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'baseline' }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '9px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--copper)',
                      minWidth: '64px',
                    }}>{label}</span>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: 300,
                      color: 'var(--grey-200)',
                    }}>{value}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.22}>
              <div style={{ display: 'flex', gap: '16px', marginTop: '48px' }}>
                <a href="#contact" className="btn-copper">
                  Find a Bottle
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Bottle image right */}
          <FadeIn delay={0.08} style={{ position: 'relative' }}>
            <motion.img
              src="/assets/Lochfyll_Concept-front2.png"
              alt="Loch Fyll Single Malt Scotch Whisky bottle"
              style={{
                width: '100%',
                maxWidth: '100%',
                margin: '0 auto',
                display: 'block',
                filter: 'drop-shadow(0 60px 120px rgba(184,131,42,0.15))',
              }}
              whileInView={{ opacity: [0, 1], y: [40, 0] }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            />
            {/* Ground shadow */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60%',
              height: '0',
              boxShadow: '0 0 80px 40px rgba(0,0,0,0.5)',
              borderRadius: '50%',
            }} />
          </FadeIn>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════════ */}
      <footer
        id="contact"
        style={{
          background: 'var(--charcoal)',
          borderTop: '1px solid rgba(184,131,42,0.12)',
          padding: '100px 40px 48px',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '48px',
            paddingBottom: '80px',
          }}>
            {/* Brand */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{
                fontFamily: 'var(--font-brand)',
                fontSize: '36px',
                color: 'var(--cream)',
                lineHeight: '1',
              }}>LOCH FYLL</h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                lineHeight: '1.8',
                fontWeight: 300,
                color: 'var(--grey-400)',
                maxWidth: '280px',
              }}>
                Single Malt Scotch Whisky, distilled in the spirit of Skara Brae. Orkney, Scotland.
              </p>
            </div>

            {/* Nav */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="section-label" style={{ marginBottom: '8px' }}>Discover</span>
              {['Our Story', 'Heritage', 'The Whisky', 'Find a Retailer'].map((item, i) => (
                <a key={i} href="#" className="nav-link" style={{ fontSize: '12px' }}>{item}</a>
              ))}
            </div>

            {/* Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="section-label" style={{ marginBottom: '8px' }}>Contact</span>
              <a href="mailto:hello@lochfyll.com" className="nav-link" style={{ fontSize: '12px' }}>hello@lochfyll.com</a>
              <a href="#" className="nav-link" style={{ fontSize: '12px' }}>Press Enquiries</a>
              <a href="#" className="nav-link" style={{ fontSize: '12px' }}>Trade & Distribution</a>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(184,131,42,0.1)',
            paddingTop: '28px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              letterSpacing: '0.15em',
              color: 'var(--grey-400)',
              textTransform: 'uppercase',
            }}>
              © 2024 Loch Fyll Distillery. All rights reserved.
            </p>
            <p style={{
              fontFamily: 'var(--font-brand)',
              fontSize: '13px',
              color: 'var(--copper)',
              letterSpacing: '0.12em',
            }}>
              DRINK RESPONSIBLY.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default StorySection;
