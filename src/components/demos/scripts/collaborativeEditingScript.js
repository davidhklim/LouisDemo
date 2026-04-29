/**
 * collaborativeEditingScript.js — State machine for the Collaborative
 * Document Editing demo (feature id: `document-storage`).
 *
 * Flow:
 *   WAITING_FOR_SELECTION  → highlight a clause to comment on
 *   WAITING_FOR_COMMENT    → click "Add Comment"
 *   ADDING_COMMENT         → the scripted comment renders (~0.3 s)
 *   WAITING_FOR_TRACK_EDIT → accept a track-changes suggestion
 *   DONE                   → Start Over
 *
 * No network stub is registered — collaboration UIs are local-state only.
 */

export const STATES = {
  WAITING_FOR_SELECTION: "WAITING_FOR_SELECTION",
  WAITING_FOR_COMMENT: "WAITING_FOR_COMMENT",
  ADDING_COMMENT: "ADDING_COMMENT",
  WAITING_FOR_TRACK_EDIT: "WAITING_FOR_TRACK_EDIT",
  DONE: "DONE",
};

export const TOTAL_STEPS = 4;

// Short, unique substring used to locate the clause in the DOM. Must be
// a verbatim substring of the fixture's rendered text.
export const DEMO_SELECTION_NEEDLE =
  "base salary of $135,000 CAD";

export const DEMO_COMMENT = {
  id: "demo-comment-1",
  author: "Sarah Mendez",
  authorInitials: "SM",
  body:
    "People Ops approved $155,000 CAD for this role. Please update the " +
    "base salary before the offer goes out.",
  createdAt: "2 min ago",
};

export const STATE_CONFIG = {
  [STATES.WAITING_FOR_SELECTION]: {
    step: 1,
    indicator: "clause",
    narrationCorner: "bottom-left",
    tooltip: "Click the compensation line",
    narration: {
      title: "Spot the business term under review",
      body:
        "Click the highlighted compensation line. In production, any " +
        "text selection is commentable.",
    },
  },
  [STATES.WAITING_FOR_COMMENT]: {
    step: 2,
    indicator: "comment-btn",
    narrationCorner: "bottom-left",
    tooltip: "Click Add Comment",
    narration: {
      title: "Drop a comment",
      body:
        "One click opens a threaded comment anchored to the selection — " +
        "reviewers see the discussion next to the exact text.",
    },
  },
  [STATES.ADDING_COMMENT]: {
    step: 3,
    indicator: null,
    narrationCorner: "bottom-left",
    tooltip: null,
    narration: {
      title: "Comment added",
      body:
        "Threaded, resolvable, and exportable. Reviewers see it next to the " +
        "text, not in a sidebar of orphaned notes.",
    },
  },
  [STATES.WAITING_FOR_TRACK_EDIT]: {
    step: 4,
    indicator: "accept-btn",
    narrationCorner: "bottom-left",
    tooltip: "Accept the tracked edit",
    narration: {
      title: "Accept the revision",
      body:
        "The suggested change is a tracked insert + delete. Accepting the " +
        "revision merges it cleanly into the base document.",
    },
  },
  [STATES.DONE]: {
    step: 4,
    indicator: "restart-btn",
    narrationCorner: "bottom-left",
    tooltip: "Start Over",
    narration: {
      title: "Collaboration, fully audited",
      body:
        "Every comment, every accepted revision, every author is logged. " +
        "Replayable, exportable, signed-off.",
    },
  },
};

export const FSM = {
  initial: STATES.WAITING_FOR_SELECTION,
  states: {
    [STATES.WAITING_FOR_SELECTION]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_SELECTION],
      on: { SELECT: STATES.WAITING_FOR_COMMENT },
    },
    [STATES.WAITING_FOR_COMMENT]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_COMMENT],
      on: { ADD_COMMENT: STATES.ADDING_COMMENT },
    },
    [STATES.ADDING_COMMENT]: {
      ...STATE_CONFIG[STATES.ADDING_COMMENT],
      on: { COMMENT_ADDED: STATES.WAITING_FOR_TRACK_EDIT },
    },
    [STATES.WAITING_FOR_TRACK_EDIT]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_TRACK_EDIT],
      on: { ACCEPT: STATES.DONE },
    },
    [STATES.DONE]: {
      ...STATE_CONFIG[STATES.DONE],
      on: { RESTART: STATES.WAITING_FOR_SELECTION },
    },
  },
};
