import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRoutes, jsonResponse } from "./demoNetworkStub.js";
import { useStateMachine } from "./hooks/useStateMachine.js";
import { scrollActiveTargetIntoView } from "./scrollToActiveTarget.js";
import "./LiveFeatureDemo.css";
import "./LiveScenarioDemo.css";

// Scripts — each exports { STATES, TOTAL_STEPS, STATE_CONFIG, FSM, ... }
import * as CollaborativeEditing from "./scripts/collaborativeEditingScript.js";
import * as VersionControl from "./scripts/versionControlScript.js";
import * as ESignature from "./scripts/eSignatureScript.js";
import * as MailMerge from "./scripts/mailMergeScript.js";
import * as TemplateLibrary from "./scripts/templateLibraryScript.js";
import * as CompanyData from "./scripts/companyDataScript.js";
import * as Minutebook from "./scripts/minutebookScript.js";
import * as DataRoom from "./scripts/dataRoomScript.js";

// Per-demo scripted content renderers. Each maps a state → JSX representing
// what the user sees in that state.
import {
  renderCollaborativeEditing,
  renderVersionControl,
  renderESignature,
  renderMailMerge,
  renderTemplateLibrary,
  renderCompanyData,
  renderMinutebook,
  renderDataRoom,
} from "./scenarioRenderers.jsx";

/**
 * LiveScenarioDemo — Generic driver for the 8 non-AI-Drafting demos.
 *
 * Each demo has a script file (STATES, STATE_CONFIG, FSM, optional data) and
 * a renderer that returns JSX for the current state. This driver:
 *   - Installs fetch stub routes (scoped to /demo/api/*)
 *   - Owns the FSM via `useStateMachine`
 *   - Draws the demo frame (header, step chip, narration card, blobs, Start Over)
 *   - Delegates the content-area rendering to the demo's renderer
 */

const DEMO_REGISTRY = {
  "document-storage": {
    script: CollaborativeEditing,
    label: "Collaborative Editing — Live Walkthrough",
    renderer: renderCollaborativeEditing,
    routes: () => ({
      // No backend writes — comments and track changes are local.
      "GET /demo/api/collaborators": () =>
        jsonResponse({ collaborators: [] }, { delayMs: 80 }),
    }),
  },
  "secure-repository": {
    script: VersionControl,
    label: "Version Control — Live Walkthrough",
    renderer: renderVersionControl,
    routes: () => ({
      "GET /demo/api/documents/:id/versions": () =>
        jsonResponse({ versions: VersionControl.DEMO_VERSIONS }, { delayMs: 140 }),
      "POST /demo/api/documents/:id/versions/:ver/restore": () =>
        jsonResponse({ ok: true, restoredTo: "v1" }, { delayMs: 600 }),
    }),
  },
  "e-signatures": {
    script: ESignature,
    label: "DocuSign Integration — Live Walkthrough",
    renderer: renderESignature,
    routes: () => ({
      "POST /demo/api/e-sign/send": () =>
        jsonResponse(ESignature.DEMO_ENVELOPE_SENT, { delayMs: 900 }),
      "GET /demo/api/e-sign/envelopes/:id": () =>
        jsonResponse(ESignature.DEMO_ENVELOPE_COMPLETED, { delayMs: 180 }),
    }),
  },
  "mail-merge": {
    script: MailMerge,
    label: "Mail Merge — Live Walkthrough",
    renderer: renderMailMerge,
    routes: () => ({
      "GET /demo/api/company/employees": () =>
        jsonResponse({ employees: MailMerge.DEMO_EMPLOYEES }, { delayMs: 120 }),
      "POST /demo/api/documents/mail-merge/preview": () =>
        jsonResponse(MailMerge.DEMO_MERGE_PREVIEW, { delayMs: 450 }),
      "POST /demo/api/documents": () =>
        jsonResponse(
          { documentId: MailMerge.DEMO_MERGE_PREVIEW.documentId, ok: true },
          { delayMs: 220 },
        ),
    }),
  },
  "template-library": {
    script: TemplateLibrary,
    label: "Template Library — Live Walkthrough",
    renderer: renderTemplateLibrary,
    routes: () => ({
      "GET /demo/api/templates": () =>
        jsonResponse(
          { templates: TemplateLibrary.DEMO_TEMPLATES },
          { delayMs: 120 },
        ),
      "POST /demo/api/templates/:id/instantiate": () =>
        jsonResponse(TemplateLibrary.DEMO_INSTANTIATED_DOC, { delayMs: 500 }),
    }),
  },
  "company-data": {
    script: CompanyData,
    label: "Company Data — Live Walkthrough",
    renderer: renderCompanyData,
    routes: () => ({
      "GET /demo/api/company/employees": () =>
        jsonResponse({ employees: CompanyData.DEMO_EMPLOYEES }, { delayMs: 120 }),
      "GET /demo/api/company/employees/:id": (req) => {
        const found =
          CompanyData.DEMO_EMPLOYEES.find((e) => e.id === req.params.id) ||
          null;
        return jsonResponse(found ?? { error: "not-found" }, {
          status: found ? 200 : 404,
          delayMs: 90,
        });
      },
      "PATCH /demo/api/company/employees/:id": () =>
        jsonResponse({ ok: true }, { delayMs: 240 }),
    }),
  },
  minutebook: {
    script: Minutebook,
    label: "Minutebook — Live Walkthrough",
    renderer: renderMinutebook,
    routes: () => ({
      "GET /demo/api/minutebook": () =>
        jsonResponse({ sections: Minutebook.DEMO_SECTIONS }, { delayMs: 120 }),
      "GET /demo/api/minutebook/documents/:id": (req) => {
        const found =
          Minutebook.DEMO_DOCUMENTS.find((d) => d.id === req.params.id) ||
          null;
        return jsonResponse(found ?? { error: "not-found" }, {
          status: found ? 200 : 404,
          delayMs: 120,
        });
      },
      "GET /demo/api/minutebook/documents/:id/download": () =>
        jsonResponse(
          { signedUrl: "https://example.com/signed/demo", expiresIn: 60 },
          { delayMs: 750 },
        ),
    }),
  },
  "data-room": {
    script: DataRoom,
    label: "Data Room — Live Walkthrough",
    renderer: renderDataRoom,
    routes: () => ({
      "GET /demo/api/data-rooms": () =>
        jsonResponse({ rooms: DataRoom.DEMO_ROOMS }, { delayMs: 140 }),
      "GET /demo/api/data-rooms/:id": (req) => {
        const found =
          DataRoom.DEMO_ROOMS.find((r) => r.id === req.params.id) || null;
        return jsonResponse(found ?? { error: "not-found" }, {
          status: found ? 200 : 404,
          delayMs: 100,
        });
      },
      "POST /demo/api/data-rooms/:id/invites": () =>
        jsonResponse(DataRoom.DEMO_INVITE, { delayMs: 800 }),
      "GET /demo/api/data-rooms/:id/activity": () =>
        jsonResponse(
          { events: DataRoom.DEMO_ACTIVITY_FEED },
          { delayMs: 120 },
        ),
    }),
  },
};

/* ── Narration card (shared with LiveFeatureDemo — inlined here) ──── */

const NarrationCard = ({ narration, corner, stepKey, isDone = false }) => {
  if (!narration || (!narration.title && !narration.body)) return null;
  return (
    <div
      className={`live-demo__narration live-demo__narration--${corner}${
        isDone ? " live-demo__narration--done" : ""
      }`}
      key={`narr-${stepKey}`}
    >
      <div className="live-demo__narration-badge" aria-hidden="true">
        <span className="live-demo__narration-badge-mark" />
      </div>
      <div className="live-demo__narration-text">
        <div className="live-demo__narration-eyebrow">
          {isDone ? "DONE" : "WHAT'S HAPPENING"}
        </div>
        {narration.title && (
          <div className="live-demo__narration-title">{narration.title}</div>
        )}
        {narration.body && (
          <div className="live-demo__narration-body">{narration.body}</div>
        )}
      </div>
    </div>
  );
};

/* ── Component ──────────────────────────────────────────────────────── */

const LiveScenarioDemo = ({ demoId }) => {
  const entry = DEMO_REGISTRY[demoId] ?? null;

  // Always call hooks in the same order — if the demo is unknown we still
  // mount a stub FSM to keep the hook count stable across renders.
  const fsm = useMemo(() => {
    if (entry) return entry.script.FSM;
    return { initial: "UNKNOWN", states: { UNKNOWN: {} } };
  }, [entry]);

  const { state, config, transition, reset } = useStateMachine(fsm);
  const [resetKey, setResetKey] = useState(0);
  const navigate = useNavigate();
  const rootRef = useRef(null);

  /* ── Register fetch stub routes ──────────────────────────────────── */
  useEffect(() => {
    if (!entry || typeof entry.routes !== "function") return undefined;
    const dispose = registerRoutes(entry.routes());
    return dispose;
  }, [entry]);

  /* ── Auto-scroll the new active target into view on every state
       transition. Confined to the demo's internal scroll containers —
       the page itself never moves. Honours prefers-reduced-motion. ── */
  useEffect(() => {
    if (!rootRef.current) return undefined;
    // Wait one frame so the new scene tree has been laid out before we
    // measure positions. Without rAF the geometry can be stale on the
    // very first paint after a state change.
    const id = requestAnimationFrame(() => {
      scrollActiveTargetIntoView(rootRef.current);
    });
    return () => cancelAnimationFrame(id);
  }, [state, resetKey]);

  /* ── Start Over — bump resetKey + reset FSM ─────────────────────── */
  const handleRestart = useCallback(() => {
    reset();
    setResetKey((k) => k + 1);
  }, [reset]);

  if (!entry) {
    return (
      <div className="live-demo live-demo--unknown">
        <p>Unknown demo: {demoId}</p>
      </div>
    );
  }

  const {
    script: { TOTAL_STEPS, STATES },
    label,
    renderer,
  } = entry;

  const stateConfig = config ?? {};
  const isDone = state === STATES.DONE;
  const isRestartLive = isDone;

  return (
    <div
      ref={rootRef}
      className={`live-demo live-scenario-demo live-demo--${state}`}
      data-demo={demoId}
      data-state={state}
      data-indicator={stateConfig.indicator ?? ""}
    >
      {/* Header with live-dot, hint, step chip */}
      <div className="live-demo__header">
        <div className="live-demo__title">
          <span className="live-demo__title-dot" aria-hidden="true" />
          {label}
        </div>
        <div className="live-demo__header-right">
          <div className="live-demo__hint">
            Interactive ·{" "}
            <span className="live-demo__hint-gold">follow the gold pulse</span>
          </div>
          {stateConfig.step ? (
            <div
              className="live-demo__step-chip"
              aria-label={`Step ${stateConfig.step} of ${TOTAL_STEPS}`}
            >
              Step{" "}
              <span className="live-demo__step-chip-num">
                {String(stateConfig.step).padStart(2, "0")}
              </span>{" "}
              of {String(TOTAL_STEPS).padStart(2, "0")}
            </div>
          ) : null}
        </div>
      </div>

      {/* Viewport — scripted scene renders per-state content */}
      <div className="live-demo__viewport">
        <div
          className="live-scenario-demo__scene"
          key={`scene-${resetKey}-${state}`}
        >
          {renderer({ state, config: stateConfig, transition, STATES, navigate })}
        </div>

        <NarrationCard
          narration={stateConfig.narration}
          corner={stateConfig.narrationCorner ?? "bottom-left"}
          stepKey={state}
          isDone={isDone}
        />

        {isRestartLive ? (
          <div className="live-demo__restart-wrap">
            <div className="live-demo__restart-done-label" aria-hidden="true">
              Done
            </div>
            <button
              type="button"
              className="live-demo__restart live-demo__pulse"
              onClick={handleRestart}
            >
              Start Over
            </button>
          </div>
        ) : null}

        <div className="live-demo__blob live-demo__blob--gold" aria-hidden="true" />
        <div className="live-demo__blob live-demo__blob--ink" aria-hidden="true" />
      </div>
    </div>
  );
};

export default LiveScenarioDemo;
