import "./PublicAboutPage.css";

const UPDATE_EMAIL = "louisaiproject@gmail.com";
const UPDATE_MAILTO = `mailto:${UPDATE_EMAIL}?subject=${encodeURIComponent(
  "I would like to stay updated!"
)}&body=${encodeURIComponent(`Hi LouisAI team,

I would like to stay updated.

Name: [your name]
Company: [company name]
Role: [your role]
Location: [city/province]
Interested in: [mailing list / pilot project / investor information]

Notes:
[add anything else you want us to know]`)}`;

const MailIcon = () => (
  <svg
    className="about__footer-mail-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M4.75 6.75h14.5v10.5H4.75V6.75Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="m5.25 7.25 6.75 5.5 6.75-5.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function PublicAboutPage({
  isAuthenticated,
  onGoHome,
  onViewPricing,
  onSignIn,
  onGetStarted,
  onSignOut,
  onViewLearn,
  onViewPrivacy,
  onViewTerms,
  onViewUseCases,
}) {
  return (
    <div className="about">
      {/* ── Fixed Header ──────────────────────────────────────── */}
      <header className="about__header">
        <nav className="about__nav" aria-label="Main navigation">
          <div className="about__nav-left">
            <button
              type="button"
              className="about__logo-btn"
              onClick={onGoHome}
              aria-label="LouisAI — go to home"
            >
              LouisAI
            </button>
            <div className="about__nav-links">
              <button
                type="button"
                className="about__nav-link"
                onClick={onViewPricing}
              >
                Pricing
              </button>
              <button
                type="button"
                className="about__nav-link"
                onClick={onViewUseCases}
              >
                Use Cases
              </button>
              <button
                type="button"
                className="about__nav-link"
                onClick={onViewLearn}
              >
                Learn
              </button>
            </div>
          </div>
          <div className="about__nav-right">
            {isAuthenticated ? (
              <button
                type="button"
                className="about__signin-btn"
                onClick={onSignOut}
              >
                Sign Out
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="about__signin-btn"
                  onClick={onSignIn}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="about__cta-btn"
                  onClick={onGetStarted}
                >
                  Start Free
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="about__main">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="about__hero" aria-label="Hero">
          <h1 className="about__hero-headline">About LouisAI</h1>
          <div className="about__hero-grid">
            <p className="about__hero-body">
              A legal platform built for founders — not a law firm, not a
              generic document generator. A structured workspace that combines
              curated templates, AI-assisted drafting grounded in real Canadian
              deal data, and the company data store you need to stop entering
              the same details in every contract. Routine paperwork done faster,
              so you can focus on what moves the company forward.
            </p>
            <div className="about__hero-meta">
              <p className="about__eyebrow">Location</p>
              <p className="about__hero-location">HQ &mdash; Vancouver, BC</p>
            </div>
          </div>
        </section>

        {/* ── What We Do ────────────────────────────────────── */}
        <section className="about__mission" aria-label="Mission">
          <div className="about__mission-inner">
            <div className="about__mission-header">
              <p className="about__eyebrow">The Mission</p>
              <h2 className="about__section-heading">What We Do</h2>
            </div>
            <div className="about__mission-grid">
              <div className="about__mission-left">
                <p>
                  Legal documents are the golden thread connecting every
                  material decision a company makes — who owns equity, who has
                  authority, what was agreed. LouisAI exists to digitize that
                  thread: to make it structured, searchable, and auditable
                  rather than buried in email chains and DOCX files.
                </p>
                <p>
                  The drafting engine draws from 500,000+ retrievable legal
                  text units sourced from real Canadian venture deals across
                  multiple provincial jurisdictions, semantically indexed so
                  Louis retrieves the most relevant language for your specific
                  document. When Louis suggests language, it is grounded in
                  actual market practice — not generic output trained on the
                  public internet. Louis understands both the market standard
                  and the legal framework behind it.
                </p>
              </div>
              <div className="about__mission-right">
                <p>
                  Every save creates an immutable version snapshot with SHA-256
                  integrity hashing. Compare any two versions with a semantic
                  redline that shows exactly what changed at the clause level.
                  No more emailing track-changes back and forth. No more
                  guessing which version is current.
                </p>
                <div className="about__quote-card">
                  <p className="about__quote-text">
                    &ldquo;Precision is our only metric.&rdquo;
                  </p>
                  <p className="about__quote-attr">Internal Mandate &mdash; 01</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Helps — Bento Grid ─────────────────────── */}
        <section className="about__toolkit" aria-label="Toolkit">
          <div className="about__toolkit-inner">
            <div className="about__toolkit-header">
              <p className="about__eyebrow">The Toolkit</p>
              <h2 className="about__section-heading">How It Helps</h2>
              <p className="about__toolkit-subtitle">
                195+ templates covering the recurring paperwork every growing
                company deals with — structured for auto-fill, AI assistance,
                and version control that Word files cannot offer.
              </p>
            </div>
            <div className="about__bento">
              {/* Governance — spans 2 columns */}
              <div className="about__bento-card about__bento-card--governance">
                <div className="about__bento-icon" aria-hidden="true">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <h3 className="about__bento-title">Governance</h3>
                <ul className="about__bento-list">
                  <li>Board resolutions</li>
                  <li>Shareholder resolutions</li>
                  <li>Shareholder agreements</li>
                  <li>Corporate governance records</li>
                </ul>
              </div>

              {/* Talent */}
              <div className="about__bento-card about__bento-card--talent">
                <h3 className="about__bento-title">Talent</h3>
                <ul className="about__bento-list about__bento-list--italic">
                  <li>Employment agreements</li>
                  <li>IP assignment</li>
                  <li>Stock option plans</li>
                </ul>
              </div>

              {/* Capital */}
              <div className="about__bento-card about__bento-card--capital">
                <h3 className="about__bento-title">Capital</h3>
                <p className="about__bento-desc">
                  Financing documents, term sheets, subscription agreements, and
                  convertible instruments — structured for the velocity of a
                  live financing round.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── What Makes Louis Different ─────────────────────── */}
        <section className="about__differentiators" aria-label="Differentiators">
          <div className="about__differentiators-inner">
            <h2 className="about__diff-heading">What Makes Louis Different</h2>
            <div className="about__diff-grid">
              <div className="about__diff-cell">
                <div className="about__diff-icon" aria-hidden="true">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <h3 className="about__diff-title">AI trained on real deals</h3>
                <p className="about__diff-desc">
                  500,000+ retrievable legal text units sourced from real
                  Canadian venture deals, semantically indexed so Louis
                  retrieves the most relevant language for your specific
                  document — not generic output.
                </p>
              </div>
              <div className="about__diff-cell">
                <div className="about__diff-icon" aria-hidden="true">
                  <span className="material-symbols-outlined">database</span>
                </div>
                <h3 className="about__diff-title">Structured, not static</h3>
                <p className="about__diff-desc">
                  Documents are stored as structured data, not Word files or
                  PDFs. Auto-fill works at the field level, version diffing is
                  precise, and AI assistance reaches inside individual clauses.
                </p>
              </div>
              <div className="about__diff-cell">
                <div className="about__diff-icon" aria-hidden="true">
                  <span className="material-symbols-outlined">public</span>
                </div>
                <h3 className="about__diff-title">Canadian-first</h3>
                <p className="about__diff-desc">
                  Every template and every piece of transaction data covers
                  real deals across BC, Ontario, Alberta, and Quebec — no
                  US-centric content from generic AI tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Disclaimer ────────────────────────────────────── */}
        <section className="about__disclaimer" aria-label="Legal disclaimer">
          <div className="about__disclaimer-inner">
            <div className="about__disclaimer-card">
              <div className="about__disclaimer-bg-icon" aria-hidden="true">
                <span className="material-symbols-outlined">gavel</span>
              </div>
              <h2 className="about__disclaimer-heading">Disclaimer</h2>
              <p>
                <strong>LouisAI does not provide legal advice.</strong> Documents,
                templates, and AI-generated suggestions are informational and
                operational tools only. Output should be reviewed and approved by
                qualified legal counsel before execution.
              </p>
              <p>
                LouisAI is intended as a drafting and workflow accelerator, not a
                substitute for professional legal judgment. Your use of LouisAI
                does not create a lawyer-client relationship.
              </p>
              <p>
                LouisAI and the Louis Templates are provided without
                representations, warranties, or guarantees of any kind, express or
                implied, including with respect to suitability, completeness,
                accuracy, or compliance with applicable law. You are solely
                responsible for determining whether any template, document, or
                generated output is appropriate for your circumstances.
              </p>
            </div>
            <div className="about__back-row">
              <button
                type="button"
                className="about__back-btn"
                onClick={onGoHome}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  arrow_back
                </span>
                Back to Home
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="about__footer">
        <div className="about__footer-inner">
          <div className="about__footer-top">
            {/* Brand + email signup */}
            <div className="about__footer-brand">
              <p className="about__footer-logo">LouisAI</p>
              <p className="about__footer-copy-note">
                &copy; 2026 LouisAI Legal Operations Inc.
              </p>
              <div className="about__footer-signup">
                <p className="about__footer-signup-label">Stay updated</p>
                <div className="about__footer-signup-row">
                  <input
                    type="email"
                    className="about__footer-signup-input"
                    placeholder="your@email.com"
                    aria-label="Email address for updates"
                  />
                  <button
                    type="button"
                    className="about__footer-signup-btn"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Learn */}
            <div className="about__footer-col">
              <h4 className="about__footer-col-heading">Learn</h4>
              <ul>
                <li>
                  <button type="button" className="about__footer-link">
                    Newsletter
                  </button>
                </li>
                <li>
                  <button type="button" className="about__footer-link" onClick={onViewLearn}>
                    Legal Glossary
                  </button>
                </li>
                <li>
                  <button type="button" className="about__footer-link" onClick={onViewLearn}>
                    Resources
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="about__footer-col">
              <h4 className="about__footer-col-heading">Legal</h4>
              <ul>
                <li>
                  <button type="button" className="about__footer-link" onClick={onViewPrivacy}>
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button type="button" className="about__footer-link" onClick={onViewTerms}>
                    Terms of Use
                  </button>
                </li>
                <li>
                  <button type="button" className="about__footer-link">
                    Legal Disclosures
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="about__footer-col">
              <h4 className="about__footer-col-heading">Contact</h4>
              <p className="about__footer-contact-line">
                <a
                  href={UPDATE_MAILTO}
                  className="about__footer-email-link"
                  aria-label="Email LouisAI to join the update list"
                >
                  <MailIcon />
                  <span>{UPDATE_EMAIL}</span>
                </a>
              </p>
              <p className="about__footer-contact-line">Vancouver, BC</p>
            </div>
          </div>

          <div className="about__footer-bottom">
            <p className="about__footer-legal">
              All rights reserved. Not legal advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
