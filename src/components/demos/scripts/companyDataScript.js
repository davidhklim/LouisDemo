/**
 * companyDataScript.js — Company Data Store demo (feature id: `company-data`).
 *
 * Flow:
 *   WAITING_FOR_TAB        → user clicks the Jurisdiction field
 *   WAITING_FOR_SEARCH     → user clicks the Industry field (pre-filled)
 *   WAITING_FOR_PROFILE    → user clicks the Priya Iyer director row
 *   WAITING_FOR_EDIT       → user clicks "Add Director"
 *   DONE                   → Start Over
 *
 * NOTE: state names retained from legacy table-tabbed flow for FSM stability;
 * the renderer now drives a vertically-stacked form (Basic Information +
 * Roles & People) instead of a tabs+table layout. Narration vocabulary
 * updated in 2026-04-27 parity pass.
 */

export const STATES = {
  WAITING_FOR_TAB: "WAITING_FOR_TAB",
  WAITING_FOR_SEARCH: "WAITING_FOR_SEARCH",
  WAITING_FOR_PROFILE: "WAITING_FOR_PROFILE",
  WAITING_FOR_EDIT: "WAITING_FOR_EDIT",
  DONE: "DONE",
};

export const TOTAL_STEPS = 4;

export const DEMO_EMPLOYEES = [
  {
    id: "emp-1",
    name: "Priya Iyer",
    role: "Lead Product Designer",
    department: "Product",
    startDate: "2026-06-17",
    compensation: "$135,000",
    equity: "0.45%",
    vesting: "4yr / 1yr cliff",
    status: "Active",
  },
  {
    id: "emp-2",
    name: "Avery Chen",
    role: "Senior Backend Engineer",
    department: "Engineering",
    startDate: "2024-09-02",
    compensation: "$155,000",
    equity: "0.60%",
    vesting: "4yr / 1yr cliff",
    status: "Active",
  },
  {
    id: "emp-3",
    name: "Morgan Rivera",
    role: "Head of Operations",
    department: "Operations",
    startDate: "2025-01-15",
    compensation: "$145,000",
    equity: "0.80%",
    vesting: "4yr / 1yr cliff",
    status: "Active",
  },
];

export const DEMO_SEARCH_QUERY = "priya";
export const DEMO_TARGET_EMPLOYEE_ID = "emp-1";

export const STATE_CONFIG = {
  [STATES.WAITING_FOR_TAB]: {
    step: 1,
    indicator: "employees-tab",
    narrationCorner: "bottom-left",
    tooltip: "Open Jurisdiction",
    narration: {
      title: "One company, one data store",
      body:
        "Basic Information lives in a structured form — jurisdiction, " +
        "incorporation number, industry. Click the Jurisdiction field to " +
        "continue.",
    },
  },
  [STATES.WAITING_FOR_SEARCH]: {
    step: 2,
    indicator: "search-input",
    narrationCorner: "bottom-left",
    tooltip: "Open Industry",
    narration: {
      title: "Every field the AI can pull from",
      body:
        "These form fields are exactly what mail merge and AI drafting read. " +
        "Click the Industry field to continue.",
    },
  },
  [STATES.WAITING_FOR_PROFILE]: {
    step: 3,
    indicator: "employee-priya",
    narrationCorner: "bottom-left",
    tooltip: "Click Priya Iyer",
    narration: {
      title: "Roles &amp; People — directors, officers, employees",
      body:
        "Each role section stores name, position, and join date. Click the " +
        "director row to continue.",
    },
  },
  [STATES.WAITING_FOR_EDIT]: {
    step: 4,
    indicator: "edit-comp-btn",
    narrationCorner: "bottom-left",
    tooltip: "Click Add Director",
    narration: {
      title: "Add a role with one click",
      body:
        "Add Director, Add Officer, Add Employee — each row is its own " +
        "person record. Click Add Director to continue.",
    },
  },
  [STATES.DONE]: {
    step: 4,
    indicator: "restart-btn",
    narrationCorner: "bottom-left",
    tooltip: "Start Over",
    narration: {
      title: "Source of truth for every contract",
      body:
        "The form is the data. Mail merge, AI drafting, and dashboards all " +
        "pull from these structured fields.",
    },
  },
};

export const FSM = {
  initial: STATES.WAITING_FOR_TAB,
  states: {
    [STATES.WAITING_FOR_TAB]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_TAB],
      on: { PICK_TAB: STATES.WAITING_FOR_SEARCH },
    },
    [STATES.WAITING_FOR_SEARCH]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_SEARCH],
      on: { SEARCH: STATES.WAITING_FOR_PROFILE },
    },
    [STATES.WAITING_FOR_PROFILE]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_PROFILE],
      on: { OPEN_PROFILE: STATES.WAITING_FOR_EDIT },
    },
    [STATES.WAITING_FOR_EDIT]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_EDIT],
      on: { EDIT: STATES.DONE },
    },
    [STATES.DONE]: {
      ...STATE_CONFIG[STATES.DONE],
      on: { RESTART: STATES.WAITING_FOR_TAB },
    },
  },
};
