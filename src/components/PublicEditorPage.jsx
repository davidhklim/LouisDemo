import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FULL_TIME_EMPLOYMENT_BC_DOCUMENT,
  FULL_TIME_EMPLOYMENT_BC_TITLE,
  FULL_TIME_EMPLOYMENT_BC_PLACEHOLDER_COUNT,
} from "./demos/demoDocuments/fullTimeEmploymentBC.js";
import "./PublicEditorPage.css";

/**
 * PublicEditorPage — Scripted "editor" surface for the Investor-webpage.
 *
 * SECURITY (Tier 1 audit findings H-3 / A-6): this is NOT the real
 * LouisAI editor and must never import from `wireframe-app/client/src`
 * or `shared/`. Every visible UI element is a hand-authored visual
 * approximation of the editor chrome (toolbar, side rail, document
 * canvas, assistant panel) with no editing capability behind it. The
 * "document" is plain rendered HTML driven by the fullTimeEmploymentBC
 * fixture — no contenteditable, no command stack, no schema.
 *
 * Visitors arrive here from the Template Library demo when they click
 * "Use Template". The intent is to show the next product surface the
 * user would land in inside the real product, so the demo's narrative
 * "from template to editable document" is visually closed.
 *
 * Future work: when the real editor is open-sourced or has a public
 * preview build, swap this for a thin wrapper with feature flags. Until
 * then, treat this as a marketing surface only.
 */

const PLACEHOLDER_REGEX = /\{[A-Z][A-Z0-9 _-]*\}/g;

/**
 * Render a paragraph string with each {PLACEHOLDER} marked up as a pill.
 * Pure function so we can keep the page component lean.
 */
const renderParagraph = (text, key) => {
  // Split the paragraph into alternating literal and placeholder pieces.
  // RegExp.matchAll is well-supported in our Vite/Node baseline.
  const pieces = [];
  let last = 0;
  for (const match of text.matchAll(PLACEHOLDER_REGEX)) {
    if (match.index > last) {
      pieces.push({ kind: "text", value: text.slice(last, match.index) });
    }
    pieces.push({ kind: "placeholder", value: match[0] });
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    pieces.push({ kind: "text", value: text.slice(last) });
  }

  return (
    <p className="editor-doc__para" key={key}>
      {pieces.map((piece, i) =>
        piece.kind === "placeholder" ? (
          <span
            key={`${key}-ph-${i}`}
            className="editor-doc__placeholder"
            title="Placeholder — fillable via Mail Merge"
          >
            {piece.value}
          </span>
        ) : (
          <span key={`${key}-t-${i}`}>{piece.value}</span>
        ),
      )}
    </p>
  );
};

const PublicEditorPage = () => {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const [savedAt] = useState("just now");

  // Scroll to the top whenever the page mounts so visitors see the
  // document title first, not a mid-document position from the back nav.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reserved for future per-template branching — today only the BC
  // employment agreement template has scripted content. Other ids fall
  // back to the same fixture so the page never errors out.
  const _unusedTemplateId = templateId;
  void _unusedTemplateId;

  return (
    <div className="editor-page">
      {/* ── Top chrome ──────────────────────────────────────── */}
      <header className="editor-page__chrome">
        <div className="editor-page__chrome-left">
          <button
            type="button"
            className="editor-page__back-btn"
            onClick={() => navigate("/")}
            aria-label="Back to home"
          >
            <span className="editor-page__back-arrow" aria-hidden="true">
              ←
            </span>
            <span>Back to home</span>
          </button>
          <span className="editor-page__divider" aria-hidden="true" />
          <div className="editor-page__file-meta">
            <div className="editor-page__file-name">
              {FULL_TIME_EMPLOYMENT_BC_TITLE} · Draft
            </div>
            <div className="editor-page__file-status">
              <span
                className="editor-page__file-status-dot"
                aria-hidden="true"
              />
              Saved {savedAt} · {FULL_TIME_EMPLOYMENT_BC_PLACEHOLDER_COUNT}{" "}
              placeholders detected
            </div>
          </div>
        </div>
        <div className="editor-page__chrome-right">
          <button type="button" className="editor-page__chip" disabled>
            Mail Merge
          </button>
          <button type="button" className="editor-page__chip" disabled>
            Compare Versions
          </button>
          <button type="button" className="editor-page__chip" disabled>
            Comments
          </button>
          <button
            type="button"
            className="editor-page__chip editor-page__chip--primary"
            disabled
          >
            Send for Signature
          </button>
        </div>
      </header>

      {/* ── Toolbar (visual only) ──────────────────────────── */}
      <div className="editor-page__toolbar" aria-hidden="true">
        <div className="editor-page__toolbar-group">
          <span className="editor-page__toolbar-btn">Aa</span>
          <span className="editor-page__toolbar-btn">B</span>
          <span className="editor-page__toolbar-btn">I</span>
          <span className="editor-page__toolbar-btn">U</span>
        </div>
        <div className="editor-page__toolbar-divider" />
        <div className="editor-page__toolbar-group">
          <span className="editor-page__toolbar-btn">¶</span>
          <span className="editor-page__toolbar-btn">≡</span>
          <span className="editor-page__toolbar-btn">⇌</span>
        </div>
        <div className="editor-page__toolbar-divider" />
        <div className="editor-page__toolbar-group">
          <span className="editor-page__toolbar-btn">⚖</span>
          <span className="editor-page__toolbar-btn">✎</span>
        </div>
      </div>

      {/* ── Main split: rail + canvas + assistant ──────────── */}
      <main className="editor-page__main">
        <aside className="editor-page__rail">
          <div className="editor-page__rail-eyebrow">Sections</div>
          <ul className="editor-page__rail-list">
            {FULL_TIME_EMPLOYMENT_BC_DOCUMENT.filter((s) => s.heading).map(
              (s, i) => (
                <li key={`rail-${i}`} className="editor-page__rail-item">
                  {s.heading}
                </li>
              ),
            )}
          </ul>
          <div className="editor-page__rail-eyebrow editor-page__rail-eyebrow--mt">
            Mail merge fields
          </div>
          <div className="editor-page__rail-mm">
            {FULL_TIME_EMPLOYMENT_BC_PLACEHOLDER_COUNT} unfilled · ready
          </div>
        </aside>

        <section className="editor-page__canvas">
          <article className="editor-doc">
            <div className="editor-doc__title">
              {FULL_TIME_EMPLOYMENT_BC_TITLE.toUpperCase()}
            </div>
            <div className="editor-doc__subtitle">
              Between{" "}
              <span className="editor-doc__placeholder">
                {"{COMPANY LEGAL NAME}"}
              </span>{" "}
              and{" "}
              <span className="editor-doc__placeholder">
                {"{EMPLOYEE NAME}"}
              </span>
            </div>

            {FULL_TIME_EMPLOYMENT_BC_DOCUMENT.map((section, idx) => (
              <section
                key={`sec-${idx}`}
                className="editor-doc__section"
              >
                {section.heading ? (
                  <h2 className="editor-doc__heading">{section.heading}</h2>
                ) : null}
                {section.paragraphs.map((p, pi) =>
                  renderParagraph(p, `p-${idx}-${pi}`),
                )}
              </section>
            ))}

            <div className="editor-doc__signature-block">
              <div className="editor-doc__sig-row">
                <div className="editor-doc__sig-line">
                  <div className="editor-doc__sig-line-bar" aria-hidden="true" />
                  <div className="editor-doc__sig-line-label">
                    Authorized Signatory · {"{COMPANY LEGAL NAME}"}
                  </div>
                </div>
                <div className="editor-doc__sig-line">
                  <div className="editor-doc__sig-line-bar" aria-hidden="true" />
                  <div className="editor-doc__sig-line-label">
                    {"{EMPLOYEE NAME}"}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>

        <aside className="editor-page__assistant">
          <div className="editor-page__assistant-header">
            <span
              className="editor-page__assistant-dot"
              aria-hidden="true"
            />
            <div className="editor-page__assistant-title">Louis AI</div>
            <div className="editor-page__assistant-sub">
              Drafting mode · BC employment
            </div>
          </div>

          <div className="editor-page__assistant-card">
            <div className="editor-page__assistant-eyebrow">Suggestions</div>
            <ul className="editor-page__assistant-list">
              <li>
                <span className="editor-page__assistant-list-num">1</span>
                Tighten the IP assignment to call out moral rights waiver
              </li>
              <li>
                <span className="editor-page__assistant-list-num">2</span>
                Add a statutory holiday entitlement clause (BC ESA)
              </li>
              <li>
                <span className="editor-page__assistant-list-num">3</span>
                Insert a probation period (3 months) under Section 5
              </li>
            </ul>
          </div>

          <div className="editor-page__assistant-card editor-page__assistant-card--mm">
            <div className="editor-page__assistant-eyebrow">Mail merge</div>
            <div className="editor-page__assistant-mm-line">
              <span>{"{COMPANY LEGAL NAME}"}</span>
              <span aria-hidden="true">→</span>
              <span>Lakeview Robotics Inc.</span>
            </div>
            <div className="editor-page__assistant-mm-line">
              <span>{"{EMPLOYEE NAME}"}</span>
              <span aria-hidden="true">→</span>
              <span>Priya Iyer</span>
            </div>
            <div className="editor-page__assistant-mm-line">
              <span>{"{BASE SALARY}"}</span>
              <span aria-hidden="true">→</span>
              <span>$135,000 CAD</span>
            </div>
            <button
              type="button"
              className="editor-page__assistant-fill-btn"
              disabled
            >
              Fill {FULL_TIME_EMPLOYMENT_BC_PLACEHOLDER_COUNT} placeholders
            </button>
          </div>

          <button
            type="button"
            className="editor-page__assistant-back"
            onClick={() => navigate(-1)}
          >
            ← Back to template library
          </button>
        </aside>
      </main>

      {/* ── Status bar ─────────────────────────────────────── */}
      <footer className="editor-page__statusbar" aria-label="Status">
        <span className="editor-page__statusbar-item">
          <span
            className="editor-page__statusbar-dot"
            aria-hidden="true"
          />
          Connected
        </span>
        <span className="editor-page__statusbar-sep" aria-hidden="true">
          ·
        </span>
        <span className="editor-page__statusbar-item">
          {FULL_TIME_EMPLOYMENT_BC_DOCUMENT.length} sections
        </span>
        <span className="editor-page__statusbar-sep" aria-hidden="true">
          ·
        </span>
        <span className="editor-page__statusbar-item">
          Track changes off
        </span>
        <span className="editor-page__statusbar-spacer" aria-hidden="true" />
        <span className="editor-page__statusbar-item">
          BC · Canadian English
        </span>
      </footer>
    </div>
  );
};

export default PublicEditorPage;
