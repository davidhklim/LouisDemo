import { useEffect, useMemo, useRef } from "react";
import { registerRoutes } from "./demoNetworkStub.js";
import { useStateMachine } from "./hooks/useStateMachine.js";

/**
 * LivePageDemo — Shell for non-editor feature demos.
 *
 * For 4 of the 8 non-AI-Drafting demos (TemplateLibrary, CompanyData,
 * Minutebook, DataRoom) the "feature" is a full-page UI, not an editor
 * + side panel. `LiveFeatureDemo` doesn't fit — it is editor-shaped.
 * This wrapper is lighter-weight and purely logical: it
 *
 *   1. Installs scripted network stub routes on mount; cleans up on unmount.
 *   2. Drives a finite-state machine via `useStateMachine`.
 *   3. Renders the real page component (child render prop) inside a demo
 *      frame, passing the state through so the caller can script props.
 *   4. Provides neutral slot containers for pulse indicators, narration
 *      card, and a Start Over button — the calling page fills in the
 *      visual primitives (GoldPulse, NarrationCard, etc).
 *
 * This component deliberately has NO visual styling decisions. The
 * caller adds CSS keyed off the BEM-style class names below.
 *
 * ── API ──────────────────────────────────────────────────────────────────
 *
 *   <LivePageDemo
 *     demoId="template-library"
 *     stateMachine={{ initial, states }}
 *     stubRoutes={{
 *       "GET /demo/api/templates": () => jsonResponse(scripted()),
 *       "POST /demo/api/templates/:id/use": (req) => jsonResponse({ ok: true }),
 *     }}
 *     resetKey={resetKey}
 *     narration={<NarrationCard ... />}      // optional, caller fills in
 *     pulseOverlay={<GoldPulse ... />}       // optional, caller fills in
 *     startOverButton={<StartOver ... />}    // optional, caller fills in
 *   >
 *     {({ state, config, transition, reset, key }) => (
 *       <RealPageComponent key={key} {...scriptedProps(state)} />
 *     )}
 *   </LivePageDemo>
 *
 * ── Children ─────────────────────────────────────────────────────────────
 *
 *   `children` MUST be a function (render prop). It receives:
 *     {
 *       state:      current state name (string),
 *       config:     states[state] config object,
 *       transition: (targetOrEvent: string) => void,
 *       reset:      () => void,           // resets the state machine only
 *       key:        number,               // resetKey, for forcing remount
 *     }
 *   Use `key={key}` on the root of your scripted component to force full
 *   remount on Start Over.
 *
 * ── Slot components ──────────────────────────────────────────────────────
 *
 *   `narration`, `pulseOverlay`, `startOverButton` are optional ReactNodes
 *   rendered into three dedicated wrapper divs. They receive no props — the
 *   caller wires state → slot content. The wrappers exist so CSS can style
 *   positioning without the caller having to know about it.
 *
 * ── resetKey ─────────────────────────────────────────────────────────────
 *
 *   When `resetKey` changes, the state machine resets to its initial state
 *   and the value is forwarded to the render prop as `key`. The child
 *   should apply it to its scripted component's root to force a clean
 *   remount (flushing any mutations the user drove into the real UI).
 */
const LivePageDemo = ({
  demoId,
  stateMachine,
  stubRoutes,
  resetKey = 0,
  narration = null,
  pulseOverlay = null,
  startOverButton = null,
  className = "",
  children,
}) => {
  const { state, config, transition, reset } = useStateMachine(stateMachine);

  // Keep stubRoutes identity fresh via a ref so registerRoutes only runs
  // once per mount — handlers always read the latest scripted values.
  const stubRoutesRef = useRef(stubRoutes);
  stubRoutesRef.current = stubRoutes;

  // Wrap each handler so it dereferences the latest stubRoutesRef entry at
  // call time (allows callers to pass inline handlers that close over
  // current state without triggering re-registration).
  const wrappedRoutes = useMemo(() => {
    if (!stubRoutes) return {};
    const out = {};
    for (const key of Object.keys(stubRoutes)) {
      out[key] = (req) => {
        const current = stubRoutesRef.current?.[key];
        if (typeof current !== "function") {
          return new Response(null, { status: 404 });
        }
        return current(req);
      };
    }
    return out;
    // We intentionally only re-register when the set of route KEYS changes,
    // not when handler identities do. Handlers are read from the ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stubRoutes ? Object.keys(stubRoutes).join("|") : ""]);

  useEffect(() => {
    if (!wrappedRoutes || Object.keys(wrappedRoutes).length === 0) {
      return undefined;
    }
    const dispose = registerRoutes(wrappedRoutes);
    return dispose;
  }, [wrappedRoutes]);

  // Reset the state machine whenever resetKey changes.
  const lastResetKeyRef = useRef(resetKey);
  useEffect(() => {
    if (lastResetKeyRef.current !== resetKey) {
      lastResetKeyRef.current = resetKey;
      reset();
    }
  }, [resetKey, reset]);

  const childRenderProps = {
    state,
    config,
    transition,
    reset,
    key: resetKey,
  };

  return (
    <div
      className={`live-page-demo live-page-demo--${demoId} ${className}`.trim()}
      data-state={state}
    >
      <div className="live-page-demo__stage">
        {typeof children === "function" ? children(childRenderProps) : null}
        {pulseOverlay ? (
          <div className="live-page-demo__pulse-slot">{pulseOverlay}</div>
        ) : null}
      </div>
      {narration ? (
        <div className="live-page-demo__narration-slot">{narration}</div>
      ) : null}
      {startOverButton ? (
        <div className="live-page-demo__start-over-slot">{startOverButton}</div>
      ) : null}
    </div>
  );
};

export default LivePageDemo;
