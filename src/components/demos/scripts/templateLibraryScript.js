/**
 * templateLibraryScript.js — Template Library demo (feature id: `template-library`).
 *
 * Flow:
 *   WAITING_FOR_CATEGORY   → user clicks a category (e.g. "Employment")
 *   WAITING_FOR_TEMPLATE   → user picks a template card
 *   WAITING_FOR_USE        → user clicks "Use This Template"
 *   LOADING                → scripted redirect fires (~0.6 s)
 *   DONE                   → Start Over
 */

export const STATES = {
  WAITING_FOR_CATEGORY: "WAITING_FOR_CATEGORY",
  WAITING_FOR_TEMPLATE: "WAITING_FOR_TEMPLATE",
  WAITING_FOR_USE: "WAITING_FOR_USE",
  LOADING: "LOADING",
  DONE: "DONE",
};

export const TOTAL_STEPS = 4;

export const DEMO_CATEGORIES = [
  { id: "employment", label: "Employment", count: 42 },
  { id: "corporate", label: "Corporate Governance", count: 58 },
  { id: "equity", label: "Equity & Options", count: 27 },
  { id: "confidentiality", label: "NDAs & Confidentiality", count: 19 },
  { id: "commercial", label: "Commercial Contracts", count: 53 },
];

export const DEMO_TARGET_CATEGORY = "employment";
export const DEMO_TARGET_TEMPLATE_ID = "template-employment-full-time-bc";

export const DEMO_TEMPLATES = [
  {
    id: "template-employment-full-time-bc",
    title: "Full-Time Employment Agreement (BC)",
    updatedAt: "Apr 2026",
    trust: "Vetted by counsel",
    description:
      "Canadian-standard employment agreement for BC-incorporated tech " +
      "companies — salary, equity, IP assignment, non-solicit, termination.",
  },
  {
    id: "template-employment-ic-bc",
    title: "Independent Contractor Agreement (BC)",
    updatedAt: "Mar 2026",
    trust: "Vetted",
    description:
      "Contractor engagement contract with work product IP transfer and " +
      "CRA-compliant classification language.",
  },
  {
    id: "template-employment-offer-letter",
    title: "Offer Letter (Exempt)",
    updatedAt: "Apr 2026",
    trust: "Vetted",
    description:
      "Simple offer letter, linked to a parent employment agreement. " +
      "Fires mail-merge for start date, title, and compensation.",
  },
];

export const DEMO_INSTANTIATED_DOC = {
  documentId: "doc-new-employment-draft",
  title: "Employment Agreement · Draft",
  redirectUrl: "/editor/doc-new-employment-draft",
};

export const STATE_CONFIG = {
  [STATES.WAITING_FOR_CATEGORY]: {
    step: 1,
    indicator: "category-employment",
    narrationCorner: "bottom-left",
    tooltip: "Click Employment",
    narration: {
      title: "Filter by category",
      body:
        "199+ templates, organized for Canadian startups. Click " +
        "\u201cEmployment\u201d to narrow to hiring documents.",
    },
  },
  [STATES.WAITING_FOR_TEMPLATE]: {
    step: 2,
    indicator: "template-full-time-bc",
    narrationCorner: "bottom-left",
    tooltip: "Click Full-Time Employment Agreement (BC)",
    narration: {
      title: "Pick a template",
      body:
        "Each card shows the province, trust tier, and last update. " +
        "Vetted by Canadian counsel, maintained quarterly.",
    },
  },
  [STATES.WAITING_FOR_USE]: {
    step: 3,
    indicator: "use-btn",
    narrationCorner: "bottom-left",
    tooltip: "Click Use This Template",
    narration: {
      title: "Instantiate a draft",
      body:
        "One click creates a private, editable copy. Your changes never " +
        "touch the master template.",
    },
  },
  [STATES.LOADING]: {
    step: 4,
    indicator: null,
    narrationCorner: "bottom-left",
    tooltip: null,
    narration: {
      title: "Spinning up your draft…",
      body:
        "Template cloned, placeholders flagged, ready for mail merge or " +
        "manual editing.",
    },
  },
  [STATES.DONE]: {
    step: 4,
    indicator: "restart-btn",
    narrationCorner: "bottom-left",
    tooltip: "Start Over",
    narration: {
      title: "Draft ready in the editor",
      body:
        "Your draft is live in the editor. From template to editable " +
        "document in under 10 seconds.",
    },
  },
};

export const FSM = {
  initial: STATES.WAITING_FOR_CATEGORY,
  states: {
    [STATES.WAITING_FOR_CATEGORY]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_CATEGORY],
      on: { PICK_CATEGORY: STATES.WAITING_FOR_TEMPLATE },
    },
    [STATES.WAITING_FOR_TEMPLATE]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_TEMPLATE],
      on: { PICK_TEMPLATE: STATES.WAITING_FOR_USE },
    },
    [STATES.WAITING_FOR_USE]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_USE],
      on: { USE: STATES.LOADING },
    },
    [STATES.LOADING]: {
      ...STATE_CONFIG[STATES.LOADING],
      on: { LOADED: STATES.DONE },
    },
    [STATES.DONE]: {
      ...STATE_CONFIG[STATES.DONE],
      on: { RESTART: STATES.WAITING_FOR_CATEGORY },
    },
  },
};
