import { useCallback, useEffect, useRef, useState } from "react";
import { registerRoutes, sseResponse } from "./demoNetworkStub.js";
import { useStateMachine } from "./hooks/useStateMachine.js";
import { scrollActiveTargetIntoView } from "./scrollToActiveTarget.js";
import {
  DEMO_AI_RESULT,
  DEMO_ASSIST_PAYLOAD,
  DEMO_SELECTION_TEXT,
  DEMO_INSTRUCTION,
  STATES,
  STATE_CONFIG,
  TOTAL_STEPS,
} from "./scripts/aiDraftingScript.js";
import "./LiveFeatureDemo.css";
import "./LiveScenarioDemo.css"; // scene primitives (scene-target, scene-doc, scene-panel…)

/**
 * LiveFeatureDemo — Visual driver for the AI Drafting walkthrough.
 *
 * The document and assistant panel are JSX + per-state CSS classes drawn
 * from the shared scene primitives (scene-doc, scene-panel, scene-btn,
 * scene-target, track-insert…). State transitions are driven by the FSM
 * in aiDraftingScript. A fetch stub backs the Generate button so the
 * narration stays authentic without contacting a live service.
 */

/* ── Demo registry ───────────────────────────────────────────────────── */

const DEMO_REGISTRY = {
  "ai-drafting": {
    label: "AI Drafting — Live Walkthrough",
    title: "Proprietary Information & Inventions Agreement",
    stubPayload: DEMO_ASSIST_PAYLOAD,
  },
};

/* ── Narration card (same primitive as LiveScenarioDemo) ─────────────── */

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

/* ── State machine spec for the AI Drafting flow ─────────────────────── */

/**
 * Build the FSM directly from STATE_CONFIG. Transitions are declared here
 * (not in the script) so the script stays data-only and the graph shape
 * is explicit. If product-designer removes an intermediate state, the
 * missing branch is silently pruned via the Object.keys filter below.
 */
const buildFsm = () => {
  const graph = {
    [STATES.WAITING_FOR_SELECTION]: {
      on: { SELECT_CLAUSE: STATES.ENTERING_PROMPT },
    },
    [STATES.ENTERING_PROMPT]: { on: { START_PROMPT: STATES.TYPING_PROMPT } },
    [STATES.TYPING_PROMPT]: { on: { PROMPT_DONE: STATES.GENERATING } },
    [STATES.GENERATING]: {
      on: {
        STREAM_DONE: STATES.WAITING_FOR_INSERT,
        STREAM_FAIL: STATES.ENTERING_PROMPT,
      },
    },
    [STATES.WAITING_FOR_INSERT]: { on: { INSERT: STATES.DONE } },
    [STATES.DONE]: { on: { RESTART: STATES.WAITING_FOR_SELECTION } },
  };

  const states = {};
  for (const [name, cfg] of Object.entries(STATE_CONFIG)) {
    const edges = graph[name]?.on ?? {};
    // Filter out any edges pointing at a state that no longer exists
    // (defensive against script collapse).
    const filtered = {};
    for (const [event, target] of Object.entries(edges)) {
      if (STATE_CONFIG[target]) filtered[event] = target;
    }
    states[name] = { ...cfg, on: filtered };
  }

  // Initial state: prefer the first key in STATE_CONFIG iteration order.
  // In practice that's always WAITING_FOR_SELECTION in the current script.
  const initial = STATE_CONFIG[STATES.WAITING_FOR_SELECTION]
    ? STATES.WAITING_FOR_SELECTION
    : Object.keys(STATE_CONFIG)[0];

  return { initial, states };
};

const AI_DRAFTING_FSM = buildFsm();

/* ── Scripted document (left column) ─────────────────────────────────── */

/**
 * The target clause is a bracketed prior-inventions placeholder - expressed
 * as static JSX, scripted, no editor dependencies.
 *
 * Two-phase display:
 *   - Pre-insert: the original bracketed placeholder is shown (pulsing if
 *     active) → visually identical in both WAITING_FOR_SELECTION and the
 *     intermediate wait states.
 *   - Post-insert (DONE, or any state after the insert transition): the
 *     filled schedule entry is shown with a track-change highlight to
 *     communicate "Louis filled this".
 */
const ScriptedDocument = ({ state, config, transition, title }) => {
  const inserted = state === STATES.DONE;
  const clauseActive = config?.indicator === "clause";

  return (
    <div className="live-demo__scripted-doc-wrap">
      <div className="scene-doc">
        <div className="scene-doc__page">
          <div className="scene-doc__heading">{title}</div>

          <div className="scene-doc__section">
            <p className="scene-doc__para">
              THIS PROPRIETARY INFORMATION AND INVENTIONS AGREEMENT (the{" "}
              <strong>&ldquo;Agreement&rdquo;</strong>) is entered into by
              and between <em>&#123;LEGAL NAME OF EMPLOYER&#125;</em>, a
              British Columbia corporation (the{" "}
              <strong>&ldquo;Employer&rdquo;</strong>) and{" "}
              <em>&#123;EMPLOYEE NAME&#125;</em>, currently residing in the
              City of Vancouver (the <strong>&ldquo;Employee&rdquo;</strong>
              ).
            </p>
          </div>

          <div className="scene-doc__section">
            <p className="scene-doc__section-title">
              SCHEDULE A. EXCLUDED PRIOR INVENTIONS
            </p>
            <p className="scene-doc__para">
              The following prior inventions, projects, works of authorship,
              and third-party deliverables are excluded from the assignment
              provisions of this Agreement:
            </p>

            <ScriptedClauseTarget
              active={clauseActive}
              inserted={inserted}
              tooltip={config?.tooltip}
              onClick={() => transition("SELECT_CLAUSE")}
            />

            <p className="scene-doc__para">
              If no excluded prior inventions are listed in this Schedule A,
              the Employee confirms that no such excluded prior inventions
              exist as of the effective date of this Agreement.
            </p>
          </div>

          <div className="scene-doc__section">
            <p className="scene-doc__section-title">
              2. COMPANY WORK PRODUCT
            </p>
            <p className="scene-doc__para scene-doc__para--muted">
              Work product created for the Employer after the effective date
              remains subject to the assignment provisions of this Agreement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * The clickable target clause. Uses the same `.scene-target` primitive as
 * LiveScenarioDemo, so pulse behaviour is identical.
 */
const ScriptedClauseTarget = ({ active, inserted, tooltip, onClick }) => {
  const className = `scene-target ${active ? "scene-target--active" : ""} live-demo__clause-wrap`;

  return (
    <div
      className={className.trim()}
      role={active ? "button" : undefined}
      tabIndex={active ? 0 : -1}
      onClick={active ? onClick : undefined}
      onKeyDown={
        active
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <p className="scene-doc__para scene-doc__para--highlight">
        {inserted ? (
          <>
            <span className="track-delete">
              [INSERT LIST OF EXCLUDED PRIOR INVENTIONS]
            </span>{" "}
            <span className="track-insert">
              (i) "Aurora UI", an open-source design system library released
              by the Employee under the MIT License in 2022 and maintained at
              github.com/priya-iyer/aurora-ui; and (ii) freelance product
              design services performed by the Employee for Acme Insurance
              Co. between January 2023 and August 2023, the deliverables of
              which are owned by Acme Insurance Co. pursuant to the parties'
              written engagement letter dated January 9, 2023
            </span>
          </>
        ) : (
          "[INSERT LIST OF EXCLUDED PRIOR INVENTIONS]"
        )}
      </p>
      {active && tooltip ? (
        <span className="scene-target__tooltip">{tooltip}</span>
      ) : null}
    </div>
  );
};

/* ── Scripted assistant panel (right column) ─────────────────────────── */

/**
 * Visual assistant panel — Rewrite/Chat tabs, selection textarea,
 * instruction textarea, Generate button, draft area, Insert button.
 * Entirely scripted: no network calls beyond the stubbed
 * `/demo/api/assist/rewrite` handled by demoNetworkStub.
 */
const ScriptedAssistantPanel = ({
  state,
  config,
  transition,
  selectionText,
  instruction,
  promptText,
  draftText,
  streamingText,
  streaming,
  error,
  onPromptClick,
  onInsert,
}) => {
  const promptActive = config?.indicator === "prompt";
  const promptTyping = state === STATES.TYPING_PROMPT;
  const promptComplete =
    state === STATES.GENERATING ||
    state === STATES.WAITING_FOR_INSERT ||
    state === STATES.DONE;
  const displayedPrompt = promptComplete ? instruction : promptText;
  const insertActive = config?.indicator === "insert-btn";
  const draftActive = config?.indicator === "draft";
  const hasSelection = selectionText.length > 0;
  const hasDraft = Boolean(draftText || streamingText);
  const displayedDraft = streaming && streamingText ? streamingText : draftText;

  return (
    <div className="live-demo__scripted-panel">
      <div className="live-demo__panel-header">
        <div className="live-demo__panel-tabs" role="tablist" aria-label="Assistant">
          <button
            type="button"
            role="tab"
            aria-selected="true"
            className="live-demo__panel-tab live-demo__panel-tab--active"
            disabled
          >
            Rewrite
          </button>
          <button
            type="button"
            role="tab"
            aria-selected="false"
            className="live-demo__panel-tab"
            disabled
          >
            Chat
          </button>
        </div>
      </div>

      {/* AI context bar — document title + placeholder status */}
      <div className="live-demo__panel-context">
        <div className="live-demo__panel-context-title">
          Proprietary Information &amp; Inventions Agreement
        </div>
        <div className="live-demo__panel-context-status">
          <span
            className="live-demo__panel-context-dot"
            aria-hidden="true"
          />
          Placeholder ready
        </div>
      </div>

      <div className="live-demo__panel-body">
        {/* Step 1 — Selection card */}
        <div className="live-demo__panel-card live-demo__panel-card--step">
          <div className="live-demo__panel-step-badge" aria-hidden="true">
            1
          </div>
          <div className="live-demo__panel-step-body">
            <div className="live-demo__panel-label">
              Selected placeholder
              {hasSelection ? (
                <span className="live-demo__panel-hint">detected</span>
              ) : null}
            </div>
            <div
              className={`live-demo__panel-selection${
                hasSelection ? "" : " live-demo__panel-selection--empty"
              }`}
            >
              {hasSelection ? (
                <span>{selectionText}</span>
              ) : (
                <span className="live-demo__panel-selection-placeholder">
                  Click a placeholder to begin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Step 2 — Instruction + Generate */}
        <div className="live-demo__panel-card live-demo__panel-card--step">
          <div className="live-demo__panel-step-badge" aria-hidden="true">
            2
          </div>
          <div className="live-demo__panel-step-body">
            <div className="live-demo__panel-label">
              Tell Louis what to put in the bracket
              {promptTyping ? (
                <span className="live-demo__panel-hint live-demo__panel-hint--pulsing">
                  typing
                </span>
              ) : null}
            </div>
            <div
              className={`scene-target ${
                promptActive ? "scene-target--active" : ""
              }`}
              role={state === STATES.ENTERING_PROMPT ? "button" : undefined}
              tabIndex={state === STATES.ENTERING_PROMPT ? 0 : -1}
              onClick={state === STATES.ENTERING_PROMPT ? onPromptClick : undefined}
              onKeyDown={
                state === STATES.ENTERING_PROMPT
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onPromptClick?.();
                      }
                    }
                  : undefined
              }
            >
              <div
                className={`live-demo__panel-instruction${
                  displayedPrompt ? "" : " live-demo__panel-instruction--empty"
                }`}
              >
                {displayedPrompt || "Click to enter drafting prompt"}
                {promptTyping ? (
                  <span className="live-demo__panel-caret" aria-hidden="true" />
                ) : null}
              </div>
              {promptActive && config?.tooltip ? (
                <span className="scene-target__tooltip">{config.tooltip}</span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Step 3 — Draft / streaming / done */}
        {state === STATES.GENERATING || hasDraft || state === STATES.DONE ? (
          <div
            className={`scene-target ${
              draftActive ? "scene-target--active" : ""
            } live-demo__panel-card live-demo__panel-card--step live-demo__panel-card--draft`}
          >
            <div className="live-demo__panel-step-badge" aria-hidden="true">
              3
            </div>
            <div className="live-demo__panel-step-body">
              <div className="live-demo__panel-label">
                Edit &amp; insert
                {streaming ? (
                  <span className="live-demo__panel-hint live-demo__panel-hint--pulsing">
                    streaming
                  </span>
                ) : null}
              </div>

              {streaming && !displayedDraft ? (
                <DraftSkeleton />
              ) : (
                <div className="live-demo__panel-draft">
                  {displayedDraft || <DraftSkeleton />}
                  {streaming && displayedDraft ? (
                    <span className="live-demo__panel-caret" aria-hidden="true" />
                  ) : null}
                </div>
              )}

              {state !== STATES.GENERATING && hasDraft ? (
                <div className="live-demo__panel-actions">
                  <button
                    type="button"
                    className="scene-btn scene-btn--ghost scene-btn--xs scene-btn--dim"
                    disabled
                  >
                    Regenerate
                  </button>
                  <div
                    className={`scene-target ${
                      insertActive ? "scene-target--active" : ""
                    }`}
                    role={insertActive ? "button" : undefined}
                    tabIndex={insertActive ? 0 : -1}
                    onClick={insertActive ? onInsert : undefined}
                    onKeyDown={
                      insertActive
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onInsert?.();
                            }
                          }
                        : undefined
                    }
                  >
                    <button
                      type="button"
                      className={`scene-btn scene-btn--primary${
                        insertActive ? "" : " scene-btn--dim"
                      }`}
                      disabled
                    >
                      Insert into Document
                    </button>
                    {insertActive && config?.tooltip ? (
                      <span className="scene-target__tooltip">
                        {config.tooltip}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {error ? <div className="live-demo__panel-error">{error}</div> : null}

        {/* Refine this draft — shown after a draft is generated */}
        {hasDraft ? (
          <div className="live-demo__panel-refine">
            <div className="live-demo__panel-refine-label">
              Refine this draft
            </div>
            <div className="live-demo__panel-refine-prompts">
              <button
                type="button"
                className="live-demo__panel-refine-pill"
                disabled
              >
                Add project URL
              </button>
              <button
                type="button"
                className="live-demo__panel-refine-pill"
                disabled
              >
                Shorten schedule entry
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const DraftSkeleton = () => (
  <div className="live-demo__draft-skeleton" aria-hidden="true">
    <div className="live-demo__draft-row live-demo__draft-row--long" />
    <div className="live-demo__draft-row live-demo__draft-row--medium" />
    <div className="live-demo__draft-row live-demo__draft-row--long" />
    <div className="live-demo__draft-row live-demo__draft-row--short" />
  </div>
);

/* ── Main component ──────────────────────────────────────────────────── */

const LiveFeatureDemo = ({ demoId = "ai-drafting" }) => {
  const config = DEMO_REGISTRY[demoId] ?? null;

  const {
    state,
    config: stateConfigRaw,
    transition,
    reset: resetMachine,
  } = useStateMachine(AI_DRAFTING_FSM);

  const [resetKey, setResetKey] = useState(0);
  const [selectionText, setSelectionText] = useState("");
  const [promptText, setPromptText] = useState("");
  const [draftText, setDraftText] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const generationStartedRef = useRef(false);

  // Keep a stable reference to the latest transition callback so the fetch
  // loop can call it without retriggering the effect.
  const transitionRef = useRef(transition);
  transitionRef.current = transition;

  // Root of the demo card — used by the auto-scroll effect to bound the
  // search for the active target and to confine the scroll to the demo's
  // internal scroll containers (so the page itself never jumps).
  const rootRef = useRef(null);

  /* ── Auto-scroll the new active target into view on every state
       transition. Same pattern as LiveScenarioDemo. ───────────────── */
  useEffect(() => {
    if (!rootRef.current) return undefined;
    const id = requestAnimationFrame(() => {
      scrollActiveTargetIntoView(rootRef.current);
    });
    return () => cancelAnimationFrame(id);
  }, [state, resetKey, promptText, streamingText]);

  const stateConfig =
    stateConfigRaw ?? STATE_CONFIG[STATES.WAITING_FOR_SELECTION] ?? {};

  /* ── Fetch stub install/uninstall ────────────────────────────────── */
  useEffect(() => {
    if (!config) return undefined;
    const dispose = registerRoutes({
      "POST /demo/api/assist/rewrite": () => sseResponse(config.stubPayload),
    });
    return dispose;
  }, [config]);

  /* ── Handler: clause selected ───────────────────────────────────── */
  const handleSelectClause = useCallback(() => {
    if (state !== STATES.WAITING_FOR_SELECTION) return;
    setSelectionText(DEMO_SELECTION_TEXT);
    setPromptText("");
    transition("SELECT_CLAUSE");
  }, []);

  useEffect(() => {
    if (state !== STATES.GENERATING || generationStartedRef.current) return;
    runGenerate();
  }, [state, runGenerate]);

  const handlePromptClick = useCallback(() => {
    if (state !== STATES.ENTERING_PROMPT) return;
    setPromptText("");
    transition("START_PROMPT");
  }, [state, transition]);

  useEffect(() => {
    if (state !== STATES.TYPING_PROMPT) return undefined;
    let index = 0;
    const id = window.setInterval(() => {
      index += 2;
      const next = DEMO_INSTRUCTION.slice(0, index);
      setPromptText(next);
      if (next.length >= DEMO_INSTRUCTION.length) {
        window.clearInterval(id);
        transitionRef.current("PROMPT_DONE");
      }
    }, 28);
    return () => window.clearInterval(id);
  }, [state]);

  /* ── Handler: Generate → stream the stubbed SSE response ───────── */
  const runGenerate = useCallback(async () => {
    generationStartedRef.current = true;
    setStreaming(true);
    setStreamingText("");
    setDraftText("");
    setError(null);

    try {
      const response = await fetch("/demo/api/assist/rewrite?stream=1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectionText: DEMO_SELECTION_TEXT,
          instruction: DEMO_INSTRUCTION,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Assist failed: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamed = "";
      let finalText = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let boundary;
        while ((boundary = buffer.indexOf("\n\n")) !== -1) {
          const block = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);
          let eventType = "message";
          let data = "";
          for (const line of block.split("\n")) {
            if (line.startsWith("event: ")) eventType = line.slice(7).trim();
            else if (line.startsWith("data: ")) data += line.slice(6);
          }
          if (!data) continue;
          try {
            const parsed = JSON.parse(data);
            if (eventType === "token" && parsed.text) {
              streamed += parsed.text;
              setStreamingText(streamed);
            } else if (eventType === "done") {
              finalText = parsed.suggestedReplacement?.text ?? streamed;
            }
          } catch {
            // skip malformed
          }
        }
      }

      const resolvedText = finalText || streamed || DEMO_AI_RESULT;
      setDraftText(resolvedText);
      setStreamingText("");
      transitionRef.current("STREAM_DONE");
    } catch (err) {
      setError(err?.message || "Unable to reach Louis.");
      transitionRef.current("STREAM_FAIL");
    } finally {
      setStreaming(false);
    }
  }, [state, transition]);

  /* ── Handler: Insert ─────────────────────────────────────────────── */
  const runInsert = useCallback(() => {
    if (state !== STATES.WAITING_FOR_INSERT) return;
    transition("INSERT");
  }, [state, transition]);

  /* ── Handler: Start Over ─────────────────────────────────────────── */
  const handleRestart = useCallback(() => {
    resetMachine();
    setSelectionText("");
    setPromptText("");
    setDraftText("");
    setStreamingText("");
    setStreaming(false);
    setError(null);
    generationStartedRef.current = false;
    setResetKey((k) => k + 1);
  }, [resetMachine]);

  if (!config) {
    return (
      <div className="live-demo live-demo--unknown">
        <p>Unknown demo: {demoId}</p>
      </div>
    );
  }

  const isDone = state === STATES.DONE;
  const isRestartLive = isDone;

  return (
    <div
      ref={rootRef}
      className={`live-demo live-scenario-demo live-demo--${state}`}
      data-demo={demoId}
      data-state={state}
      data-indicator={stateConfig.indicator ?? ""}
      key={`live-demo-${resetKey}`}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="live-demo__header">
        <div className="live-demo__title">
          <span className="live-demo__title-dot" aria-hidden="true" />
          {config.label}
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

      {/* ── Viewport ──────────────────────────────────────────── */}
      <div className="live-demo__viewport">
        <div className="live-demo__scripted-stage">
          <div className="live-demo__scripted-doc-col">
            <ScriptedDocument
              state={state}
              config={stateConfig}
              transition={handleSelectClause}
              title={config.title}
            />
          </div>
          <div className="live-demo__scripted-panel-col">
            <ScriptedAssistantPanel
              state={state}
              config={stateConfig}
              transition={transition}
              selectionText={selectionText}
              instruction={DEMO_INSTRUCTION}
              promptText={promptText}
              draftText={draftText}
              streamingText={streamingText}
              streaming={streaming}
              error={error}
              onPromptClick={handlePromptClick}
              onInsert={runInsert}
            />
          </div>
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

export default LiveFeatureDemo;
