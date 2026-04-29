/**
 * versionControlScript.js — State machine for Version Control & Redline
 * (feature id: `secure-repository`).
 *
 * Flow:
 *   WAITING_FOR_HISTORY     → user opens the history panel
 *   WAITING_FOR_COMPARE     → user clicks "Compare v1 ↔ v3"
 *   COMPARING               → redline view computes (~0.8 s)
 *   WAITING_FOR_RESTORE     → user clicks "Restore v1"
 *   DONE                    → Start Over
 */

export const STATES = {
  WAITING_FOR_HISTORY: "WAITING_FOR_HISTORY",
  WAITING_FOR_COMPARE: "WAITING_FOR_COMPARE",
  COMPARING: "COMPARING",
  WAITING_FOR_RESTORE: "WAITING_FOR_RESTORE",
  DONE: "DONE",
};

export const TOTAL_STEPS = 4;

export const DEMO_VERSIONS = [
  {
    id: "v3",
    label: "v3 — current",
    author: "Morgan Rivera",
    authorInitials: "MR",
    savedAt: "Today · 10:12 AM",
    summary:
      "Promoted to Director of Product Design; salary $165K with annual bonus.",
  },
  {
    id: "v2",
    label: "v2",
    author: "Priya Iyer",
    authorInitials: "PI",
    savedAt: "Yesterday · 4:48 PM",
    summary: "Updated reporting line to Chief Product Officer.",
  },
  {
    id: "v1",
    label: "v1 — initial draft",
    author: "Alex Chen",
    authorInitials: "AC",
    savedAt: "Apr 12 · 2:05 PM",
    summary: "Base employment agreement generated from template.",
  },
];

export const DEMO_COMPARE_DIFF = {
  fromVersion: "v1",
  toVersion: "v3",
  additions: 12,
  deletions: 4,
  netChange: "+8 substantive changes",
};

export const STATE_CONFIG = {
  [STATES.WAITING_FOR_HISTORY]: {
    step: 1,
    indicator: "history-btn",
    narrationCorner: "bottom-left",
    tooltip: "Open Version History",
    narration: {
      title: "Open the version history",
      body:
        "Every save is a snapshot. Click the history icon — the full " +
        "timeline loads from the document store.",
    },
  },
  [STATES.WAITING_FOR_COMPARE]: {
    step: 2,
    indicator: "compare-btn",
    narrationCorner: "bottom-left",
    tooltip: "Compare v1 ↔ v3",
    narration: {
      title: "Compare across versions",
      body:
        "Click Compare to see a semantic redline between the initial draft " +
        "and today's version — additions in green, deletions in red.",
    },
  },
  [STATES.COMPARING]: {
    step: 3,
    indicator: null,
    narrationCorner: "bottom-left",
    tooltip: null,
    narration: {
      title: "Computing the redline…",
      body:
        "Word-level diff with block alignment — additions in green, " +
        "deletions in red. Computed locally, no external service.",
    },
  },
  [STATES.WAITING_FOR_RESTORE]: {
    step: 4,
    indicator: "restore-btn",
    narrationCorner: "bottom-left",
    tooltip: "Restore v1",
    narration: {
      title: "Restore without losing history",
      body:
        "Rolling back creates a new version — the timeline stays intact. " +
        "Nothing is ever truly deleted.",
    },
  },
  [STATES.DONE]: {
    step: 4,
    indicator: "restart-btn",
    narrationCorner: "bottom-left",
    tooltip: "Start Over",
    narration: {
      title: "Every change is recoverable",
      body:
        "Audit trail, semantic diff, one-click restore. Compliance-grade " +
        "version control for legal documents.",
    },
  },
};

export const FSM = {
  initial: STATES.WAITING_FOR_HISTORY,
  states: {
    [STATES.WAITING_FOR_HISTORY]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_HISTORY],
      on: { OPEN_HISTORY: STATES.WAITING_FOR_COMPARE },
    },
    [STATES.WAITING_FOR_COMPARE]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_COMPARE],
      on: { COMPARE: STATES.COMPARING },
    },
    [STATES.COMPARING]: {
      ...STATE_CONFIG[STATES.COMPARING],
      on: { COMPARE_DONE: STATES.WAITING_FOR_RESTORE },
    },
    [STATES.WAITING_FOR_RESTORE]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_RESTORE],
      on: { RESTORE: STATES.DONE },
    },
    [STATES.DONE]: {
      ...STATE_CONFIG[STATES.DONE],
      on: { RESTART: STATES.WAITING_FOR_HISTORY },
    },
  },
};
