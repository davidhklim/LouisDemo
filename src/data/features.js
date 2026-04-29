/**
 * features.js — The 9 LouisAI user features.
 *
 * Single source of truth for the investor webpage. Powers:
 *   - Landing page features grid (9 cards)
 *   - Use-case detail pages (intro / capabilities / demo)
 *
 * Scene types used in demoSteps:
 *   editor      — editor with paginated doc page
 *   editor-ai   — editor with right side panel
 *   explorer    — template / file browser (sidebar tree + grid or list)
 *   diff        — side-by-side version comparison (red/green)
 *   status      — status / signing / progress tracker
 *   dashboard   — dashboard summary cards
 *   form        — data-entry form
 *   minutebook  — minutebook (filter sidebar + record card grid)
 *   data-room   — data room (list view OR 3-pane detail view)
 *
 * Narration:
 *   Every step has a `narration: { title, body }` field — the
 *   "show & tell" caption explaining what the user is watching and
 *   why it matters. Keep narration concise: a 3-5 word title and
 *   one or two short sentences for the body.
 *
 * Fictional demo universe: all names, companies, investors, and
 * employees are invented. Email addresses use the RFC-2606 reserved
 * `@louisai.com` (LouisAI-owned domain) so any typo-driven delivery lands
 * in a LouisAI-controlled inbox rather than a third party's.
 */

export const FEATURES = [
  /* ── 1. AI Drafting ──────────────────────────────────────────── */
  {
    id: "ai-drafting",
    icon: "psychology",
    title: "AI-Assisted Legal Drafting",
    shortTitle: "AI Drafting",
    tagline: "500,000+ clauses. One intelligent assistant.",
    badge: "Legal Intelligence",
    landingDescription:
      "Our context-aware AI is trained on 500,000+ verified clauses from real transaction data across Canadian jurisdictions. Draft, rewrite, and assemble documents grounded in how Canadian deals actually get written.",
    subtitle: "Precedent-Backed Intelligence",
    intro:
      "Precedent-backed clause generation drawn from 500,000+ real clauses from Canadian transaction data across multiple jurisdictions. Draft, rewrite, and assemble legal documents with AI that knows the needs of Canadian founders — grounded in what actually gets signed.",
    designedFor:
      "Founders, operations leads, and in-house teams that need to move faster on routine corporate documents without starting from scratch every time.",
    video: "/videos/ai-drafting.mp4",
    sceneType: "bespoke",
    capabilities: [
      { icon: "auto_awesome", label: "Precedent-backed drafting — language grounded in real Canadian venture deals, not generic AI output" },
      { icon: "search", label: "Every clause summarized and semantically indexed for precise retrieval" },
      { icon: "edit_note", label: "Rewrite and explain selected clauses in plain English for internal review" },
      { icon: "library_books", label: "Full draft assembly from 199+ curated legal templates" },
      { icon: "mail", label: "Auto-fill company details with mail merge across any template" },
      { icon: "database", label: "Context-aware suggestions using your stored company data" },
    ],
  },

  /* ── 2. Collaborative Editing ────────────────────────────────── */
  {
    id: "document-storage",
    slug: "collaborative-document-editing",
    icon: "edit_note",
    title: "Collaborative Document Editing",
    shortTitle: "Collaborative Editing",
    tagline: "Comments. Track changes. Resolved.",
    badge: "Team Workflow",
    landingDescription:
      "Comment inline, track every change, and resolve feedback together. Grant credential-based access to advisors, investors, and outside counsel with the right level of visibility.",
    subtitle: "Comments and Track Changes",
    intro:
      "Leave comments inline on any document, track every change across versions, and resolve feedback together. Your corporate records stay organized, protected, and accessible to the right people.",
    designedFor:
      "Founders managing corporate records, minute books, financing documents, and operational agreements who need controlled access for team members, advisors, investors, and outside counsel.",
    video: "/videos/document-storage.mp4",
    sceneType: "generic",
    demoSteps: [
      {
        label: "Sarah leaves a comment on Section 3",
        narration: {
          title: "Inline comments — anchored to the text",
          body: "Comments live next to the exact words they reference. Reviewers can debate compensation, titles, responsibilities, and other company-controlled terms without losing the context.",
        },
        scene: "editor-ai",
        panelVariant: "comments",
        title: "Employment Agreement.docx",
        lines: [
          "EMPLOYMENT AGREEMENT",
          "",
          'This Employment Agreement ("Agreement") is entered',
          "into as of April 16, 2026, by and between:",
          "",
          "Employer: Lakeview Robotics Inc.",
          "Employee: Jordan Park",
          "",
          "3. Compensation",
          "The Employee shall receive a base salary of $135,000",
          "per annum, payable in bi-weekly installments.",
        ],
        highlightLines: [9, 10],
        panelLines: [
          {
            type: "comment",
            author: "Alex Chen",
            initials: "AC",
            color: "#C9A84C",
            time: "2 min ago",
            text: "Should this be $155K to align with market for a senior engineer at our stage?",
            anchor: "Section 3 · Compensation",
          },
          {
            type: "comment",
            author: "Morgan Rivera",
            initials: "MR",
            color: "#2563eb",
            time: "5 min ago",
            text: "Let's confirm with the board before sending the offer.",
            anchor: "Section 3 · Compensation",
          },
        ],
      },
      {
        label: "Track Changes — accept the salary update",
        narration: {
          title: "Track changes with full attribution",
          body: "Every insertion and deletion is captured with author and timestamp. Accept individually or in bulk — nothing slips through unattributed.",
        },
        scene: "editor-ai",
        panelVariant: "track-changes",
        title: "Employment Agreement.docx",
        lines: [
          "EMPLOYMENT AGREEMENT",
          "",
          "3. Compensation",
          "",
          { text: "The Employee shall receive a base salary of ", change: null },
          { text: "$135,000", change: "delete" },
          { text: "$155,000", change: "insert" },
          { text: " per annum, payable in bi-weekly installments.", change: null },
        ],
        useChangeLines: true,
        panelLines: [
          {
            type: "change",
            author: "Alex Chen",
            initials: "AC",
            color: "#C9A84C",
            time: "Just now",
            change: "Replaced \"$135,000\" with \"$155,000\"",
            location: "Section 3 · Compensation",
          },
          { type: "actions", actions: ["Accept", "Reject", "Accept All"] },
        ],
      },
      {
        label: "Resolved · saved to version history",
        narration: {
          title: "Resolved and recorded",
          body: "Once accepted, the change becomes part of an immutable version snapshot. Comments resolve, the audit log updates, and the document keeps moving.",
        },
        scene: "editor",
        title: "Employment Agreement.docx",
        lines: [
          "EMPLOYMENT AGREEMENT",
          "",
          "3. Compensation",
          "",
          "The Employee shall receive a base salary of $155,000",
          "per annum, payable in bi-weekly installments.",
          "",
          "All comments resolved.",
        ],
        statusBadge: {
          text: "2 comments resolved · 1 change accepted · Version 4 saved",
          color: "#16a34a",
        },
      },
    ],
    capabilities: [
      { icon: "comment", label: "Leave comments inline anywhere in the document" },
      { icon: "track_changes", label: "Track every insertion, deletion, and edit with attribution" },
      { icon: "check_circle", label: "Accept or reject changes individually or in bulk" },
      { icon: "folder_managed", label: "Centralized storage for all corporate documents — generated and uploaded" },
      { icon: "lock", label: "Credential-based access control for people inside and outside your organization" },
      { icon: "history", label: "Full audit trail on who accessed, edited, or downloaded each document" },
    ],
  },

  /* ── 3. Version Control ──────────────────────────────────────── */
  {
    id: "secure-repository",
    icon: "history",
    title: "Version Control & Redline",
    shortTitle: "Version Control",
    tagline: "Every change tracked. Every version recoverable.",
    badge: "Audit Ready",
    landingDescription:
      "Every save creates an immutable snapshot. Compare any two versions side-by-side with semantic redlining that highlights exactly what changed.",
    subtitle: "Every Change, Tracked",
    intro:
      "Every save creates an immutable version snapshot. Compare any two versions side-by-side with semantic redlining that shows exactly what changed — no more v3_FINAL_final.docx.",
    designedFor:
      "Teams that need a clean audit trail on corporate documents and the confidence that nothing has been silently altered.",
    video: "/videos/version-control.mp4",
    sceneType: "generic",
    demoSteps: [
      {
        label: "Open version history",
        narration: {
          title: "Every save is a snapshot",
          body: "The version history panel lists every save with author, time, and the contributor's note. No more v3_FINAL_final.docx chains.",
        },
        scene: "editor-ai",
        panelVariant: "version-history",
        title: "Employment Agreement.docx",
        lines: [
          "EMPLOYMENT AGREEMENT",
          "",
          "3. Compensation",
          "",
          "The Employee shall receive a base salary of $155,000",
          "per annum, payable in bi-weekly installments.",
          "",
          "4. Stock Options",
          "The Employee shall be granted options to purchase",
          "15,000 shares of Common Stock, vesting over 4 years.",
        ],
        panelLines: [
          { type: "version", label: "v3 (current)", meta: "Apr 16 · 2:14 PM · You",          note: "Updated salary; added stock options",      current: true,  status: "saved" },
          { type: "version", label: "v2",          meta: "Apr 15 · 4:42 PM · Alex Chen",     note: "Revised reporting line",                    current: false, status: "approved" },
          { type: "version", label: "v1",          meta: "Apr 14 · 9:08 AM · You",           note: "Initial draft from template",                current: false, status: "saved" },
        ],
      },
      {
        label: "Compare v1 ↔ v3 — segment-level redline",
        narration: {
          title: "Side-by-side semantic redline",
          body: "Compare any two versions to see exactly what changed — additions in green, deletions in red. Catches every silent edit.",
        },
        scene: "diff",
        title: "Compare · v1 ↔ v3",
        lines: [
          { type: "context", text: "3. Compensation" },
          { type: "context", text: "" },
          { type: "del",     text: "The Employee shall receive a salary of $135,000" },
          { type: "ins",     text: "The Employee shall receive a base salary of $155,000" },
          { type: "context", text: "per annum, payable in bi-weekly installments." },
          { type: "context", text: "" },
          { type: "context", text: "4. Stock Options" },
          { type: "del",     text: "Stock options: 10,000 shares." },
          { type: "ins",     text: "The Employee shall be granted options to purchase" },
          { type: "ins",     text: "15,000 shares of Common Stock, vesting over 4 years." },
        ],
        diffMeta: { added: 3, removed: 2, unchanged: 4 },
      },
      {
        label: "Restore v1 — audit trail preserved",
        narration: {
          title: "Restore without losing history",
          body: "Restoring an older version creates a new version on top — the audit trail is preserved, and SHA-256 integrity hashes confirm nothing was tampered with.",
        },
        scene: "editor",
        title: "Employment Agreement.docx",
        lines: [
          "EMPLOYMENT AGREEMENT",
          "",
          "3. Compensation",
          "",
          "The Employee shall receive a salary of $135,000",
          "per annum, payable in bi-weekly installments.",
          "",
          "4. Stock Options",
          "Stock options: 10,000 shares.",
        ],
        statusBadge: {
          text: "Restored to v1 · SHA-256 verified · v4 created from restore",
          color: "#2563eb",
        },
      },
    ],
    capabilities: [
      { icon: "save", label: "Immutable version snapshots on every save" },
      { icon: "compare", label: "Side-by-side semantic redline between any two versions" },
      { icon: "restore", label: "Full version history with the ability to restore prior versions" },
      { icon: "verified_user", label: "SHA-256 integrity hashing to verify documents have not been altered" },
      { icon: "receipt_long", label: "Complete audit trail on all document operations" },
    ],
  },

  /* ── 4. DocuSign Integration ─────────────────────────────────── */
  {
    id: "e-signatures",
    icon: "draw",
    title: "DocuSign Integration",
    shortTitle: "DocuSign Integration",
    tagline: "Draft to executed. Zero tab-switching.",
    badge: "Closing Workflow",
    landingDescription:
      "Prepare and send signature packages directly from your workspace. Go from draft to executed without switching tabs or chasing down signers.",
    subtitle: "Draft to Executed, One Click",
    intro:
      "Prepare and send DocuSign signature packages directly from your workspace. Go from draft to executed without switching tabs or chasing down signers.",
    designedFor:
      "Teams closing agreements with employees, investors, vendors, and partners who need predictable execution cycles and fewer handoffs.",
    video: "/videos/e-signature.mp4",
    sceneType: "generic",
    demoSteps: [
      {
        label: "Signers auto-suggested from Company Data",
        narration: {
          title: "Signatories pre-mapped",
          body: "LouisAI scans signature blocks and matches them against your stored officers and counterparties. The right signer is suggested before you even click 'Send'.",
        },
        scene: "editor-ai",
        panelVariant: "signing",
        title: "Independent Contractor Agreement.docx",
        lines: [
          "INDEPENDENT CONTRACTOR AGREEMENT",
          "",
          "10. Signatures",
          "",
          "Lakeview Robotics Inc.",
          "Per: ____________________  [[SIGN_COMPANY]]",
          "      Alex Chen, CEO",
          "",
          "Casey Webb",
          "Sign: ___________________  [[SIGN_CONTRACTOR]]",
        ],
        highlightLines: [5, 9],
        panelLines: [
          { type: "signer", roleLabel: "Company Signatory", anchorTag: "[[SIGN_COMPANY]]",   name: "Alex Chen",  email: "alex@louisai.com",       suggested: "company.officer_primary" },
          { type: "signer", roleLabel: "Contractor",        anchorTag: "[[SIGN_CONTRACTOR]]", name: "Casey Webb", email: "casey.webb@louisai.com", suggested: "manual" },
          { type: "subjectLine", value: "Signature request: Independent Contractor Agreement" },
        ],
      },
      {
        label: "Send via DocuSign — envelope dispatched",
        narration: {
          title: "One click sends the envelope",
          body: "We package the document, route it to DocuSign, and surface the envelope ID so you can audit the dispatch — all without leaving the workspace.",
        },
        scene: "status",
        title: "Sending Signature Package",
        statusItems: [
          { label: "Alex Chen",  meta: "Company Signatory · alex@louisai.com",       status: "Sent", color: "#15803d", initials: "AC" },
          { label: "Casey Webb", meta: "Contractor · casey.webb@louisai.com",         status: "Sent", color: "#15803d", initials: "CW" },
        ],
        footerNote: "Sent to signers · Parallel routing",
      },
      {
        label: "All parties signed — executed copy filed",
        narration: {
          title: "Executed copy auto-filed",
          body: "When the last signer signs, the executed PDF is filed back into My Documents alongside the draft. Your audit log entry is created automatically.",
        },
        scene: "status",
        title: "Signature Status — COMPLETED",
        statusItems: [
          { label: "Alex Chen",  meta: "Signed Apr 16, 3:42 PM EDT", status: "Signed", color: "#15803d", initials: "AC" },
          { label: "Casey Webb", meta: "Signed Apr 16, 4:15 PM EDT", status: "Signed", color: "#15803d", initials: "CW" },
        ],
        footerNote: "Executed PDF stored in My Documents · Audit log entry created",
        statusBadge: { text: "All parties signed · Envelope completed", color: "#16a34a" },
      },
    ],
    capabilities: [
      { icon: "send", label: "Send signature packages directly from the active document" },
      { icon: "track_changes", label: "Track signing status in your document workspace" },
      { icon: "draw", label: "DocuSign integration for industry-standard e-signatures" },
      { icon: "inventory_2", label: "Store executed copies alongside drafts and version history" },
      { icon: "group", label: "Manage counterparties and signing order from one place" },
    ],
  },

  /* ── 5. Template Library ─────────────────────────────────────── */
  {
    id: "template-library",
    icon: "library_books",
    title: "Template Library",
    shortTitle: "Template Library",
    tagline: "199+ templates. Canadian startup law.",
    badge: "Pro Verified",
    landingDescription:
      "Access 199+ battle-tested Canadian corporate templates, covering the CBCA and every major provincial business corporations act — BCBCA, ABCA, OBCA, and QBCA — out of the box.",
    subtitle: "199+ Battle-Tested Templates",
    intro:
      "Access a curated library of corporate document templates specifically built for Canadian startup founders. Every template is structured for the CBCA and major provincial corporate statutes across Canada, covers seed through Series A, and is ready to merge with your company data.",
    designedFor:
      "Founders incorporating federally (CBCA) or provincially in BC, Alberta, Ontario, or Quebec who need legally accurate documents without paying senior-counsel hourly rates to have them drafted from scratch.",
    video: "/videos/template-library.mp4",
    sceneType: "generic",
    demoSteps: [
      {
        label: "Browse 199+ templates · category tabs",
        narration: {
          title: "Curated for Canadian startups",
          body: "Every template is hand-crafted for the CBCA, BCBCA, ABCA, OBCA, and QBCA. Browse by category or jump straight to the document you need.",
        },
        scene: "explorer",
        explorerVariant: "templates",
        title: "Template Library",
        categoryTabs: [
          { label: "All",            count: 199, active: false },
          { label: "Employment",     count: 22,  active: false },
          { label: "Equity",         count: 18,  active: false },
          { label: "Corporate",      count: 38,  active: true  },
          { label: "Confidentiality",count: 12,  active: false },
          { label: "M&A",            count: 18,  active: false },
          { label: "Real Estate",    count: 14,  active: false },
        ],
        gridItems: [
          { title: "Employment Agreement",              meta: "Full employment contract with standard clauses",   jurisdiction: "BCBCA", tier: "Gold" },
          { title: "Employment Offer Letter",           meta: "Formal offer letter for new hires",                jurisdiction: "OBCA",  tier: "Gold" },
          { title: "Independent Contractor Agreement",  meta: "Contractor engagement agreement",                  jurisdiction: "CBCA",  tier: "Gold" },
          { title: "ESOP Grant Agreement",              meta: "Stock option grant under company ESOP",            jurisdiction: "CBCA",  tier: "Gold" },
          { title: "SAFE Note (Pre-Money)",             meta: "Y-Combinator standard SAFE, Canadian variant",     jurisdiction: "ABCA",  tier: "Gold" },
          { title: "Share Purchase Agreement",          meta: "Purchase agreement for private company shares",    jurisdiction: "QBCA",  tier: "Gold" },
        ],
      },
      {
        label: "Search across the library",
        narration: {
          title: "Search across the library",
          body: "Type anywhere in the title, description, or category. Filter to the templates that matter — without scrolling 199 cards.",
        },
        scene: "explorer",
        explorerVariant: "templates",
        title: "Template Library",
        searchQuery: "employment",
        categoryTabs: [
          { label: "All",            count: 199, active: true  },
          { label: "Employment",     count: 22,  active: false },
          { label: "Equity",         count: 18,  active: false },
          { label: "Corporate",      count: 38,  active: false },
        ],
        searchSummary: "3 results for \"employment\"",
        gridItems: [
          { title: "Employment Agreement",             meta: "Full employment contract with standard clauses", jurisdiction: "BCBCA", tier: "Gold", active: true },
          { title: "Employment Offer Letter",          meta: "Formal offer letter for new hires",              jurisdiction: "OBCA",  tier: "Gold" },
          { title: "Independent Contractor Agreement", meta: "Contractor engagement agreement",                jurisdiction: "CBCA",  tier: "Gold" },
        ],
      },
      {
        label: "Preview · click \"Use Template\" to open in editor",
        narration: {
          title: "Mail-merge fields are already mapped",
          body: "Every template comes with placeholders pre-mapped to your company data. One click opens it in the editor with merge fields ready to populate.",
        },
        scene: "editor",
        title: "Employment Agreement · Preview",
        lines: [
          "EMPLOYMENT AGREEMENT",
          "",
          "This Employment Agreement is made as of {{DATE}}",
          "between {{COMPANY_NAME}},",
          "a {{JURISDICTION}} corporation (\"Employer\"),",
          "and {{EMPLOYEE_NAME}} (\"Employee\").",
          "",
          "1. Position: {{POSITION}}",
          "2. Start Date: {{START_DATE}}",
          "3. Salary: {{SALARY}}",
        ],
        highlightTokens: true,
        statusBadge: { text: "8 mail-merge fields detected · ready to populate", color: "#C9A84C" },
      },
    ],
    capabilities: [
      { icon: "library_books", label: "199+ templates covering incorporations, employment, equity, NDAs, board resolutions, and more" },
      { icon: "gavel", label: "Jurisdiction-specific — covers CBCA, BCBCA, ABCA, OBCA, and QBCA" },
      { icon: "search", label: "Browse by category, search by keyword, or filter by document type" },
      { icon: "preview", label: "Full preview before editing — see exactly what the document contains" },
      { icon: "edit", label: "One-click open into the editor with mail merge fields pre-mapped" },
      { icon: "update", label: "Templates updated regularly as legislation and market standards evolve" },
    ],
  },

  /* ── 6. Mail Merge ───────────────────────────────────────────── */
  {
    id: "mail-merge",
    icon: "mail",
    title: "Mail Merge & Auto-Population",
    shortTitle: "Mail Merge",
    tagline: "Enter once. Populate everywhere.",
    badge: "Time Saver",
    landingDescription:
      "Auto-populate complex shareholder agreements and board resolutions in seconds, not hours. Stored company data flows into every template.",
    subtitle: "One Source of Truth, Every Document",
    intro:
      "Store your company data once — officer names, share classes, addresses, incorporation details — and auto-populate every template instantly. No more copy-pasting the same information into 15 different documents.",
    designedFor:
      "Founders and operations leads who generate multiple corporate documents per month and are tired of manually entering the same company details each time.",
    video: "/videos/mail-merge.mp4",
    sceneType: "generic",
    demoSteps: [
      {
        label: "Template loaded · 6 placeholder fields detected",
        narration: {
          title: "Placeholders detected automatically",
          body: "We scan the template for {{merge fields}} and match each one against your company data store. Five of six are already auto-matched — one needs your pick.",
        },
        scene: "editor-ai",
        panelVariant: "mail-merge",
        title: "Employment Agreement.docx",
        lines: [
          "EMPLOYMENT AGREEMENT",
          "",
          "This Agreement is between {{company.name}},",
          "a {{company.jurisdiction}} corporation, and {{employee.name}},",
          "residing at {{employee.address}}.",
          "",
          "1. Salary: {{employee.salary}}",
          "2. Start Date: {{employee.start_date}}",
          "3. Position: {{employee.title}}",
        ],
        highlightTokens: true,
        panelLines: [
          { type: "merge-field", token: "company.name",         label: "Company Name",   suggested: "Lakeview Robotics Inc.",      source: "Company",  status: "auto-matched" },
          { type: "merge-field", token: "company.jurisdiction", label: "Jurisdiction",   suggested: "British Columbia",             source: "Company",  status: "auto-matched" },
          { type: "merge-field", token: "employee.name",        label: "Employee",       suggested: "Michael Torres",                    source: "People",   status: "auto-matched" },
          { type: "merge-field", token: "employee.address",     label: "Address",        suggested: "123 Demo Way, Vancouver BC",   source: "People",   status: "auto-matched" },
          { type: "merge-field", token: "employee.salary",      label: "Salary",         suggested: "$95,000",                      source: "People",   status: "auto-matched" },
          { type: "merge-field", token: "employee.start_date",  label: "Start Date",     suggested: "May 1, 2026",                  source: "Dates",    status: "needs-pick" },
          { type: "panel-summary", text: "5 of 6 auto-matched · 1 needs your pick" },
        ],
      },
      {
        label: "Pick \"Start Date\" from the Dates group",
        narration: {
          title: "Pick a value from the right group",
          body: "When auto-match isn't sure, you choose from grouped suggestions — Company, People, or Dates. No typing, no copy-paste.",
        },
        scene: "editor-ai",
        panelVariant: "mail-merge",
        title: "Employment Agreement.docx",
        showPopover: true,
        popover: {
          title: "Pick a value for {{employee.start_date}}",
          groups: [
            { label: "Company",   items: ["Incorporation Date · Jan 15, 2024"] },
            { label: "People",    items: ["Alex Chen Hire Date · Mar 1, 2025", "Jamie Park Hire Date · Aug 1, 2025"] },
            { label: "Dates",     items: ["Today · Apr 16, 2026", "May 1, 2026 ✓", "Custom date…"] },
          ],
          selected: "May 1, 2026",
        },
        lines: [
          "EMPLOYMENT AGREEMENT",
          "",
          "This Agreement is between {{company.name}},",
          "a {{company.jurisdiction}} corporation, and {{employee.name}},",
          "residing at {{employee.address}}.",
          "",
          "1. Salary: {{employee.salary}}",
          "2. Start Date: {{employee.start_date}}",
          "3. Position: {{employee.title}}",
        ],
        highlightTokens: true,
        panelLines: [
          { type: "merge-field", token: "employee.start_date", label: "Start Date", suggested: "May 1, 2026", source: "Dates", status: "selected" },
        ],
      },
      {
        label: "Apply Mail Merge — all 6 fields populated",
        narration: {
          title: "All 6 fields populated in seconds",
          body: "Click Apply and every placeholder is replaced with the right value. What used to be 20 minutes of copy-paste is now one click.",
        },
        scene: "editor",
        title: "Employment Agreement.docx",
        lines: [
          "EMPLOYMENT AGREEMENT",
          "",
          "This Agreement is between Lakeview Robotics Inc.,",
          "a British Columbia corporation, and Michael Torres,",
          "residing at 123 Demo Way, Vancouver BC.",
          "",
          "1. Salary: $95,000",
          "2. Start Date: May 1, 2026",
          "3. Position: Chief Technology Officer",
        ],
        statusBadge: { text: "Mail merge applied · 6/6 fields populated · ready to send", color: "#16a34a" },
      },
    ],
    capabilities: [
      { icon: "database", label: "Centralized company data store — enter once, use everywhere" },
      { icon: "mail", label: "Auto-populate templates with stored company, officer, and shareholder data" },
      { icon: "checklist", label: "Visual placeholder tracker shows remaining fields at a glance" },
      { icon: "group", label: "Employee-level data for ESOP grants, employment contracts, and offer letters" },
      { icon: "swap_horiz", label: "Switch between raw template and merged preview instantly" },
      { icon: "lock", label: "Company data encrypted at rest — never exposed to unauthorized users" },
    ],
  },

  /* ── 7. Company Data Store ───────────────────────────────────── */
  {
    id: "company-data",
    icon: "database",
    title: "Company Data Store",
    shortTitle: "Company Data Store",
    tagline: "One vault. Every document connected.",
    badge: null,
    landingDescription:
      "A single source of truth for your cap table, officer info, and corporate identity data — encrypted at rest and connected to every template.",
    subtitle: "Single Source of Truth",
    intro:
      "A centralized, encrypted vault for your cap table, officer details, share classes, addresses, and incorporation data. Enter it once and every template in the system can pull from it.",
    designedFor:
      "Founders and operations leads who are tired of re-entering the same company details across dozens of corporate documents.",
    video: "/videos/company-data.mp4",
    sceneType: "generic",
    demoSteps: [
      {
        label: "Company profile — incorporation details",
        narration: {
          title: "One profile, every document",
          body: "Legal name, jurisdiction, incorporation number, registered office. Enter it once — every template in the library pulls from this profile.",
        },
        scene: "form",
        formVariant: "company-profile",
        title: "Company Data",
        formGroups: [
          {
            label: "Company",
            fields: [
              { key: "Legal Name",         value: "Lakeview Robotics Inc." },
              { key: "Jurisdiction Type",  value: "Canada", select: ["Canada", "USA", "Other"] },
              { key: "Province",           value: "British Columbia", select: ["British Columbia", "Alberta", "Ontario", "Quebec", "…"] },
              { key: "Incorporation No.",  value: "BC1234567" },
              { key: "Incorporation Date", value: "Jan 15, 2024" },
            ],
          },
          {
            label: "Registered Office",
            fields: [
              { key: "Street",   value: "123 Startup Lane" },
              { key: "City",     value: "Vancouver" },
              { key: "Postal",   value: "V6B 1A1" },
            ],
          },
        ],
      },
      {
        label: "People · 5 role sections (Directors, Officers, Department Heads, Employees, Interns)",
        narration: {
          title: "People organized by role",
          body: "Directors, officers, department heads, employees, interns — each has its own section. Generate ESOP grants and offer letters from any record without re-typing details.",
        },
        scene: "form",
        formVariant: "people",
        title: "Company Data · People",
        roleSections: [
          {
            label: "Directors",
            count: 2,
            people: [
              { firstName: "Alex",   lastName: "Chen", title: "Chair of the Board", email: "alex@louisai.com",  initials: "AC" },
              { firstName: "Jamie",  lastName: "Park", title: "Director",            email: "jamie@louisai.com",  initials: "JP" },
            ],
          },
          {
            label: "Executive Officers",
            count: 2,
            people: [
              { firstName: "Alex",   lastName: "Chen", title: "CEO", email: "alex@louisai.com", initials: "AC" },
              { firstName: "Jamie",  lastName: "Park", title: "CTO", email: "jamie@louisai.com", initials: "JP" },
            ],
          },
          {
            label: "Department Heads",
            count: 1,
            people: [
              { firstName: "Priya", lastName: "Iyer", title: "Head of Operations", email: "priya@louisai.com", initials: "PI" },
            ],
          },
          {
            label: "Employees",
            count: 4,
            people: [
              { firstName: "Michael",lastName: "Torres",  title: "Senior Engineer",   email: "michael@louisai.com", initials: "MT" },
              { firstName: "Maya",   lastName: "Rossi",   title: "Senior Designer",   email: "maya@louisai.com",   initials: "MR" },
            ],
            collapsed: true,
            collapsedNote: "+ 2 more",
          },
          {
            label: "Interns",
            count: 0,
            empty: "No interns added yet",
          },
        ],
      },
      {
        label: "Connected to every template via Mail Merge",
        narration: {
          title: "Connected to every template",
          body: "Update a director name once and every active template — board resolutions, employment agreements, SAFE notes — stays in perfect sync.",
        },
        scene: "status",
        title: "Templates Auto-Filling From Company Data",
        statusItems: [
          { label: "Employment Agreement",        meta: "8 fields · company name, jurisdiction, signatory officer", status: "Live",  color: "#15803d" },
          { label: "Board Resolution",            meta: "5 fields · director names, incorporation number",          status: "Live",  color: "#15803d" },
          { label: "Independent Contractor Agt.", meta: "6 fields · company signatory, address, jurisdiction",      status: "Live",  color: "#15803d" },
          { label: "SAFE Note",                   meta: "4 fields · company name, jurisdiction, signatory",         status: "Live",  color: "#15803d" },
        ],
        footerNote: "Edit Company Data once — every connected template stays in sync",
        statusBadge: { text: "Centralized · encrypted at rest", color: "#16a34a" },
      },
    ],
    capabilities: [
      { icon: "database", label: "Centralized storage for cap table, officers, directors, and share classes" },
      { icon: "lock", label: "Encrypted at rest — company data never exposed to unauthorized users" },
      { icon: "sync", label: "Connected to mail merge — update once, propagate everywhere" },
      { icon: "people", label: "Employee-level records for ESOP grants, offer letters, and contracts" },
      { icon: "edit", label: "Edit and update company data anytime from the dashboard" },
    ],
  },

  /* ── 8. Digital Minutebook ──────────────────────────────────── */
  {
    id: "minutebook",
    icon: "menu_book",
    title: "Digital Minutebook",
    shortTitle: "Digital Minutebook",
    tagline: "Corporate records. Cloud-native.",
    landingDescription:
      "Keep your corporate records organized and audit-ready with a cloud-native minutebook that replaces the binder on the shelf.",
    subtitle: "Corporate Records, Cloud-Native",
    intro:
      "Keep your corporate records organized, searchable, and audit-ready. Board resolutions, shareholder consents, officer appointments — all in a structured digital minutebook that replaces the binder on the shelf.",
    designedFor:
      "Founders maintaining corporate governance records who need their minutebook accessible for audits, financing rounds, and regulatory filings.",
    video: "/videos/minutebook.mp4",
    sceneType: "generic",
    demoSteps: [
      {
        label: "Filter by year — every record indexed chronologically",
        narration: {
          title: "Your binder, organized chronologically",
          body: "Every resolution, consent, and appointment lives here — sorted by year and category. The dusty binder on the shelf is finally searchable.",
        },
        scene: "minutebook",
        title: "Digital Minutebook",
        subtitle: "A complete historical ledger of corporate governance, resolutions, and structural amendments.",
        years: [
          { label: "2026", active: true },
          { label: "2025" },
          { label: "2024" },
          { label: "Historical" },
        ],
        categories: [
          { label: "All Documents", active: true },
          { label: "Resolutions" },
          { label: "Director Resolutions" },
          { label: "Shareholder Consents" },
          { label: "Officer Appointments" },
          { label: "Share Issuance" },
          { label: "Director Consents" },
          { label: "Other" },
        ],
        records: [
          { category: "annual",              title: "Annual Resolutions of Directors",     date: "12 Apr 2026",  categoryLabel: "Resolutions",          jurisdiction: "BC",   primary: true },
          { category: "officer-appointment", title: "Appointment of Officers",              date: "08 Mar 2026",  categoryLabel: "Officer Appointments", jurisdiction: "BC" },
          { category: "share-issuance",      title: "Consent Resolution — Share Issuance",  date: "22 Feb 2026",  categoryLabel: "Share Issuance",       jurisdiction: "CBCA" },
          { category: "director-resolution", title: "Director Resolution — Banking Auth",   date: "18 Jan 2026",  categoryLabel: "Director Resolutions", jurisdiction: "BC" },
          { category: "shareholder-consent", title: "Shareholder Consent — Option Pool",    date: "05 Jan 2026",  categoryLabel: "Shareholder Consents", jurisdiction: "BC" },
          { category: "initial-record",      title: "Initial Director Consent",             date: "15 Jan 2024",  categoryLabel: "Director Consents",    jurisdiction: "BC" },
        ],
      },
      {
        label: "Search across the minutebook",
        narration: {
          title: "Search across every record",
          body: "Type a keyword — director appointment, share issuance, banking — and the minutebook surfaces every matching resolution across years.",
        },
        scene: "minutebook",
        title: "Digital Minutebook",
        subtitle: "Search returned 3 records across 3 years.",
        years: [
          { label: "2026" },
          { label: "2025" },
          { label: "2024" },
          { label: "Historical" },
        ],
        categories: [
          { label: "All Documents", active: true },
          { label: "Resolutions" },
          { label: "Director Resolutions" },
          { label: "Officer Appointments" },
          { label: "Other" },
        ],
        searchBar: {
          query: "director appointment",
          summary: "3 results across 3 years",
        },
        records: [
          { category: "officer-appointment", title: "Consent Resolution — Appointing Officers (2026)", date: "08 Mar 2026",  categoryLabel: "Officer Appointments", jurisdiction: "BC",   primary: true },
          { category: "director-resolution", title: "Initial Directors Resolution (2024)",              date: "15 Jan 2024",  categoryLabel: "Director Resolutions", jurisdiction: "BC" },
          { category: "director-resolution", title: "Board Resolution — Director Change (2025)",        date: "12 Aug 2025",  categoryLabel: "Director Resolutions", jurisdiction: "BC" },
        ],
      },
      {
        label: "Export the full minutebook for auditors",
        narration: {
          title: "One-click export for auditors",
          body: "Generate a chronologically ordered PDF package — table of contents, every record, ready for counsel, auditors, or due diligence.",
        },
        scene: "status",
        title: "Export Minutebook",
        statusItems: [
          { label: "Documents",          meta: "42 included",                  status: "Verified",  color: "#15803d" },
          { label: "Chronological order", meta: "All records sorted by date",   status: "Verified",  color: "#15803d" },
          { label: "Table of contents",  meta: "Auto-generated",               status: "Generated", color: "#15803d" },
        ],
        footerNote: "Format: PDF Package · Size: 8.4 MB · Share link generated",
        statusBadge: { text: "Download ready", color: "#16a34a" },
      },
    ],
    capabilities: [
      { icon: "menu_book", label: "Organized chronological record of all corporate resolutions and consents" },
      { icon: "search", label: "Search across your entire minutebook by keyword, date, or document type" },
      { icon: "verified", label: "Audit-ready structure that meets Canadian corporate governance standards" },
      { icon: "calendar_month", label: "Automatic chronological ordering — never file a resolution out of sequence" },
      { icon: "download", label: "Export your full minutebook as a PDF package for counsel or auditors" },
    ],
  },

  /* ── 9. Investor Data Room ──────────────────────────────────── */
  {
    id: "data-room",
    icon: "folder_zip",
    title: "Investor Data Room",
    shortTitle: "Data Room",
    tagline: "Fundraise-ready. Instantly.",
    landingDescription:
      "Deploy secure, investor-ready data rooms instantly. Tiered permissions ensure investors see exactly what they should — and nothing more.",
    subtitle: "Fundraise-Ready, Instantly",
    intro:
      "Deploy secure, investor-ready data rooms when it's time to raise. Tiered permissions ensure investors see exactly what they should — and nothing more.",
    designedFor:
      "Founders preparing for seed or Series A who need a professional, secure way to share diligence materials with prospective investors and their counsel.",
    video: "/videos/data-room.mp4",
    sceneType: "generic",
    demoSteps: [
      {
        label: "All your data rooms in one place",
        narration: {
          title: "One workspace for every raise",
          body: "Stand up a Series A room for one investor, an acquisition data room for another. Each enclosure is sandboxed — different documents, different invitees, different permissions.",
        },
        scene: "data-room",
        view: "list",
        title: "Investor Data Room",
        subtitle: "Secure enclosures for sensitive financial and legal auditing.",
        rooms: [
          {
            name: "Series A Due Diligence",
            description: "Open to lead and co-investors for the upcoming Series A round.",
            status: "ACTIVE",
            docCount: 24,
            active: true,
          },
          {
            name: "Acquisition — Acme Corp",
            description: "Buy-side diligence enclosure for the Acme strategic acquisition.",
            status: "ACTIVE",
            docCount: 36,
          },
          {
            name: "Seed Round (Closed)",
            description: "Archived enclosure from the 2024 seed round.",
            status: "ARCHIVED",
            docCount: 18,
          },
          {
            name: "Vendor — Audit Firm",
            description: "Read-only access for our 2026 audit.",
            status: "SECURE",
            docCount: 12,
          },
        ],
      },
      {
        label: "Inside the room — categorized files, live activity feed",
        narration: {
          title: "3-pane file browser with audit trail",
          body: "Categories on the left, files in the centre, real-time activity on the right. You see who downloaded what, when — investor engagement at a glance.",
        },
        scene: "data-room",
        view: "detail",
        title: "Series A Due Diligence",
        categories: [
          { label: "Financials",          count: 4,  active: true },
          { label: "Corporate Docs",      count: 6 },
          { label: "Cap Table",           count: 2 },
          { label: "IP Assignments",      count: 3 },
          { label: "HR & Employees",      count: 5 },
          { label: "Customer Contracts",  count: 4 },
          { label: "Other",               count: 0 },
        ],
        files: [
          { icon: "picture_as_pdf", name: "2025 Audited Financial Statements.pdf", uploader: "Alex Chen",  date: "Apr 14, 2026", size: "4.2 MB", status: "Verified", highlight: true },
          { icon: "picture_as_pdf", name: "2026 Q1 Projections.xlsx",              uploader: "Jamie Park",  date: "Apr 12, 2026", size: "1.1 MB", status: "Verified" },
          { icon: "picture_as_pdf", name: "Cap Table — Current.pdf",               uploader: "Alex Chen",  date: "Apr 11, 2026", size: "0.8 MB", status: "Verified" },
          { icon: "picture_as_pdf", name: "SAFE Conversion Schedule.pdf",          uploader: "Alex Chen",  date: "Apr 10, 2026", size: "0.6 MB", status: "Pending" },
        ],
        activity: [
          { initials: "MC", color: "#C9A84C", actor: "Maplebrook Capital", action: "Downloaded 2025 Audited Financials", time: "12 MIN AGO" },
          { initials: "BC", color: "#2563eb", actor: "Banff Capital",      action: "Viewed Cap Table — Current",          time: "32 MIN AGO" },
          { initials: "NL", color: "#15803d", actor: "Northline Accelerator", action: "Joined the data room",             time: "1 HR AGO" },
          { initials: "AC", color: "#777",    actor: "Alex Chen",          action: "Uploaded Q1 Projections",             time: "TODAY 9:14 AM" },
        ],
      },
      {
        label: "Tiered permissions — invite investors with the right access",
        narration: {
          title: "Tiered permissions per invitee",
          body: "Lead investors get download rights, counsel gets view-only, the team gets full edit. Every invitation can be revoked instantly.",
        },
        scene: "data-room",
        view: "detail",
        title: "Series A Due Diligence",
        categories: [
          { label: "Financials",          count: 4,  active: true },
          { label: "Corporate Docs",      count: 6 },
          { label: "Cap Table",           count: 2 },
          { label: "IP Assignments",      count: 3 },
        ],
        files: [
          { icon: "picture_as_pdf", name: "2025 Audited Financial Statements.pdf", uploader: "Alex Chen", date: "Apr 14, 2026", size: "4.2 MB", status: "Verified" },
          { icon: "picture_as_pdf", name: "2026 Q1 Projections.xlsx",              uploader: "Jamie Park", date: "Apr 12, 2026", size: "1.1 MB", status: "Verified" },
        ],
        activity: [
          { initials: "MC", color: "#C9A84C", actor: "Maplebrook Capital", action: "Joined the data room", time: "JUST NOW" },
        ],
        inviteModal: {
          email: "partner@louisai.com",
          permission: "View + Download",
          invitations: [
            { email: "partner@louisai.com",          permission: "View + Download", status: "accepted" },
            { email: "associate@louisai.com",        permission: "View + Download", status: "accepted" },
            { email: "counsel@louisai.com",          permission: "View only",       status: "pending" },
            { email: "old.lead@louisai.com",         permission: "View + Download", status: "revoked" },
          ],
        },
      },
    ],
    capabilities: [
      { icon: "folder_shared", label: "One-click data room deployment from your existing document workspace" },
      { icon: "visibility", label: "Tiered permissions — investors, counsel, and team each see the right documents" },
      { icon: "analytics", label: "Track who viewed what and when with investor engagement analytics" },
      { icon: "lock", label: "Watermarked downloads and view-only modes for sensitive documents" },
      { icon: "link", label: "Shareable invite links with expiration dates and access controls" },
    ],
  },
];

/** Lookup map by feature id. */
export const FEATURES_BY_ID = FEATURES.reduce((acc, f) => {
  acc[f.id] = f;
  return acc;
}, {});

/** Public use-case slugs. Defaults to id unless a feature has a better URL. */
export const FEATURE_SLUGS_BY_ID = FEATURES.reduce((acc, f) => {
  acc[f.id] = f.slug ?? f.id;
  return acc;
}, {});

/** Resolve a URL slug or legacy id back to a feature id. */
export const FEATURE_IDS_BY_SLUG = FEATURES.reduce((acc, f) => {
  acc[f.id] = f.id;
  acc[f.slug ?? f.id] = f.id;
  return acc;
}, {});

/** All feature IDs in canonical order. */
export const FEATURE_IDS = FEATURES.map((f) => f.id);
