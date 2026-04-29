/**
 * dataRoomScript.js — Investor Data Room demo (feature id: `data-room`).
 *
 * Flow:
 *   WAITING_FOR_ROOM         → user opens the active data room
 *   WAITING_FOR_INVITE       → user clicks "Invite Investor"
 *   WAITING_FOR_SEND_INVITE  → modal open, email field empty, user clicks
 *                              "Send Invite" — explicit click required so
 *                              the demo never auto-advances past a step
 *                              that needs visitor consent
 *   SENDING_INVITE           → scripted ~1.0 s (modal shows filled email)
 *   WAITING_FOR_ACTIVITY     → user opens the activity feed
 *   DONE                     → Start Over
 */

export const STATES = {
  WAITING_FOR_ROOM: "WAITING_FOR_ROOM",
  WAITING_FOR_INVITE: "WAITING_FOR_INVITE",
  WAITING_FOR_SEND_INVITE: "WAITING_FOR_SEND_INVITE",
  SENDING_INVITE: "SENDING_INVITE",
  WAITING_FOR_ACTIVITY: "WAITING_FOR_ACTIVITY",
  DONE: "DONE",
};

export const TOTAL_STEPS = 4;

export const DEMO_ROOMS = [
  {
    id: "room-seriesA",
    label: "Series A — Q2 2026",
    docCount: 42,
    permissionTier: "Investor (view-only)",
    createdAt: "Apr 01, 2026",
    status: "Active",
  },
  {
    id: "room-seed",
    label: "Seed Extension · 2025",
    docCount: 18,
    permissionTier: "Investor (view-only)",
    createdAt: "Oct 12, 2025",
    status: "Archived",
  },
];

export const DEMO_TARGET_ROOM_ID = "room-seriesA";

export const DEMO_INVITE = {
  id: "invite-demo-3a12",
  firm: "Maplebrook Capital",
  email: "partner@louisai.com",
  permissionTier: "view-only",
  sentAt: new Date().toISOString(),
};

export const DEMO_ACTIVITY_FEED = [
  {
    id: "evt-1",
    actor: "Maplebrook Capital",
    initials: "MC",
    action: "Joined the data room",
    time: "JUST NOW",
  },
  {
    id: "evt-2",
    actor: "Cedarline Ventures",
    initials: "CV",
    action: "Downloaded 2025 Audited Financials",
    time: "12 MIN AGO",
  },
  {
    id: "evt-3",
    actor: "Banff Capital",
    initials: "BC",
    action: "Viewed Cap Table · v3",
    time: "38 MIN AGO",
  },
  {
    id: "evt-4",
    actor: "Cedarline Ventures",
    initials: "CV",
    action: "Viewed Board Decks (Q1 2026)",
    time: "1 HR AGO",
  },
];

export const STATE_CONFIG = {
  [STATES.WAITING_FOR_ROOM]: {
    step: 1,
    indicator: "room-seriesA",
    narrationCorner: "bottom-left",
    tooltip: "Click Series A — Q2 2026",
    narration: {
      title: "Per-raise data rooms",
      body:
        "Every raise gets its own room — scoped permissions, scoped " +
        "documents. Nothing leaks across deals.",
    },
  },
  [STATES.WAITING_FOR_INVITE]: {
    step: 2,
    indicator: "invite-btn",
    narrationCorner: "bottom-left",
    tooltip: "Click Invite Investor",
    narration: {
      title: "Invite with tiered access",
      body:
        "Investors get view-only by default. Team members get edit. Every " +
        "permission is reversible with one click.",
    },
  },
  [STATES.WAITING_FOR_SEND_INVITE]: {
    step: 2,
    indicator: "send-invite-btn",
    narrationCorner: "bottom-left",
    tooltip: "Click Send Invite",
    narration: {
      title: "Confirm and send",
      body:
        "Email entered, permission scoped to Viewer. Click Send Invite to " +
        "issue the magic link and log the audit event.",
    },
  },
  [STATES.SENDING_INVITE]: {
    step: 3,
    indicator: null,
    narrationCorner: "bottom-left",
    tooltip: null,
    narration: {
      title: "Sending invite…",
      body:
        "Magic link issued, permission scoped, audit event logged. " +
        "Investor can join without a LouisAI account.",
    },
  },
  [STATES.WAITING_FOR_ACTIVITY]: {
    step: 4,
    indicator: "activity-tab",
    narrationCorner: "bottom-left",
    tooltip: "Click Activity",
    narration: {
      title: "See who saw what, when",
      body:
        "Full audit log: joins, views, downloads. Know which investors are " +
        "engaged — without refreshing DocSend.",
    },
  },
  [STATES.DONE]: {
    step: 4,
    indicator: "restart-btn",
    narrationCorner: "bottom-left",
    tooltip: "Start Over",
    narration: {
      title: "A data room that closes with you",
      body:
        "Permissioned access, real-time activity, and a self-expiring " +
        "invite flow. Investor-ready in minutes.",
    },
  },
};

export const FSM = {
  initial: STATES.WAITING_FOR_ROOM,
  states: {
    [STATES.WAITING_FOR_ROOM]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_ROOM],
      on: { OPEN_ROOM: STATES.WAITING_FOR_INVITE },
    },
    [STATES.WAITING_FOR_INVITE]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_INVITE],
      on: { INVITE: STATES.WAITING_FOR_SEND_INVITE },
    },
    [STATES.WAITING_FOR_SEND_INVITE]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_SEND_INVITE],
      on: { SEND: STATES.SENDING_INVITE },
    },
    [STATES.SENDING_INVITE]: {
      ...STATE_CONFIG[STATES.SENDING_INVITE],
      on: { INVITED: STATES.WAITING_FOR_ACTIVITY },
    },
    [STATES.WAITING_FOR_ACTIVITY]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_ACTIVITY],
      on: { OPEN_ACTIVITY: STATES.DONE },
    },
    [STATES.DONE]: {
      ...STATE_CONFIG[STATES.DONE],
      on: { RESTART: STATES.WAITING_FOR_ROOM },
    },
  },
};
