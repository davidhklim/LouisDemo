import { useMemo } from "react";
import { useParams } from "react-router-dom";
import "./PublicUseCasePage.css";

const USE_CASES = {
  "ai-drafting": {
    title: "AI-Assisted Legal Drafting",
    subtitle: "Precedent-Backed Intelligence",
    intro:
      "Precedent-backed clause generation drawn from 228,000+ real clauses from Canadian venture deals across multiple jurisdictions. Draft, rewrite, and assemble legal documents with AI that knows the needs of Canadian founders — grounded in what actually gets signed.",
    designedFor:
      "Founders, operations leads, and in-house teams that need to move faster on routine corporate documents without starting from scratch every time.",
    video: "/videos/ai-drafting.mp4",
    capabilities: [
      {
        icon: "auto_awesome",
        label: "Precedent-backed drafting — language grounded in real Canadian venture deals, not generic AI output",
      },
      {
        icon: "search",
        label: "Every clause summarized and semantically indexed for precise retrieval",
      },
      {
        icon: "edit_note",
        label: "Rewrite and explain selected clauses in plain English for internal review",
      },
      {
        icon: "library_books",
        label: "Full draft assembly from 199+ curated legal templates",
      },
      {
        icon: "mail",
        label: "Auto-fill company details with mail merge across any template",
      },
      {
        icon: "database",
        label: "Context-aware suggestions using your stored company data",
      },
    ],
  },
  "secure-repository": {
    title: "Version Control & Redline",
    subtitle: "Every Change, Tracked",
    intro:
      "Every save creates an immutable version snapshot. Compare any two versions side-by-side with semantic redlining that shows exactly what changed — no more v3_FINAL_final.docx.",
    designedFor:
      "Teams that need a clean audit trail on corporate documents and the confidence that nothing has been silently altered.",
    video: "/videos/version-control.mp4",
    capabilities: [
      {
        icon: "save",
        label: "Immutable version snapshots on every save",
      },
      {
        icon: "compare",
        label: "Side-by-side semantic redline between any two versions",
      },
      {
        icon: "restore",
        label: "Full version history with the ability to restore prior versions",
      },
      {
        icon: "verified_user",
        label: "SHA-256 integrity hashing to verify documents have not been altered",
      },
      {
        icon: "receipt_long",
        label: "Complete audit trail on all document operations",
      },
    ],
  },
  "document-storage": {
    title: "Collaborative Document Editing",
    subtitle: "Work Together, Seamlessly",
    intro:
      "Store generated and uploaded documents in one secure workspace with collaborative editing. Your corporate records — organized, protected, and accessible to the right people.",
    designedFor:
      "Founders managing corporate records, minute books, financing documents, and operational agreements who need controlled access for team members, advisors, investors, and outside counsel.",
    video: "/videos/document-storage.mp4",
    capabilities: [
      {
        icon: "group",
        label: "Collaborative editing — work on the same document with your team in real time",
      },
      {
        icon: "folder_managed",
        label: "Centralized storage for all corporate documents — generated and uploaded",
      },
      {
        icon: "lock",
        label: "Credential-based access control for people inside and outside your organization",
      },
      {
        icon: "visibility",
        label: "Tiered visibility so investors see what investors should see",
      },
      {
        icon: "comment",
        label: "Leave comments, track suggestions, and resolve feedback inline",
      },
      {
        icon: "history",
        label: "Full audit trail on who accessed, edited, or downloaded each document",
      },
    ],
  },
  "e-signatures": {
    title: "DocuSign Integration",
    subtitle: "Draft to Executed, One Click",
    intro:
      "Prepare and send DocuSign signature packages directly from your workspace. Go from draft to executed without switching tabs or chasing down signers.",
    designedFor:
      "Teams closing agreements with employees, investors, vendors, and partners who need predictable execution cycles and fewer handoffs.",
    video: "/videos/e-signature.mp4",
    capabilities: [
      {
        icon: "send",
        label: "Send signature packages directly from the active document",
      },
      {
        icon: "track_changes",
        label: "Track signing status in your document workspace",
      },
      {
        icon: "draw",
        label: "DocuSign integration for industry-standard e-signatures",
      },
      {
        icon: "inventory_2",
        label: "Store executed copies alongside drafts and version history",
      },
      {
        icon: "group",
        label: "Manage counterparties and signing order from one place",
      },
    ],
  },
};

const FOOTER_RESOURCES = [
  { label: "Newsletter", action: "newsletter" },
  { label: "Learn", action: "learn" },
];

const FOOTER_LEGAL = [
  { label: "Privacy Policy", action: "privacy" },
  { label: "Terms of Service", action: "terms" },
];

const FOOTER_SUPPORT = [
  { label: "Contact Us", action: "contact" },
];

const PublicUseCasePage = ({
  onGoHome,
  onViewPricing,
  onViewAbout,
  onViewLearn,
  onSignIn,
  onGetStarted,
  onViewPrivacy,
  onViewTerms,
}) => {
  const footerAction = (action) => {
    switch (action) {
      case "learn": onViewLearn?.(); break;
      case "privacy": onViewPrivacy?.(); break;
      case "terms": onViewTerms?.(); break;
      case "contact": window.location.href = "mailto:louisaiproject@gmail.com"; break;
      case "newsletter": break;
      default: break;
    }
  };

  const { useCaseId } = useParams();
  const useCase = useMemo(() => USE_CASES[useCaseId] ?? null, [useCaseId]);

  if (!useCase) {
    return (
      <div className="usecase">
        <header className="usecase__header">
          <nav className="usecase__nav" aria-label="Main navigation">
            <div className="usecase__nav-left">
              <button
                type="button"
                className="usecase__logo-btn usecase-serif"
                onClick={onGoHome}
                aria-label="LouisAI — go to home"
              >
                LouisAI
              </button>
            </div>
            <div className="usecase__nav-right">
              <button type="button" className="usecase__login-btn" onClick={onSignIn}>
                Log In
              </button>
              <button type="button" className="usecase__cta-btn" onClick={onGetStarted}>
                Get Started
              </button>
            </div>
          </nav>
        </header>
        <main className="usecase__main">
          <section className="usecase__hero">
            <h1 className="usecase__hero-headline usecase-serif">Feature not found</h1>
            <p className="usecase__hero-sub">
              The feature you're looking for doesn't exist. Head back to explore what LouisAI can do.
            </p>
            <button type="button" className="usecase__cta-btn" onClick={onGoHome}>
              Back to Home
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="usecase">
      {/* ── Fixed Glass Header ────────────────────────────────── */}
      <header className="usecase__header">
        <nav className="usecase__nav" aria-label="Main navigation">
          <div className="usecase__nav-left">
            <button
              type="button"
              className="usecase__logo-btn usecase-serif"
              onClick={onGoHome}
              aria-label="LouisAI — go to home"
            >
              LouisAI
            </button>
            <div className="usecase__nav-links">
              <button type="button" className="usecase__nav-link" onClick={onGoHome}>
                Use Cases
              </button>
              <button type="button" className="usecase__nav-link" onClick={onViewPricing}>
                Pricing
              </button>
              <button type="button" className="usecase__nav-link" onClick={onViewLearn}>
                Learn
              </button>
              <button type="button" className="usecase__nav-link" onClick={onViewAbout}>
                About
              </button>
            </div>
          </div>
          <div className="usecase__nav-right">
            <button type="button" className="usecase__login-btn" onClick={onSignIn}>
              Log In
            </button>
            <button type="button" className="usecase__cta-btn" onClick={onGetStarted}>
              Get Started
            </button>
          </div>
        </nav>
      </header>

      <main className="usecase__main">
        {/* ── Breadcrumb ─────────────────────────────────────── */}
        <div className="usecase__breadcrumb">
          <button type="button" className="usecase__breadcrumb-link" onClick={onGoHome}>
            Home
          </button>
          <span className="usecase__breadcrumb-sep" aria-hidden="true">/</span>
          <button type="button" className="usecase__breadcrumb-link" onClick={onGoHome}>
            Use Cases
          </button>
          <span className="usecase__breadcrumb-sep" aria-hidden="true">/</span>
          <span className="usecase__breadcrumb-current">{useCase.title}</span>
        </div>

        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="usecase__hero" aria-label="Use case hero">
          <div className="usecase__hero-badge">{useCase.subtitle}</div>
          <h1 className="usecase__hero-headline usecase-serif">{useCase.title}</h1>
          <p className="usecase__hero-sub">{useCase.intro}</p>
        </section>

        {/* ── Video Player — enlarged ──────────────────────── */}
        <section className="usecase__video-section" aria-label="Demo video">
          <div className="usecase__video-wrap">
            <video
              className="usecase__video"
              src={useCase.video}
              autoPlay
              muted
              loop
              playsInline
              controls
              aria-label={`${useCase.title} demo video`}
            />
          </div>
        </section>

        {/* ── Designed For ──────────────────────────────────── */}
        <section className="usecase__designed-for" aria-label="Designed for">
          <div className="usecase__designed-for-inner">
            <div className="usecase__designed-for-label">
              <span className="material-symbols-outlined" aria-hidden="true">groups</span>
              Designed For
            </div>
            <p className="usecase__designed-for-text">{useCase.designedFor}</p>
          </div>
        </section>

        {/* ── Capabilities ──────────────────────────────────── */}
        <section className="usecase__capabilities" aria-label="Capabilities">
          <h2 className="usecase__section-heading usecase-serif">What You Can Do</h2>
          <div className="usecase__capabilities-grid">
            {useCase.capabilities.map((cap) => (
              <div key={cap.label} className="usecase__capability-card">
                <div className="usecase__capability-icon" aria-hidden="true">
                  <span className="material-symbols-outlined">{cap.icon}</span>
                </div>
                <p className="usecase__capability-label">{cap.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Section ───────────────────────────────────── */}
        <section className="usecase__cta-section" aria-label="Call to action">
          <div className="usecase__cta-card">
            <div className="usecase__cta-lines" aria-hidden="true">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="usecase__cta-line" />
              ))}
            </div>
            <h2 className="usecase__cta-heading usecase-serif">
              Ready to try {useCase.title.toLowerCase()}?
            </h2>
            <p className="usecase__cta-body">
              Start building with LouisAI today — no credit card required.
            </p>
            <button type="button" className="usecase__cta-gold" onClick={onGetStarted}>
              Get Started Free
              <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </button>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="usecase__footer">
        <div className="usecase__footer-inner">
          <div className="usecase__footer-top">
            <div className="usecase__footer-brand">
              <p className="usecase__footer-logo usecase-serif">LouisAI</p>
              <div className="usecase__footer-contact">
                <div className="usecase__footer-contact-item">
                  <span className="material-symbols-outlined" aria-hidden="true">mail</span>
                  louisaiproject@gmail.com
                </div>
                <div className="usecase__footer-contact-item">
                  <span className="material-symbols-outlined" aria-hidden="true">location_on</span>
                  Vancouver, BC
                </div>
              </div>
            </div>
            <nav className="usecase__footer-links" aria-label="Footer navigation">
              <div className="usecase__footer-col">
                <h4 className="usecase__footer-col-heading">Resources</h4>
                <ul>
                  {FOOTER_RESOURCES.map((link) => (
                    <li key={link.label}>
                      <button type="button" className="usecase__footer-link" onClick={() => footerAction(link.action)}>
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="usecase__footer-col">
                <h4 className="usecase__footer-col-heading">Legal</h4>
                <ul>
                  {FOOTER_LEGAL.map((link) => (
                    <li key={link.label}>
                      <button type="button" className="usecase__footer-link" onClick={() => footerAction(link.action)}>
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="usecase__footer-col">
                <h4 className="usecase__footer-col-heading">Support</h4>
                <ul>
                  {FOOTER_SUPPORT.map((link) => (
                    <li key={link.label}>
                      <button type="button" className="usecase__footer-link" onClick={() => footerAction(link.action)}>
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
          <div className="usecase__footer-bottom">
            <p className="usecase__footer-copy">
              &copy; 2026 LouisAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicUseCasePage;
