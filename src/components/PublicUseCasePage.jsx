import { useMemo } from "react";
import { useParams } from "react-router-dom";
import PublicPageShell from "./PublicPageShell";

const USE_CASES = {
  "ai-drafting": {
    title: "AI-Assisted Legal Drafting",
    intro:
      "Precedent-backed clause generation drawn from 170,000+ real clauses. Draft, rewrite, and assemble legal documents with AI that knows the needs of Canadian founders.",
    designedFor:
      "Founders, operations leads, and in-house teams that need to move faster on routine corporate documents without starting from scratch every time.",
    video: "/videos/Ai-Drafting-SHORT.mp4",
    capabilities: [
      "Precedent-backed drafting — language grounded in real transaction data, not generic AI output",
      "Rewrite and explain selected clauses in plain English for internal review",
      "Full draft assembly from 100+ curated legal templates",
      "Auto-fill company details with mail merge across any template",
      "Context-aware suggestions using your stored company data",
    ],
  },
  "secure-repository": {
    title: "Version Control & Redline",
    intro:
      "Every save creates an immutable version snapshot. Compare any two versions side-by-side with semantic redlining that shows exactly what changed.",
    designedFor:
      "Teams that need a clean audit trail on corporate documents — no more emailing v3_FINAL_final.docx back and forth.",
    video: "/videos/version-control-SHORT.mp4",
    capabilities: [
      "Immutable version snapshots on every save",
      "Side-by-side semantic redline between any two versions",
      "Full version history with the ability to restore prior versions",
      "SHA-256 integrity hashing to verify documents have not been altered",
      "Audit trail on all document operations",
    ],
  },
  "document-storage": {
    title: "Secure Document Storage",
    intro:
      "Store generated and uploaded documents in one secure workspace. Your corporate records — organized, protected, and accessible to the right people.",
    designedFor:
      "Founders managing corporate records, minute books, financing documents, and operational agreements who need controlled access for team members, advisors, investors, and outside counsel.",
    video: "/videos/document-storage-SHORT.mp4",
    capabilities: [
      "Centralized storage for all corporate documents — generated and uploaded",
      "Credential-based access control for people inside and outside your organization",
      "Tiered visibility so investors see what investors should see, and counsel sees what counsel needs",
      "Secure upload of existing documents alongside LouisAI-generated files",
      "Organized workspace that replaces scattered folders, shared drives, and email attachments",
      "Full audit trail on who accessed, edited, or downloaded each document",
    ],
  },
  "e-signatures": {
    title: "E-Signature Integration",
    intro:
      "Prepare and send DocuSign signature packages directly from your workspace. Go from draft to executed without switching tabs.",
    designedFor:
      "Teams closing agreements with employees, investors, vendors, and partners who need predictable execution cycles and fewer handoffs.",
    video: "/videos/e-signature-SHORT.mp4",
    capabilities: [
      "Send signature packages directly from the active document",
      "Track signing status in your document workspace",
      "DocuSign integration for industry-standard e-signatures",
      "Store executed copies alongside drafts and version history",
      "Manage counterparties and signing order from one place",
    ],
  },
};

const PublicUseCasePage = ({
  onGoHome,
  onViewPricing,
  onViewAbout,
  onGetStarted,
}) => {
  const { useCaseId } = useParams();

  const useCase = useMemo(() => USE_CASES[useCaseId] ?? null, [useCaseId]);
  const actions = [
    {
      key: "pricing",
      label: "Pricing",
      onClick: onViewPricing,
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

  if (!useCase) {
    return (
      <PublicPageShell onGoHome={onGoHome} actions={actions}>
          <section className="public-pricing__hero public-reveal">
            <h1>Use case not found.</h1>
            <p>Choose another feature from the landing page.</p>
            <div className="public-landing__cta-row">
              <button type="button" className="pill-button primary-button" onClick={onGoHome}>
                Back to Home
              </button>
            </div>
          </section>
      </PublicPageShell>
    );
  }

  return (
    <PublicPageShell onGoHome={onGoHome} actions={actions}>
        <section className="public-pricing__hero public-reveal">
          <h1>{useCase.title}</h1>
          <p>{useCase.intro}</p>
        </section>

        <section className="public-use-case__video-section public-reveal public-reveal--delay-1">
          <div className="public-use-case__video-wrap">
            <video
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

        <section className="public-use-case__section public-reveal public-reveal--delay-2">
          <h2>Designed For</h2>
          <p>{useCase.designedFor}</p>
        </section>

        <section className="public-use-case__section public-reveal public-reveal--delay-3">
          <h2>What You Can Do</h2>
          <ul className="public-use-case__list">
            {useCase.capabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="public-use-case__section public-reveal">
          <div className="public-landing__cta-row">
            <button type="button" className="pill-button primary-button" onClick={onGetStarted}>
              Get Started
            </button>
            <button type="button" className="pill-button" onClick={onGoHome}>
              Back to Home
            </button>
          </div>
        </section>
    </PublicPageShell>
  );
};

export default PublicUseCasePage;
