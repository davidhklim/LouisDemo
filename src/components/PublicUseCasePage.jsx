import { lazy, Suspense, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FEATURE_IDS,
  FEATURE_IDS_BY_SLUG,
  FEATURES_BY_ID,
} from "../data/features";
import "./PublicUseCasePage.css";

// Lazy-loaded to keep the initial bundle small. Only loaded when someone
// lands on the AI Drafting use case page.
const LiveFeatureDemo = lazy(() => import("./demos/LiveFeatureDemo"));

// Scripted-scene driver for the other 8 demos. Shares the frame + state
// machine + fetch stub + narration card with LiveFeatureDemo.
const LiveScenarioDemo = lazy(() => import("./demos/LiveScenarioDemo"));

const AI_DRAFTING_LIVE = new Set(["ai-drafting"]);

const SCENARIO_LIVE = new Set([
  "document-storage",
  "secure-repository",
  "e-signatures",
  "mail-merge",
  "template-library",
  "company-data",
  "minutebook",
  "data-room",
]);

// Single source of truth: shared features data.
const USE_CASES = FEATURES_BY_ID;

const scrollPageToTop = () => {
  if (typeof window === "undefined") return;

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  const targets = [
    document.scrollingElement,
    document.documentElement,
    document.body,
    document.getElementById("root"),
  ].filter(Boolean);

  targets.forEach((target) => {
    target.scrollTop = 0;
    target.scrollLeft = 0;
  });
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
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
  onViewUseCases,
  onOpenUseCase,
  onViewPricing,
  onViewAbout,
  onViewLearn,
  onSignIn,
  onGetStarted,
  onViewPrivacy,
  onViewTerms,
}) => {
  const navigate = useNavigate();
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
  const featureId = FEATURE_IDS_BY_SLUG[useCaseId] ?? useCaseId;
  const useCase = useMemo(() => USE_CASES[featureId] ?? null, [featureId]);
  const currentFeatureIndex = FEATURE_IDS.indexOf(featureId);
  const previousFeature = currentFeatureIndex >= 0
    ? USE_CASES[FEATURE_IDS[(currentFeatureIndex - 1 + FEATURE_IDS.length) % FEATURE_IDS.length]]
    : null;
  const nextFeature = currentFeatureIndex >= 0
    ? USE_CASES[FEATURE_IDS[(currentFeatureIndex + 1) % FEATURE_IDS.length]]
    : null;
  const featurePosition = currentFeatureIndex >= 0 ? currentFeatureIndex + 1 : 0;

  useEffect(() => {
    const canonicalSlug = useCase?.slug ?? useCase?.id;
    if (canonicalSlug && useCaseId !== canonicalSlug) {
      navigate(`/use-case/${canonicalSlug}`, { replace: true });
      return;
    }
    scrollPageToTop();
    window.requestAnimationFrame(scrollPageToTop);
    window.setTimeout(scrollPageToTop, 80);
    window.setTimeout(scrollPageToTop, 250);
  }, [featureId, navigate, useCase, useCaseId]);

  const openFeature = (featureId) => {
    if (!featureId || featureId === useCase?.id) return;
    scrollPageToTop();
    onOpenUseCase?.(featureId);
    window.requestAnimationFrame(scrollPageToTop);
    window.setTimeout(scrollPageToTop, 80);
    window.setTimeout(scrollPageToTop, 250);
  };

  const viewAllUseCases = () => {
    scrollPageToTop();
    onViewUseCases?.();
  };

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
    <div className="usecase" key={featureId}>
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
              <button type="button" className="usecase__nav-link" onClick={viewAllUseCases}>
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
          <button type="button" className="usecase__breadcrumb-link" onClick={viewAllUseCases}>
            Use Cases
          </button>
          <span className="usecase__breadcrumb-sep" aria-hidden="true">/</span>
          <span className="usecase__breadcrumb-current">{useCase.title}</span>
        </div>

        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="usecase__hero" aria-label="Use case hero">
          <div className="usecase__hero-badges">
            <div className="usecase__hero-badge">{useCase.subtitle}</div>
          </div>
          <h1 className="usecase__hero-headline usecase-serif">{useCase.title}</h1>
          <p className="usecase__hero-sub">{useCase.intro}</p>
        </section>

        {/* ── Interactive Demo (all 9 features have one) ────── */}
        <section
          className="usecase__video-section usecase__video-section--demo"
          aria-label="Interactive demo"
        >
          <Suspense
            fallback={
              <div
                style={{
                  width: "100%",
                  maxWidth: 1240,
                  margin: "0 auto",
                  minHeight: 620,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fff",
                  borderRadius: 18,
                  border: "1px solid rgba(18,18,18,0.08)",
                  boxShadow: "0 24px 60px -20px rgba(18,18,18,0.18)",
                  color: "#777",
                  fontSize: 13,
                }}
              >
                Loading live demo…
              </div>
            }
          >
            {AI_DRAFTING_LIVE.has(featureId) ? (
              <LiveFeatureDemo demoId={featureId} />
            ) : SCENARIO_LIVE.has(featureId) ? (
              <LiveScenarioDemo demoId={featureId} />
            ) : null}
          </Suspense>
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

        <section className="usecase__feature-nav" aria-label="Feature navigation">
          <div className="usecase__feature-nav-heading">
            <span className="usecase__feature-nav-count">
              Feature {featurePosition} of {FEATURE_IDS.length}
            </span>
            <h2 className="usecase__feature-nav-title usecase-serif">
              Explore more features
            </h2>
          </div>

          <div className="usecase__feature-nav-actions">
            {previousFeature ? (
              <button
                type="button"
                className="usecase__feature-nav-button usecase__feature-nav-button--previous"
                onClick={() => openFeature(previousFeature.id)}
                aria-label={`Previous feature: ${previousFeature.title}`}
              >
                <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
                <span className="usecase__feature-nav-copy">
                  <span className="usecase__feature-nav-kicker">Previous Feature</span>
                  <span className="usecase__feature-nav-name">
                    {previousFeature.shortTitle ?? previousFeature.title}
                  </span>
                </span>
              </button>
            ) : null}

            <button
              type="button"
              className="usecase__feature-nav-home"
              onClick={viewAllUseCases}
              aria-label="View all use cases"
            >
              <span className="material-symbols-outlined" aria-hidden="true">apps</span>
              <span>All Use Cases</span>
            </button>

            {nextFeature ? (
              <button
                type="button"
                className="usecase__feature-nav-button usecase__feature-nav-button--next"
                onClick={() => openFeature(nextFeature.id)}
                aria-label={`Next feature: ${nextFeature.title}`}
              >
                <span className="usecase__feature-nav-copy">
                  <span className="usecase__feature-nav-kicker">Next Feature</span>
                  <span className="usecase__feature-nav-name">
                    {nextFeature.shortTitle ?? nextFeature.title}
                  </span>
                </span>
                <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
              </button>
            ) : null}
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
