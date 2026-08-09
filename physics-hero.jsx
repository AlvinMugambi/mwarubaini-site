// PhysicsHero — React only renders the canvas; all physics runs via plain JS
const PhysicsHero = ({ accentColor, accentGreen }) => {
  return (
    <canvas
      id="physics-hero-canvas"
      data-cyan={accentColor}
      data-green={accentGreen}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        zIndex: 1, pointerEvents: 'auto',
      }}
    />
  );
};

Object.assign(window, { PhysicsHero });
