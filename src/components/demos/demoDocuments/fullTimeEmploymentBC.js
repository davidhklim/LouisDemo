/**
 * fullTimeEmploymentBC.js — Scripted "Full-Time Employment Agreement (BC)"
 * fixture used by:
 *   - Template Library demo preview (slide-in panel)
 *   - Public Editor Page (/editor/:templateId)
 *
 * SECURITY: This is *scripted content*, hand-authored for the public
 * Investor-webpage. It is not pulled from the real template library and
 * must never be — see vite.config.js for the rationale (Tier 1 audit
 * finding H-3). Edit this file directly when the marketing copy needs
 * to change.
 *
 * The document is rendered as a plain JS data structure (not raw JSX) so
 * it can be reused in different chrome (preview vs. editor) without
 * duplication. Each section is a heading + an array of paragraph nodes.
 * Paragraphs may be a string or { kind: "li", text } for list items.
 */

export const FULL_TIME_EMPLOYMENT_BC_TITLE = "Full-Time Employment Agreement";

export const FULL_TIME_EMPLOYMENT_BC_SUBTITLE =
  "Between {COMPANY LEGAL NAME} and {EMPLOYEE NAME}";

export const FULL_TIME_EMPLOYMENT_BC_DOCUMENT = [
  {
    heading: null,
    paragraphs: [
      "THIS EMPLOYMENT AGREEMENT (the “Agreement”) is made as of the {EFFECTIVE DATE}, between {COMPANY LEGAL NAME}, a company duly incorporated under the laws of British Columbia (the “Company”), and {EMPLOYEE NAME}, of the City of Vancouver, in the Province of British Columbia (the “Employee”).",
      "WHEREAS the Company wishes to employ the Employee and the Employee wishes to be so employed, the parties agree as follows:",
    ],
  },
  {
    heading: "1. POSITION AND DUTIES",
    paragraphs: [
      "1.1 The Employee shall serve as {POSITION TITLE} and shall report to the {REPORTING MANAGER}. The Employee shall perform the duties customarily associated with such position and such other duties as the Company may reasonably assign from time to time.",
      "1.2 The Employee shall devote substantially all of their working time, attention, and skill to the business of the Company and shall not, without the prior written consent of the Company, engage in any other business activity that would materially interfere with the performance of the Employee’s duties.",
    ],
  },
  {
    heading: "2. COMPENSATION",
    paragraphs: [
      "2.1 Base Salary. The Company shall pay the Employee a base salary of {BASE SALARY} per annum, payable in equal instalments in accordance with the Company’s standard payroll practices, less applicable deductions and withholdings.",
      "2.2 Equity. Subject to approval by the Board of Directors, the Employee shall be granted {OPTION GRANT} stock options under the Company’s Stock Option Plan, vesting over four (4) years with a one (1) year cliff.",
      "2.3 Benefits. The Employee shall be entitled to participate in the Company’s standard benefits programs, including extended health and dental coverage, on the same terms as similarly situated employees.",
    ],
  },
  {
    heading: "3. VACATION",
    paragraphs: [
      "3.1 The Employee shall be entitled to {VACATION DAYS} business days of paid vacation per calendar year, accruing pro rata, in accordance with the Company’s vacation policy and the Employment Standards Act (British Columbia).",
    ],
  },
  {
    heading: "4. CONFIDENTIALITY AND INTELLECTUAL PROPERTY",
    paragraphs: [
      "4.1 Confidentiality. The Employee acknowledges that during the course of employment they will have access to confidential information of the Company, and agrees to hold all such information in strict confidence both during and after the term of employment.",
      "4.2 Assignment of Intellectual Property. The Employee hereby assigns to the Company all right, title, and interest in any intellectual property, including without limitation inventions, software, designs, and works of authorship, conceived or developed by the Employee during the course of employment that relate to the business of the Company.",
      "4.3 Moral Rights. The Employee waives all moral rights in any work product to the fullest extent permitted by law.",
    ],
  },
  {
    heading: "5. TERMINATION",
    paragraphs: [
      "5.1 Termination by Employee. The Employee may terminate this Agreement upon providing the Company with two (2) weeks’ written notice.",
      "5.2 Termination by Company for Cause. The Company may terminate this Agreement at any time for cause, without notice or pay in lieu of notice.",
      "5.3 Termination by Company without Cause. The Company may terminate this Agreement without cause upon providing the Employee with the minimum notice or pay in lieu thereof prescribed by the Employment Standards Act (British Columbia), and no more.",
    ],
  },
  {
    heading: "6. NON-SOLICITATION",
    paragraphs: [
      "6.1 During the term of this Agreement and for a period of twelve (12) months following termination, the Employee shall not, directly or indirectly, solicit any employee, contractor, customer, or supplier of the Company for the purpose of inducing them to terminate or alter their relationship with the Company.",
    ],
  },
  {
    heading: "7. GOVERNING LAW",
    paragraphs: [
      "7.1 This Agreement shall be governed by and construed in accordance with the laws of the Province of British Columbia and the federal laws of Canada applicable therein. The parties attorn to the exclusive jurisdiction of the courts of British Columbia.",
    ],
  },
  {
    heading: "8. ENTIRE AGREEMENT",
    paragraphs: [
      "8.1 This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, understandings, and agreements, whether oral or written, relating to the subject matter hereof.",
    ],
  },
];

/**
 * Number of {PLACEHOLDERS} in the document — used by the editor page
 * status bar to show "N placeholders detected".
 */
export const FULL_TIME_EMPLOYMENT_BC_PLACEHOLDER_COUNT = 9;
