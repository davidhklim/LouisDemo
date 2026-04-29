import {
  FULL_TIME_EMPLOYMENT_BC_DOCUMENT,
  FULL_TIME_EMPLOYMENT_BC_TITLE,
  FULL_TIME_EMPLOYMENT_BC_SUBTITLE,
} from "./demoDocuments/fullTimeEmploymentBC.js";

/**
 * scenarioRenderers.jsx — Per-demo content renderers used by LiveScenarioDemo.
 *
 * Each renderer takes `{ state, config, transition, STATES }` and returns JSX
 * representing what the user sees in the current state. The renderers are
 * purely view-level — they never own state of their own. All mutation happens
 * via the `transition(...)` callback provided by the state machine.
 *
 * ── Interaction model ────────────────────────────────────────────────
 *
 *   Only the target matching `config.indicator` is clickable. Everything
 *   else shows as visually present but non-interactive (dimmed via CSS).
 *   The <SceneTarget> primitive implements this pattern:
 *
 *     <SceneTarget
 *       active={config.indicator === "my-id"}
 *       tooltip={config.tooltip}
 *       onClick={() => transition("NEXT_EVENT")}
 *     >
 *       <div>...</div>
 *     </SceneTarget>
 *
 * Parity pass 2026-04-27: scripted demos now visually mirror the real
 * product surfaces (form-not-table for company data, pill-filters for
 * the template library, approval pane for version control, etc.). Every
 * mirror is a static analogue — no editor, schema, or panel imports.
 */

/* ── Shared scene primitives ─────────────────────────────────────── */

export const SceneTarget = ({
  active,
  tooltip,
  onClick,
  disabled,
  children,
  className = "",
  "data-scene-id": dataSceneId,
}) => {
  return (
    <div
      className={`scene-target ${active ? "scene-target--active" : ""} ${
        className || ""
      }`.trim()}
      data-scene-id={dataSceneId}
      onClick={active && !disabled ? onClick : undefined}
      role={active ? "button" : undefined}
      tabIndex={active && !disabled ? 0 : -1}
      onKeyDown={
        active && !disabled
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {children}
      {active && tooltip ? (
        <span className="scene-target__tooltip">{tooltip}</span>
      ) : null}
    </div>
  );
};

export const SceneFrame = ({ left, right, leftWidth = "minmax(0, 1fr)" }) => (
  <div
    className="scene-frame"
    style={{ gridTemplateColumns: `${leftWidth} minmax(0, 1fr)` }}
  >
    <div className="scene-frame__left">{left}</div>
    <div className="scene-frame__right">{right}</div>
  </div>
);

export const SceneHeader = ({ eyebrow, title, sub }) => (
  <div className="scene-header">
    {eyebrow ? <div className="scene-header__eyebrow">{eyebrow}</div> : null}
    <div className="scene-header__title">{title}</div>
    {sub ? <div className="scene-header__sub">{sub}</div> : null}
  </div>
);

/* ── 1. Collaborative Editing ───────────────────────────────────── */

export const renderCollaborativeEditing = ({ state, config, transition, STATES }) => {
  const commentAdded =
    state === STATES.ADDING_COMMENT ||
    state === STATES.WAITING_FOR_TRACK_EDIT ||
    state === STATES.DONE;
  const trackAccepted = state === STATES.DONE;

  return (
    <SceneFrame
      leftWidth="minmax(0, 1fr)"
      left={
        <div className="scene-doc">
          <div className="scene-doc__page">
            <div className="scene-doc__heading">EMPLOYMENT AGREEMENT</div>
            <div className="scene-doc__section">
              <p className="scene-doc__section-title">1. POSITION &amp; DUTIES</p>
              <p className="scene-doc__para">
                The Employee shall serve as <em>Lead Product Designer</em> and
                shall diligently perform such duties as are assigned by the
                Employer from time to time.
              </p>
            </div>
            <div className="scene-doc__section">
              <p className="scene-doc__section-title">2. COMPENSATION</p>
              <SceneTarget
                active={config.indicator === "clause"}
                tooltip={config.tooltip}
                onClick={() => transition("SELECT")}
                className="scene-doc__clause"
                data-scene-id="clause"
              >
                <p className="scene-doc__para scene-doc__para--highlight">
                  The Employee shall receive a base salary of{" "}
                  {trackAccepted ? (
                    <>
                      <span className="track-delete">$135,000 CAD</span>{" "}
                      <span className="track-insert">$155,000 CAD</span>
                    </>
                  ) : state === STATES.WAITING_FOR_TRACK_EDIT ? (
                    <>
                      <span className="track-delete">$135,000 CAD</span>{" "}
                      <span className="track-insert-pending">$155,000 CAD</span>
                    </>
                  ) : (
                    "$135,000 CAD"
                  )}{" "}
                  per annum, payable in accordance with the Employer&apos;s
                  standard payroll practices.
                </p>
              </SceneTarget>
            </div>
            <div className="scene-doc__section">
              <p className="scene-doc__section-title">3. ROLE</p>
              <p className="scene-doc__para">
                The Employee shall report to the Head of Product and will
                focus on product design, user research, and design system
                maintenance.
              </p>
            </div>
          </div>
        </div>
      }
      right={
        <div className="scene-panel">
          <div className="scene-cmt-header">
            <div>
              <div className="scene-header__eyebrow">COMMENTS</div>
              <div className="scene-header__title">Clause review</div>
              <div className="scene-header__sub">
                Threaded, anchored to the selection
              </div>
            </div>
            {commentAdded ? (
              <button
                type="button"
                className="scene-btn scene-btn--ghost scene-btn--xs scene-btn--dim"
                disabled
              >
                Resolve
              </button>
            ) : null}
          </div>

          {commentAdded ? (
            <div className="scene-cmt-card">
              <div className="scene-cmt-author">
                <div className="scene-panel__avatar scene-panel__avatar--sm">
                  SM
                </div>
                <div className="scene-cmt-author-meta">
                  <div className="scene-cmt-name">Sarah Mendez</div>
                  <div className="scene-cmt-time">just now</div>
                </div>
              </div>
              <div className="scene-cmt-quote">
                <span className="scene-cmt-quote-bar" aria-hidden="true" />
                <span className="scene-cmt-quote-text">
                  The Employee shall receive a base salary of $135,000 CAD...
                </span>
              </div>
              <div className="scene-cmt-body">
                <span className="scene-cmt-mention">@Sarah</span> flagged
                this - People Ops approved $155,000 CAD for this role before
                the offer goes out.
              </div>

              <div className="scene-cmt-thread">
                <div className="scene-cmt-reply">
                  <div className="scene-panel__avatar scene-panel__avatar--xs">
                    AC
                  </div>
                  <div className="scene-cmt-reply-body">
                    <span className="scene-cmt-name-sm">Alex Chen</span>{" "}
                    <span className="scene-cmt-reply-text">
                      Agreed. This matches the approved offer terms for the
                      senior product-design role.
                    </span>
                  </div>
                </div>
                <div className="scene-cmt-reply">
                  <div className="scene-panel__avatar scene-panel__avatar--xs">
                    MR
                  </div>
                  <div className="scene-cmt-reply-body">
                    <span className="scene-cmt-name-sm">Morgan Rivera</span>{" "}
                    <span className="scene-cmt-reply-text">
                      I will apply the salary change and resolve the thread
                      after Sarah confirms.
                    </span>
                  </div>
                </div>
              </div>

              <div className="scene-cmt-reply-input">
                <div className="scene-panel__avatar scene-panel__avatar--xs">
                  AC
                </div>
                <div className="scene-cmt-reply-field">Reply…</div>
              </div>
            </div>
          ) : (
            <div className="scene-panel__empty">
              Select a clause to start a thread
            </div>
          )}

          <SceneTarget
            active={config.indicator === "comment-btn"}
            tooltip={config.tooltip}
            onClick={() => transition("ADD_COMMENT")}
            className="scene-panel__cta-wrap"
            data-scene-id="comment-btn"
          >
            <button
              type="button"
              className={`scene-btn scene-btn--primary ${
                config.indicator !== "comment-btn" ? "scene-btn--dim" : ""
              }`}
              disabled
            >
              Add Comment
            </button>
          </SceneTarget>

          {state === STATES.ADDING_COMMENT ? (
            <SceneTarget
              active={config.indicator === "review-track-btn"}
              tooltip={config.tooltip}
              onClick={() => transition("COMMENT_ADDED")}
              className="scene-panel__cta-wrap"
              data-scene-id="review-track-btn"
            >
              <button
                type="button"
                className={`scene-btn scene-btn--primary ${
                  config.indicator !== "review-track-btn" ? "scene-btn--dim" : ""
                }`}
                disabled
              >
                Review tracked edit
              </button>
            </SceneTarget>
          ) : null}

          {state === STATES.WAITING_FOR_TRACK_EDIT ||
          state === STATES.DONE ? (
            <div className="scene-panel__track">
              <div className="scene-panel__track-label">Tracked change</div>
              <div className="scene-panel__track-diff">
                <span className="track-delete">$135,000 CAD</span> to{" "}
                <span className="track-insert">$155,000 CAD</span>
              </div>
              <SceneTarget
                active={config.indicator === "accept-btn"}
                tooltip={config.tooltip}
                onClick={() => transition("ACCEPT")}
                className="scene-panel__cta-wrap"
                data-scene-id="accept-btn"
              >
                <button
                  type="button"
                  className={`scene-btn scene-btn--primary ${
                    config.indicator !== "accept-btn" ? "scene-btn--dim" : ""
                  }`}
                  disabled
                >
                  Accept Revision
                </button>
              </SceneTarget>
            </div>
          ) : null}
        </div>
      }
    />
  );
};

/* ── 2. Version Control ────────────────────────────────────────── */

export const renderVersionControl = ({ state, config, transition, STATES }) => {
  const showHistory = state !== STATES.WAITING_FOR_HISTORY;
  const showCompare =
    state === STATES.COMPARING ||
    state === STATES.WAITING_FOR_RESTORE ||
    state === STATES.DONE;
  const showDiffCards =
    state === STATES.WAITING_FOR_RESTORE || state === STATES.DONE;

  return (
    <SceneFrame
      leftWidth="minmax(0, 1fr)"
      left={
        <div className="scene-doc">
          <div className="scene-doc__page">
            <div className="scene-doc__toolbar">
              <div className="scene-doc__toolbar-title">
                Employment Agreement.docx
              </div>
              <SceneTarget
                active={config.indicator === "history-btn"}
                tooltip={config.tooltip}
                onClick={() => transition("OPEN_HISTORY")}
                className="scene-doc__toolbar-btn-wrap"
                data-scene-id="history-btn"
              >
                <button
                  type="button"
                  className={`scene-btn scene-btn--ghost ${
                    config.indicator !== "history-btn" ? "scene-btn--dim" : ""
                  }`}
                  disabled
                >
                  <span className="scene-btn__glyph">◴</span> Version History
                </button>
              </SceneTarget>
            </div>

            <div className="scene-doc__body">
              {/* Section 1 — Role & Title. Pre-compare: just shows the v1
                  base text. From COMPARING onward, we render the redline
                  inline so the document itself communicates the diff,
                  not just the side panel. Company-controlled terms only —
                  no substantive law in this demo. */}
              <div className="scene-doc__section-title">
                1. Role &amp; Title
              </div>
              {showCompare ? (
                <div className="scene-doc__para scene-doc__redline">
                  The Employee shall serve as{" "}
                  <span className="track-delete">Lead Product Designer</span>{" "}
                  <span className="track-insert">Director of Product Design</span>{" "}
                  and shall report to the{" "}
                  <span className="track-delete">Head of Product</span>{" "}
                  <span className="track-insert">Chief Product Officer</span>.
                </div>
              ) : (
                <div className="scene-doc__para">
                  The Employee shall serve as Lead Product Designer and
                  shall report to the Head of Product.
                </div>
              )}

              <div className="scene-doc__section-title">
                2. Compensation
              </div>
              {showCompare ? (
                <div className="scene-doc__para scene-doc__redline">
                  The Employee shall receive a base salary of{" "}
                  <span className="track-delete">$135,000 CAD</span>{" "}
                  <span className="track-insert">$165,000 CAD</span>{" "}
                  per annum, payable in accordance with the Company&apos;s
                  standard payroll practices.{" "}
                  <span className="track-insert">
                    The Employee shall be eligible for an annual performance
                    bonus of up to 15% of base salary.
                  </span>
                </div>
              ) : (
                <div className="scene-doc__para scene-doc__para--muted">
                  The Employee shall receive a base salary of $135,000 CAD
                  per annum, payable in accordance with the Company&apos;s
                  standard payroll practices.
                </div>
              )}

              {showCompare ? (
                <div className="scene-doc__redline-banner">
                  <span className="scene-doc__redline-banner-dot" aria-hidden="true" />
                  Comparing v1 ↔ v3 · 3 changed · 1 added
                </div>
              ) : null}
            </div>
          </div>
        </div>
      }
      right={
        showHistory ? (
          <div className="scene-panel">
            {/* Approval mini-panel — mirrors the Request Approval form */}
            <div className="scene-vh-approval">
              <div className="scene-vh-approval-label">Request approval</div>
              <div className="scene-vh-approval-row">
                <div className="scene-vh-field">
                  <div className="scene-vh-field-label">Reviewer</div>
                  <div className="scene-vh-field-control scene-vh-field-control--select">
                    <span>Morgan Rivera</span>
                    <span className="scene-vh-caret" aria-hidden="true">
                      ▾
                    </span>
                  </div>
                </div>
              </div>
              <div className="scene-vh-field">
                <div className="scene-vh-field-label">Message</div>
                <div className="scene-vh-field-control scene-vh-field-control--textarea">
                  Please review the v3 promotion + comp changes before we
                  route to signature.
                </div>
              </div>
              <button
                type="button"
                className="scene-btn scene-btn--ghost scene-btn--xs scene-btn--dim"
                disabled
              >
                Request Approval
              </button>
            </div>

            <div className="scene-vh-divider" aria-hidden="true" />

            <SceneHeader
              eyebrow="VERSION HISTORY"
              title="3 versions"
              sub="Every save is a snapshot"
            />

            <div className="scene-panel__list">
              {[
                {
                  id: "v3",
                  label: "v3 · current",
                  author: "MR",
                  time: "Today · 10:12 AM",
                  summary:
                    "Promoted to Director of Product Design; salary $165K + bonus.",
                },
                {
                  id: "v2",
                  label: "v2",
                  author: "PI",
                  time: "Yesterday · 4:48 PM",
                  summary: "Updated reporting line to CPO.",
                },
                {
                  id: "v1",
                  label: "v1 · initial",
                  author: "AC",
                  time: "Apr 12 · 2:05 PM",
                  summary: "Base draft from template.",
                },
              ].map((v) => (
                <div
                  key={v.id}
                  className={`scene-panel__version ${
                    (state === STATES.WAITING_FOR_RESTORE ||
                      state === STATES.DONE) &&
                    v.id === "v1"
                      ? "scene-panel__version--active"
                      : ""
                  }`}
                >
                  <div className="scene-panel__version-head">
                    <div className="scene-panel__avatar scene-panel__avatar--sm">
                      {v.author}
                    </div>
                    <div>
                      <div className="scene-panel__version-label">
                        {v.label}
                      </div>
                      <div className="scene-panel__version-time">{v.time}</div>
                    </div>
                  </div>
                  <div className="scene-panel__version-summary">
                    {v.summary}
                  </div>
                  <div className="scene-vh-row-actions">
                    <span className="scene-vh-row-pill">Compare</span>
                    {v.id === "v1" &&
                    (state === STATES.WAITING_FOR_RESTORE ||
                      state === STATES.DONE) ? (
                      <SceneTarget
                        active={config.indicator === "restore-btn"}
                        tooltip={config.tooltip}
                        onClick={() => transition("RESTORE")}
                        className="scene-vh-row-pill-wrap"
                        data-scene-id="restore-btn"
                      >
                        <span
                          className={`scene-vh-row-pill scene-vh-row-pill--primary ${
                            config.indicator !== "restore-btn"
                              ? "scene-vh-row-pill--dim"
                              : ""
                          }`}
                        >
                          Restore
                        </span>
                      </SceneTarget>
                    ) : (
                      <span className="scene-vh-row-pill scene-vh-row-pill--dim">
                        Restore
                      </span>
                    )}
                    <span className="scene-vh-row-pill scene-vh-row-pill--dim">
                      Set as Base
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {showDiffCards ? (
              <div className="scene-vh-changes">
                <div className="scene-vh-changes-label">Changes (4)</div>
                <div className="scene-vh-diff-card scene-vh-diff-card--changed">
                  <div className="scene-vh-diff-card-tag">Changed</div>
                  <div className="scene-vh-diff-card-line">
                    <span className="track-delete">Lead Product Designer</span>{" "}
                    →{" "}
                    <span className="track-insert">
                      Director of Product Design
                    </span>
                  </div>
                  <div className="scene-vh-diff-card-meta">
                    Section 1 · Role &amp; Title
                  </div>
                </div>
                <div className="scene-vh-diff-card scene-vh-diff-card--changed">
                  <div className="scene-vh-diff-card-tag">Changed</div>
                  <div className="scene-vh-diff-card-line">
                    <span className="track-delete">Head of Product</span> →{" "}
                    <span className="track-insert">Chief Product Officer</span>
                  </div>
                  <div className="scene-vh-diff-card-meta">
                    Section 1 · Role &amp; Title
                  </div>
                </div>
                <div className="scene-vh-diff-card scene-vh-diff-card--changed">
                  <div className="scene-vh-diff-card-tag">Changed</div>
                  <div className="scene-vh-diff-card-line">
                    <span className="track-delete">$135,000 CAD</span> →{" "}
                    <span className="track-insert">$165,000 CAD</span>
                  </div>
                  <div className="scene-vh-diff-card-meta">
                    Section 2 · Compensation
                  </div>
                </div>
                <div className="scene-vh-diff-card scene-vh-diff-card--added">
                  <div className="scene-vh-diff-card-tag">Added</div>
                  <div className="scene-vh-diff-card-line">
                    <span className="track-insert">
                      Annual performance bonus eligibility — up to 15% of base
                      salary.
                    </span>
                  </div>
                  <div className="scene-vh-diff-card-meta">
                    Section 2 · Compensation
                  </div>
                </div>
              </div>
            ) : null}

            <SceneTarget
              active={config.indicator === "compare-btn"}
              tooltip={config.tooltip}
              onClick={() => transition("COMPARE")}
              className="scene-panel__cta-wrap"
              data-scene-id="compare-btn"
            >
              <button
                type="button"
                className={`scene-btn scene-btn--primary ${
                  config.indicator !== "compare-btn" ? "scene-btn--dim" : ""
                }`}
                disabled
              >
                Compare v1 ↔ v3
              </button>
            </SceneTarget>

            {state === STATES.COMPARING ? (
              <AutoAdvance
                event="COMPARE_DONE"
                transition={transition}
                delay={1100}
                label="Computing redline…"
              />
            ) : null}
          </div>
        ) : (
          <div className="scene-panel scene-panel--empty">
            <SceneHeader
              eyebrow="VERSION HISTORY"
              title="Open the panel"
              sub="Click the history button above"
            />
          </div>
        )
      }
    />
  );
};

/* ── 3. E-Signature ────────────────────────────────────────────── */

export const renderESignature = ({ state, config, transition, STATES }) => {
  const sent =
    state === STATES.WAITING_FOR_COMPLETE || state === STATES.DONE;
  const completed = state === STATES.DONE;

  const signers = [
    {
      role: "Company",
      name: "Alex Chen",
      email: "alex@louisai.com",
      title: "CEO",
      anchor: "[[SIGN_COMPANY]]",
    },
    {
      role: "Contractor",
      name: "Priya Iyer",
      email: "priya.iyer@louisai.com",
      title: "Lead Product Designer",
      anchor: "[[SIGN_CONTRACTOR]]",
    },
  ];

  return (
    <SceneFrame
      leftWidth="minmax(0, 1fr)"
      left={
        <div className="scene-doc">
          <div className="scene-doc__page">
            <div className="scene-doc__heading">
              INDEPENDENT CONTRACTOR AGREEMENT
            </div>
            <div className="scene-doc__para">
              This Agreement is entered into between Lakeview Robotics Inc.
              ("Company") and Priya Iyer ("Contractor") for the provision of
              product design services.
            </div>
            <div className="scene-doc__signature-block">
              <div className="scene-sig-row">
                <div className="scene-sig-line">
                  {completed ? (
                    <span className="scene-sig-signed">Alex Chen</span>
                  ) : (
                    <span className="scene-sig-placeholder">
                      [Company signature]
                    </span>
                  )}
                </div>
                <div className="scene-sig-label">Alex Chen — CEO</div>
              </div>
              <div className="scene-sig-row">
                <div className="scene-sig-line">
                  {completed ? (
                    <span className="scene-sig-signed">Priya Iyer</span>
                  ) : (
                    <span className="scene-sig-placeholder">
                      [Contractor signature]
                    </span>
                  )}
                </div>
                <div className="scene-sig-label">
                  Priya Iyer — Lead Product Designer
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      right={
        <div className="scene-panel">
          <SceneHeader
            eyebrow="E-SIGN ENVELOPE"
            title={
              completed
                ? "COMPLETED"
                : sent
                  ? "SENT · awaiting signatures"
                  : "Ready to send"
            }
            sub="Via DocuSign · audit trail enabled"
          />

          {/* Subject + Message */}
          <div className="scene-esign-form">
            <div className="scene-esign-field">
              <div className="scene-esign-field-label">Subject</div>
              <div className="scene-esign-field-control">
                Please sign — Independent Contractor Agreement
              </div>
            </div>
            <div className="scene-esign-field">
              <div className="scene-esign-field-label">Message</div>
              <div className="scene-esign-field-control scene-esign-field-control--ta">
                Hi team — please review and sign at your earliest convenience.
                Both signatures required to execute.
              </div>
            </div>
          </div>

          <SceneTarget
            active={config.indicator === "review-panel"}
            tooltip={config.tooltip}
            onClick={() => transition("CONFIRM")}
            className="scene-panel__signatories"
            data-scene-id="review-panel"
          >
            <div className="scene-panel__list">
              {signers.map((s) => (
                <div key={s.email} className="scene-panel__signatory">
                  <div className="scene-panel__signatory-top">
                    <div className="scene-panel__avatar scene-panel__avatar--sm">
                      {s.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="scene-panel__signatory-name">
                        {s.name}
                      </div>
                      <div className="scene-panel__signatory-sub">
                        {s.title} · {s.email}
                      </div>
                    </div>
                    <div className="scene-esign-tags">
                      <span className="scene-esign-auto-tag">Company Data</span>
                    </div>
                  </div>
                  <div className="scene-esign-anchor">
                    <span className="scene-esign-anchor-label">Anchor</span>
                    <span className="scene-esign-anchor-token">
                      {s.anchor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SceneTarget>

          {!sent ? (
            <SceneTarget
              active={config.indicator === "send-btn"}
              tooltip={config.tooltip}
              onClick={() => transition("SEND")}
              className="scene-panel__cta-wrap"
              data-scene-id="send-btn"
            >
              <button
                type="button"
                className={`scene-btn scene-btn--primary ${
                  config.indicator !== "send-btn" ? "scene-btn--dim" : ""
                }`}
                disabled
              >
                Send for Signature
              </button>
            </SceneTarget>
          ) : null}

          {state === STATES.SENDING ? (
            <AutoAdvance
              event="SENT"
              transition={transition}
              delay={1100}
              label="Sending envelope…"
            />
          ) : null}

          {state === STATES.WAITING_FOR_COMPLETE ? (
            <SceneTarget
              active={config.indicator === "simulate-sign-btn"}
              tooltip={config.tooltip}
              onClick={() => transition("SIGNED")}
              className="scene-panel__cta-wrap"
              data-scene-id="simulate-sign-btn"
            >
              <button
                type="button"
                className={`scene-btn scene-btn--primary ${
                  config.indicator !== "simulate-sign-btn"
                    ? "scene-btn--dim"
                    : ""
                }`}
                disabled
              >
                Simulate Both Signatures
              </button>
            </SceneTarget>
          ) : null}

          {sent ? (
            <div className="scene-esign-tracker">
              <div className="scene-esign-tracker-label">Tracker</div>
              {signers.map((s) => (
                <div key={s.email} className="scene-esign-tracker-row">
                  <span
                    className={`scene-esign-tracker-dot ${
                      completed
                        ? "scene-esign-tracker-dot--done"
                        : "scene-esign-tracker-dot--pending"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="scene-esign-tracker-name">{s.name}</span>
                  <span className="scene-esign-tracker-status">
                    {completed ? "Signed" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          {completed ? (
            <div className="scene-panel__complete">
              Filed to Minute Book · Audit log entry created
            </div>
          ) : null}
        </div>
      }
    />
  );
};

/* ── 4. Mail Merge ─────────────────────────────────────────────── */

export const renderMailMerge = ({ state, config, transition, STATES }) => {
  const hasEmployee = state !== STATES.WAITING_FOR_EMPLOYEE;
  const populated =
    state === STATES.WAITING_FOR_SAVE || state === STATES.DONE;
  const saved = state === STATES.DONE;

  return (
    <SceneFrame
      leftWidth="minmax(0, 1.3fr)"
      left={
        <div className="scene-doc">
          <div className="scene-doc__page">
            <div className="scene-doc__heading">EMPLOYMENT AGREEMENT</div>
            <div className="scene-doc__para">
              This Agreement is entered into between Lakeview Robotics Inc. and{" "}
              {populated ? (
                <span className="scene-pill scene-pill--filled">
                  Priya Iyer
                </span>
              ) : (
                <span className="scene-pill">{`{{employee.full_name}}`}</span>
              )}
              , effective{" "}
              {populated ? (
                <span className="scene-pill scene-pill--filled">
                  June 17, 2026
                </span>
              ) : (
                <span className="scene-pill">{`{{employee.start_date}}`}</span>
              )}
              .
            </div>
            <div className="scene-doc__para">
              The Employee shall serve as{" "}
              {populated ? (
                <span className="scene-pill scene-pill--filled">
                  Lead Product Designer
                </span>
              ) : (
                <span className="scene-pill">{`{{employee.role}}`}</span>
              )}{" "}
              and shall receive a base salary of{" "}
              {populated ? (
                <span className="scene-pill scene-pill--filled">
                  $135,000 CAD
                </span>
              ) : (
                <span className="scene-pill">{`{{employee.compensation}}`}</span>
              )}
              , payable in accordance with the Employer's standard payroll
              practices.
            </div>
            <div className="scene-doc__para scene-doc__para--muted">
              …and 13 more merge fields.
            </div>
            {populated ? (
              <div className="scene-merge-chip">
                <span className="scene-merge-chip__dot" /> 17 of 17 fields
                merged
              </div>
            ) : (
              <div className="scene-merge-chip scene-merge-chip--dim">
                <span className="scene-merge-chip__dot" /> 17 placeholders
                detected
              </div>
            )}
          </div>
        </div>
      }
      right={
        <div className="scene-panel">
          <SceneHeader
            eyebrow="COMPANY DATA"
            title="Employees"
            sub="Pick a row to populate the template"
          />
          <div className="scene-panel__list">
            {[
              {
                id: "emp-1",
                name: "Priya Iyer",
                role: "Lead Product Designer",
                comp: "$135,000",
              },
              {
                id: "emp-2",
                name: "Avery Chen",
                role: "Senior Backend Engineer",
                comp: "$155,000",
              },
              {
                id: "emp-3",
                name: "Morgan Rivera",
                role: "Head of Operations",
                comp: "$145,000",
              },
            ].map((e) => (
              <SceneTarget
                key={e.id}
                active={
                  config.indicator === "employee-row" &&
                  e.id === "emp-1"
                }
                tooltip={e.id === "emp-1" ? config.tooltip : null}
                onClick={() => transition("PICK")}
                className={`scene-panel__emp-row ${
                  hasEmployee && e.id === "emp-1"
                    ? "scene-panel__emp-row--selected"
                    : ""
                }`}
                data-scene-id={`employee-${e.id}`}
              >
                <div className="scene-panel__avatar scene-panel__avatar--sm">
                  {e.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>
                <div className="scene-panel__emp-body">
                  <div className="scene-panel__emp-name">{e.name}</div>
                  <div className="scene-panel__emp-sub">
                    {e.role} · {e.comp}
                  </div>
                </div>
                {hasEmployee && e.id === "emp-1" ? (
                  <span className="scene-check">✓</span>
                ) : null}
              </SceneTarget>
            ))}
          </div>

          {/* Per-placeholder source dropdowns + progress bar */}
          {hasEmployee ? (
            <div className="scene-mm-binds">
              <div className="scene-mm-binds-label">
                Placeholder bindings
                <span className="scene-mm-binds-count">
                  {populated ? "17 / 17 filled" : "0 / 17 filled"}
                </span>
              </div>
              <div className="scene-mm-binds-progress">
                <div
                  className={`scene-mm-binds-progress-bar ${
                    populated ? "scene-mm-binds-progress-bar--full" : ""
                  }`}
                />
              </div>
              {[
                {
                  ph: "{{employee.full_name}}",
                  val: "Priya Iyer",
                },
                {
                  ph: "{{employee.start_date}}",
                  val: "June 17, 2026",
                },
                {
                  ph: "{{employee.role}}",
                  val: "Lead Product Designer",
                },
              ].map((row) => (
                <div key={row.ph} className="scene-mm-binds-row">
                  <span className="scene-mm-binds-ph">{row.ph}</span>
                  <span className="scene-mm-binds-arrow" aria-hidden="true">
                    →
                  </span>
                  <span className="scene-mm-binds-source">
                    <span>{row.val}</span>
                    <span className="scene-vh-caret" aria-hidden="true">
                      ▾
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          <SceneTarget
            active={config.indicator === "preview-btn"}
            tooltip={config.tooltip}
            onClick={() => transition("PREVIEW")}
            className="scene-panel__cta-wrap"
            data-scene-id="preview-btn"
          >
            <button
              type="button"
              className={`scene-btn scene-btn--primary ${
                config.indicator !== "preview-btn" ? "scene-btn--dim" : ""
              }`}
              disabled
            >
              Preview Populated Draft
            </button>
          </SceneTarget>

          {state === STATES.POPULATING ? (
            <AutoAdvance
              event="POPULATED"
              transition={transition}
              delay={1100}
              label="Merging 17 fields…"
            />
          ) : null}

          {populated ? (
            <SceneTarget
              active={config.indicator === "save-btn"}
              tooltip={config.tooltip}
              onClick={() => transition("SAVE")}
              className="scene-panel__cta-wrap"
              data-scene-id="save-btn"
            >
              <button
                type="button"
                className={`scene-btn scene-btn--primary ${
                  config.indicator !== "save-btn" ? "scene-btn--dim" : ""
                }`}
                disabled
              >
                {saved ? "✓ Saved" : "Save as Draft"}
              </button>
            </SceneTarget>
          ) : null}
        </div>
      }
    />
  );
};

/* ── 5. Template Library ───────────────────────────────────────── */

export const renderTemplateLibrary = ({
  state,
  config,
  transition,
  STATES,
  // navigate is plumbed through by LiveScenarioDemo for demos that need
  // route changes (e.g. an external "View pricing" CTA). This demo
  // intentionally keeps everything inside the demo box, so navigate is
  // unused here.
  // eslint-disable-next-line no-unused-vars
  navigate,
}) => {
  const categoryPicked = state !== STATES.WAITING_FOR_CATEGORY;
  const templatePicked =
    state === STATES.WAITING_FOR_USE ||
    state === STATES.LOADING ||
    state === STATES.DONE;
  const showEditor =
    state === STATES.LOADING || state === STATES.DONE;
  const editorReady = state === STATES.DONE;

  const PILLS = [
    { id: "all", label: "All" },
    { id: "employment", label: "Employment", count: 42, target: true },
    { id: "corporate", label: "Corporate Governance", count: 58 },
    { id: "equity", label: "Equity & Options", count: 27 },
    { id: "confidentiality", label: "NDAs & Confidentiality", count: 19 },
    { id: "commercial", label: "Commercial Contracts", count: 53 },
  ];

  const TEMPLATES = [
    {
      id: "template-employment-full-time-bc",
      title: "Full-Time Employment Agreement (BC)",
      description: "Salary, equity, IP assignment, termination.",
      jurisdiction: "BC",
    },
    {
      id: "template-employment-ic-bc",
      title: "Independent Contractor Agreement (BC)",
      description: "Work product IP transfer, CRA-compliant.",
      jurisdiction: "BC",
    },
    {
      id: "template-employment-offer-letter",
      title: "Offer Letter (Exempt)",
      description: "Linked to parent employment agreement.",
      jurisdiction: "GEN",
    },
  ];

  const selectedTemplate = TEMPLATES.find(
    (t) => t.id === "template-employment-full-time-bc",
  );

  return (
    <div className="scene-tpl">
      <SceneHeader
        eyebrow={
          categoryPicked
            ? `${PILLS.find((p) => p.target)?.label?.toUpperCase()} · 42 TEMPLATES`
            : "199+ TEMPLATES"
        }
        title="Library / Templates"
        sub="Vetted by Canadian counsel"
      />

      {/* Pill filter row */}
      <div className="scene-tpl-pills" role="tablist" aria-label="Categories">
        {PILLS.map((p) => (
          <SceneTarget
            key={p.id}
            active={
              config.indicator === "category-employment" && p.target === true
            }
            tooltip={p.target ? config.tooltip : null}
            onClick={() => transition("PICK_CATEGORY")}
            className={`scene-tpl-pill ${
              categoryPicked && p.target
                ? "scene-tpl-pill--active"
                : !categoryPicked && p.id === "all"
                  ? "scene-tpl-pill--active"
                  : ""
            }`}
            data-scene-id={`category-${p.id}`}
          >
            <span>{p.label}</span>
            {typeof p.count === "number" ? (
              <span className="scene-tpl-pill-count">{p.count}</span>
            ) : null}
          </SceneTarget>
        ))}
      </div>

      {/* Search input */}
      <div className="scene-tpl-search">
        <span className="scene-search__glyph" aria-hidden="true">
          ⌕
        </span>
        <span className="scene-tpl-search-placeholder">
          Search templates…
        </span>
      </div>

      {/* Card grid + slide-in preview — hidden once the user has clicked
          Use Template, since the in-demo editor view replaces them. */}
      {categoryPicked && !showEditor ? (
        <div
          className={`scene-tpl-stage ${
            templatePicked ? "scene-tpl-stage--with-preview" : ""
          }`}
        >
          <div className="scene-grid__cards">
            {TEMPLATES.map((t) => (
              <SceneTarget
                key={t.id}
                active={
                  config.indicator === "template-full-time-bc" &&
                  t.id === "template-employment-full-time-bc"
                }
                tooltip={
                  t.id === "template-employment-full-time-bc"
                    ? config.tooltip
                    : null
                }
                onClick={() => transition("PICK_TEMPLATE")}
                className={`scene-tpl-card ${
                  templatePicked &&
                  t.id === "template-employment-full-time-bc"
                    ? "scene-tpl-card--selected"
                    : ""
                }`}
                data-scene-id={`template-${t.id}`}
              >
                <div className="scene-tpl-card-row">
                  <span
                    className={`scene-tpl-jur scene-tpl-jur--${t.jurisdiction.toLowerCase()}`}
                  >
                    {t.jurisdiction}
                  </span>
                  <span className="scene-tpl-ready">
                    <span
                      className="scene-tpl-ready-dot"
                      aria-hidden="true"
                    />
                    Ready
                  </span>
                </div>
                <div className="scene-tpl-card-title">{t.title}</div>
                <div className="scene-tpl-card-desc">{t.description}</div>
              </SceneTarget>
            ))}
          </div>

          {/* Slide-in preview panel */}
          {templatePicked && selectedTemplate ? (
            <aside className="scene-tpl-preview" aria-label="Template preview">
              <div className="scene-tpl-preview-bcrumb">
                Library / Templates / Employment
              </div>
              <div className="scene-tpl-preview-title">
                {selectedTemplate.title}
              </div>
              <div className="scene-tpl-preview-tags">
                <span
                  className={`scene-tpl-jur scene-tpl-jur--${selectedTemplate.jurisdiction.toLowerCase()}`}
                >
                  {selectedTemplate.jurisdiction}
                </span>
                <span className="scene-tpl-ready">
                  <span className="scene-tpl-ready-dot" aria-hidden="true" />
                  Ready
                </span>
              </div>
              <div className="scene-tpl-preview-doc scene-tpl-preview-doc--rich">
                <div className="scene-tpl-preview-doc-h">
                  {FULL_TIME_EMPLOYMENT_BC_TITLE.toUpperCase()}
                </div>
                <div className="scene-tpl-preview-doc-sub">
                  {FULL_TIME_EMPLOYMENT_BC_SUBTITLE}
                </div>
                <div className="scene-tpl-preview-doc-body">
                  {FULL_TIME_EMPLOYMENT_BC_DOCUMENT.map((section, idx) => (
                    <div
                      key={`tpl-prev-sec-${idx}`}
                      className="scene-tpl-preview-doc-section"
                    >
                      {section.heading ? (
                        <div className="scene-tpl-preview-doc-section-title">
                          {section.heading}
                        </div>
                      ) : null}
                      {section.paragraphs.map((p, pi) => (
                        <p
                          key={`tpl-prev-p-${idx}-${pi}`}
                          className="scene-tpl-preview-doc-p"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="scene-tpl-preview-doc-fade" aria-hidden="true" />
              </div>

              <SceneTarget
                active={config.indicator === "use-btn"}
                tooltip={config.tooltip}
                onClick={() => transition("USE")}
                className="scene-panel__cta-wrap"
                data-scene-id="use-btn"
              >
                <button
                  type="button"
                  className={`scene-btn scene-btn--primary ${
                    config.indicator !== "use-btn" ? "scene-btn--dim" : ""
                  }`}
                  disabled
                >
                  Use Template
                </button>
              </SceneTarget>
            </aside>
          ) : null}
        </div>
      ) : null}

      {/* In-demo editor view — replaces the card grid once the user has
          clicked Use Template. Shows the same scripted document inside
          a compact editor chrome (file name, save status, toolbar,
          scrollable canvas) so the visitor sees the natural next step
          of the workflow without leaving the demo box. */}
      {showEditor ? (
        <div
          className={`scene-tpl-editor ${
            editorReady ? "scene-tpl-editor--ready" : "scene-tpl-editor--loading"
          }`}
        >
          <div className="scene-tpl-editor-chrome">
            <div className="scene-tpl-editor-chrome-left">
              <span className="scene-tpl-editor-back" aria-hidden="true">
                ←
              </span>
              <div className="scene-tpl-editor-meta">
                <div className="scene-tpl-editor-file">
                  {FULL_TIME_EMPLOYMENT_BC_TITLE} · Draft
                </div>
                <div className="scene-tpl-editor-status">
                  <span
                    className="scene-tpl-editor-status-dot"
                    aria-hidden="true"
                  />
                  {editorReady
                    ? "Saved just now · 9 placeholders detected"
                    : "Spinning up your draft…"}
                </div>
              </div>
            </div>
            <div className="scene-tpl-editor-chrome-right">
              <span className="scene-tpl-editor-chip">Mail Merge</span>
              <span className="scene-tpl-editor-chip">Comments</span>
              <span className="scene-tpl-editor-chip scene-tpl-editor-chip--primary">
                Send for Signature
              </span>
            </div>
          </div>

          <div className="scene-tpl-editor-toolbar" aria-hidden="true">
            <span className="scene-tpl-editor-toolbar-btn">Aa</span>
            <span className="scene-tpl-editor-toolbar-btn">B</span>
            <span className="scene-tpl-editor-toolbar-btn">I</span>
            <span className="scene-tpl-editor-toolbar-btn">U</span>
            <span className="scene-tpl-editor-toolbar-divider" />
            <span className="scene-tpl-editor-toolbar-btn">¶</span>
            <span className="scene-tpl-editor-toolbar-btn">≡</span>
            <span className="scene-tpl-editor-toolbar-divider" />
            <span className="scene-tpl-editor-toolbar-btn">⚖</span>
            <span className="scene-tpl-editor-toolbar-btn">✎</span>
          </div>

          <div className="scene-tpl-editor-canvas">
            <article className="scene-tpl-editor-doc">
              <div className="scene-tpl-editor-doc-title">
                {FULL_TIME_EMPLOYMENT_BC_TITLE.toUpperCase()}
              </div>
              <div className="scene-tpl-editor-doc-sub">
                Between{" "}
                <span className="scene-tpl-editor-ph">
                  {"{COMPANY LEGAL NAME}"}
                </span>{" "}
                and{" "}
                <span className="scene-tpl-editor-ph">
                  {"{EMPLOYEE NAME}"}
                </span>
              </div>
              {FULL_TIME_EMPLOYMENT_BC_DOCUMENT.slice(0, 5).map(
                (section, idx) => (
                  <div
                    key={`tpl-edit-sec-${idx}`}
                    className="scene-tpl-editor-doc-section"
                  >
                    {section.heading ? (
                      <div className="scene-tpl-editor-doc-heading">
                        {section.heading}
                      </div>
                    ) : null}
                    {section.paragraphs.map((p, pi) => (
                      <p
                        key={`tpl-edit-p-${idx}-${pi}`}
                        className="scene-tpl-editor-doc-p"
                      >
                        {/* highlight {PLACEHOLDERS} as pills */}
                        {p
                          .split(/(\{[A-Z][A-Z0-9 _-]*\})/g)
                          .filter(Boolean)
                          .map((piece, ix) =>
                            /^\{[A-Z][A-Z0-9 _-]*\}$/.test(piece) ? (
                              <span
                                key={`ph-${idx}-${pi}-${ix}`}
                                className="scene-tpl-editor-ph"
                              >
                                {piece}
                              </span>
                            ) : (
                              <span key={`tx-${idx}-${pi}-${ix}`}>{piece}</span>
                            ),
                          )}
                      </p>
                    ))}
                  </div>
                ),
              )}
              <div className="scene-tpl-editor-doc-fade" aria-hidden="true" />
            </article>
          </div>

          {state === STATES.LOADING ? (
            <div className="scene-tpl-editor-loader">
              <span
                className="scene-tpl-editor-loader-spinner"
                aria-hidden="true"
              />
              <span>Spinning up your draft…</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {state === STATES.LOADING ? (
        <AutoAdvance
          event="LOADED"
          transition={transition}
          delay={1000}
          label="Spinning up your draft…"
        />
      ) : null}
    </div>
  );
};

/* ── 6. Company Data ───────────────────────────────────────────── */

export const renderCompanyData = ({ state, config, transition, STATES }) => {
  // Re-purposed legacy state names for the form-mirror layout:
  //  WAITING_FOR_TAB     → Open Jurisdiction field
  //  WAITING_FOR_SEARCH  → Open Industry field
  //  WAITING_FOR_PROFILE → Click director row
  //  WAITING_FOR_EDIT    → Click Add Director
  //  DONE                → Done
  const jurisdictionOpen = state !== STATES.WAITING_FOR_TAB;
  const industryOpen =
    state === STATES.WAITING_FOR_PROFILE ||
    state === STATES.WAITING_FOR_EDIT ||
    state === STATES.DONE;
  const directorPicked =
    state === STATES.WAITING_FOR_EDIT || state === STATES.DONE;
  const addedDirector = state === STATES.DONE;

  return (
    <div className="scene-cd-form">
      <SceneHeader
        eyebrow="COMPANY DATA"
        title="Lakeview Robotics Inc."
        sub="The form is the data store"
      />

      {/* Section 1: Basic Information */}
      <section className="scene-cd-section">
        <div className="scene-cd-section-title">Basic Information</div>
        <div className="scene-cd-grid">
          <div className="scene-cd-field">
            <div className="scene-cd-field-label">Company Name</div>
            <div className="scene-cd-field-control scene-cd-field-control--text">
              Lakeview Robotics Inc.
            </div>
          </div>

          <SceneTarget
            active={config.indicator === "employees-tab"}
            tooltip={config.tooltip}
            onClick={() => transition("PICK_TAB")}
            className="scene-cd-field-wrap"
            data-scene-id="tab-employees"
          >
            <div className="scene-cd-field">
              <div className="scene-cd-field-label">Jurisdiction</div>
              <div
                className={`scene-cd-field-control scene-cd-field-control--cascade ${
                  jurisdictionOpen ? "scene-cd-field-control--filled" : ""
                }`}
              >
                <span className="scene-cd-cascade-leg">
                  <span>Canada</span>
                  <span className="scene-vh-caret" aria-hidden="true">
                    ▾
                  </span>
                </span>
                <span className="scene-cd-cascade-leg">
                  <span>{jurisdictionOpen ? "BC" : "—"}</span>
                  <span className="scene-vh-caret" aria-hidden="true">
                    ▾
                  </span>
                </span>
              </div>
            </div>
          </SceneTarget>

          <SceneTarget
            active={config.indicator === "search-input"}
            tooltip={config.tooltip}
            onClick={() => transition("SEARCH")}
            className="scene-cd-field-wrap"
            data-scene-id="search-input"
          >
            <div className="scene-cd-field">
              <div className="scene-cd-field-label">Industry / Sector</div>
              <div
                className={`scene-cd-field-control scene-cd-field-control--text ${
                  industryOpen ? "scene-cd-field-control--filled" : ""
                }`}
              >
                {industryOpen ? "Robotics &amp; Automation" : "—"}
              </div>
            </div>
          </SceneTarget>

          <div className="scene-cd-field">
            <div className="scene-cd-field-label">Incorporation Number</div>
            <div className="scene-cd-field-control scene-cd-field-control--text">
              BC1234567
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Roles & People */}
      <section className="scene-cd-section">
        <div className="scene-cd-section-title">Roles &amp; People</div>
        <div className="scene-cd-role">
          <div className="scene-cd-role-head">
            <div className="scene-cd-role-title">Directors</div>
            <SceneTarget
              active={config.indicator === "edit-comp-btn"}
              tooltip={config.tooltip}
              onClick={() => transition("EDIT")}
              className="scene-cd-role-cta-wrap"
              data-scene-id="add-director-btn"
            >
              <button
                type="button"
                className={`scene-btn scene-btn--ghost scene-btn--xs ${
                  config.indicator !== "edit-comp-btn" ? "scene-btn--dim" : ""
                }`}
                disabled
              >
                + Add Director
              </button>
            </SceneTarget>
          </div>
          <div className="scene-cd-role-rows">
            <SceneTarget
              active={config.indicator === "employee-priya"}
              tooltip={config.tooltip}
              onClick={() => transition("OPEN_PROFILE")}
              className={`scene-cd-role-row ${
                directorPicked ? "scene-cd-role-row--selected" : ""
              }`}
              data-scene-id="row-emp-1"
            >
              <div className="scene-panel__avatar scene-panel__avatar--sm">
                PI
              </div>
              <div className="scene-cd-role-row-fields">
                <div className="scene-cd-role-cell">
                  <div className="scene-cd-field-label">Name</div>
                  <div className="scene-cd-field-control scene-cd-field-control--text scene-cd-field-control--filled">
                    Priya Iyer
                  </div>
                </div>
                <div className="scene-cd-role-cell">
                  <div className="scene-cd-field-label">Position</div>
                  <div className="scene-cd-field-control scene-cd-field-control--text scene-cd-field-control--filled">
                    Director
                  </div>
                </div>
              </div>
            </SceneTarget>

            {addedDirector ? (
              <div className="scene-cd-role-row scene-cd-role-row--new">
                <div className="scene-panel__avatar scene-panel__avatar--sm scene-panel__avatar--gold">
                  +
                </div>
                <div className="scene-cd-role-row-fields">
                  <div className="scene-cd-role-cell">
                    <div className="scene-cd-field-label">Name</div>
                    <div className="scene-cd-field-control scene-cd-field-control--text scene-cd-field-control--placeholder">
                      New director…
                    </div>
                  </div>
                  <div className="scene-cd-role-cell">
                    <div className="scene-cd-field-label">Position</div>
                    <div className="scene-cd-field-control scene-cd-field-control--text scene-cd-field-control--placeholder">
                      Director
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {addedDirector ? (
        <div className="scene-panel__complete">
          Form saved · Roles &amp; People synced to mail merge sources
        </div>
      ) : null}
    </div>
  );
};

/* ── 7. Minutebook ─────────────────────────────────────────────── */

export const renderMinutebook = ({ state, config, transition, STATES }) => {
  const sectionOpen = state !== STATES.WAITING_FOR_SECTION;
  const docOpen =
    state === STATES.WAITING_FOR_DOWNLOAD ||
    state === STATES.DOWNLOADING ||
    state === STATES.DONE;

  const YEARS = ["2026", "2025", "2024", "Historical"];

  const CARDS = [
    {
      id: "doc-articles-incorporation",
      title: "Articles of Incorporation (BC)",
      filed: "Mar 14, 2024",
      symbol: "assignment",
      target: true,
    },
    {
      id: "doc-unanimous-shareholders-agreement",
      title: "Unanimous Shareholders Agreement",
      filed: "Mar 18, 2024",
      symbol: "contract_edit",
    },
    {
      id: "doc-bylaws",
      title: "Bylaws",
      filed: "Mar 14, 2024",
      symbol: "groups",
    },
  ];

  return (
    <SceneFrame
      leftWidth="280px"
      left={
        <div className="scene-sidebar">
          <div className="scene-mb-filter">
            <div className="scene-mb-filter-label">Year</div>
            <div className="scene-mb-filter-pills">
              {YEARS.map((y, i) => (
                <span
                  key={y}
                  className={`scene-mb-filter-pill ${
                    i === 0 ? "scene-mb-filter-pill--active" : ""
                  }`}
                >
                  {y}
                </span>
              ))}
            </div>
          </div>

          <div className="scene-mb-filter">
            <div className="scene-mb-filter-label">Category</div>
            <div className="scene-sidebar__list">
              {[
                {
                  id: "section-constating",
                  label: "Constating Documents",
                  n: 4,
                },
                {
                  id: "section-resolutions",
                  label: "Director Resolutions",
                  n: 22,
                },
                {
                  id: "section-shareholder-consents",
                  label: "Shareholder Consents",
                  n: 14,
                },
                {
                  id: "section-officer-appointments",
                  label: "Officer Appointments",
                  n: 6,
                },
                {
                  id: "section-share-issuance",
                  label: "Share Issuance",
                  n: 8,
                },
              ].map((s) => (
                <SceneTarget
                  key={s.id}
                  active={
                    config.indicator === "section-constating" &&
                    s.id === "section-constating"
                  }
                  tooltip={
                    s.id === "section-constating" ? config.tooltip : null
                  }
                  onClick={() => transition("OPEN_SECTION")}
                  className={`scene-sidebar__item ${
                    sectionOpen && s.id === "section-constating"
                      ? "scene-sidebar__item--active"
                      : ""
                  }`}
                  data-scene-id={`section-${s.id}`}
                >
                  <div className="scene-sidebar__item-label">{s.label}</div>
                  <div className="scene-sidebar__item-count">{s.n}</div>
                </SceneTarget>
              ))}
            </div>
          </div>
        </div>
      }
      right={
        <div className="scene-grid">
          <div className="scene-mb-header">
            <SceneHeader
              eyebrow={
                sectionOpen
                  ? "CONSTATING DOCUMENTS · 4 FILED"
                  : "MINUTE BOOK"
              }
              title={
                sectionOpen
                  ? "Your filed records"
                  : "Pick a section to browse"
              }
              sub="Preserved with provenance"
            />
            <button
              type="button"
              className="scene-btn scene-btn--ghost scene-btn--xs scene-btn--dim"
              disabled
            >
              Export Minutebook
            </button>
          </div>

          {sectionOpen ? (
            <div className="scene-mb-cards">
              {CARDS.map((d) => (
                <SceneTarget
                  key={d.id}
                  active={
                    config.indicator === "doc-articles-incorporation" &&
                    d.target === true
                  }
                  tooltip={d.target ? config.tooltip : null}
                  onClick={() => transition("OPEN_DOC")}
                  className={`scene-mb-card ${
                    docOpen && d.target ? "scene-mb-card--active" : ""
                  }`}
                  data-scene-id={`doc-${d.id}`}
                >
                  <div className="scene-mb-card-icon" aria-hidden="true">
                    <span className="material-symbols-outlined">
                      {d.symbol}
                    </span>
                  </div>
                  <div className="scene-mb-card-title">{d.title}</div>
                  <div className="scene-mb-card-meta">Filed · {d.filed}</div>
                </SceneTarget>
              ))}
            </div>
          ) : null}

          {docOpen ? (
            <SceneTarget
              active={config.indicator === "download-btn"}
              tooltip={config.tooltip}
              onClick={() => transition("DOWNLOAD")}
              className="scene-panel__cta-wrap scene-grid__cta"
              data-scene-id="download-btn"
            >
              <button
                type="button"
                className={`scene-btn scene-btn--primary ${
                  config.indicator !== "download-btn" ? "scene-btn--dim" : ""
                }`}
                disabled
              >
                Download Original PDF
              </button>
            </SceneTarget>
          ) : null}

          {state === STATES.DOWNLOADING ? (
            <AutoAdvance
              event="DOWNLOADED"
              transition={transition}
              delay={1100}
              label="Preparing signed URL…"
            />
          ) : null}

          {state === STATES.DONE ? (
            <div className="scene-panel__complete">
              Downloaded · access logged in audit trail
            </div>
          ) : null}
        </div>
      }
    />
  );
};

/* ── 8. Data Room ──────────────────────────────────────────────── */

export const renderDataRoom = ({ state, config, transition, STATES }) => {
  const roomOpen = state !== STATES.WAITING_FOR_ROOM;
  const sent =
    state === STATES.WAITING_FOR_ACTIVITY || state === STATES.DONE;
  const activityOpen = state === STATES.DONE;
  // Modal shows during the "fill the form" step (WAITING_FOR_SEND_INVITE)
  // and the "sending" step (SENDING_INVITE). Splitting these two states is
  // what gives the visitor a real click to send — without it the modal
  // auto-advances the moment it appears, which felt like the demo was
  // ignoring the user.
  const inviteModalOpen =
    state === STATES.WAITING_FOR_SEND_INVITE ||
    state === STATES.SENDING_INVITE;
  const inviteFormFilled = state === STATES.SENDING_INVITE;

  const FILES = [
    {
      name: "Articles of Incorporation.pdf",
      date: "Mar 14, 2024",
      size: "142 KB",
      status: "Verified",
    },
    {
      name: "2025 Audited Financials.pdf",
      date: "Feb 28, 2026",
      size: "2.4 MB",
      status: "Verified",
    },
    {
      name: "Cap Table v3.xlsx",
      date: "Apr 10, 2026",
      size: "94 KB",
      status: "Verified",
    },
    {
      name: "Q1 2026 Board Deck.pdf",
      date: "Apr 18, 2026",
      size: "3.1 MB",
      status: "Pending",
    },
    {
      name: "IP Assignment Roster.pdf",
      date: "Apr 22, 2026",
      size: "186 KB",
      status: "Verified",
    },
  ];

  return (
    <div className="scene-dr">
      {/* Three-pane: rooms list / file table / activity feed */}
      <div className="scene-dr-grid">
        {/* Rooms sidebar */}
        <div className="scene-sidebar scene-dr-rooms">
          <div className="scene-sidebar__title">Your data rooms</div>
          <div className="scene-sidebar__list">
            {[
              {
                id: "room-seriesA",
                label: "Series A — Q2 2026",
                n: 42,
                status: "Active",
              },
              {
                id: "room-seed",
                label: "Seed Extension · 2025",
                n: 18,
                status: "Archived",
              },
            ].map((r) => (
              <SceneTarget
                key={r.id}
                active={
                  config.indicator === "room-seriesA" &&
                  r.id === "room-seriesA"
                }
                tooltip={r.id === "room-seriesA" ? config.tooltip : null}
                onClick={() => transition("OPEN_ROOM")}
                className={`scene-sidebar__item ${
                  roomOpen && r.id === "room-seriesA"
                    ? "scene-sidebar__item--active"
                    : ""
                }`}
                data-scene-id={`room-${r.id}`}
              >
                <div className="scene-sidebar__item-label">{r.label}</div>
                <div className="scene-sidebar__item-meta">
                  {r.n} docs ·{" "}
                  <span
                    className={
                      r.status === "Active" ? "scene-chip--ok" : "scene-chip--archived"
                    }
                  >
                    {r.status}
                  </span>
                </div>
              </SceneTarget>
            ))}
          </div>
        </div>

        {/* Center: file table */}
        <div className="scene-dr-center">
          {roomOpen ? (
            <>
              <div className="scene-mb-header">
                <SceneHeader
                  eyebrow="SERIES A — Q2 2026"
                  title="42 documents"
                  sub="Tiered permissions · audit trail"
                />
                <SceneTarget
                  active={config.indicator === "invite-btn"}
                  tooltip={config.tooltip}
                  onClick={() => transition("INVITE")}
                  className="scene-dr-invite-wrap"
                  data-scene-id="invite-btn"
                >
                  <button
                    type="button"
                    className={`scene-btn scene-btn--primary scene-btn--xs ${
                      config.indicator !== "invite-btn"
                        ? "scene-btn--dim"
                        : ""
                    }`}
                    disabled
                  >
                    Invite Investor
                  </button>
                </SceneTarget>
              </div>

              <div className="scene-dr-files">
                <div className="scene-dr-files-head">
                  <div>File Name</div>
                  <div>Date</div>
                  <div>Size</div>
                  <div>Status</div>
                </div>
                {FILES.map((f) => (
                  <div key={f.name} className="scene-dr-files-row">
                    <div className="scene-table__doc-title">
                      <span className="scene-glyph">📄</span>
                      <span>{f.name}</span>
                    </div>
                    <div>{f.date}</div>
                    <div>{f.size}</div>
                    <div>
                      <span
                        className={`scene-chip ${
                          f.status === "Verified"
                            ? "scene-chip--ok"
                            : "scene-chip--pending"
                        }`}
                      >
                        {f.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="scene-empty">
              Pick a data room to continue
            </div>
          )}
        </div>

        {/* Right: invitees + activity */}
        {roomOpen ? (
          <div className="scene-dr-right">
            <div className="scene-invites">
              <div className="scene-invites__heading">
                Invited
                {sent ? (
                  <span className="scene-chip scene-chip--ok">
                    +1 Maplebrook
                  </span>
                ) : null}
              </div>
              <div className="scene-invites__chips">
                {[
                  { initials: "CV", name: "Cedarline Ventures" },
                  { initials: "BC", name: "Banff Capital" },
                  { initials: "PG", name: "Polar Growth" },
                  ...(sent ? [{ initials: "MC", name: "Maplebrook" }] : []),
                ].map((i) => (
                  <div key={i.name} className="scene-invite-chip">
                    <div
                      className={`scene-panel__avatar scene-panel__avatar--sm ${
                        i.initials === "MC"
                          ? "scene-panel__avatar--gold"
                          : ""
                      }`}
                    >
                      {i.initials}
                    </div>
                    <span>{i.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {sent ? (
              <>
                <SceneTarget
                  active={config.indicator === "activity-tab"}
                  tooltip={config.tooltip}
                  onClick={() => transition("OPEN_ACTIVITY")}
                  className="scene-tabs__single"
                  data-scene-id="activity-tab"
                >
                  <div
                    className={`scene-tab ${
                      activityOpen ? "scene-tab--active" : ""
                    }`}
                  >
                    Activity feed
                  </div>
                </SceneTarget>

                {activityOpen ? (
                  <div className="scene-activity">
                    {[
                      {
                        initials: "MC",
                        actor: "Maplebrook Capital",
                        action: "Joined the data room",
                        time: "JUST NOW",
                      },
                      {
                        initials: "CV",
                        actor: "Cedarline Ventures",
                        action: "Downloaded 2025 Audited Financials",
                        time: "12 MIN AGO",
                      },
                      {
                        initials: "BC",
                        actor: "Banff Capital",
                        action: "Viewed Cap Table · v3",
                        time: "38 MIN AGO",
                      },
                    ].map((e, i) => (
                      <div key={i} className="scene-activity__row">
                        <div
                          className={`scene-panel__avatar scene-panel__avatar--sm ${
                            e.initials === "MC"
                              ? "scene-panel__avatar--gold"
                              : ""
                          }`}
                        >
                          {e.initials}
                        </div>
                        <div className="scene-activity__body">
                          <div className="scene-activity__actor">
                            {e.actor}
                          </div>
                          <div className="scene-activity__action">
                            {e.action}
                          </div>
                        </div>
                        <div className="scene-activity__time">{e.time}</div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Invite modal — visible during WAITING_FOR_SEND_INVITE
          (form open, awaiting click) and SENDING_INVITE (form filled,
          AutoAdvance running). The Send Invite button is the gold
          target during the first of those two states. */}
      {inviteModalOpen ? (
        <div className="scene-dr-modal" role="dialog" aria-modal="true">
          <div className="scene-dr-modal-card">
            <div className="scene-dr-modal-title">Invite an investor</div>
            <div className="scene-dr-modal-field">
              <div className="scene-cd-field-label">Email address</div>
              <div
                className={`scene-cd-field-control scene-cd-field-control--text${
                  inviteFormFilled
                    ? " scene-cd-field-control--filled"
                    : " scene-cd-field-control--placeholder"
                }`}
              >
                {inviteFormFilled
                  ? "hello@maplebrook.capital"
                  : "investor@firm.com"}
                {!inviteFormFilled ? (
                  <span className="scene-dr-modal-caret" aria-hidden="true" />
                ) : null}
              </div>
            </div>
            <div className="scene-dr-modal-field">
              <div className="scene-cd-field-label">Permission</div>
              <div className="scene-cd-field-control scene-cd-field-control--cascade scene-cd-field-control--filled">
                <span className="scene-cd-cascade-leg">
                  <span>Viewer</span>
                  <span className="scene-vh-caret" aria-hidden="true">
                    ▾
                  </span>
                </span>
              </div>
              <div className="scene-dr-modal-perms">
                {["Viewer", "View+Download", "Editor", "Admin"].map((p) => (
                  <span
                    key={p}
                    className={`scene-dr-perm-pill ${
                      p === "Viewer" ? "scene-dr-perm-pill--active" : ""
                    }`}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="scene-dr-modal-actions">
              <button
                type="button"
                className="scene-btn scene-btn--ghost scene-btn--xs scene-btn--dim"
                disabled
              >
                Cancel
              </button>
              <SceneTarget
                active={config.indicator === "send-invite-btn"}
                tooltip={config.tooltip}
                onClick={() => transition("SEND")}
                className="scene-panel__cta-wrap"
                data-scene-id="send-invite-btn"
              >
                <button
                  type="button"
                  className={`scene-btn scene-btn--primary scene-btn--xs ${
                    config.indicator !== "send-invite-btn"
                      ? "scene-btn--dim"
                      : ""
                  }`}
                  disabled
                >
                  {inviteFormFilled ? "Sending…" : "Send Invite"}
                </button>
              </SceneTarget>
            </div>
          </div>

          {state === STATES.SENDING_INVITE ? (
            <AutoAdvance
              event="INVITED"
              transition={transition}
              delay={1100}
              label="Sending scoped invite…"
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

/* ── Helper: auto-advance on a timer ─────────────────────────────
   Used for "thinking" states (COMPARING, POPULATING, SENDING, etc).
   Fires `transition(event)` after `delay` ms. Renders a skeleton row
   so the viewport doesn't feel frozen. */
const AutoAdvance = ({ event, transition, label = "Working..." }) => {
  return (
    <SceneTarget
      active
      tooltip="Continue"
      onClick={() => transition(event)}
      className="scene-loading"
      data-scene-id="continue-btn"
    >
      <span className="scene-loading__dot" aria-hidden="true" />
      <span>{label}</span>
      <button type="button" className="scene-btn scene-btn--primary scene-btn--xs" disabled>
        Continue
      </button>
    </SceneTarget>
  );
};