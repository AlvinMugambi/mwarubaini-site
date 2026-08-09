// ─── Solutions Tree Section ────────────────────────────────────────────────

const TreeSection = ({ accentColor, accentGreen }) => {
  const [phase, setPhase] = React.useState(0);
  const [hovered, setHovered] = React.useState(null);
  const sectionRef = React.useRef(null);
  const svgRef = React.useRef(null);

  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setPhase(1), 100);   // trunk appears
        setTimeout(() => setPhase(2), 600);   // branches draw
        setTimeout(() => setPhase(3), 1800);  // leaves bloom
        obs.disconnect();
      }
    }, { threshold: 0.25 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  React.useEffect(() => {
    if (phase < 2 || !svgRef.current) return;
    const paths = svgRef.current.querySelectorAll('.branch-path');
    paths.forEach((path, i) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.style.transition = `stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1) ${i * 0.12}s`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        path.style.strokeDashoffset = '0';
      }));
    });
    const trunk = svgRef.current.querySelector('.trunk-path');
    if (trunk) {
      const len = trunk.getTotalLength();
      trunk.style.strokeDasharray = len;
      trunk.style.strokeDashoffset = len;
      trunk.style.transition = 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        trunk.style.strokeDashoffset = '0';
      }));
    }
  }, [phase]);

  const services = [
    {
      label: ['AI &', 'Machine Learning'],
      cx: 350, cy: 88, r: 66,
      branch: 'M 350 460 C 350 360 350 220 350 130',
      color: accentColor, delay: 0
    },
    {
      label: ['Software', 'Development'],
      cx: 105, cy: 180, r: 58,
      branch: 'M 348 475 C 290 430 220 320 155 220',
      color: accentGreen, delay: 1
    },
    {
      label: ['Cloud &', 'Infrastructure'],
      cx: 595, cy: 180, r: 58,
      branch: 'M 352 475 C 410 430 480 320 545 220',
      color: accentColor, delay: 2
    },
    {
      label: ['Data &', 'Analytics'],
      cx: 72, cy: 318, r: 55,
      branch: 'M 345 500 C 270 475 185 430 112 368',
      color: accentGreen, delay: 3
    },
    {
      label: ['Cyber-', 'security'],
      cx: 628, cy: 318, r: 55,
      branch: 'M 355 500 C 430 475 515 430 588 368',
      color: accentColor, delay: 4
    },
    {
      label: ['Web &', 'App Design'],
      cx: 115, cy: 458, r: 52,
      branch: 'M 342 528 C 290 515 225 500 158 488',
      color: accentGreen, delay: 5
    },
    {
      label: ['Consulting &', 'Strategy'],
      cx: 585, cy: 458, r: 52,
      branch: 'M 358 528 C 410 515 475 500 542 488',
      color: accentColor, delay: 6
    },
  ];

  return (
    <section ref={sectionRef} id="solutions-tree" data-screen-label="Solutions Tree"
      style={{ padding: '120px clamp(24px,5vw,80px)', borderTop: '1px solid var(--border)', background: 'var(--bg-1)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 24, height: 1, background: accentGreen }}/>
            <span style={{ fontSize: 11, letterSpacing: '0.18em', color: accentGreen, textTransform: 'uppercase' }}>The Mwarubaini tree</span>
            <div style={{ width: 24, height: 1, background: accentGreen }}/>
          </div>
          <h2 className="reveal reveal-delay-1" style={{ fontFamily: 'var(--ff-display)', fontWeight: 800, fontSize: 'clamp(32px,5vw,64px)', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 16 }}>
            One tree. Seven solutions.
          </h2>
          <p className="reveal reveal-delay-2" style={{ color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto', fontSize: 15, lineHeight: 1.7 }}>
            Just as the Mwarubaini tree branches into remedies for over 40 ailments, our practice branches across the full technology spectrum.
          </p>
        </div>

        {/* SVG Tree */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          {/* Background glow */}
          <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, background: `radial-gradient(circle, ${accentGreen}0d 0%, transparent 70%)`, pointerEvents: 'none' }}/>

          <svg ref={svgRef} viewBox="0 0 700 600" style={{ width: '100%', maxWidth: 780, height: 'auto' }}>
            <defs>
              <filter id="leafGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="trunkGlow" x="-50%" y="-10%" width="200%" height="120%">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Ground roots */}
            {phase >= 1 && [
              'M 350 590 C 310 588 270 585 230 590',
              'M 350 590 C 390 588 430 585 470 590',
              'M 350 590 C 330 586 300 582 280 592',
              'M 350 590 C 370 586 400 582 420 592',
            ].map((d, i) => (
              <path key={i} d={d} stroke={accentGreen} strokeWidth="1.5" fill="none" opacity="0.25"
                style={{ transition: `opacity 0.5s ease ${i * 0.1}s` }}/>
            ))}

            {/* Trunk */}
            <path className="trunk-path" d="M 350 590 C 348 560 352 520 350 460"
              stroke={`url(#trunkGrad)`} strokeWidth="18" fill="none"
              strokeLinecap="round" filter="url(#trunkGlow)"
              style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.4s' }}/>
            <defs>
              <linearGradient id="trunkGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={accentGreen} stopOpacity="0.8"/>
                <stop offset="100%" stopColor={accentColor} stopOpacity="0.6"/>
              </linearGradient>
            </defs>

            {/* Branches */}
            {services.map((s, i) => (
              <path key={`branch-${i}`} className="branch-path" d={s.branch}
                stroke={s.color} strokeWidth={3 - i * 0.2} fill="none"
                strokeLinecap="round" opacity="0.55"/>
            ))}

            {/* Leaf clusters */}
            {services.map((s, i) => {
              const isHovered = hovered === i;
              const leafPhase = phase >= 3;
              return (
                <g key={`leaf-${i}`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer', transition: `opacity 0.5s ease ${s.delay * 0.12}s`, opacity: leafPhase ? 1 : 0 }}>

                  {/* Outer glow ring */}
                  <circle cx={s.cx} cy={s.cy} r={s.r + 8}
                    fill="none" stroke={s.color} strokeWidth="1"
                    opacity={isHovered ? 0.4 : 0.12}
                    style={{ transition: 'opacity 0.3s' }}/>

                  {/* Leaf cluster body + label — wrapped so they pulse together */}
                  <g style={{
                    transformOrigin: `${s.cx}px ${s.cy}px`,
                    animation: leafPhase ? `leafPulse ${4 + i * 0.5}s ease-in-out infinite ${i * 0.3}s` : 'none',
                  }}>
                    <circle cx={s.cx} cy={s.cy} r={s.r}
                      fill={isHovered ? `${s.color}1a` : `${s.color}0d`}
                      stroke={s.color} strokeWidth={isHovered ? 1.5 : 1}
                      filter="url(#leafGlow)"
                      style={{ transition: 'all 0.35s ease' }}/>

                    {/* Inner detail circle */}
                    <circle cx={s.cx} cy={s.cy} r={s.r * 0.45}
                      fill={s.color} opacity={isHovered ? 0.12 : 0.06}
                      style={{ transition: 'opacity 0.3s' }}/>

                    {/* Label */}
                    {s.label.map((line, li) => (
                      <text key={li}
                        x={s.cx} y={s.cy + (li - (s.label.length - 1) / 2) * 14}
                        textAnchor="middle" dominantBaseline="middle"
                        fill={s.color}
                        fontSize={isHovered ? 10.5 : 9.5}
                        fontFamily="'Syne', sans-serif"
                        fontWeight="700"
                        letterSpacing="0.04em"
                        style={{ transition: 'font-size 0.2s', userSelect: 'none' }}>
                        {line}
                      </text>
                    ))}
                  </g>
                </g>
              );
            })}

            {/* Center trunk node */}
            {phase >= 2 && (
              <circle cx={350} cy={460} r={8} fill={accentColor} opacity="0.7"
                style={{ animation: 'leafPulse 3s ease-in-out infinite' }}/>
            )}
          </svg>
        </div>

        {/* Bottom CTA */}
        <div className="reveal" style={{ textAlign: 'center', marginTop: 56 }}>
          <a href="#contact" style={{ fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 13, letterSpacing: '0.12em', color: accentColor, border: `1px solid ${accentColor}44`, padding: '14px 36px', borderRadius: 4, display: 'inline-block', transition: 'background 0.2s, border-color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${accentColor}1a`; e.currentTarget.style.borderColor = accentColor; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = `${accentColor}44`; }}>
            EXPLORE ALL SOLUTIONS →
          </a>
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { TreeSection });
