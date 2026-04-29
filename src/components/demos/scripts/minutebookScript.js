/**
 * minutebookScript.js — Digital Minutebook demo (feature id: `minutebook`).
 *
 * Flow:
 *   WAITING_FOR_SECTION    → user opens a section (e.g. Articles of Incorporation)
 *   WAITING_FOR_DOC        → user clicks a specific document row
 *   WAITING_FOR_DOWNLOAD   → user clicks Download
 *   DOWNLOADING            → scripted ~0.8 s
 *   DONE                   → Start Over
 */

export const STATES = {
  WAITING_FOR_SECTION: "WAITING_FOR_SECTION",
  WAITING_FOR_DOC: "WAITING_FOR_DOC",
  WAITING_FOR_DOWNLOAD: "WAITING_FOR_DOWNLOAD",
  DOWNLOADING: "DOWNLOADING",
  DONE: "DONE",
};

export const TOTAL_STEPS = 4;

export const DEMO_SECTIONS = [
  {
    id: "section-constating",
    title: "Constating Documents",
    docCount: 4,
    lastUpdated: "Apr 10, 2026",
  },
  {
    id: "section-resolutions",
    title: "Directors' Resolutions",
    docCount: 22,
    lastUpdated: "Apr 14, 2026",
  },
  {
    id: "section-share-issuances",
    title: "Share Issuances",
    docCount: 14,
    lastUpdated: "Apr 02, 2026",
  },
  {
    id: "section-registers",
    title: "Registers (Directors, Officers, Shareholders)",
    docCount: 6,
    lastUpdated: "Apr 14, 2026",
  },
  {
    id: "section-annual",
    title: "Annual Resolutions",
    docCount: 8,
    lastUpdated: "Apr 01, 2026",
  },
];

export const DEMO_TARGET_SECTION_ID = "section-constating";
export const DEMO_TARGET_DOC_ID = "doc-articles-incorporation";

export const DEMO_DOCUMENTS = [
  {
    id: "doc-articles-incorporation",
    title: "Articles of Incorporation (BC)",
    filedAt: "Mar 14, 2024",
    filedBy: "BC Registrar",
    pageCount: 6,
    size: "142 KB",
  },
  {
    id: "doc-unanimous-shareholders-agreement",
    title: "Unanimous Shareholders Agreement",
    filedAt: "Mar 18, 2024",
    filedBy: "Alex Chen",
    pageCount: 22,
    size: "418 KB",
  },
  {
    id: "doc-bylaws",
    title: "Bylaws",
    filedAt: "Mar 14, 2024",
    filedBy: "BC Registrar",
    pageCount: 18,
    size: "295 KB",
  },
];

export const STATE_CONFIG = {
  [STATES.WAITING_FOR_SECTION]: {
    step: 1,
    indicator: "section-constating",
    narrationCorner: "bottom-left",
    tooltip: "Click Constating Documents",
    narration: {
      title: "Your minute book, organized",
      body:
        "Constating docs, resolutions, share issuances, registers — every " +
        "record in one place, searchable.",
    },
  },
  [STATES.WAITING_FOR_DOC]: {
    step: 2,
    indicator: "doc-articles-incorporation",
    narrationCorner: "bottom-left",
    tooltip: "Click Articles of Incorporation (BC)",
    narration: {
      title: "Open any record instantly",
      body:
        "No digging through email. Every filed document preserved with " +
        "provenance — who filed, when, and from what source.",
    },
  },
  [STATES.WAITING_FOR_DOWNLOAD]: {
    step: 3,
    indicator: "download-btn",
    narrationCorner: "bottom-left",
    tooltip: "Click Download",
    narration: {
      title: "Download the original",
      body:
        "Lands with its audit stamp intact — the PDF you or your lawyer " +
        "originally filed, unaltered.",
    },
  },
  [STATES.DOWNLOADING]: {
    step: 4,
    indicator: null,
    narrationCorner: "bottom-left",
    tooltip: null,
    narration: {
      title: "Preparing download…",
      body:
        "Signed URL issued, transfer starting. Every access is logged in " +
        "the company audit trail.",
    },
  },
  [STATES.DONE]: {
    step: 4,
    indicator: "restart-btn",
    narrationCorner: "bottom-left",
    tooltip: "Start Over",
    narration: {
      title: "Minute book, always current",
      body:
        "Every approved document flows automatically into the minute book. " +
        "No more year-end scavenger hunt before diligence.",
    },
  },
};

export const FSM = {
  initial: STATES.WAITING_FOR_SECTION,
  states: {
    [STATES.WAITING_FOR_SECTION]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_SECTION],
      on: { OPEN_SECTION: STATES.WAITING_FOR_DOC },
    },
    [STATES.WAITING_FOR_DOC]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_DOC],
      on: { OPEN_DOC: STATES.WAITING_FOR_DOWNLOAD },
    },
    [STATES.WAITING_FOR_DOWNLOAD]: {
      ...STATE_CONFIG[STATES.WAITING_FOR_DOWNLOAD],
      on: { DOWNLOAD: STATES.DOWNLOADING },
    },
    [STATES.DOWNLOADING]: {
      ...STATE_CONFIG[STATES.DOWNLOADING],
      on: { DOWNLOADED: STATES.DONE },
    },
    [STATES.DONE]: {
      ...STATE_CONFIG[STATES.DONE],
      on: { RESTART: STATES.WAITING_FOR_SECTION },
    },
  },
};
