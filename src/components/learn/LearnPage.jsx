import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PublicPageShell from "../PublicPageShell";
import { learnIndex } from "../../data/learnContent.js";
import LearnErrorBoundary from "./LearnErrorBoundary";
import "./Learn.css";

/**
 * LearnPage — Legal Knowledge Hub.
 *
 * Authenticated view: Stitch-style hub layout rendered directly (no PublicPageShell).
 *   - Hero with pill-shaped search bar
 *   - Sticky filter bar (All / Glossary / Guides pill buttons + topic dropdown)
 *   - Key Terminology 4-column card grid (terms + roles)
 *   - Expert Guides 2-column card grid (document_guides)
 *   - Quick Resource Links 3-column grid
 *
 * Unauthenticated view: original PublicPageShell accordion layout (unchanged UX).
 *
 * Props: isAuthenticated, onGoHome, onViewPricing, onSignIn, onGetStarted, onSignOut
 */

const TYPE_SLUG_MAP = { term: "terms", document_guide: "documents", role: "roles" };

const TYPE_LABEL_MAP = { term: "Term", document_guide: "Guide", role: "Role" };

const CATEGORY_LABEL_MAP = {
  term: "Terminology",
  role: "Corporate Role",
  document_guide: "Document Guide",
};

const FILTER_TABS = [
  { key: "all",       label: "All"      },
  { key: "glossary",  label: "Glossary" },
  { key: "guides",    label: "Guides"   },
];

// Map filter tab keys to entry types
const FILTER_TYPE_MAP = {
  all:      null,
  glossary: ["term", "role"],
  guides:   ["document_guide"],
};

// Gradient placeholders for guide cards — cycles through a small set
const GUIDE_GRADIENTS = [
  "linear-gradient(135deg, #e8e4e0 0%, #ccc8c4 100%)",
  "linear-gradient(135deg, #e2e6eb 0%, #c8cfd8 100%)",
  "linear-gradient(135deg, #ece9e4 0%, #d5d0c9 100%)",
  "linear-gradient(135deg, #e4e8e2 0%, #c8d0c6 100%)",
];

// ─── Unauthenticated: old accordion layout ───────────────────────────────────

const ACCORDION_SECTIONS = [
  { type: "term",           label: "Legal Terms",     filterKey: "terms"     },
  { type: "document_guide", label: "Document Guides", filterKey: "documents" },
  { type: "role",           label: "Corporate Roles", filterKey: "roles"     },
];

const ACCORDION_FILTER_TABS = [
  { key: "all",       label: "All"       },
  { key: "terms",     label: "Terms"     },
  { key: "documents", label: "Documents" },
  { key: "roles",     label: "Roles"     },
];

function UnauthLearnView({ entries, loading, onEntryClick }) {
  const [searchQuery, setSearchQuery]     = useState("");
  const [activeFilter, setActiveFilter]   = useState("all");
  const [expandedSections, setExpandedSections] = useState({
    term: true, document_guide: true, role: true,
  });

  const filtered = useMemo(() => {
    let result = entries;
    if (activeFilter !== "all") {
      const typeMap = { terms: "term", documents: "document_guide", roles: "role" };
      result = result.filter((e) => e.type === typeMap[activeFilter]);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) => {
        const title    = (e.title    || "").toLowerCase();
        const summary  = (e.summary  || "").toLowerCase();
        const synonyms = (e.synonyms || []).join(" ").toLowerCase();
        return title.includes(q) || summary.includes(q) || synonyms.includes(q);
      });
    }
    return result;
  }, [entries, activeFilter, searchQuery]);

  const grouped = useMemo(() => {
    const map = {};
    for (const s of ACCORDION_SECTIONS) {
      map[s.type] = filtered.filter((e) => e.type === s.type);
    }
    return map;
  }, [filtered]);

  const counts = {
    all:       entries.length,
    terms:     entries.filter((e) => e.type === "term").length,
    documents: entries.filter((e) => e.type === "document_guide").length,
    roles:     entries.filter((e) => e.type === "role").length,
  };

  const isSearching     = searchQuery.trim().length > 0;
  const visibleSections = ACCORDION_SECTIONS.filter((s) =>
    activeFilter === "all" ? true : s.filterKey === activeFilter
  );

  return (
    <>
      {/* Hero */}
      <div className="learn-hero">
        <h1 className="learn-hero__title">Learn</h1>
        <p className="learn-hero__subtitle">
          Plain-English explanations of the legal terms, documents, and corporate roles
          that matter at every stage of building a Canadian startup.
        </p>
      </div>

      {/* Search + filters */}
      <div className="learn-search">
        <input
          type="text"
          className="learn-search__input"
          placeholder="Search terms, documents, roles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
        />
        <div className="learn-search__filters">
          {ACCORDION_FILTER_TABS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`learn-search__filter${activeFilter === f.key ? " learn-search__filter--active" : ""}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
              {counts[f.key] != null && (
                <span className="learn-search__filter-count">{counts[f.key]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="learn-loading">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="learn-empty">
          {searchQuery ? `No results for "${searchQuery}"` : "No entries available yet."}
        </div>
      ) : isSearching ? (
        <div className="learn-flat-list">
          {filtered.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="learn-row learn-row--search"
              onClick={() => onEntryClick(entry)}
            >
              <span className="learn-row__title">{entry.title}</span>
              <span className="learn-row__type-label">{TYPE_LABEL_MAP[entry.type] || entry.type}</span>
              {entry.summary && (
                <span className="learn-row__summary">
                  {entry.summary.length > 120
                    ? entry.summary.slice(0, 120) + "..."
                    : entry.summary}
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="learn-accordion">
          {visibleSections.map((section) => {
            const sectionEntries = grouped[section.type] || [];
            if (sectionEntries.length === 0) return null;
            const isOpen = expandedSections[section.type];
            return (
              <div key={section.type} className="learn-section">
                <button
                  type="button"
                  className="learn-section__header"
                  onClick={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      [section.type]: !prev[section.type],
                    }))
                  }
                  aria-expanded={isOpen}
                >
                  <span className="learn-section__title">{section.label}</span>
                  <span className="learn-section__count">{sectionEntries.length}</span>
                  <span className="learn-section__chevron" aria-hidden="true">
                    {isOpen ? "▾" : "▸"}
                  </span>
                </button>
                {isOpen && (
                  <div className="learn-section__content">
                    {sectionEntries.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        className="learn-row"
                        onClick={() => onEntryClick(entry)}
                      >
                        <span className="learn-row__title">{entry.title}</span>
                        {entry.summary && (
                          <span className="learn-row__summary">
                            {entry.summary.length > 120
                              ? entry.summary.slice(0, 120) + "..."
                              : entry.summary}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── Authenticated: Stitch hub layout ────────────────────────────────────────

const TOPIC_OPTIONS = [
  { key: "all",         label: "All Areas" },
  { key: "corporate",   label: "Corporate" },
  { key: "employment",  label: "Employment" },
  { key: "ip",          label: "IP & Technology" },
  { key: "finance",     label: "Finance & Securities" },
  { key: "compliance",  label: "Compliance" },
];

function AuthLearnView({ entries, loading, onEntryClick }) {
  const [heroSearch,   setHeroSearch]   = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTopic,  setActiveTopic]  = useState("all");

  const filtered = useMemo(() => {
    let result = entries;

    // Filter by tab
    const allowedTypes = FILTER_TYPE_MAP[activeFilter];
    if (allowedTypes) {
      result = result.filter((e) => allowedTypes.includes(e.type));
    }

    // Filter by topic
    if (activeTopic !== "all") {
      result = result.filter((e) => {
        const text = [e.title, e.summary, ...(e.synonyms || []), ...(e.tags || [])].join(" ").toLowerCase();
        return text.includes(activeTopic);
      });
    }

    // Search
    if (heroSearch.trim()) {
      const q = heroSearch.toLowerCase();
      result = result.filter((e) => {
        const title    = (e.title    || "").toLowerCase();
        const summary  = (e.summary  || "").toLowerCase();
        const synonyms = (e.synonyms || []).join(" ").toLowerCase();
        return title.includes(q) || summary.includes(q) || synonyms.includes(q);
      });
    }

    return result;
  }, [entries, activeFilter, activeTopic, heroSearch]);

  // Split filtered into terminology (terms + roles) and guides
  const termCards  = filtered.filter((e) => e.type === "term" || e.type === "role");
  const guideCards = filtered.filter((e) => e.type === "document_guide");

  const isFiltering = heroSearch.trim().length > 0 || activeFilter !== "all" || activeTopic !== "all";

  // Decide whether to show a given section based on active filter
  const showTermSection  = activeFilter === "all" || activeFilter === "glossary";
  const showGuideSection = activeFilter === "all" || activeFilter === "guides";

  return (
    <div className="lhub">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="lhub-hero">
        <h1 className="lhub-hero__title">Learn Legal Fundamentals</h1>
        <p className="lhub-hero__subtitle">
          Navigate complex legal concepts with our curated library of terminology and
          expert guides designed for founders building Canadian companies.
        </p>
        <div className="lhub-hero__search-wrap">
          <span className="material-symbols-outlined lhub-hero__search-icon" aria-hidden="true">
            search
          </span>
          <input
            type="text"
            className="lhub-hero__search-input"
            placeholder="Search the library..."
            value={heroSearch}
            onChange={(e) => setHeroSearch(e.target.value)}
            autoComplete="off"
          />
          <button
            type="button"
            className="lhub-hero__search-btn"
            onClick={() => {/* search already live via state */}}
          >
            Search
          </button>
        </div>
      </section>

      {/* ── Filter bar ───────────────────────────────────────────── */}
      <div className="lhub-filter-bar">
        <div className="lhub-filter-bar__pills">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`lhub-filter-bar__pill${activeFilter === tab.key ? " lhub-filter-bar__pill--active" : ""}`}
              onClick={() => setActiveFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="lhub-filter-bar__topic">
          <select
            className="lhub-filter-bar__topic-select"
            value={activeTopic}
            onChange={(e) => setActiveTopic(e.target.value)}
            aria-label="Filter by topic"
          >
            {TOPIC_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                Topic: {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Main content body ────────────────────────────────────── */}
      <div className="lhub-body">
        {loading ? (
          <div className="learn-loading">Loading...</div>
        ) : isFiltering && filtered.length === 0 ? (
          <div className="learn-empty">
            No results for &ldquo;{heroSearch}&rdquo;
          </div>
        ) : (
          <>
            {/* Key Terminology */}
            {showTermSection && termCards.length > 0 && (
              <section className="lhub-section">
                <div className="lhub-section__header">
                  <h2 className="lhub-section__title">Key Terminology</h2>
                  <button
                    type="button"
                    className="lhub-section__link"
                    onClick={() => setActiveFilter("glossary")}
                  >
                    View Full Glossary
                    <span className="material-symbols-outlined lhub-section__link-icon" aria-hidden="true">
                      arrow_forward
                    </span>
                  </button>
                </div>
                <div className="lhub-term-grid">
                  {termCards.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      className="lhub-term-card"
                      onClick={() => onEntryClick(entry)}
                    >
                      <span className="lhub-term-card__badge">
                        {CATEGORY_LABEL_MAP[entry.type] || entry.type}
                      </span>
                      <h3 className="lhub-term-card__title">{entry.title}</h3>
                      {entry.summary && (
                        <p className="lhub-term-card__desc">
                          {entry.summary.length > 140
                            ? entry.summary.slice(0, 140) + "…"
                            : entry.summary}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Expert Guides */}
            {showGuideSection && guideCards.length > 0 && (
              <section className="lhub-section">
                <div className="lhub-section__header">
                  <h2 className="lhub-section__title">Expert Guides</h2>
                  <button
                    type="button"
                    className="lhub-section__link"
                    onClick={() => setActiveFilter("guides")}
                  >
                    Browse All Guides
                    <span className="material-symbols-outlined lhub-section__link-icon" aria-hidden="true">
                      arrow_forward
                    </span>
                  </button>
                </div>
                <div className="lhub-guide-grid">
                  {guideCards.map((entry, idx) => (
                    <button
                      key={entry.id}
                      type="button"
                      className="lhub-guide-card"
                      onClick={() => onEntryClick(entry)}
                    >
                      {/* Gradient image placeholder */}
                      <div
                        className="lhub-guide-card__image"
                        style={{
                          background: GUIDE_GRADIENTS[idx % GUIDE_GRADIENTS.length],
                        }}
                        aria-hidden="true"
                      />
                      <div className="lhub-guide-card__body">
                        <div className="lhub-guide-card__meta">
                          <span className="lhub-guide-card__badge">Document Guide</span>
                          <span className="lhub-guide-card__read-time">
                            <span className="material-symbols-outlined lhub-guide-card__read-icon" aria-hidden="true">
                              schedule
                            </span>
                            8 min read
                          </span>
                        </div>
                        <h3 className="lhub-guide-card__title">{entry.title}</h3>
                        {entry.summary && (
                          <p className="lhub-guide-card__desc">
                            {entry.summary.length > 180
                              ? entry.summary.slice(0, 180) + "…"
                              : entry.summary}
                          </p>
                        )}
                        <span className="lhub-guide-card__cta">
                          Start Learning
                          <span className="material-symbols-outlined lhub-guide-card__cta-icon" aria-hidden="true">
                            arrow_forward
                          </span>
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Quick Resource Links — only shown when not actively filtering */}
            {!isFiltering && (
              <section className="lhub-resources">
                <div className="lhub-resource-card">
                  <span className="material-symbols-outlined lhub-resource-card__icon" aria-hidden="true">
                    library_books
                  </span>
                  <h4 className="lhub-resource-card__title">Legislative Archives</h4>
                  <p className="lhub-resource-card__desc">
                    Access direct links to federal and provincial law databases and recent
                    amendments.
                  </p>
                  <button
                    type="button"
                    className="lhub-resource-card__link"
                    onClick={() => window.open("https://laws-lois.justice.gc.ca/eng/acts/C-44/", "_blank", "noopener")}
                  >
                    Explore Archives
                    <span className="material-symbols-outlined lhub-resource-card__link-icon" aria-hidden="true">
                      open_in_new
                    </span>
                  </button>
                </div>
                <div className="lhub-resource-card">
                  <span className="material-symbols-outlined lhub-resource-card__icon" aria-hidden="true">
                    quiz
                  </span>
                  <h4 className="lhub-resource-card__title">Knowledge Checks</h4>
                  <p className="lhub-resource-card__desc">
                    Test your team&rsquo;s understanding of internal legal procedures and
                    guidelines.
                  </p>
                  <button
                    type="button"
                    className="lhub-resource-card__link"
                    onClick={() => setActiveFilter("glossary")}
                  >
                    Start Assessment
                    <span className="material-symbols-outlined lhub-resource-card__link-icon" aria-hidden="true">
                      play_circle
                    </span>
                  </button>
                </div>
                <div className="lhub-resource-card">
                  <span className="material-symbols-outlined lhub-resource-card__icon" aria-hidden="true">
                    forum
                  </span>
                  <h4 className="lhub-resource-card__title">Q&amp;A Sessions</h4>
                  <p className="lhub-resource-card__desc">
                    View recordings and transcripts from our monthly legal operations
                    seminars.
                  </p>
                  <button
                    type="button"
                    className="lhub-resource-card__link"
                    onClick={() => window.location.href = "mailto:louisaiproject@gmail.com?subject=Q%26A%20Session%20Inquiry"}
                  >
                    Watch Replays
                    <span className="material-symbols-outlined lhub-resource-card__link-icon" aria-hidden="true">
                      movie
                    </span>
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function LearnPage({
  isAuthenticated = false,
  onGoHome,
  onViewPricing,
  onSignIn,
  onGetStarted,
  onSignOut,
}) {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEntries(learnIndex);
    setLoading(false);
  }, []);

  const handleEntryClick = (entry) => {
    const typeSlug = TYPE_SLUG_MAP[entry.type] || "terms";
    navigate(`/learn/${typeSlug}/${entry.slug}`);
  };

  // Both authenticated and unauthenticated views use the same Stitch hub layout.
  // When unauthenticated, wrap in PublicPageShell for the public header/nav.
  const learnContent = (
    <AuthLearnView
      entries={entries}
      loading={loading}
      onEntryClick={handleEntryClick}
    />
  );

  if (isAuthenticated) {
    return (
      <LearnErrorBoundary>
        {learnContent}
      </LearnErrorBoundary>
    );
  }

  const actions = [
    { key: "pricing",    label: "Pricing",    onClick: onViewPricing },
    { key: "sign-in",    label: "Sign In",    onClick: onSignIn },
    { key: "start-free", label: "Start Free", onClick: onGetStarted, className: "header-actions__cta" },
  ];

  return (
    <LearnErrorBoundary>
      <PublicPageShell
        pageClassName="learn-page"
        headerClassName="learn-page__header"
        contentClassName="learn-page__content"
        onGoHome={onGoHome}
        actions={actions}
      >
        {learnContent}
      </PublicPageShell>
    </LearnErrorBoundary>
  );
}
