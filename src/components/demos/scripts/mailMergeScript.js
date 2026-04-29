/**
 * mailMergeScript.js — Mail Merge demo (feature id: `mail-merge`).
 *
 * Flow:
 *   WAITING_FOR_EMPLOYEE   → user picks an employee row
 *   WAITING_FOR_PREVIEW    → user clicks "Preview Populated Draft"
 *   POPULATING             → placeholder replacement runs (~0.5 s)
 *   WAITING_FOR_SAVE       → user clicks "Save as Draft"
 *   DONE                   → Start Over
 */

export const STATES = {
  WAITING_FOR_EMPLOYEE: "WAITING_FOR_EMPLOYEE",
  WAITING_FOR_PREVIEW: "WAITING_FOR_PREVIEW",
  POPULATING: "POPULATING",
  WAITING_FOR_SAVE: "WAITING_FOR_SAVE",
  DONE: "DONE",
};

export const TOTAL_STEPS = 4;

export const DEMO_EMPLOYEES = [
  {
    id: "emp-1",
    name: "Priya Iyer",
    role: "Lead Product Designer",
    startDate: "2026-06-17",
    compensation: "$135,000",
    location: "Vancouver, BC",
  },
  {
    id: "emp-2",
    name: "Avery Chen",
    role: "Senior Backend Engineer",
    startDate: "2024-09-02",
    compensation: "$155,000",
    location: "Toronto, ON",
  },
  {
    id: "emp-3",
    name: "Morgan Patel",
    role: "Head of Operations",
    startDate: "2025-01-15",
    compensation: "$145,000",
    location: "Vancouver, BC",
  },
];

export const DEMO_SELECTED_EMPLOYEE_ID = "emp-1";

export const DEMO_MERGE_PREVIEW = {
  documentId: "doc-draft-demo",
  filledPlaceholders: 17,
  totalPlaceholders: 17,
  title:
    "Employment Agreement · Priya Iyer · Lead Product Designer · Vancouver",
};

export const STATE_CONFIG = {
  [STATES.WAITING_FOR_EMPLOYEE]: {
    step: 1,
    indicator: "employee-row",
    narrationCorner: "bottom-left",
    tooltip: "Click Priya Iyer",
    narration: {
      title: "Pick the employee",
      body:
        "Louis reads employee records straight from your company data " +
        "store — pre-validated, always current.",
    },
  },
  [STATES.WAITING_FOR_PREVIEW]: {
    step: 2,
    indicator: "preview-btn",
    narrationCorner: "bottom-left",
    tooltip: "Click Preview Populated Draft",
    narration: {
      title: "Populate 17 fields in one click",
      body:
        "Every {{placeholder}} in the template is replaced with the " +
        "corresponding employee + company data — no copy-paste risk.",
    },
  },
  [STATES.POPULATING]: {
    step: 3,
    indicator: null,
    narrationCorner: "bottom-left",
    tooltip: null,
    narration: {
      title: "Merging fields…",
      body:
        "Each placeholder is resolved from your stored company and " +
        "employee data — structured fields only, zero AI guesswork.",
    },
  },
  [STATES.WAITING_FOR_SAVE]: {
    step: 4,
    indicator: "save-btn",
    narrationCorner: "bottom-left",
    tooltip: "Click Save as Draft",
    narration: {
      title: "Save as a named draft",
      body:
        "The filled draft lands in the document store, ready for review, " +
        "e-signature, or further editing.",
    },
  },
  [STATES.DONE]: {
    step: 4,
    indicator: "restart-btn",
    narrationCorner: "bottom-left",
    tooltip: "Start Over",
    narration: {
      title: "From template to draft in seconds",
      body:
        "No transcription, no paste errors. Mail merge powered by " +
        "structured company + employee data.",
    },
  },
};

export const FSM = {
  initial: STATES.WAITING_FOR_EMPLOYEE,
  states: {
    [STATES.WAITING_FOR_EMPLOYEE]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_EMPLOYEE],
      on: { PICK: STATES.WAITING_FOR_PREVIEW },
    },
    [STATES.WAITING_FOR_PREVIEW]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_PREVIEW],
      on: { PREVIEW: STATES.POPULATING },
    },
    [STATES.POPULATING]: {
      ...STATE_CONFIG[STATES.POPULATING],
      on: { POPULATED: STATES.WAITING_FOR_SAVE },
    },
    [STATES.WAITING_FOR_SAVE]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_SAVE],
      on: { SAVE: STATES.DONE },
    },
    [STATES.DONE]: {
      ...STATE_CONFIG[STATES.DONE],
      on: { RESTART: STATES.WAITING_FOR_EMPLOYEE },
    },
  },
};
