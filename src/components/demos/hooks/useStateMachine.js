import { useCallback, useMemo, useRef, useState } from "react";

/**
 * useStateMachine — A generic finite-state-machine hook for demo drivers.
 *
 * Config shape:
 *   {
 *     initial: "STATE_A",
 *     states: {
 *       STATE_A: { on: { NEXT: "STATE_B" }, ...anyOtherConfig },
 *       STATE_B: { on: { BACK: "STATE_A", DONE: "STATE_C" }, ... },
 *       STATE_C: { ... },                              // terminal — no transitions
 *     },
 *   }
 *
 * Two transition styles are supported; pick whichever feels natural:
 *
 *   1. By event name (canonical FSM style):
 *        transition("NEXT")        // looks up states[current].on.NEXT
 *
 *   2. By target state name (string shortcut):
 *        transition("STATE_B")     // validates that states[current].on has
 *                                  // some entry mapping to STATE_B
 *
 * If the current state does not define a transition to the requested target,
 * transition() is a no-op (returns the unchanged state name). This is the
 * validation guard mentioned in the platform brief.
 *
 * @template {string} S
 * @param {object} config
 * @param {S} config.initial
 * @param {Record<S, { on?: Record<string, S> } & Record<string, unknown>>} config.states
 * @returns {{
 *   state: S,
 *   config: object,
 *   transition: (targetOrEvent: string) => S,
 *   reset: () => void,
 *   can: (targetOrEvent: string) => boolean,
 * }}
 */
export const useStateMachine = (config) => {
  const { initial, states } = config;
  const [state, setState] = useState(initial);

  // Keep a stable ref to the states table so transition() / can() keep a
  // stable identity across renders even if the caller rebuilds the object
  // inline.
  const statesRef = useRef(states);
  statesRef.current = states;

  const initialRef = useRef(initial);
  initialRef.current = initial;

  /**
   * Resolve `targetOrEvent` for the given current state:
   *   - If states[current].on[targetOrEvent] is defined, treat it as an event
   *     name and return the mapped target state.
   *   - Otherwise, if targetOrEvent is itself the target of some on-entry,
   *     return targetOrEvent (string-shortcut style).
   *   - Otherwise, return null (invalid transition).
   */
  const resolveTarget = useCallback((currentState, targetOrEvent) => {
    const stateDef = statesRef.current?.[currentState];
    const on = stateDef?.on ?? {};
    // Event-name style.
    if (Object.prototype.hasOwnProperty.call(on, targetOrEvent)) {
      return on[targetOrEvent];
    }
    // Target-state shortcut: accepted if some event maps to it.
    const targetStates = Object.values(on);
    if (targetStates.includes(targetOrEvent)) {
      return targetOrEvent;
    }
    return null;
  }, []);

  const transition = useCallback(
    (targetOrEvent) => {
      let next = state;
      setState((current) => {
        const resolved = resolveTarget(current, targetOrEvent);
        if (resolved == null) return current;
        next = resolved;
        return resolved;
      });
      return next;
    },
    [resolveTarget, state],
  );

  const can = useCallback(
    (targetOrEvent) => resolveTarget(state, targetOrEvent) != null,
    [resolveTarget, state],
  );

  const reset = useCallback(() => {
    setState(initialRef.current);
  }, []);

  const stateConfig = useMemo(
    () => statesRef.current?.[state] ?? null,
    [state],
  );

  return { state, config: stateConfig, transition, reset, can };
};

export default useStateMachine;
