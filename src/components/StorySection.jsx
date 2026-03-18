import { useRef, useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import useFrameSequence from '../hooks/useFrameSequence';

/* ── Reveal on scroll — lean, CSS-driven ─────────────────────── */
const Reveal = ({ children, delay = 0, style = {}, direction = 'up' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const transforms = {
    up:   'translateY(28px)',
    left: 'translateX(-28px)',
    right:'translateX(28px)',
    none: 'none',
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(0)' : transforms[direction],
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        willChange: 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const StorySection = ({ onNavigate404 }) => {
  const capSectionRef = useRef(null);
  const capCanvasRef  = useRef(null);
  const videoSectionRef = useRef(null);
  const videoCanvasRef = useRef(null);

  const { draw: drawCap } = useFrameSequence(capCanvasRef, {
    path: '/frames/cap', prefix: 'cap', total: 192, ext: 'webp',
  });

  const { draw: drawVideo } = useFrameSequence(videoCanvasRef, {
    path: '/frames/video', prefix: 'video', total: 150, ext: 'jpg',
  });

  const { scrollYProgress: capScroll } = useScroll({
    target: capSectionRef,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    const unsub = capScroll.on('change', drawCap);
    return unsub;
  }, [capScroll, drawCap]);

  // ── Scroll-linked video canvas (frame sequence) ───────────────
  const { scrollYProgress: videoScroll } = useScroll({
    target: videoSectionRef,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    const unsub = videoScroll.on('change', drawVideo);
    return unsub;
  }, [videoScroll, drawVideo]);

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          STORY WRAPPER
          ══════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'relative',
        background: 'var(--black)',
        overflow: 'hidden',
      }}>
        {/* Fade from hero */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '160px',
          background: 'linear-gradient(to bottom, var(--black), transparent)',
          zIndex: 2, pointerEvents: 'none',
        }} />

        {/* Wave texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/assets/lochfyll-background.png)',
          backgroundSize: 'cover', backgroundPosition: 'center top',
          opacity: 0.03, pointerEvents: 'none',
        }} />

        {/* ── INTRO BAND ──────────────────────────────────────────── */}
        <section
          id="our-story"
          style={{ padding: 'var(--space-2xl) 48px var(--space-xl)', position: 'relative' }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

            {/* Eyebrow */}
            <Reveal>
              <span className="section-label" style={{ display: 'block', textAlign: 'center', marginBottom: '28px' }}>
                Our Story
              </span>
            </Reveal>

            {/* Headline — editorial scale */}
            <Reveal delay={0.08}>
              <h2 style={{
                fontFamily: 'var(--font-brand)',
                fontSize: 'clamp(36px, 5.5vw, 76px)',
                lineHeight: '1.05',
                color: 'var(--cream)',
                letterSpacing: '-0.02em',
                textAlign: 'center',
                maxWidth: '900px',
                margin: '0 auto',
              }}>
                A story carved in stone and distilled in time
              </h2>
            </Reveal>

            {/* Divider */}
            <Reveal delay={0.15} style={{ display: 'flex', justifyContent: 'center', margin: '48px 0' }}>
              <div style={{
                width: '48px', height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--copper), transparent)',
              }} />
            </Reveal>

            {/* Artifacts image */}
            <Reveal delay={0.12}>
              <div style={{
                display: 'flex', justifyContent: 'center',
                margin: '0 0 var(--space-lg)',
                filter: 'drop-shadow(0 60px 120px rgba(0,0,0,0.9))',
              }}>
                <motion.img
                  src="/assets/skara-brae-artifacts.png"
                  alt="Skara Brae stone artifacts"
                  style={{
                    height: 'clamp(280px, 35vw, 500px)',
                    objectFit: 'contain',
                  }}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  whileInView={{ opacity: 0.85, y: 0, scale: 1 }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: '-60px' }}
                />
              </div>
            </Reveal>

            {/* Two-column body */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '80px',
              maxWidth: '1000px',
              margin: '0 auto',
            }}>
              <Reveal delay={0.1}>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  lineHeight: '1.95',
                  fontWeight: 300,
                  color: 'var(--grey-200)',
                }}>
                  In the northern winds of Orkney, where stone whispers the language of time, lies the ancient village of Skara Brae — a Neolithic site older than the Pyramids. It was here, among the carved stones and windswept lochs, that the inspiration for Loch Fyll was born.
                  <br /><br />
                  Every bottle is a tribute to Scotland's enduring spirit — a blend of nature, craft, and heritage. The whisky's character is shaped by the same patience and precision that defined those early stone artisans.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  lineHeight: '1.95',
                  fontWeight: 300,
                  color: 'var(--grey-200)',
                }}>
                  The distinctive stone-textured cap draws from the mysterious artifacts of Skara Brae — symbolic of craftsmanship that transcends millennia. Its sculpted contours reflect Scotland's elemental beauty: rugged cliffs, rolling mists, and rippling lochs.
                  <br /><br />
                  Each sip of Loch Fyll celebrates the deep cultural connection of Scotland, merging ancient artistry with modern mastery. The result is a whisky of quiet power and exquisite smoothness — a spirit that bridges the ages.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── HERITAGE & CRAFT ────────────────────────────────────── */}
        <section
          ref={capSectionRef}
          id="heritage"
          style={{
            padding: 'var(--space-2xl) 48px var(--space-xl)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Subtle copper accent — left edge */}
          <div style={{
            position: 'absolute', left: 0, top: '15%',
            width: '1px', height: '70%',
            background: 'linear-gradient(to bottom, transparent, var(--copper-dk), transparent)',
            opacity: 0.4,
          }} />

          {/* Cap animation — left */}
          <Reveal style={{
            position: 'absolute',
            bottom: 0, left: '-10%',
            width: '70%',
            display: 'flex', justifyContent: 'flex-start',
            zIndex: 1,
          }}>
            <canvas
              ref={capCanvasRef}
              style={{
                width: '100%', maxWidth: '2160px',
                display: 'block',
                filter: 'drop-shadow(0 40px 100px rgba(0,0,0,0.8))',
              }}
            />
          </Reveal>

          <div style={{
            maxWidth: '1200px', margin: '0 auto',
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '80px', alignItems: 'center',
            position: 'relative', zIndex: 2,
          }}>
            <div /> {/* Spacer for canvas */}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
              <Reveal>
                <span className="section-label">Heritage</span>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 style={{
                  fontFamily: 'var(--font-brand)',
                  fontSize: 'clamp(32px, 4vw, 60px)',
                  lineHeight: '1.0',
                  color: 'var(--cream)',
                  letterSpacing: '-0.02em',
                }}>
                  Heritage<br />&amp; Craft
                </h2>
              </Reveal>
              <Reveal delay={0.10}>
                <div style={{ width: '40px', height: '1px', background: 'var(--copper)', opacity: 0.5 }} />
              </Reveal>
              <Reveal delay={0.14}>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  lineHeight: '1.95',
                  fontWeight: 300,
                  color: 'var(--grey-200)',
                  maxWidth: '480px',
                }}>
                  Skara Brae's mysterious stone artifacts — buttons, beads, and carved objects — are among the most enigmatic relics in the world. Dating to 3200 BC, they are older than Stonehenge. Our cap is a direct homage: hand-sculpted to mirror their tactile, time-worn texture, connecting every pour to five thousand years of Scottish heritage.
                </p>
              </Reveal>

              {/* Stats */}
              <Reveal delay={0.20}>
                <div style={{
                  display: 'flex', gap: '56px', marginTop: '16px',
                  borderTop: '1px solid rgba(184,131,42,0.1)',
                  paddingTop: '32px',
                }}>
                  {[
                    { num: '5,000', label: 'Years of heritage' },
                    { num: '12+', label: 'Years matured' },
                    { num: '100%', label: 'Scottish malt' },
                  ].map(({ num, label }) => (
                    <div key={label}>
                      <div className="stat-number">{num}</div>
                      <div className="stat-label">{label}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          VIDEO BREAK
          ══════════════════════════════════════════════════════════ */}
      <section
        ref={videoSectionRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '200vh',
          background: 'var(--black)',
        }}
      >
        <div style={{
          position: 'sticky', top: 0,
          width: '100%', height: '100vh',
          overflow: 'hidden',
        }}>
        <canvas
          ref={videoCanvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Top fade */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '30%',
          background: 'linear-gradient(to bottom, var(--black), transparent)',
          zIndex: 1, pointerEvents: 'none',
        }} />
        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '100%', height: '30%',
          background: 'linear-gradient(to top, var(--black), transparent)',
          zIndex: 1, pointerEvents: 'none',
        }} />
        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(8,7,4,0.6) 100%)',
          pointerEvents: 'none',
        }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          THE WHISKY
          ══════════════════════════════════════════════════════════ */}
      <section
        id="the-whisky"
        style={{
          background: 'var(--black)',
          padding: 'var(--space-2xl) 48px',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Ambient copper glow */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(184,131,42,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '100px', alignItems: 'center',
        }}>
          {/* Copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <Reveal>
              <span className="section-label">The Whisky</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 style={{
                fontFamily: 'var(--font-brand)',
                fontSize: 'clamp(44px, 5.5vw, 88px)',
                lineHeight: '0.9',
                color: 'var(--cream)',
                letterSpacing: '-0.02em',
              }}>
                SMOOTH<br />ON LOCH.
              </h2>
            </Reveal>
            <Reveal delay={0.10}>
              <div style={{ width: '40px', height: '1px', background: 'var(--copper)', opacity: 0.5 }} />
            </Reveal>
            <Reveal delay={0.12}>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                lineHeight: '1.95',
                fontWeight: 300,
                color: 'var(--grey-200)',
                maxWidth: '440px',
              }}>
                Rich and unhurried. Notes of heather honey, oak, and salt-kissed peat unfold with time. A long, warming finish that lingers like the last light over a Scottish loch.
              </p>
            </Reveal>

            {/* Tasting notes */}
            <Reveal delay={0.18}>
              <div style={{
                borderTop: '1px solid rgba(184,131,42,0.1)',
                paddingTop: '28px',
                display: 'flex', flexDirection: 'column', gap: '16px',
              }}>
                {[
                  { label: 'Nose', value: 'Heather honey, vanilla, light smoke' },
                  { label: 'Palate', value: 'Dark fruit, toasted oak, sea salt' },
                  { label: 'Finish', value: 'Long, warm, with a peat whisper' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: '20px', alignItems: 'baseline' }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '9px', fontWeight: 500,
                      letterSpacing: '0.25em', textTransform: 'uppercase',
                      color: 'var(--copper)',
                      minWidth: '56px',
                    }}>{label}</span>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '16px', fontWeight: 300, fontStyle: 'normal',
                      color: 'var(--grey-300)',
                    }}>{value}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div style={{ marginTop: '32px' }}>
                <a href="/404" onClick={onNavigate404} className="btn-copper">
                  Find a Bottle
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Bottle */}
          <Reveal delay={0.1} style={{ position: 'relative' }}>
            <motion.img
              src="/assets/Lochfyll_Concept-front2.png"
              alt="Loch Fyll Single Malt Scotch Whisky bottle"
              style={{
                width: '100%', maxWidth: '100%',
                margin: '0 auto', display: 'block',
                filter: 'drop-shadow(0 60px 100px rgba(184,131,42,0.12))',
              }}
              whileInView={{ opacity: [0, 1], y: [50, 0] }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: '50%',
              transform: 'translateX(-50%)',
              width: '60%', height: 0,
              boxShadow: '0 0 100px 50px rgba(0,0,0,0.6)',
              borderRadius: '50%',
            }} />
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PULL QUOTE
          ══════════════════════════════════════════════════════════ */}
      <section style={{
        background: 'var(--charcoal)',
        padding: 'var(--space-xl) 48px',
        position: 'relative',
        borderTop: '1px solid rgba(184,131,42,0.06)',
        borderBottom: '1px solid rgba(184,131,42,0.06)',
      }}>
        <Reveal style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(14px, 1.8vw, 22px)',
            fontWeight: 500,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--copper)',
            lineHeight: 2.2,
            display: 'block',
          }}>
            Forged in stone. Tempered by time.<br />
            A single malt that doesn't ask for your attention —<br />
            it commands it.
          </span>
          <div style={{
            width: '32px', height: '1px',
            background: 'var(--copper)',
            margin: '36px auto 0',
            opacity: 0.5,
          }} />
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════════ */}
      <footer
        id="contact"
        style={{
          background: 'var(--black)',
          padding: '100px 48px 48px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr',
            gap: '64px', paddingBottom: '80px',
          }}>
            {/* Brand */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{
                fontFamily: 'var(--font-brand)',
                fontSize: '32px',
                color: 'var(--cream)',
                lineHeight: 1, letterSpacing: '0.04em',
              }}>LOCH FYLL</h3>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '15px', lineHeight: 1.9,
                fontWeight: 300,
                color: 'var(--grey-500)',
                maxWidth: '300px',
              }}>
                Single Malt Scotch Whisky, distilled in the spirit of Skara Brae. Orkney, Scotland.
              </p>
            </div>

            {/* Nav */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="section-label" style={{ marginBottom: '12px' }}>Explore</span>
              {['Our Story', 'Heritage', 'The Whisky', 'Find a Retailer'].map(item => (
                <a key={item} href="#" className="nav-link" style={{ fontSize: '11px' }}>{item}</a>
              ))}
            </div>

            {/* Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="section-label" style={{ marginBottom: '12px' }}>Contact</span>
              <a href="mailto:hello@lochfyll.com" className="nav-link" style={{ fontSize: '11px' }}>hello@lochfyll.com</a>
              <a href="#" className="nav-link" style={{ fontSize: '11px' }}>Press Enquiries</a>
              <a href="#" className="nav-link" style={{ fontSize: '11px' }}>Trade &amp; Distribution</a>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderTop: '1px solid rgba(184,131,42,0.08)',
            paddingTop: '28px', flexWrap: 'wrap', gap: '16px',
          }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px', letterSpacing: '0.15em',
              color: 'var(--grey-500)', textTransform: 'uppercase',
            }}>
              &copy; 2025 Loch Fyll Distillery. All rights reserved.
            </p>
            <p style={{
              fontFamily: 'var(--font-brand)',
              fontSize: '12px', color: 'var(--copper-dk)',
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
