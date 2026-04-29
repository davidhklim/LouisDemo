/**
 * eSignatureScript.js — DocuSign integration demo (feature id: `e-signatures`).
 *
 * Flow:
 *   WAITING_FOR_REVIEW     → user confirms signatories pre-mapped
 *   WAITING_FOR_SEND       → user clicks "Send for Signature"
 *   SENDING                → scripted ~1 s
 *   WAITING_FOR_COMPLETE   → simulated status change to COMPLETED
 *   DONE                   → Start Over
 */

export const STATES = {
  WAITING_FOR_REVIEW: "WAITING_FOR_REVIEW",
  WAITING_FOR_SEND: "WAITING_FOR_SEND",
  SENDING: "SENDING",
  WAITING_FOR_COMPLETE: "WAITING_FOR_COMPLETE",
  DONE: "DONE",
};

export const TOTAL_STEPS = 4;

export const DEMO_SIGNATORIES = [
  {
    role: "Company",
    name: "Alex Chen",
    email: "alex@louisai.com",
    title: "CEO",
  },
  {
    role: "Contractor",
    name: "Priya Iyer",
    email: "priya.iyer@louisai.com",
    title: "Lead Product Designer",
  },
];

export const DEMO_ENVELOPE_ID = "env-demo-2a41b";

export const DEMO_ENVELOPE_SENT = {
  id: DEMO_ENVELOPE_ID,
  status: "SENT",
  sentAt: new Date().toISOString(),
  signatories: DEMO_SIGNATORIES.map((s) => ({
    ...s,
    status: "PENDING",
  })),
};

export const DEMO_ENVELOPE_COMPLETED = {
  ...DEMO_ENVELOPE_SENT,
  status: "COMPLETED",
  completedAt: new Date(Date.now() + 60_000).toISOString(),
  signatories: DEMO_SIGNATORIES.map((s) => ({
    ...s,
    status: "SIGNED",
    signedAt: new Date(Date.now() + 30_000).toISOString(),
  })),
};

export const STATE_CONFIG = {
  [STATES.WAITING_FOR_REVIEW]: {
    step: 1,
    indicator: "review-panel",
    narrationCorner: "bottom-left",
    tooltip: "Review the signing order",
    narration: {
      title: "Signatories pre-mapped",
      body:
        "The signing panel detected who signs based on document metadata. " +
        "Roles, names, and titles — populated, no manual fill.",
    },
  },
  [STATES.WAITING_FOR_SEND]: {
    step: 2,
    indicator: "send-btn",
    narrationCorner: "bottom-left",
    tooltip: "Click Send for Signature",
    narration: {
      title: "One click sends the envelope",
      body:
        "Click Send — the document is packaged and routed to DocuSign " +
        "without leaving the workspace.",
    },
  },
  [STATES.SENDING]: {
    step: 3,
    indicator: null,
    narrationCorner: "bottom-left",
    tooltip: null,
    narration: {
      title: "Sending to DocuSign…",
      body:
        "Envelope packaged, fields mapped, recipients queued. The signing " +
        "request is on its way.",
    },
  },
  [STATES.WAITING_FOR_COMPLETE]: {
    step: 4,
    indicator: "simulate-sign-btn",
    narrationCorner: "bottom-left",
    tooltip: "Simulate both signatures",
    narration: {
      title: "Waiting for signatures",
      body:
        "Click to simulate both parties signing — the executed copy is " +
        "then auto-filed into the minute book.",
    },
  },
  [STATES.DONE]: {
    step: 4,
    indicator: "restart-btn",
    narrationCorner: "bottom-left",
    tooltip: "Start Over",
    narration: {
      title: "Executed, filed, and auditable",
      body:
        "Executed PDF with audit trail, automatically routed to the " +
        "minute book. No attachments lost in email.",
    },
  },
};

export const FSM = {
  initial: STATES.WAITING_FOR_REVIEW,
  states: {
    [STATES.WAITING_FOR_REVIEW]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_REVIEW],
      on: { CONFIRM: STATES.WAITING_FOR_SEND },
    },
    [STATES.WAITING_FOR_SEND]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_SEND],
      on: { SEND: STATES.SENDING },
    },
    [STATES.SENDING]: {
      ...STATE_CONFIG[STATES.SENDING],
      on: {
        SENT: STATES.WAITING_FOR_COMPLETE,
        FAILED: STATES.WAITING_FOR_SEND,
      },
    },
    [STATES.WAITING_FOR_COMPLETE]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_COMPLETE],
      on: { SIGNED: STATES.DONE },
    },
    [STATES.DONE]: {
      ...STATE_CONFIG[STATES.DONE],
      on: { RESTART: STATES.WAITING_FOR_REVIEW },
    },
  },
};
