const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#22d3ee",
  "accentGreen": "#4ade80",
  "heroHeadline": "Built for the future."
}/*EDITMODE-END*/;

const App = () => {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const { accentColor, accentGreen, heroHeadline } = tweaks;

  React.useEffect(() => {
    document.documentElement.style.setProperty('--cyan', accentColor);
    document.documentElement.style.setProperty('--green', accentGreen);
  }, [accentColor, accentGreen]);

  const sharedProps = { accentColor, accentGreen };

  return (
    <>
      <NavSection accentColor={accentColor} accentGreen={accentGreen} />
      <HeroSection {...sharedProps} headline={heroHeadline} />
      <TreeSection {...sharedProps} />
      <ServicesSection {...sharedProps} />
      <AboutSection {...sharedProps} />
      <PortfolioSection {...sharedProps} />
      <TeamSection {...sharedProps} />
      <TestimonialsSection {...sharedProps} />
      <ContactSection {...sharedProps} />
      <FooterSection accentColor={accentColor} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Brand Colors">
          <TweakColor id="accentColor" label="Primary (Cyan)" value={accentColor} onChange={v => setTweak('accentColor', v)} />
          <TweakColor id="accentGreen" label="Secondary (Green)" value={accentGreen} onChange={v => setTweak('accentGreen', v)} />
        </TweakSection>
        <TweakSection label="Hero">
          <TweakText id="heroHeadline" label="Headline" value={heroHeadline} onChange={v => setTweak('heroHeadline', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

if (typeof document !== 'undefined') {
  const rootEl = document.getElementById('root');
  if (rootEl && rootEl.hasChildNodes()) {
    ReactDOM.hydrateRoot(rootEl, <App />);
  } else {
    ReactDOM.createRoot(rootEl).render(<App />);
  }
}
