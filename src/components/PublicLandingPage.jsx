import PublicPageShell from "./PublicPageShell";

const FEATURES = [
  {
    useCaseId: "ai-drafting",
    label: "Feature 01",
    title: "AI Legal Drafting backed by real transactions",
    description:
      "Draft, rewrite, and assemble legal documents with AI grounded in 170,000+ real transaction clauses. Louis suggests language that reflects what actually gets signed — not generic output. Rewrite clauses, explain them in plain English, or fully assemble documents from 100+ curated templates.",
    reverse: false,
    video: "/videos/Ai-Drafting-SHORT.mp4",
  },
  {
    useCaseId: "secure-repository",
    label: "Feature 02",
    title: "Version Control & Redline",
    description:
      "Every save creates an immutable snapshot. Compare any two versions side-by-side with semantic redlining that highlights exactly what changed — additions, deletions, restructured sections. No more emailing v3_FINAL_final.docx back and forth.",
    reverse: true,
    video: "/videos/version-control-SHORT.mp4",
  },
  {
    useCaseId: "document-storage",
    label: "Feature 03",
    title: "Secure Document Storage",
    description:
      "One workspace for generated and uploaded documents. Collaborate with your team in real time, and grant credential-based access to advisors, investors, and outside counsel — each with the right level of visibility. Your corporate records, organized and protected.",
    reverse: false,
    video: "/videos/document-storage-SHORT.mp4",
  },
  {
    useCaseId: "e-signatures",
    label: "Feature 04",
    title: "E-Signature Integration",
    description:
      "Prepare DocuSign signature packages and send them directly from your workspace. Draft to executed in one place — no re-uploading, no switching tabs. Track status, manage counterparties, and store executed copies.",
    reverse: true,
    video: "/videos/e-signature-SHORT.mp4",
  },
];

const HOW_STEPS = [
  {
    number: "01",
    title: "Pick a template",
    description:
      "Choose from 100+ ready-to-use legal templates — board resolutions, employment agreements, NDAs, financing documents, and more.",
  },
  {
    number: "02",
    title: "Draft with AI",
    description:
      "Louis suggests language as you write, drawn from real transaction data. Fill in your company details and let the tool do the heavy lifting.",
  },
  {
    number: "03",
    title: "Sign and close",
    description:
      "Send for signature through DocuSign with one click. Executed documents and full version history stay in your workspace.",
  },
];

const FeatureVideo = ({ src, title }) => (
  <video
    className="public-showcase-row__video"
    src={src}
    autoPlay
    muted
    loop
    playsInline
    aria-label={`${title} demo`}
  />
);

const PublicLandingPage = ({
  onGetStarted,
  onViewPricing,
  onViewAbout,
  onViewLearn,
  onOpenUseCase,
}) => {
  const actions = [
    {
      key: "pricing",
      label: "Pricing",
      onClick: onViewPricing,
    },
    {
      key: "learn",
      label: "Learn",
      onClick: onViewLearn,
    },
    {
      key: "about",
      label: "About",
      onClick: onViewAbout,
    },
    {
      key: "start-free",
      label: "Start Free",
      onClick: onGetStarted,
      className: "pill-button primary-button",
    },
  ];

  return (
    <PublicPageShell
      pageClassName="public-landing"
      headerClassName="public-landing__header"
      brandClassName="public-landing__brand"
      actionsClassName="public-landing__actions"
      contentClassName="public-landing__content"
      actions={actions}
      brandExtra={<span className="public-landing__tagline">Legal Operations for Canadian Startups</span>}
      decor={
        <>
          <div className="public-landing__bg-orb public-landing__bg-orb--left" aria-hidden="true" />
          <div className="public-landing__bg-orb public-landing__bg-orb--right" aria-hidden="true" />
        </>
      }
    >
      {/* Hero */}
      <section className="public-landing__hero public-reveal">
        <p className="public-landing__eyebrow">Built for founders who do it themselves</p>
        <h1>The legal tool that works as hard as you do</h1>
        <p className="public-landing__lead">
          100+ ready-to-use legal templates, AI-assisted drafting backed by real transaction data, version control with redline, and DocuSign integration — all in one legal workspace built for Canadian founders.
        </p>
      </section>

      {/* Section divider */}
      <div className="public-landing__section-divider" aria-hidden="true" style={{ marginTop: "64px" }} />

      {/* Feature Showcase */}
      <section className="public-landing__showcase public-reveal" aria-label="Feature showcase">
        <h2 className="public-landing__showcase-heading">Legal drafting, document storage, record-keeping, and signing — one workspace.</h2>

        {FEATURES.map((item) => (
          <div
            key={item.useCaseId}
            className={`public-showcase-row${item.reverse ? " public-showcase-row--reverse" : ""}`}
          >
            <div className="public-showcase-row__text">
              <p className="public-showcase-row__label">{item.label}</p>
              <h3 className="public-showcase-row__title">
                <button
                  type="button"
                  className="public-showcase-row__title-link"
                  onClick={() => onOpenUseCase?.(item.useCaseId)}
                >
                  {item.title}
                </button>
              </h3>
              <p className="public-showcase-row__desc">{item.description}</p>
            </div>
            <div className="public-showcase-row__video-wrap">
              <FeatureVideo src={item.video} title={item.title} />
            </div>
          </div>
        ))}
      </section>

      {/* Section divider */}
      <div className="public-landing__section-divider" aria-hidden="true" />

      {/* How It Works */}
      <section className="public-landing__how-it-works public-reveal" aria-label="How it works">
        <h2>How it works.</h2>
        <div className="public-how-steps">
          {HOW_STEPS.map((step) => (
            <div key={step.number} className="public-how-step">
              <div className="public-how-step__number" aria-hidden="true">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section divider */}
      <div className="public-landing__section-divider" aria-hidden="true" style={{ marginTop: "64px" }} />

      {/* Trust / Stats */}
      <section className="public-landing__trust public-reveal" aria-label="Platform credentials">
        <h2>Built for Canadian founders.</h2>
        <div className="public-trust-stats">
          <div className="public-trust-stat">
            <span className="public-trust-stat__number">100+</span>
            <span className="public-trust-stat__label">Canadian Business Templates</span>
          </div>
          <div className="public-trust-stat">
            <span className="public-trust-stat__number">170,000+</span>
            <span className="public-trust-stat__label">Clauses</span>
          </div>
          <div className="public-trust-stat">
            <span className="public-trust-stat__number">SHA-256</span>
            <span className="public-trust-stat__label">Version Integrity</span>
          </div>
          <div className="public-trust-stat">
            <span className="public-trust-stat__number">DocuSign</span>
            <span className="public-trust-stat__label">E-Signature Integration</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="public-landing__final-cta public-reveal" aria-label="Get started">
        <h2>Ready to get your paperwork out of the way?</h2>
        <p>100+ legal templates, AI drafting backed by real transactions, version control, and DocuSign — all in one legal workspace.</p>
        <button type="button" className="pill-button primary-button" onClick={onGetStarted}>
          Start Free
        </button>
      </section>
    </PublicPageShell>
  );
};

export default PublicLandingPage;
