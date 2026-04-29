import { useEffect, useState } from "react";
import "./LandingHeroDemoReel.css";

/**
 * LandingHeroDemoReel — Auto-cycling visualization that replaces the static
 * hero mockup. Each "scene" is a hand-authored snapshot of one of the live
 * demos elsewhere on the site, scaled down to hero dimensions. The reel
 * advances on a fixed interval and cross-fades between scenes.
 *
 * No real product imports — all snapshots are static JSX, consistent with
 * the security-audit constraint on this codebase (no imports from
 * wireframe-app/client/src or shared/).
 */

const SCENES = [
  { id: "ai-drafting", label: "AI Drafting" },
  { id: "mail-merge", label: "Mail Merge" },
  { id: "version-control", label: "Version Control" },
  { id: "data-room", label: "Data Room" },
];

const SCENE_INTERVAL_MS = 4200;

const SceneAiDrafting = () => (
  <div className="hero-reel__scene hero-reel__scene--ai">
    <div className="hero-reel__scene-doc">
      <div className="hero-reel__scene-doc-title">
        Proprietary Information &amp; Inventions Agreement
      </div>
      <div className="hero-reel__scene-doc-section">
        SCHEDULE A &middot; EXCLUDED PRIOR INVENTIONS
      </div>
      <div className="hero-reel__scene-doc-clause hero-reel__scene-doc-clause--track">
        <span className="hero-reel__track-delete">
          [INSERT LIST OF EXCLUDED PRIOR INVENTIONS]
        </span>
        <span className="hero-reel__track-insert">
          (i) &ldquo;Aurora UI&rdquo; — open-source design library, MIT-licensed
          (2022); and (ii) freelance design for Acme Insurance Co. (Jan–Aug 2023).
        </span>
      </div>
    </div>
    <div className="hero-reel__scene-panel">
      <div className="hero-reel__scene-panel-eyebrow">DRAFTING</div>
      <div className="hero-reel__scene-panel-title">Bracket filled</div>
      <div className="hero-reel__scene-panel-body">
        Drafter facts, lawyer phrasing.
      </div>
      <div className="hero-reel__scene-panel-cta">Insert into document</div>
    </div>
  </div>
);

const SceneMailMerge = () => (
  <div className="hero-reel__scene hero-reel__scene--mm">
    <div className="hero-reel__scene-doc">
      <div className="hero-reel__scene-doc-title">
        Full-Time Employment Agreement
      </div>
      <div className="hero-reel__scene-doc-row">
        <span className="hero-reel__scene-doc-row-label">Employee</span>
        <span className="hero-reel__scene-doc-row-value hero-reel__pill-fill">
          Priya Iyer
        </span>
      </div>
      <div className="hero-reel__scene-doc-row">
        <span className="hero-reel__scene-doc-row-label">Position</span>
        <span className="hero-reel__scene-doc-row-value hero-reel__pill-fill hero-reel__pill-fill--delay">
          Lead Product Designer
        </span>
      </div>
      <div className="hero-reel__scene-doc-row">
        <span className="hero-reel__scene-doc-row-label">Start date</span>
        <span className="hero-reel__scene-doc-row-value hero-reel__pill-fill hero-reel__pill-fill--delay-2">
          June 17, 2026
        </span>
      </div>
      <div className="hero-reel__scene-doc-row">
        <span className="hero-reel__scene-doc-row-label">Salary</span>
        <span className="hero-reel__scene-doc-row-value hero-reel__pill-fill hero-reel__pill-fill--delay-3">
          $135,000 CAD
        </span>
      </div>
    </div>
    <div className="hero-reel__scene-panel">
      <div className="hero-reel__scene-panel-eyebrow">MAIL MERGE</div>
      <div className="hero-reel__scene-panel-title">Auto-populating</div>
      <div className="hero-reel__scene-panel-body">
        From the company data store.
      </div>
      <div className="hero-reel__scene-panel-cta">Preview draft</div>
    </div>
  </div>
);

const SceneVersionControl = () => (
  <div className="hero-reel__scene hero-reel__scene--vc">
    <div className="hero-reel__scene-doc">
      <div className="hero-reel__scene-doc-title">
        Employment Agreement &middot; v1 &harr; v3
      </div>
      <div className="hero-reel__scene-doc-section">
        1. Role &amp; Title
      </div>
      <div className="hero-reel__scene-doc-clause hero-reel__scene-doc-clause--track">
        Serve as{" "}
        <span className="hero-reel__track-delete">Lead Product Designer</span>{" "}
        <span className="hero-reel__track-insert">
          Director of Product Design
        </span>
        .
      </div>
      <div className="hero-reel__scene-doc-section">2. Compensation</div>
      <div className="hero-reel__scene-doc-clause hero-reel__scene-doc-clause--track">
        Base salary of{" "}
        <span className="hero-reel__track-delete">$135,000</span>{" "}
        <span className="hero-reel__track-insert">$165,000</span> CAD.
      </div>
    </div>
    <div className="hero-reel__scene-panel">
      <div className="hero-reel__scene-panel-eyebrow">VERSION HISTORY</div>
      <div className="hero-reel__scene-panel-title">3 changed · 1 added</div>
      <div className="hero-reel__scene-panel-body">
        Every save is a snapshot.
      </div>
      <div className="hero-reel__scene-panel-cta">Restore v1</div>
    </div>
  </div>
);

const SceneDataRoom = () => (
  <div className="hero-reel__scene hero-reel__scene--dr">
    <div className="hero-reel__scene-doc">
      <div className="hero-reel__scene-doc-title">
        Series A &middot; Q2 2026
      </div>
      <div className="hero-reel__scene-doc-section">ACTIVITY</div>
      <div className="hero-reel__scene-doc-event hero-reel__pill-fill">
        <span className="hero-reel__avatar">MC</span>
        <span className="hero-reel__event-text">
          <strong>Maplebrook Capital</strong> joined the data room
          <span className="hero-reel__event-time">JUST NOW</span>
        </span>
      </div>
      <div className="hero-reel__scene-doc-event hero-reel__pill-fill hero-reel__pill-fill--delay">
        <span className="hero-reel__avatar">CV</span>
        <span className="hero-reel__event-text">
          <strong>Cedarline Ventures</strong> downloaded 2025 Audited Financials
          <span className="hero-reel__event-time">12 MIN AGO</span>
        </span>
      </div>
      <div className="hero-reel__scene-doc-event hero-reel__pill-fill hero-reel__pill-fill--delay-2">
        <span className="hero-reel__avatar">BC</span>
        <span className="hero-reel__event-text">
          <strong>Banff Capital</strong> viewed Cap Table · v3
          <span className="hero-reel__event-time">38 MIN AGO</span>
        </span>
      </div>
    </div>
    <div className="hero-reel__scene-panel">
      <div className="hero-reel__scene-panel-eyebrow">DATA ROOM</div>
      <div className="hero-reel__scene-panel-title">Live audit log</div>
      <div className="hero-reel__scene-panel-body">
        Know who saw what, when.
      </div>
      <div className="hero-reel__scene-panel-cta">Invite investor</div>
    </div>
  </div>
);

const SCENE_RENDERERS = {
  "ai-drafting": SceneAiDrafting,
  "mail-merge": SceneMailMerge,
  "version-control": SceneVersionControl,
  "data-room": SceneDataRoom,
};

const LandingHeroDemoReel = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SCENES.length);
    }, SCENE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hero-reel" aria-label="LouisAI demo reel — auto-cycling">
      <div className="hero-reel__stage">
        {SCENES.map((scene, idx) => {
          const Renderer = SCENE_RENDERERS[scene.id];
          const isActive = idx === activeIdx;
          return (
            <div
              key={scene.id}
              className={`hero-reel__slide ${
                isActive ? "hero-reel__slide--active" : ""
              }`}
              aria-hidden={!isActive}
            >
              <Renderer />
            </div>
          );
        })}
      </div>
      <div className="hero-reel__dots" role="tablist" aria-label="Demo scenes">
        {SCENES.map((scene, idx) => (
          <button
            key={scene.id}
            type="button"
            role="tab"
            aria-selected={idx === activeIdx}
            className={`hero-reel__dot ${
              idx === activeIdx ? "hero-reel__dot--active" : ""
            }`}
            onClick={() => setActiveIdx(idx)}
          >
            <span className="sr-only">{scene.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LandingHeroDemoReel;
