import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vite config for the Investor-webpage.
 *
 * Aliases:
 *   @demo — Legacy: the DEMO-VIDEO app's src (mock demo components).
 *
 * SECURITY NOTE (Tier 1 #5, Session 28): the former `@app` and `@shared`
 * aliases have been removed. They used to resolve into
 * `wireframe-app/client/src` and `shared/`, which caused the real
 * LouisEditor, AIAssistantPanel, and internal shared code to ship into
 * the public Investor-webpage bundle (audit findings H-3 and A-6 in
 * `30 - Stitch Rollout Security Audit.md` and
 * `31 - Investor Webpage IP and Trade Secret Audit.md`).
 *
 * The investor site now renders scripted visual approximations only and
 * must never import from `@app` or `@shared` again. If a demo needs a
 * product-like surface, build a scripted equivalent inside
 * `Investor-webpage/src/components/demos/` — no alias, no side-load.
 *
 * Source maps are pinned to `false` (audit finding M-3) to prevent an
 * accidental toggle from leaking the full source tree to every visitor.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@demo": path.resolve(__dirname, "../DEMO-VIDEO/src"),
    },
    // Deduplicate peer React copies — safe-guard even though we no longer
    // import from sibling apps. Keeps hooks consistent if any workspace
    // peer somehow resolves through node_modules.
    dedupe: ["react", "react-dom", "react-router-dom"],
  },
});
