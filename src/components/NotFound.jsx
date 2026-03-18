const NotFound = ({ onBack }) => (
  <div style={{
    width: '100%',
    minHeight: '100vh',
    background: 'var(--black)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '32px',
    padding: '48px',
  }}>
    <h1 style={{
      fontFamily: 'var(--font-display)',
      fontSize: 'clamp(80px, 15vw, 200px)',
      color: 'var(--cream)',
      lineHeight: 1,
      fontWeight: 300,
    }}>
      404
    </h1>
    <div style={{
      width: '48px', height: '1px',
      background: 'linear-gradient(90deg, transparent, var(--copper), transparent)',
    }} />
    <p style={{
      fontFamily: 'var(--font-display)',
      fontSize: 'clamp(18px, 2.5vw, 28px)',
      fontWeight: 300,
      color: 'var(--grey-300)',
      textAlign: 'center',
      lineHeight: 1.6,
    }}>
      Have a drink, check back soon…
    </p>
    <button
      onClick={onBack}
      className="btn-copper"
      style={{ marginTop: '16px' }}
    >
      Back Home
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  </div>
);

export default NotFound;
