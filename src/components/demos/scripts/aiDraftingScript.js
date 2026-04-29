/**
 * aiDraftingScript.js — State machine config for the AI Drafting demo.
 *
 * The AI Drafting demo is event-driven: the user performs the
 * predetermined next action to advance through the flow. Everything
 * else is blocked.
 *
 * Flow:
 *   WAITING_FOR_SELECTION → user clicks the highlighted clause
 *   WAITING_FOR_GENERATE  → user clicks the (pre-filled) Generate button
 *   GENERATING            → auto-advances when the rewrite resolves
 *   WAITING_FOR_INSERT    → user clicks Insert
 *   DONE                  → Start Over button available
 *
 * Each state declares:
 *   indicator  — which visual element should pulse / tooltip next
 *   narration  — floating caption content (title + 1-sentence body)
 */

/* ── Canonical demo copy ─────────────────────────────────────────────── */

// The drafter input is a bracketed placeholder inside an "Excluded Prior
// Inventions" clause — the kind of clause a drafter is expected to fill in
// with the employee's specific prior work. This pattern is intentional:
// we are NOT substituting a general legal provision with a specific one.
// We are filling in a placeholder that is meant to be filled in.
export const DEMO_SELECTION_TEXT =
  "[INSERT LIST OF EXCLUDED PRIOR INVENTIONS]";

// Short, unique substring used to locate the clause in the DOM. Must be
// present verbatim inside DEMO_SELECTION_TEXT and the rendered document.
export const DEMO_SELECTION_NEEDLE =
  "[INSERT LIST OF EXCLUDED PRIOR INVENTIONS]";

// Drafter instruction — a few facts the founder/HR person knows about
// the employee's prior work. The AI's job is to format these facts into
// the legal phrasing the placeholder expects.
export const DEMO_INSTRUCTION =
  "Priya owns Aurora UI (an open-source design system, MIT-licensed, " +
  "released 2022) and did freelance product design for Acme Insurance " +
  "Co. between Jan and Aug 2023.";

// Formal clause language assembled from the drafter's facts. Same
// content the drafter could have written by hand — Louis just turns
// the bullet points into the bracket-fillable phrasing.
export const DEMO_AI_RESULT =
  "(i) \"Aurora UI\", an open-source design system library released by " +
  "the Employee under the MIT License in 2022 and maintained at " +
  "github.com/priya-iyer/aurora-ui; and (ii) freelance product design " +
  "services performed by the Employee for Acme Insurance Co. between " +
  "January 2023 and August 2023, the deliverables of which are owned by " +
  "Acme Insurance Co. pursuant to the parties' written engagement letter " +
  "dated January 9, 2023";

/**
 * The payload returned by the fetch stub.
 */
export const DEMO_ASSIST_PAYLOAD = {
  suggestedReplacement: {
    id: "demo-suggestion-1",
    text: DEMO_AI_RESULT,
  },
  variants: [
    {
      id: "demo-variant-1",
      text: DEMO_AI_RESULT,
    },
  ],
  referenceAlerts: [],
  followUpPrompts: [
    "Add an exception for residual knowledge",
    "Tighten the opening clause",
  ],
  draftingTips: [],
  chatPrompts: [],
  summary: {
    headline: "Drafter input — placeholder filled",
    simplified:
      "Turns the drafter's facts about Priya's prior work into the formal phrasing the bracket placeholder expects.",
    wordCount: DEMO_AI_RESULT.split(/\s+/).filter(Boolean).length,
  },
  explanation:
    "Louis kept the drafter's facts intact and reshaped them into the " +
    "numbered, formal phrasing prior-inventions schedules use — naming " +
    "each prior project, the licensing or ownership posture, and the " +
    "underlying engagement.",
  keywords: ["prior inventions", "open source", "freelance", "schedule"],
  source: "demo",
  compatibility: null,
  learnMatches: [],
  learnSuggestion: null,
};

/* ── State machine ───────────────────────────────────────────────────── */

export const STATES = {
  WAITING_FOR_SELECTION: "WAITING_FOR_SELECTION",
  ENTERING_PROMPT: "ENTERING_PROMPT",
  TYPING_PROMPT: "TYPING_PROMPT",
  GENERATING: "GENERATING",
  WAITING_FOR_INSERT: "WAITING_FOR_INSERT",
  DONE: "DONE",
};

/**
 * Per-state config. `indicator` is the key used by the narration card + the
 * CSS `.live-demo__target[data-indicator="..."]` hook to drive the pulsing
 * gold outline and the tooltip attached to the active target.
 *
 * `narrationCorner` tells the narration card which corner to float in so it
 * never overlaps the active indicator.
 *
 * `step` is a 1-based index (or null) used by the header step counter chip.
 */
export const TOTAL_STEPS = 3;

export const STATE_CONFIG = {
  [STATES.WAITING_FOR_SELECTION]: {
    step: 1,
    indicator: "clause",
    narrationCorner: "bottom-left",
    tooltip: "Click the bracketed placeholder",
    narration: {
      title: "Click the placeholder to fill",
      body:
        "Bracketed placeholders flag drafter input. Click the " +
        "[INSERT LIST OF EXCLUDED PRIOR INVENTIONS] placeholder so Louis " +
        "can format your facts into the bracket.",
    },
  },
  [STATES.ENTERING_PROMPT]: {
    step: 1,
    indicator: "prompt",
    narrationCorner: "bottom-left",
    tooltip: "Click to type prompt",
    narration: {
      title: "Insert the drafting prompt",
      body:
        "Click the prompt box. The user tells Louis what to draft, and " +
        "Louis will combine that instruction with stored company data and " +
        "the selected placeholder.",
    },
  },
  [STATES.TYPING_PROMPT]: {
    step: 1,
    indicator: "prompt",
    narrationCorner: "bottom-left",
    tooltip: "Typing prompt",
    narration: {
      title: "Prompt being entered",
      body:
        "The drafting prompt captures the facts the user knows. Louis then " +
        "uses the prompt, company context, and the selected bracket to draft " +
        "specific contract language.",
    },
  },
  [STATES.GENERATING]: {
    step: 2,
    indicator: "draft",
    narrationCorner: "bottom-left",
    tooltip: null,
    narration: {
      title: "Generating with company context",
      body:
        "Louis is using the drafting prompt, the selected bracket, and " +
        "company context to structure Priya's prior projects into the " +
        "formal phrasing this agreement needs.",
    },
  },
  [STATES.WAITING_FOR_INSERT]: {
    step: 3,
    indicator: "insert-btn",
    narrationCorner: "bottom-left",
    tooltip: "Click Insert into Document",
    narration: {
      title: "Review and insert",
      body:
        "Read the generated content. Click Insert to replace the bracket " +
        "with the formal clause language — Track Changes captures the edit.",
    },
  },
  [STATES.DONE]: {
    step: 3,
    indicator: "restart-btn",
    narrationCorner: "bottom-left",
    tooltip: "Start Over",
    narration: {
      title: "Placeholder filled",
      body:
        "The bracket now reads as a formal Schedule A entry — the drafter's " +
        "facts, the lawyer's phrasing. Hit Start Over to replay.",
    },
  },
};
