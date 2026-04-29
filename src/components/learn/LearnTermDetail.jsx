import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PublicPageShell from "../PublicPageShell";
import { getLearnEntry } from "../../data/learnContent.js";
import LearnRelatedTemplates from "./LearnRelatedTemplates";
import LearnEntryCard from "./LearnEntryCard";
import LearnErrorBoundary from "./LearnErrorBoundary";
import useLearnIndex from "./useLearnIndex.js";
import LinkedText from "./LinkedText.jsx";
import "./Learn.css";

/**
 * LearnEntryDetail — full detail page for any Learn entry type (terms, documents, roles).
 * Route: /learn/:type/:slug
 */

const TYPE_BADGE_LABELS = {
  terms: "Term",
  documents: "Document",
  roles: "Role",
};

const TYPE_BADGE_CLASSES = {
  terms: "learn-card__badge--term",
  documents: "learn-card__badge--document_guide",
  roles: "learn-card__badge--role",
};

function LearnTermDetailInner({
  isAuthenticated = false,
  onGoHome,
  onViewPricing,
  onSignIn,
  onGetStarted,
  onSignOut,
}) {
  const { type = "terms", slug } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFormal, setShowFormal] = useState(false);

  // Build the entity map for auto-linking prose fields
  const { entityMap } = useLearnIndex();

  // Helper: render a prose text field with inline entity links
  const renderLinked = (text) =>
    text ? <LinkedText text={text} entityMap={entityMap} excludeSlug={slug} /> : null;

  useEffect(() => {
    setLoading(true);
    setEntry(getLearnEntry(type, slug));
    setLoading(false);
  }, [type, slug]);

  const actions = isAuthenticated
    ? [
        { key: "workspace", label: "Workspace", onClick: onGoHome },
        { key: "sign-out", label: "Sign Out", onClick: onSignOut },
      ]
    : [
        { key: "pricing", label: "Pricing", onClick: onViewPricing },
        { key: "sign-in", label: "Sign In", onClick: onSignIn },
        { key: "start-free", label: "Start Free", onClick: onGetStarted, className: "header-actions__cta" },
      ];

  if (loading) {
    return (
      <PublicPageShell
        pageClassName="learn-page"
        headerClassName="learn-page__header"
        contentClassName="learn-page__content"
        onGoHome={onGoHome}
        actions={actions}
      >
        <div className="learn-loading">Loading...</div>
      </PublicPageShell>
    );
  }

  if (!entry) {
    return (
      <PublicPageShell
        pageClassName="learn-page"
        headerClassName="learn-page__header"
        contentClassName="learn-page__content"
        onGoHome={onGoHome}
        actions={actions}
      >
        <div className="learn-empty">
          <h2>Term not found</h2>
          <button
            type="button"
            className="learn-back-link"
            onClick={() => navigate("/learn")}
          >
            Back to Learn
          </button>
        </div>
      </PublicPageShell>
    );
  }

  return (
    <PublicPageShell
      pageClassName="learn-page"
      headerClassName="learn-page__header"
      contentClassName="learn-page__content"
      onGoHome={onGoHome}
      actions={actions}
    >
      <button
        type="button"
        className="learn-back-link"
        onClick={() => navigate("/learn")}
      >
        &larr; Back to Learn
      </button>

      <article className="learn-detail">
        <header className="learn-detail__header">
          <span className={`learn-card__badge ${TYPE_BADGE_CLASSES[type] || "learn-card__badge--term"}`}>
            {TYPE_BADGE_LABELS[type] || "Term"}
          </span>
          <h1 className="learn-detail__title">{entry.term || entry.title || entry.role || entry.name}</h1>
        </header>

        {/* ── TERM SECTIONS ──────────────────────────────── */}

        {/* Plain-English definition (terms) */}
        {entry.definition && (
          <section className="learn-detail__section">
            <p className="learn-detail__definition">{renderLinked(entry.definition)}</p>
          </section>
        )}

        {/* Formal definition toggle (terms) */}
        {entry.formalDefinition && (
          <section className="learn-detail__section learn-detail__section--formal">
            <button
              type="button"
              className="learn-detail__toggle"
              onClick={() => setShowFormal((prev) => !prev)}
            >
              {showFormal ? "Hide" : "Show"} formal definition
            </button>
            {showFormal && (
              <p className="learn-detail__formal">{renderLinked(entry.formalDefinition)}</p>
            )}
          </section>
        )}

        {/* Synonyms (terms) */}
        {entry.synonyms?.length > 0 && (
          <section className="learn-detail__section">
            <h2 className="learn-detail__section-title">Also known as</h2>
            <div className="learn-detail__pills">
              {entry.synonyms.map((s) => (
                <span key={s} className="learn-detail__pill">{s}</span>
              ))}
            </div>
          </section>
        )}

        {/* Related phrases (terms) */}
        {entry.relatedPhrases?.length > 0 && (
          <section className="learn-detail__section">
            <h2 className="learn-detail__section-title">Common contract phrases</h2>
            <div className="learn-detail__pills learn-detail__pills--muted">
              {entry.relatedPhrases.map((p) => (
                <span key={p} className="learn-detail__pill learn-detail__pill--muted">{p}</span>
              ))}
            </div>
          </section>
        )}

        {/* When you'll see this (terms) */}
        {entry.whenYouSeeThis && (
          <section className="learn-detail__section">
            <h2 className="learn-detail__section-title">When you'll see this</h2>
            <p className="learn-detail__text">{renderLinked(entry.whenYouSeeThis)}</p>
          </section>
        )}

        {/* ── DOCUMENT GUIDE SECTIONS ────────────────────── */}

        {/* Summary (document guides — lead paragraph) */}
        {entry.type === "document_guide" && entry.summary && (
          <section className="learn-detail__section">
            <p className="learn-detail__definition">{renderLinked(entry.summary)}</p>
          </section>
        )}

        {/* What it is (document guides) */}
        {entry.whatItIs && (
          <section className="learn-detail__section">
            <h2 className="learn-detail__section-title">What it is</h2>
            <p className="learn-detail__text">{renderLinked(entry.whatItIs)}</p>
          </section>
        )}

        {/* When to use (document guides) */}
        {entry.whenToUse && (
          <section className="learn-detail__section">
            <h2 className="learn-detail__section-title">When to use it</h2>
            <p className="learn-detail__text">{renderLinked(entry.whenToUse)}</p>
          </section>
        )}

        {/* Why it matters (document guides) */}
        {entry.whyItMatters && (
          <section className="learn-detail__section">
            <h2 className="learn-detail__section-title">Why it matters</h2>
            <p className="learn-detail__text">{renderLinked(entry.whyItMatters)}</p>
          </section>
        )}

        {/* Key terms (document guides) */}
        {entry.keyTerms?.length > 0 && (
          <section className="learn-detail__section">
            <h2 className="learn-detail__section-title">Key terms</h2>
            <div className="learn-detail__pills">
              {entry.keyTerms.map((kt) => (
                <button
                  key={kt.termSlug}
                  type="button"
                  className="learn-detail__pill learn-detail__pill--link"
                  onClick={() => navigate(`/learn/terms/${kt.termSlug}`)}
                >
                  {kt.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── ROLE SECTIONS ──────────────────────────────── */}

        {/* Summary (roles — lead paragraph) */}
        {entry.type === "role" && entry.summary && (
          <section className="learn-detail__section">
            <p className="learn-detail__definition">{renderLinked(entry.summary)}</p>
          </section>
        )}

        {/* What they do (roles) */}
        {entry.whatTheyDo && (
          <section className="learn-detail__section">
            <h2 className="learn-detail__section-title">What they do</h2>
            <p className="learn-detail__text">{renderLinked(entry.whatTheyDo)}</p>
          </section>
        )}

        {/* Legal duties (roles) */}
        {entry.legalDuties?.length > 0 && (
          <section className="learn-detail__section">
            <h2 className="learn-detail__section-title">Legal duties</h2>
            <div className="learn-detail__duties">
              {entry.legalDuties.map((d, i) => (
                <div key={i} className="learn-detail__duty">
                  <h3 className="learn-detail__duty-name">{d.duty}</h3>
                  <p className="learn-detail__duty-desc">{renderLinked(d.description)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Qualifications (roles) */}
        {entry.qualifications && (
          <section className="learn-detail__section">
            <h2 className="learn-detail__section-title">Qualifications</h2>
            <p className="learn-detail__text">{renderLinked(entry.qualifications)}</p>
          </section>
        )}

        {/* Common documents (roles) */}
        {entry.commonDocuments?.length > 0 && (
          <section className="learn-detail__section">
            <h2 className="learn-detail__section-title">Common documents</h2>
            <div className="learn-detail__pills learn-detail__pills--muted">
              {entry.commonDocuments.map((doc) => (
                <span key={doc} className="learn-detail__pill learn-detail__pill--muted">{doc}</span>
              ))}
            </div>
          </section>
        )}

        {/* ── SHARED SECTIONS (all types) ────────────────── */}

        {/* Applicable jurisdictions */}
        {entry.applicableJurisdictions?.length > 0 && (
          <section className="learn-detail__section">
            <h2 className="learn-detail__section-title">Applicable jurisdictions</h2>
            <div className="learn-detail__pills learn-detail__pills--muted">
              {entry.applicableJurisdictions.map((j) => (
                <span key={j} className="learn-detail__pill learn-detail__pill--muted">{j}</span>
              ))}
            </div>
          </section>
        )}

        {/* Founder Note (terms + roles) */}
        {entry.founderNote && (
          <section className="learn-detail__callout">
            <h2 className="learn-detail__callout-title">Founder Note</h2>
            <p className="learn-detail__text">{renderLinked(entry.founderNote)}</p>
          </section>
        )}

        {/* Related templates */}
        {entry.relatedTemplateIds?.length > 0 && (
          <LearnRelatedTemplates
            templateIds={entry.relatedTemplateIds}
            isAuthenticated={isAuthenticated}
            onSignIn={onSignIn}
          />
        )}

        {/* Referenced by (backlinks) */}
        {entry.backlinks?.length > 0 && (
          <section className="learn-detail__section">
            <h2 className="learn-detail__section-title">Referenced by</h2>
            <div className="learn-backlinks">
              {entry.backlinks.map((bl) => (
                <button
                  key={`${bl.type}-${bl.slug}`}
                  type="button"
                  className="learn-backlink"
                  onClick={() => navigate(`/learn/${bl.type}/${bl.slug}`)}
                >
                  <span className={`learn-card__badge learn-card__badge--${bl.entryType}`}>
                    {bl.entryType === "term" ? "Term" : bl.entryType === "document_guide" ? "Document" : "Role"}
                  </span>
                  <span className="learn-backlink__title">{bl.title}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Related terms */}
        {entry.relatedTermSlugs?.length > 0 && (
          <section className="learn-detail__section">
            <h2 className="learn-detail__section-title">Related terms</h2>
            <div className="learn-grid learn-grid--compact">
              {entry.relatedTermSlugs.map((relSlug) => (
                <LearnEntryCard
                  key={relSlug}
                  entry={{ id: relSlug, type: "term", slug: relSlug, title: relSlug.replace(/-/g, " ") }}
                  onClick={() => navigate(`/learn/terms/${relSlug}`)}
                  compact
                />
              ))}
            </div>
          </section>
        )}

        {/* Related document guides (terms + roles can link to doc guides) */}
        {entry.relatedDocumentGuideSlugs?.length > 0 && (
          <section className="learn-detail__section">
            <h2 className="learn-detail__section-title">Related documents</h2>
            <div className="learn-grid learn-grid--compact">
              {entry.relatedDocumentGuideSlugs.map((docSlug) => (
                <LearnEntryCard
                  key={docSlug}
                  entry={{ id: docSlug, type: "document_guide", slug: docSlug, title: docSlug.replace(/-/g, " ") }}
                  onClick={() => navigate(`/learn/documents/${docSlug}`)}
                  compact
                />
              ))}
            </div>
          </section>
        )}

        {/* Related roles */}
        {entry.relatedRoleSlugs?.length > 0 && (
          <section className="learn-detail__section">
            <h2 className="learn-detail__section-title">Related roles</h2>
            <div className="learn-grid learn-grid--compact">
              {entry.relatedRoleSlugs.map((roleSlug) => (
                <LearnEntryCard
                  key={roleSlug}
                  entry={{ id: roleSlug, type: "role", slug: roleSlug, title: roleSlug.replace(/-/g, " ") }}
                  onClick={() => navigate(`/learn/roles/${roleSlug}`)}
                  compact
                />
              ))}
            </div>
          </section>
        )}
      </article>
    </PublicPageShell>
  );
}

export default function LearnTermDetail(props) {
  return (
    <LearnErrorBoundary>
      <LearnTermDetailInner {...props} />
    </LearnErrorBoundary>
  );
}
