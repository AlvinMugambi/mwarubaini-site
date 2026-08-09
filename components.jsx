// ─── Shared utilities ────────────────────────────────────────────────────────

const useCountUp = (target, duration = 1800, active = false) => {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return val;
};

const useReveal = () => {
  React.useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
};

// ─── Logo Mark ───────────────────────────────────────────────────────────────
const LogoMark = ({ size = 28, cyan = '#22d3ee', green = '#4ade80' }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="13" stroke={cyan} strokeWidth="1.2"/>
    <path d="M7 20 L14 8 L21 20" stroke={cyan} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M14 14 L14 22" stroke={green} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M11 17 L14 20 L17 17" stroke={green} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// ─── Nav ─────────────────────────────────────────────────────────────────────
const NavSection = ({ accentColor, accentGreen = '#4ade80' }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const links = ['Services','About','Work','Team','Contact'];

  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
    height: 'var(--nav-h)',
    display: 'flex', alignItems: 'center',
    padding: '0 clamp(24px, 5vw, 80px)',
    background: scrolled ? 'rgba(5,8,16,0.92)' : 'transparent',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
    transition: 'all 0.4s ease',
    justifyContent: 'space-between',
  };

  return (
    <nav style={navStyle}>
      <a href="#hero" style={{ display:'flex', alignItems:'center', gap:10, fontFamily:'var(--ff-display)', fontWeight:700, fontSize:15, letterSpacing:'0.08em', color:'var(--text)' }}>
        <LogoMark size={26} cyan={accentColor} green={accentGreen}/>
        <span>MWARUBAINI</span>
        <span style={{ color:'var(--text-muted)', fontWeight:400, fontSize:12 }}>SOLUTIONS</span>
      </a>
      <div style={{ display:'flex', alignItems:'center', gap:32 }}>
        {links.map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{ fontFamily:'var(--ff-body)', fontSize:13, letterSpacing:'0.06em', color:'var(--text-dim)', transition:'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = accentColor}
            onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
          >{l}</a>
        ))}
        <a href="#contact" style={{ padding:'8px 20px', background: accentColor, color:'#050810', fontFamily:'var(--ff-display)', fontWeight:700, fontSize:12, letterSpacing:'0.1em', borderRadius:4, transition:'opacity 0.2s' }}
          onMouseEnter={e => e.target.style.opacity='0.85'}
          onMouseLeave={e => e.target.style.opacity='1'}
        >GET IN TOUCH</a>
      </div>
    </nav>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
const HeroSection = ({ accentColor, accentGreen, headline }) => {
  useReveal();
  const [bgOffset, setBgOffset] = React.useState(0);
  const [statsVisible, setStatsVisible] = React.useState(false);
  const statsRef = React.useRef(null);

  const c7 = useCountUp(7, 1600, statsVisible);
  const c40 = useCountUp(40, 1800, statsVisible);
  const c5 = useCountUp(5, 1400, statsVisible);

  React.useEffect(() => {
    const fn = () => setBgOffset(window.scrollY * 0.35);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.5 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { n: c7, suffix: '+', label: 'Core solutions' },
    { n: c40, suffix: '+', label: 'Clients served' },
    { n: c5, suffix: '+', label: 'Years of excellence' },
    { n: '100', suffix: '%', label: 'Commitment', static: true },
  ];

  return (
    <section id="hero" data-screen-label="Hero" style={{ position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', padding:'calc(var(--nav-h) + 60px) clamp(24px,5vw,80px) 80px', overflow:'hidden' }}>
      {/* Real background image with parallax */}
      <div style={{ position:'absolute', inset:0, overflow:'hidden', zIndex:0 }}>
        <div style={{
          position:'absolute', inset:'-20%',
          backgroundImage:'url(https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize:'cover', backgroundPosition:'center',
          transform:`translateY(${bgOffset}px)`,
          willChange:'transform',
        }}/>
        {/* Layered overlays */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(5,8,16,0.92) 0%, rgba(5,8,16,0.75) 50%, rgba(5,8,16,0.88) 100%)' }}/>
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 70% 40%, ${accentColor}14 0%, transparent 60%)` }}/>
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 20% 80%, ${accentGreen}0d 0%, transparent 50%)` }}/>
      </div>

      {/* Physics leaves */}
      <PhysicsHero accentColor={accentColor} accentGreen={accentGreen} />

      <div style={{ position:'relative', zIndex:2, maxWidth:1200 }}>
        <div className="reveal" style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
          <div style={{ width:32, height:1, background:accentColor }}/>
          <span style={{ fontFamily:'var(--ff-body)', fontSize:12, letterSpacing:'0.18em', color:accentColor, textTransform:'uppercase' }}>Technology rooted in purpose</span>
        </div>

        <h1 className="reveal reveal-delay-1" style={{ fontFamily:'var(--ff-display)', fontWeight:800, fontSize:'clamp(48px, 9vw, 128px)', lineHeight:0.95, letterSpacing:'-0.02em', color:'var(--text)', marginBottom:8 }}>
          Built for
        </h1>
        <h1 className="reveal reveal-delay-2" style={{ fontFamily:'var(--ff-display)', fontWeight:800, fontSize:'clamp(48px, 9vw, 128px)', lineHeight:0.95, letterSpacing:'-0.02em', marginBottom:40 }}>
          <span style={{ WebkitTextStroke:`1px ${accentColor}`, color:'transparent' }}>the future.</span>
        </h1>

        <p className="reveal reveal-delay-3" style={{ fontFamily:'var(--ff-body)', fontSize:'clamp(15px,2vw,18px)', color:'var(--text-dim)', maxWidth:520, lineHeight:1.7, marginBottom:48 }}>
          We engineer software solutions across the full technology spectrum — from intelligent systems to cloud infrastructure — built to solve real problems at scale.
        </p>

        <div className="reveal reveal-delay-4" style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:100 }}>
          <a href="#work" style={{ padding:'14px 32px', background:accentColor, color:'#050810', fontFamily:'var(--ff-display)', fontWeight:700, fontSize:13, letterSpacing:'0.1em', borderRadius:4, display:'inline-flex', alignItems:'center', gap:8, transition:'opacity 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.opacity='0.85'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
            OUR WORK <span>→</span>
          </a>
          <a href="#about" style={{ padding:'14px 32px', border:'1px solid var(--border)', color:'var(--text-dim)', fontFamily:'var(--ff-display)', fontWeight:600, fontSize:13, letterSpacing:'0.1em', borderRadius:4, transition:'border-color 0.2s, color 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=accentColor;e.currentTarget.style.color=accentColor;}} onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text-dim)';}}>
            WHO WE ARE
          </a>
        </div>

        {/* Stats bar */}
        <div ref={statsRef} className="reveal reveal-delay-5" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:1, borderTop:'1px solid var(--border)', paddingTop:32 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ paddingRight:32 }}>
              <div style={{ fontFamily:'var(--ff-display)', fontWeight:800, fontSize:'clamp(28px,4vw,44px)', color: i===0 ? accentColor : 'var(--text)', letterSpacing:'-0.02em' }}>
                {s.static ? s.n : s.n}{s.suffix}
              </div>
              <div style={{ fontFamily:'var(--ff-body)', fontSize:12, color:'var(--text-muted)', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Services (Sticky Scroll) ──────────────────────────────────────────────
const ServicesSection = ({ accentColor, accentGreen }) => {
  const [active, setActive] = React.useState(0);
  const [prevActive, setPrevActive] = React.useState(0);
  const sectionRef = React.useRef(null);

  const services = [
    { n:'01', title:'Software Development', tag:'Engineering', desc:'Custom-built platforms, APIs, and enterprise systems engineered for reliability and scale. From MVPs to mission-critical infrastructure.', features:['Web Applications','Mobile Apps','APIs & Microservices','DevOps Pipelines'], color: accentColor, img:'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1400&q=80' },
    { n:'02', title:'Web & App Design', tag:'Design', desc:'End-to-end UI/UX and product design that converts visitors into users and users into advocates. Beautiful, functional, fast.', features:['UI / UX Design','Prototyping','Design Systems','User Research'], color: accentGreen, img:'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1400&q=80' },
    { n:'03', title:'Data & Analytics', tag:'Intelligence', desc:'Turn raw data into clear intelligence — dashboards, pipelines, and reporting systems that drive decisions across your organisation.', features:['BI Dashboards','ETL Pipelines','Data Warehousing','KPI Reporting'], color: accentColor, img:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80' },
    { n:'04', title:'AI & Machine Learning', tag:'Intelligent Systems', desc:'Intelligent automation, predictive models, and LLM integrations that give you a competitive edge over the market.', features:['Predictive Models','NLP & Chatbots','LLM Integration','Computer Vision'], color: accentGreen, img:'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1400&q=80' },
    { n:'05', title:'Cloud & Infrastructure', tag:'DevOps', desc:'Architecture, DevOps, and cloud migration built for resilience, performance, and cost efficiency — wherever you are in the cloud journey.', features:['Cloud Migration','AWS / GCP / Azure','CI/CD Pipelines','Infrastructure as Code'], color: accentColor, img:'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1400&q=80' },
    { n:'06', title:'Cybersecurity', tag:'Protection', desc:'End-to-end protection — audits, penetration testing, compliance frameworks, and incident response that keep your business secure.', features:['Penetration Testing','Security Audits','Compliance (ISO/SOC)','Incident Response'], color: accentGreen, img:'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1400&q=80' },
    { n:'07', title:'Consulting & Strategy', tag:'Advisory', desc:'Digital transformation strategy rooted in your context — honest, actionable, and results-oriented guidance from experienced practitioners.', features:['Digital Transformation','Technology Audits','Roadmapping','Change Management'], color: accentColor, img:'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80' },
  ];

  React.useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const top = -sectionRef.current.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const idx = Math.max(0, Math.min(services.length - 1, Math.floor(top / vh)));
      setActive(prev => { if (prev !== idx) setPrevActive(prev); return idx; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dir = active >= prevActive ? 1 : -1;

  return (
    <section ref={sectionRef} id="services" data-screen-label="Services"
      style={{ height: `${(services.length + 1) * 100}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Background images */}
        {services.map((s, i) => (
          <div key={`bg-${i}`} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${s.img})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: active === i ? 1 : 0,
            transform: active === i ? 'scale(1)' : 'scale(1.04)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            willChange: 'opacity, transform',
          }}/>
        ))}

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,8,16,0.97) 0%, rgba(5,8,16,0.88) 45%, rgba(5,8,16,0.45) 100%)', zIndex: 1 }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,8,16,0.7) 0%, transparent 40%)', zIndex: 1 }}/>

        {/* Content slides */}
        {services.map((s, i) => (
          <div key={`slide-${i}`} style={{
            position: 'absolute', inset: 0, zIndex: 2,
            display: 'flex', alignItems: 'center',
            padding: '0 clamp(24px,5vw,80px)',
            opacity: active === i ? 1 : 0,
            transform: active === i ? 'translateY(0)' : `translateY(${dir * 24}px)`,
            transition: 'opacity 0.55s ease, transform 0.55s ease',
            pointerEvents: active === i ? 'auto' : 'none',
          }}>
            <div style={{ maxWidth: 580 }}>
              {/* Tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <span style={{ fontFamily: 'var(--ff-display)', fontSize: 11, letterSpacing: '0.2em', color: s.color, textTransform: 'uppercase', border: `1px solid ${s.color}55`, padding: '4px 12px', borderRadius: 3 }}>{s.tag}</span>
              </div>
              {/* Number */}
              <div style={{ fontFamily: 'var(--ff-display)', fontWeight: 800, fontSize: 'clamp(64px,9vw,120px)', lineHeight: 0.85, letterSpacing: '-0.04em', color: `${s.color}18`, marginBottom: -8, userSelect: 'none' }}>{s.n}</div>
              {/* Title */}
              <h2 style={{ fontFamily: 'var(--ff-display)', fontWeight: 800, fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1.05, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 20 }}>{s.title}</h2>
              {/* Desc */}
              <p style={{ fontSize: 16, color: 'var(--text-dim)', lineHeight: 1.75, marginBottom: 32, maxWidth: 480 }}>{s.desc}</p>
              {/* Features */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
                {s.features.map(f => (
                  <span key={f} style={{ fontSize: 12, color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '6px 14px', borderRadius: 3, fontFamily: 'var(--ff-body)', letterSpacing: '0.04em' }}>{f}</span>
                ))}
              </div>
              {/* CTA */}
              <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--ff-display)', fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', color: s.color, textTransform: 'uppercase' }}>
                START THIS PROJECT <span style={{ fontSize: 14 }}>→</span>
              </a>
            </div>
          </div>
        ))}

        {/* Section label top */}
        <div style={{ position: 'absolute', top: 32, left: 'clamp(24px,5vw,80px)', zIndex: 3, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 20, height: 1, background: 'var(--text-muted)' }}/>
          <span style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--ff-display)' }}>Our Solutions</span>
        </div>

        {/* Progress indicator */}
        <div style={{ position: 'absolute', right: 'clamp(24px,4vw,56px)', top: '50%', transform: 'translateY(-50%)', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          {services.map((s, i) => (
            <div key={i} style={{
              width: active === i ? 3 : 2,
              height: active === i ? 32 : 10,
              background: active === i ? s.color : 'rgba(255,255,255,0.18)',
              borderRadius: 99,
              transition: 'all 0.4s ease',
            }}/>
          ))}
        </div>

        {/* Bottom service counter */}
        <div style={{ position: 'absolute', bottom: 40, left: 'clamp(24px,5vw,80px)', zIndex: 3, display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: 'var(--ff-display)', fontWeight: 800, fontSize: 28, color: services[active].color, transition: 'color 0.4s' }}>{String(active + 1).padStart(2,'0')}</span>
          <span style={{ fontFamily: 'var(--ff-display)', fontSize: 14, color: 'var(--text-muted)' }}>/ 07</span>
        </div>

        {/* Scroll cue — fades out after first service */}
        <div style={{ position: 'absolute', bottom: 36, right: 'clamp(24px,4vw,56px)', zIndex: 3, opacity: active === 0 ? 1 : 0, transition: 'opacity 0.5s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, var(--text-muted), transparent)', animation: 'floatUp 1.8s ease-in-out infinite' }}/>
        </div>
      </div>
    </section>
  );
};

// ─── About ────────────────────────────────────────────────────────────────────
const AboutSection = ({ accentColor, accentGreen }) => (
  <section id="about" data-screen-label="About" style={{ padding:'120px clamp(24px,5vw,80px)', borderTop:'1px solid var(--border)', background:'var(--bg-1)' }}>
    <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'start' }}>
      <div>
        <div className="reveal" style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <div style={{ width:24, height:1, background:accentGreen }}/>
          <span style={{ fontSize:11, letterSpacing:'0.18em', color:accentGreen, textTransform:'uppercase' }}>Who we are</span>
        </div>
        <h2 className="reveal reveal-delay-1" style={{ fontFamily:'var(--ff-display)', fontWeight:800, fontSize:'clamp(32px,4vw,56px)', letterSpacing:'-0.02em', lineHeight:1.05, marginBottom:32 }}>
          We are<br/><span style={{ color:accentColor }}>Mwarubaini</span>
        </h2>
        <p className="reveal reveal-delay-2" style={{ fontSize:16, color:'var(--text-dim)', lineHeight:1.8, marginBottom:24 }}>
          In Kikuyu tradition, the <em>Mwarubaini</em> tree is revered for its ability to remedy over 40 ailments. Its roots run deep; its reach is wide. We named our company after this tree — because we believe technology, applied with purpose, holds that same power to heal and transform.
        </p>
        <p className="reveal reveal-delay-3" style={{ fontSize:15, color:'var(--text-muted)', lineHeight:1.8, marginBottom:40 }}>
          We are a multidisciplinary technology company built to solve the full spectrum of digital challenges. From ground-up software development to strategic consulting, we bring clarity, craft, and commitment to every engagement.
        </p>
        <div className="reveal reveal-delay-4" style={{ display:'flex', gap:24 }}>
          <a href="#work" style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:12, letterSpacing:'0.12em', color:accentColor }}>SEE OUR WORK →</a>
          <a href="#team" style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:12, letterSpacing:'0.12em', color:'var(--text-muted)' }}>MEET THE TEAM →</a>
        </div>
      </div>

      <div className="reveal reveal-delay-2">
        <div style={{ border:'1px solid var(--border)', borderRadius:8, padding:40, background:'var(--bg-2)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, background:`radial-gradient(circle, ${accentGreen}22 0%, transparent 70%)`, pointerEvents:'none' }}/>
          {/* Big 40 motif */}
          <div style={{ fontFamily:'var(--ff-display)', fontWeight:800, fontSize:120, lineHeight:1, color:'rgba(255,255,255,0.03)', letterSpacing:'-0.05em', userSelect:'none', marginBottom:8 }}>40</div>
          <div style={{ marginTop:-40, position:'relative', zIndex:2 }}>
            <p style={{ fontSize:13, color:accentGreen, letterSpacing:'0.14em', textTransform:'uppercase', fontFamily:'var(--ff-display)', fontWeight:600, marginBottom:8 }}>The origin</p>
            <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.7 }}>Named after the Kikuyu <em>Mwarubaini</em> — a tree whose roots treat over forty ailments. We carry that same ethos: deep roots, wide solutions.</p>
          </div>
          <div style={{ height:1, background:'var(--border)', margin:'28px 0' }}/>
          {[['Est.','2019'],['HQ','Nairobi, Kenya'],['Team','15+ specialists']].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
              <span style={{ fontSize:12, color:'var(--text-muted)', letterSpacing:'0.08em' }}>{k}</span>
              <span style={{ fontSize:13, color:'var(--text)', fontFamily:'var(--ff-display)', fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─── Portfolio (Spinning Wheel) ───────────────────────────────────────────────
const PortfolioSection = ({ accentColor, accentGreen }) => {
  const [active, setActive] = React.useState(0);
  const [prev, setPrev] = React.useState(0);
  const sectionRef = React.useRef(null);

  const works = [
    { tag:'FinTech', title:'NexaBank Core Platform', desc:'Full-stack digital banking platform with real-time transaction processing and fraud detection for a Nairobi-based financial institution.', year:'2024', color: accentColor, img:'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80' },
    { tag:'Government', title:'National Health Analytics', desc:'End-to-end data pipeline and executive dashboard tracking health metrics across 47 counties for the Ministry of Health.', year:'2023', color: accentGreen, img:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80' },
    { tag:'AI / SaaS', title:'Rafiki AI Assistant', desc:'Multilingual conversational AI supporting Swahili, English and Kikuyu — deployed at scale for a major telecom operator.', year:'2024', color: accentColor, img:'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&q=80' },
    { tag:'Enterprise', title:'CloudShift Infrastructure', desc:'Zero-downtime cloud migration for a 200-employee logistics firm — from on-prem to AWS with full DevOps pipeline rebuild.', year:'2023', color: accentGreen, img:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80' },
  ];

  const N = works.length;
  const R = 220;   // orbit radius
  const W = 540;   // wheel container size

  // Item base positions in wheel container (right, bottom, left, top)
  const itemPos = [
    { cx: W/2 + R, cy: W/2 },
    { cx: W/2,     cy: W/2 + R },
    { cx: W/2 - R, cy: W/2 },
    { cx: W/2,     cy: W/2 - R },
  ];

  // Rotate wheel so item[active] arrives at focal point = 9 o'clock (left edge)
  // Item 0 is at right (0°), item 2 is already at left. Formula: 180 - active*90
  const wheelRot = 180 - active * (360 / N);

  React.useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const top = -sectionRef.current.getBoundingClientRect().top;
      const idx = Math.max(0, Math.min(N - 1, Math.floor(top / window.innerHeight)));
      setActive(p => { if (p !== idx) setPrev(p); return idx; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dir = active >= prev ? 1 : -1;
  const aw = works[active];

  return (
    <section ref={sectionRef} id="work" data-screen-label="Portfolio"
      style={{ height: `${(N + 1) * 100}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', borderTop: '1px solid var(--border)' }}>

        {/* Ambient glow that follows active color */}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 72% 50%, ${aw.color}0e 0%, transparent 65%)`, transition: 'background 0.9s', pointerEvents: 'none' }}/>

        {/* Top label */}
        <div style={{ position: 'absolute', top: 32, left: 'clamp(24px,5vw,80px)', zIndex: 3, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 20, height: 1, background: 'var(--text-muted)' }}/>
          <span style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--ff-display)' }}>Selected Work</span>
        </div>

        {/* ── LEFT: content ── */}
        <div style={{ flex: '0 0 44%', padding: '0 clamp(24px,5vw,80px)', position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
          {works.map((w, i) => (
            <div key={i} style={{
              position: 'absolute', left: 'clamp(24px,5vw,80px)', right: 0,
              opacity: active === i ? 1 : 0,
              transform: active === i ? 'translateY(0)' : `translateY(${dir * 28}px)`,
              transition: 'opacity 0.55s ease, transform 0.55s ease',
              pointerEvents: active === i ? 'auto' : 'none',
            }}>
              <span style={{ fontFamily:'var(--ff-display)', fontSize:11, letterSpacing:'0.18em', color:w.color, textTransform:'uppercase', border:`1px solid ${w.color}44`, padding:'4px 12px', borderRadius:3, display:'inline-block', marginBottom:24 }}>{w.tag}</span>
              <h2 style={{ fontFamily:'var(--ff-display)', fontWeight:800, fontSize:'clamp(26px,3.2vw,48px)', lineHeight:1.08, letterSpacing:'-0.02em', color:'var(--text)', marginBottom:20 }}>{w.title}</h2>
              <p style={{ fontSize:15, color:'var(--text-dim)', lineHeight:1.78, marginBottom:36, maxWidth:400 }}>{w.desc}</p>
              <div style={{ display:'flex', alignItems:'center', gap:28 }}>
                <a href="#contact" style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:12, letterSpacing:'0.14em', color:w.color, display:'inline-flex', alignItems:'center', gap:8 }}>
                  VIEW CASE STUDY <span>→</span>
                </a>
                <span style={{ fontSize:12, color:'var(--text-muted)' }}>{w.year}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── RIGHT: wheel ── */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ position: 'relative', width: W, height: W, flexShrink: 0 }}>

            {/* Static SVG decorative rings */}
            <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} viewBox={`0 0 ${W} ${W}`}>
              {/* Outer faint ring */}
              <circle cx={W/2} cy={W/2} r={R+28} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
              {/* Main orbit ring (dashed) */}
              <circle cx={W/2} cy={W/2} r={R} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1" strokeDasharray="3 9"/>
              {/* Inner ring */}
              <circle cx={W/2} cy={W/2} r={R-48} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
              {/* Center hub */}
              <circle cx={W/2} cy={W/2} r={6} fill={aw.color} opacity="0.7" style={{ transition:'fill 0.4s' }}/>
              <circle cx={W/2} cy={W/2} r={18} fill="none" stroke={aw.color} strokeWidth="0.8" opacity="0.18" style={{ transition:'stroke 0.4s' }}/>
              {/* Focal indicator — left edge (9 o'clock) */}
              <circle cx={W/2 - R} cy={W/2} r={8} fill={aw.color} opacity="0.95" style={{ transition:'fill 0.4s' }}/>
              <circle cx={W/2 - R} cy={W/2} r={18} fill="none" stroke={aw.color} strokeWidth="1.2" opacity="0.4" style={{ transition:'stroke 0.4s' }}/>
              <circle cx={W/2 - R} cy={W/2} r={28} fill="none" stroke={aw.color} strokeWidth="0.5" opacity="0.15" style={{ transition:'stroke 0.4s' }}/>
            </svg>

            {/* Rotating spokes */}
            <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none',
              transform:`rotate(${wheelRot}deg)`, transformOrigin:`${W/2}px ${W/2}px`,
              transition:'transform 0.9s cubic-bezier(0.4,0,0.2,1)' }} viewBox={`0 0 ${W} ${W}`}>
              {works.map((_,i) => {
                const rad = (i * 90) * Math.PI / 180;
                return <line key={i} x1={W/2} y1={W/2}
                  x2={W/2 + Math.cos(rad)*R} y2={W/2 + Math.sin(rad)*R}
                  stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>;
              })}
            </svg>

            {/* Rotating items container */}
            <div style={{ position:'absolute', inset:0,
              transform:`rotate(${wheelRot}deg)`, transformOrigin:`${W/2}px ${W/2}px`,
              transition:'transform 0.9s cubic-bezier(0.4,0,0.2,1)' }}>
              {works.map((w, i) => {
                const isActive = active === i;
                const sz = isActive ? 116 : 66;
                return (
                  <div key={i} style={{ position:'absolute', left: itemPos[i].cx, top: itemPos[i].cy }}>
                    <div style={{
                      transform:`translate(-50%,-50%) rotate(${-wheelRot}deg)`,
                      transformOrigin:'center center',
                      width: sz, height: sz,
                      borderRadius:'50%', overflow:'hidden',
                      border:`${isActive?2.5:1}px solid ${isActive ? w.color : 'rgba(255,255,255,0.15)'}`,
                      boxShadow: isActive ? `0 0 32px ${w.color}55, 0 0 64px ${w.color}22` : 'none',
                      transition:'transform 0.9s cubic-bezier(0.4,0,0.2,1), width 0.5s ease, height 0.5s ease, border-color 0.4s, box-shadow 0.4s',
                    }}>
                      <img src={w.img} alt={w.title} style={{ width:'100%', height:'100%', objectFit:'cover',
                        filter: isActive ? 'none' : 'grayscale(0.75) brightness(0.3)',
                        transition:'filter 0.5s, transform 0.5s',
                        transform: isActive ? 'scale(1)' : 'scale(1.1)',
                      }}/>
                    </div>
                    {/* Project number label — counter-rotated */}
                    <div style={{
                      position:'absolute', bottom:-22, left:'50%',
                      transform:`translateX(-50%) rotate(${-wheelRot}deg)`,
                      transition:'transform 0.9s cubic-bezier(0.4,0,0.2,1), opacity 0.4s',
                      opacity: isActive ? 0 : 0.4,
                      fontFamily:'var(--ff-display)', fontSize:10,
                      color:'var(--text-muted)', letterSpacing:'0.1em', whiteSpace:'nowrap',
                    }}>0{i+1}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Counter */}
        <div style={{ position:'absolute', bottom:40, left:'clamp(24px,5vw,80px)', zIndex:3, display:'flex', alignItems:'baseline', gap:8 }}>
          <span style={{ fontFamily:'var(--ff-display)', fontWeight:800, fontSize:28, color:aw.color, transition:'color 0.4s' }}>{String(active+1).padStart(2,'0')}</span>
          <span style={{ fontFamily:'var(--ff-display)', fontSize:14, color:'var(--text-muted)' }}>/ 04</span>
        </div>

        {/* Right progress pills */}
        <div style={{ position:'absolute', right:'clamp(24px,4vw,56px)', top:'50%', transform:'translateY(-50%)', zIndex:3, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
          {works.map((w,i) => (
            <div key={i} style={{ width: active===i?3:2, height: active===i?32:10, background: active===i?w.color:'rgba(255,255,255,0.18)', borderRadius:99, transition:'all 0.4s ease' }}/>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Team (Auto-scroll Carousel) ─────────────────────────────────────────────
const TeamSection = ({ accentColor, accentGreen }) => {
  const [running, setRunning] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const sectionRef = React.useRef(null);

  const team = [
    { name:'Amara Kibe',      role:'Founder & CEO',     spec:'Vision & Strategy',    init:'AK', color: accentColor },
    { name:'Njoroge Mwangi',  role:'Chief Technology Officer', spec:'Systems Architecture', init:'NM', color: accentGreen },
    { name:'Wanjiru Ndegwa',  role:'Head of Design',    spec:'Product & UX',         init:'WN', color: accentColor },
    { name:'Kamau Githinji',  role:'Lead Engineer',     spec:'Full-Stack & AI',      init:'KG', color: accentGreen },
    { name:'Aisha Odhiambo',  role:'Data Scientist',    spec:'Analytics & ML',       init:'AO', color: accentColor },
    { name:'Peter Kariuki',   role:'Cloud Architect',   spec:'DevOps & Infrastructure', init:'PK', color: accentGreen },
    { name:'Faith Wanjiku',   role:'AI Engineer',       spec:'LLMs & Automation',    init:'FW', color: accentColor },
  ];

  // Duplicate for seamless infinite loop
  const loop = [...team, ...team];

  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setRunning(true);
    }, { threshold: 0.2 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const cardW = 292;
  const gap   = 24;
  const setW  = team.length * (cardW + gap);  // width of one full set

  return (
    <section ref={sectionRef} id="team" data-screen-label="Team"
      style={{ padding:'120px 0', borderTop:'1px solid var(--border)', background:'var(--bg-1)', overflow:'hidden' }}>

      {/* Header */}
      <div style={{ padding:'0 clamp(24px,5vw,80px)', maxWidth:1200, margin:'0 auto 64px' }}>
        <div className="reveal" style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <div style={{ width:24, height:1, background:accentGreen }}/>
          <span style={{ fontSize:11, letterSpacing:'0.18em', color:accentGreen, textTransform:'uppercase' }}>The minds behind it</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:24 }}>
          <h2 className="reveal reveal-delay-1" style={{ fontFamily:'var(--ff-display)', fontWeight:800, fontSize:'clamp(32px,5vw,64px)', letterSpacing:'-0.02em', lineHeight:1 }}>Our Team</h2>
          <p className="reveal reveal-delay-2" style={{ color:'var(--text-muted)', maxWidth:360, fontSize:14, lineHeight:1.7 }}>
            A multidisciplinary crew of engineers, designers, and strategists united by one mission.
          </p>
        </div>
      </div>

      {/* Carousel track with edge fade */}
      <div style={{
        position:'relative',
        WebkitMaskImage:'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        maskImage:'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
      }}>
        {/* Inject dynamic keyframes */}
        <style>{`
          @keyframes teamFlow {
            from { transform: translateX(-${setW}px); }
            to   { transform: translateX(0px); }
          }
        `}</style>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            display:'flex', gap:`${gap}px`,
            width: 'max-content',
            paddingLeft: `${gap}px`,
            animationName: running ? 'teamFlow' : 'none',
            animationDuration: `${team.length * 4}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationPlayState: paused ? 'paused' : 'running',
            willChange: 'transform',
          }}>
          {loop.map((m, i) => {
            const idx = i % team.length;
            const isEven = idx % 2 === 0;
            return (
              <div key={i} style={{
                width: cardW,
                flexShrink: 0,
                background:'var(--bg-2)',
                border:'1px solid var(--border)',
                borderRadius:8,
                padding:'36px 28px 32px',
                position:'relative',
                overflow:'hidden',
                cursor:'default',
                transition:'border-color 0.3s, transform 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.transform = 'translateY(-6px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Background number watermark */}
                <div style={{ position:'absolute', bottom:-16, right:16, fontFamily:'var(--ff-display)', fontWeight:800, fontSize:96, color:'rgba(255,255,255,0.025)', lineHeight:1, userSelect:'none', pointerEvents:'none' }}>
                  {String(idx+1).padStart(2,'0')}
                </div>

                {/* Accent top bar */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(to right, ${m.color}, transparent)`, opacity:0.6 }}/>

                {/* Avatar */}
                <div style={{
                  width:72, height:72, borderRadius:'50%',
                  background:`radial-gradient(circle, ${m.color}1a 0%, transparent 70%)`,
                  border:`1.5px solid ${m.color}44`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  marginBottom:24,
                }}>
                  <span style={{ fontFamily:'var(--ff-display)', fontWeight:800, fontSize:22, color:m.color }}>
                    {m.init}
                  </span>
                </div>

                {/* Spec chip */}
                <div style={{ fontSize:10, letterSpacing:'0.14em', color:m.color, textTransform:'uppercase', fontFamily:'var(--ff-display)', fontWeight:600, marginBottom:10 }}>{m.spec}</div>

                {/* Name */}
                <div style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:18, color:'var(--text)', marginBottom:6, lineHeight:1.2 }}>{m.name}</div>

                {/* Role */}
                <div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.5 }}>{m.role}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pause hint */}
      <div style={{ padding:'28px clamp(24px,5vw,80px) 0', display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background: paused ? accentColor : 'var(--text-muted)', transition:'background 0.3s' }}/>
        <span style={{ fontSize:11, color:'var(--text-muted)', letterSpacing:'0.1em' }}>
          {paused ? 'PAUSED — HOVER TO PAUSE' : 'HOVER OVER A CARD TO PAUSE'}
        </span>
      </div>
    </section>
  );
};

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TestimonialsSection = ({ accentColor, accentGreen }) => {
  const testimonials = [
    { quote:"Mwarubaini didn't just build us software — they understood our context. The result was a platform that actually fits how Kenyans bank.", name:"David Omondi", role:"CTO, NexaBank Kenya" },
    { quote:"Their analytics work transformed how we report to Parliament. Data that used to take weeks now updates in real time.", name:"Dr. Grace Waweru", role:"Director, Ministry of Health" },
    { quote:"The Rafiki AI assistant has reduced our support costs by 60% while handling Swahili queries our previous vendor couldn't touch.", name:"Fatuma Hassan", role:"Head of Digital, Safaricom Partner" },
  ];
  const [active, setActive] = React.useState(0);
  const accs = [accentColor, accentGreen, accentColor];

  return (
    <section id="testimonials" data-screen-label="Testimonials" style={{ padding:'120px clamp(24px,5vw,80px)', borderTop:'1px solid var(--border)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div className="reveal" style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <div style={{ width:24, height:1, background:accentColor }}/>
          <span style={{ fontSize:11, letterSpacing:'0.18em', color:accentColor, textTransform:'uppercase' }}>Client voices</span>
        </div>
        <h2 className="reveal reveal-delay-1" style={{ fontFamily:'var(--ff-display)', fontWeight:800, fontSize:'clamp(32px,5vw,64px)', letterSpacing:'-0.02em', lineHeight:1, marginBottom:64 }}>What They Say</h2>

        <div className="reveal reveal-delay-2" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
          {testimonials.map((t, i) => (
            <div key={i}
              onClick={() => setActive(i)}
              style={{ padding:'36px 32px', border:`1px solid ${active===i ? accs[i] : 'var(--border)'}`, borderRadius:6, background: active===i ? 'rgba(255,255,255,0.02)' : 'transparent', cursor:'pointer', transition:'all 0.3s' }}>
              <div style={{ fontSize:32, color:accs[i], fontFamily:'serif', marginBottom:16, lineHeight:1 }}>"</div>
              <p style={{ fontSize:15, color:'var(--text-dim)', lineHeight:1.75, marginBottom:28, fontStyle:'italic' }}>{t.quote}</p>
              <div style={{ height:1, background:'var(--border)', marginBottom:20 }}/>
              <div style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:4 }}>{t.name}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Contact ──────────────────────────────────────────────────────────────────
const ContactSection = ({ accentColor, accentGreen }) => {
  const [form, setForm] = React.useState({ name:'', email:'', service:'', message:'' });
  const [sent, setSent] = React.useState(false);
  const services = ['Software Development','Web & App Design','Data & Analytics','AI / Machine Learning','Cloud & Infrastructure','Cybersecurity','Consulting & Strategy'];

  const inputStyle = { width:'100%', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:4, padding:'14px 16px', color:'var(--text)', fontFamily:'var(--ff-body)', fontSize:14, outline:'none', transition:'border-color 0.2s' };

  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <section id="contact" data-screen-label="Contact" style={{ padding:'120px clamp(24px,5vw,80px)', borderTop:'1px solid var(--border)', background:'var(--bg-1)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'start' }}>
        <div>
          <div className="reveal" style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <div style={{ width:24, height:1, background:accentColor }}/>
            <span style={{ fontSize:11, letterSpacing:'0.18em', color:accentColor, textTransform:'uppercase' }}>Start a conversation</span>
          </div>
          <h2 className="reveal reveal-delay-1" style={{ fontFamily:'var(--ff-display)', fontWeight:800, fontSize:'clamp(32px,4vw,56px)', letterSpacing:'-0.02em', lineHeight:1.05, marginBottom:24 }}>Let's build<br/>something<br/><span style={{ color:accentColor }}>together.</span></h2>
          <p className="reveal reveal-delay-2" style={{ fontSize:15, color:'var(--text-muted)', lineHeight:1.8, marginBottom:48 }}>
            Whether you have a clear brief or just an idea, we'd love to hear from you. We'll get back within 24 hours.
          </p>
          <div className="reveal reveal-delay-3" style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[['✉','hello@mwarubaini.co'],['📍','Nairobi, Kenya'],['⏱','Response within 24h']].map(([icon,val]) => (
              <div key={val} style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>{icon}</div>
                <span style={{ fontSize:14, color:'var(--text-dim)' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal reveal-delay-2">
          {sent ? (
            <div style={{ padding:48, border:`1px solid ${accentColor}`, borderRadius:6, textAlign:'center' }}>
              <div style={{ fontSize:40, marginBottom:16 }}>✓</div>
              <h3 style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:22, color:accentColor, marginBottom:12 }}>Message sent!</h3>
              <p style={{ color:'var(--text-muted)', fontSize:14 }}>We'll be in touch within 24 hours.</p>
              <button onClick={()=>setSent(false)} style={{ marginTop:24, color:accentColor, fontFamily:'var(--ff-display)', fontWeight:600, fontSize:12, letterSpacing:'0.1em', cursor:'pointer', background:'none', border:'none' }}>SEND ANOTHER →</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[['name','Your name','text'],['email','Your email','email']].map(([key,ph,type]) => (
                <input key={key} type={type} placeholder={ph} required value={form[key]}
                  onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                  onFocus={e=>e.target.style.borderColor=accentColor}
                  onBlur={e=>e.target.style.borderColor='var(--border)'}
                  style={inputStyle}/>
              ))}
              <select value={form.service} onChange={e=>setForm(f=>({...f,service:e.target.value}))}
                onFocus={e=>e.target.style.borderColor=accentColor}
                onBlur={e=>e.target.style.borderColor='var(--border)'}
                style={{...inputStyle, color: form.service ? 'var(--text)' : 'var(--text-muted)'}}>
                <option value="" style={{background:'var(--bg-2)'}}>Select a service</option>
                {services.map(s=><option key={s} value={s} style={{background:'var(--bg-2)'}}>{s}</option>)}
              </select>
              <textarea placeholder="Tell us about your project" required value={form.message}
                onChange={e=>setForm(f=>({...f,message:e.target.value}))}
                onFocus={e=>e.target.style.borderColor=accentColor}
                onBlur={e=>e.target.style.borderColor='var(--border)'}
                rows={5} style={{...inputStyle, resize:'vertical'}}/>
              <button type="submit" style={{ padding:'16px', background:accentColor, color:'#050810', fontFamily:'var(--ff-display)', fontWeight:700, fontSize:13, letterSpacing:'0.12em', borderRadius:4, transition:'opacity 0.2s' }}
                onMouseEnter={e=>e.target.style.opacity='0.85'}
                onMouseLeave={e=>e.target.style.opacity='1'}>
                SEND MESSAGE
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const FooterSection = ({ accentColor }) => (
  <footer style={{ padding:'48px clamp(24px,5vw,80px)', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:24 }}>
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <LogoMark size={22} cyan={accentColor} green={accentColor}/>
      <span style={{ fontFamily:'var(--ff-display)', fontWeight:700, fontSize:13, letterSpacing:'0.08em' }}>MWARUBAINI SOLUTIONS</span>
    </div>
    <span style={{ fontSize:12, color:'var(--text-muted)' }}>© 2025 Mwarubaini Solutions. Nairobi, Kenya.</span>
    <div style={{ display:'flex', gap:24 }}>
      {['Services','About','Work','Contact'].map(l=>(
        <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize:12, color:'var(--text-muted)', letterSpacing:'0.08em', transition:'color 0.2s' }}
          onMouseEnter={e=>e.target.style.color=accentColor}
          onMouseLeave={e=>e.target.style.color='var(--text-muted)'}>{l}</a>
      ))}
    </div>
  </footer>
);

// ─── Export all ───────────────────────────────────────────────────────────────
Object.assign(window, {
  NavSection, HeroSection, ServicesSection, AboutSection,
  PortfolioSection, TeamSection, TestimonialsSection,
  ContactSection, FooterSection, LogoMark
});
