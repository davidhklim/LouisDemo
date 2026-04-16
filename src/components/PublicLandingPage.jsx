import "./PublicLandingPage.css";

const FEATURES = [
  {
    id: "ai-drafting",
    icon: "psychology",
    title: "AI Drafting",
    description:
      "Our context-aware AI leverages 228K verified clauses to suggest the perfect legal wording. Draft, rewrite, and assemble documents grounded in real Canadian deals.",
    badge: "Legal Intelligence",
    videoShort: "/videos/Ai-Drafting-SHORT.mp4",
  },
  {
    id: "secure-repository",
    icon: "history",
    title: "Version Control & Redline",
    description:
      "Every save creates an immutable snapshot. Compare any two versions side-by-side with semantic redlining that highlights exactly what changed.",
    badge: "Audit Ready",
    videoShort: "/videos/version-control-SHORT.mp4",
  },
  {
    id: "document-storage",
    icon: "edit_note",
    title: "Collaborative Editing",
    description:
      "Work on documents with your team in real time. Grant credential-based access to advisors, investors, and outside counsel with the right level of visibility.",
    badge: "Team Workflow",
    videoShort: "/videos/document-storage-SHORT.mp4",
  },
  {
    id: "e-signatures",
    icon: "draw",
    title: "DocuSign Integration",
    description:
      "Prepare and send signature packages directly from your workspace. Go from draft to executed without switching tabs or chasing down signers.",
    badge: "Closing Workflow",
    videoShort: "/videos/e-signature-SHORT.mp4",
  },
];

const FOOTER_PRODUCT_LINKS = [
  { label: "Features", action: "features" },
  { label: "Pricing", action: "pricing" },
  { label: "Templates", action: "templates" },
];

const FOOTER_COMPANY_LINKS = [
  { label: "About", action: "about" },
  { label: "Learn", action: "learn" },
  { label: "Contact", action: "contact" },
];

const FOOTER_LEGAL_LINKS = [
  { label: "Privacy Policy", action: "privacy" },
  { label: "Terms of Service", action: "terms" },
];

const PublicLandingPage = ({
  onGetStarted,
  onSignIn,
  onViewPricing,
  onViewAbout,
  onViewLearn,
  onOpenUseCase,
  onViewPrivacy,
  onViewTerms,
}) => {
  const footerAction = (action) => {
    switch (action) {
      case "features":
        document.querySelector(".landing__features")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "pricing": onViewPricing?.(); break;
      case "templates": onGetStarted?.(); break;
      case "about": onViewAbout?.(); break;
      case "learn": onViewLearn?.(); break;
      case "contact": window.location.href = "mailto:louisaiproject@gmail.com"; break;
      case "privacy": onViewPrivacy?.(); break;
      case "terms": onViewTerms?.(); break;
      default: break;
    }
  };

  return (
    <div className="landing">
      {/* ── Fixed Header ──────────────────────────────────────── */}
      <header className="landing__header">
        <nav className="landing__nav" aria-label="Main navigation">
          <div className="landing__nav-left">
            <button
              type="button"
              className="landing__logo-btn landing-serif"
              onClick={onGetStarted}
              aria-label="LouisAI — go to home"
            >
              LouisAI
            </button>
            <div className="landing__nav-links">
              <button type="button" className="landing__nav-link" onClick={() => onOpenUseCase?.("ai-drafting")}>
                Use Cases
              </button>
              <button type="button" className="landing__nav-link" onClick={onViewPricing}>
                Pricing
              </button>
              <button type="button" className="landing__nav-link" onClick={onViewLearn}>
                Learn
              </button>
              <button type="button" className="landing__nav-link" onClick={onViewAbout}>
                About
              </button>
            </div>
          </div>
          <div className="landing__nav-right">
            <button type="button" className="landing__login-btn" onClick={onSignIn}>
              Log In
            </button>
            <button type="button" className="landing__cta-btn" onClick={onGetStarted}>
              Get Started
            </button>
          </div>
        </nav>
      </header>

      <main className="landing__main">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="landing__hero" aria-label="Hero">
          <div className="landing__hero-text">
            <h1 className="landing__hero-headline">
              Legal operations, simplified.
            </h1>
            <p className="landing__hero-sub">
              The lightweight platform startup founders use to manage corporate
              documents, generate contracts, and keep their minutebook
              organized.
            </p>
            <div className="landing__hero-cta-row">
              <button
                type="button"
                className="landing__hero-cta"
                onClick={onGetStarted}
              >
                Get Started &mdash; Free
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_forward
                </span>
              </button>
              <div className="landing__social-proof">
                <div className="landing__avatars" aria-hidden="true">
                  <div className="landing__avatar landing__avatar--a" />
                  <div className="landing__avatar landing__avatar--b" />
                  <div className="landing__avatar landing__avatar--c" />
                </div>
                <p className="landing__social-proof-label">
                  Trusted by 500+ Canadian founders
                </p>
              </div>
            </div>
          </div>

          {/* Product demo video — enlarged */}
          <div className="landing__hero-visual">
            <div className="landing__hero-orb--a" />
            <div className="landing__hero-orb--b" />
            <div className="landing__hero-card">
              <div className="landing__hero-screen">
                <video
                  className="landing__hero-video"
                  src="/videos/ai-drafting.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="LouisAI product demo"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Social Proof Bar ──────────────────────────────── */}
        <section className="landing__proof-bar" aria-label="Social proof">
          <div className="landing__proof-bar-inner">
            <div className="landing__proof-left">
              <p className="landing__proof-label">Trusted by founders</p>
              <p className="landing__proof-quote">
                &ldquo;The only legal tool that actually speaks Canadian.&rdquo;
              </p>
            </div>
            <div className="landing__proof-right">
              <span className="landing__proof-number">228,005</span>
              <span className="landing__proof-sublabel">
                clauses from 87 real Canadian deals power our AI
              </span>
            </div>
          </div>
        </section>

        {/* ── Features Grid ─────────────────────────────────── */}
        <section className="landing__features" aria-label="Features">
          <div className="landing__features-inner">
            <div className="landing__features-header">
              <h2 className="landing__features-heading">
                Built for the velocity of startups.
              </h2>
              <p className="landing__features-sub">
                Eliminate legal bottlenecks with tools designed for corporate
                efficiency and compliance.
              </p>
            </div>
            <div className="landing__features-grid">
              {FEATURES.map((feature) => (
                <button
                  key={feature.title}
                  type="button"
                  className="landing__feature-card landing__feature-card--clickable"
                  onClick={() => onOpenUseCase?.(feature.id)}
                >
                  {/* Video thumbnail */}
                  <div className="landing__feature-video-wrap">
                    <video
                      src={feature.videoShort}
                      autoPlay
                      muted
                      loop
                      playsInline
                      aria-label={`${feature.title} preview`}
                    />
                  </div>
                  <div className="landing__feature-icon-wrap" aria-hidden="true">
                    <span className="material-symbols-outlined">
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="landing__feature-title">{feature.title}</h3>
                  <p className="landing__feature-desc">
                    {feature.description}
                  </p>
                  {feature.badge ? (
                    <div className="landing__feature-badge">
                      {feature.badge}
                    </div>
                  ) : null}
                  <span className="landing__feature-arrow" aria-hidden="true">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Dark CTA ──────────────────────────────────────── */}
        <section className="landing__cta-section" aria-label="Call to action">
          <div className="landing__cta-card">
            <div className="landing__cta-lines" aria-hidden="true">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="landing__cta-line" />
              ))}
            </div>
            <div className="landing__cta-text">
              <h2 className="landing__cta-heading">
                Ready to clean up your legal deck?
              </h2>
              <p className="landing__cta-body">
                Join hundreds of founders who spend less on legal fees and more
                on building.
              </p>
            </div>
            <div className="landing__cta-actions">
              <button
                type="button"
                className="landing__cta-btn"
                onClick={onGetStarted}
              >
                Get Started &mdash; Free
              </button>
              <p className="landing__cta-fine">No credit card required</p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="landing__footer">
        <div className="landing__footer-inner">
          <div className="landing__footer-top">
            <div className="landing__footer-brand">
              <p className="landing__footer-logo landing-serif">LouisAI</p>
              <p className="landing__footer-tagline">
                The premium legal operations layer for high-growth Canadian
                companies.
              </p>
            </div>
            <nav className="landing__footer-links" aria-label="Footer navigation">
              <div className="landing__footer-col">
                <h4 className="landing__footer-col-heading">Product</h4>
                <ul>
                  {FOOTER_PRODUCT_LINKS.map((link) => (
                    <li key={link.label}>
                      <button
                        type="button"
                        className="landing__footer-link"
                        onClick={() => footerAction(link.action)}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="landing__footer-col">
                <h4 className="landing__footer-col-heading">Company</h4>
                <ul>
                  {FOOTER_COMPANY_LINKS.map((link) => (
                    <li key={link.label}>
                      <button
                        type="button"
                        className="landing__footer-link"
                        onClick={() => footerAction(link.action)}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="landing__footer-col">
                <h4 className="landing__footer-col-heading">Legal</h4>
                <ul>
                  {FOOTER_LEGAL_LINKS.map((link) => (
                    <li key={link.label}>
                      <button
                        type="button"
                        className="landing__footer-link"
                        onClick={() => footerAction(link.action)}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
          <div className="landing__footer-bottom">
            <p className="landing__footer-copy">
              &copy; 2026 LouisAI Legal Operations Inc. All rights reserved.
            </p>
            <div className="landing__footer-icons">
              <button
                type="button"
                className="landing__footer-icon-btn"
                aria-label="Language"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  language
                </span>
              </button>
              <button
                type="button"
                className="landing__footer-icon-btn"
                aria-label="Email"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  alternate_email
                </span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLandingPage;
