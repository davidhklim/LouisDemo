import PublicPageShell from "./PublicPageShell";

export default function PublicTermsPage({
  onGoHome,
  onViewPricing,
  onGetStarted,
}) {
  const actions = [
    {
      key: "pricing",
      label: "Pricing",
      onClick: onViewPricing,
    },
    {
      key: "start-free",
      label: "Start Free",
      onClick: onGetStarted,
      className: "pill-button primary-button",
    },
  ];

  return (
    <PublicPageShell onGoHome={onGoHome} actions={actions}>
      <section className="public-pricing__hero public-reveal">
        <p className="public-legal__updated">
          Last Updated: March 31, 2026 &middot; Effective Date: March 31, 2026
        </p>
        <h1>Terms of Use</h1>
      </section>

      {/* 1. Agreement to Terms */}
      <section className="public-about__section public-legal__section public-reveal">
        <h2>1. Agreement to Terms</h2>
        <p>
          By accessing or using the LouisAI platform (the "Service"), you agree
          to be bound by these Terms of Use ("Terms"). If you are using the
          Service on behalf of a company or other legal entity, you represent
          that you have the authority to bind that entity to these Terms, and
          references to "you" include that entity.
        </p>
        <p>If you do not agree to these Terms, you must not use the Service.</p>
        <p>
          These Terms are a legal agreement between you and LouisAI ("we," "us,"
          or "our"), a company incorporated under the laws of British Columbia,
          Canada, headquartered in Vancouver, British Columbia.
        </p>
      </section>

      {/* 2. Description of Service */}
      <section className="public-about__section public-legal__section public-reveal">
        <h2>2. Description of Service</h2>
        <p>
          LouisAI is a legal operations platform designed to help startup
          founders and their teams draft, organize, and manage corporate legal
          documents more efficiently. The Service includes:
        </p>
        <ul>
          <li>A library of curated Canadian corporate document templates</li>
          <li>AI-assisted document drafting tools</li>
          <li>
            A centralized workspace for company data (directors, employees,
            share structures, and related information)
          </li>
          <li>
            Document generation through template population using your stored
            company data
          </li>
          <li>Corporate records organization and management tools</li>
        </ul>
        <p>
          LouisAI is a software tool. It is not a law firm. It does not provide
          legal advice, legal representation, or legal services. See Section 5
          for the full AI disclaimer, which you should read carefully before
          using the drafting features.
        </p>
      </section>

      {/* 3. Account Registration */}
      <section className="public-about__section public-legal__section public-reveal">
        <h2>3. Account Registration</h2>
        <p>
          To use the Service, you must create an account. When registering, you
          agree to:
        </p>
        <ul>
          <li>Provide accurate, complete, and current information</li>
          <li>
            Maintain and promptly update your account information if it changes
          </li>
          <li>
            Keep your password and authentication credentials secure and
            confidential
          </li>
          <li>Not share your account credentials with any other person</li>
          <li>
            Notify us immediately at{" "}
            <a href="mailto:louisaiproject@gmail.com" className="public-site-footer__link">
              louisaiproject@gmail.com
            </a>{" "}
            if you suspect unauthorized access to your account
          </li>
        </ul>
        <p>
          You are responsible for all activity that occurs under your account,
          whether or not you authorized it. We are not liable for any loss or
          damage arising from your failure to maintain the security of your
          credentials.
        </p>
        <p>
          Each account is for use by one individual. If you are a team using the
          Service, each team member must have their own account under your
          organization's workspace (when team features are available).
        </p>
      </section>

      {/* 4. Acceptable Use */}
      <section className="public-about__section public-legal__section public-reveal">
        <h2>4. Acceptable Use</h2>
        <p>
          You agree to use the Service only for lawful purposes and in
          accordance with these Terms. You agree not to:
        </p>
        <ul>
          <li>
            Use the Service in any way that violates applicable Canadian federal
            or provincial law, or the law of any jurisdiction in which you are
            located or operating
          </li>
          <li>
            Use the Service to draft, generate, or store documents intended to
            facilitate fraud, money laundering, tax evasion, or any other
            unlawful purpose
          </li>
          <li>
            Attempt to reverse engineer, decompile, disassemble, or otherwise
            attempt to derive the source code of the Service or any underlying
            AI model
          </li>
          <li>
            Use automated scripts, bots, crawlers, or other automated tools to
            scrape, extract, or collect data from the Service
          </li>
          <li>
            Share, sell, or transfer your account credentials to any other
            person
          </li>
          <li>
            Upload or introduce malicious code, malware, or any software
            intended to damage or interfere with the Service
          </li>
          <li>
            Attempt to gain unauthorized access to any account, database, or
            system connected to the Service
          </li>
          <li>
            Circumvent, disable, or interfere with any security feature,
            authentication requirement, or access control of the Service
          </li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that violate
          these restrictions, without prior notice where the violation is
          serious.
        </p>
      </section>

      {/* 5. AI-Generated Content Disclaimer */}
      <section className="public-about__section public-legal__section public-legal__highlight public-reveal">
        <h2>5. AI-Generated Content Disclaimer</h2>
        <p>
          <strong>
            This section is important. Please read it carefully before using any
            AI-assisted drafting feature.
          </strong>
        </p>
        <p>
          <strong>
            LouisAI is not a law firm. The AI-assisted drafting features of this
            Service produce documents that are drafts only — they are not legal
            advice and they are not legal opinions.
          </strong>
        </p>
        <p>
          <strong>No lawyer-client relationship is created</strong> by your use
          of the Service. No communication through LouisAI — including
          AI-generated document drafts, template suggestions, or any other
          output — constitutes legal advice or establishes any professional
          relationship.
        </p>
        <p>
          <strong>
            AI-generated documents may be incorrect, incomplete, or
            inappropriate for your situation.
          </strong>{" "}
          AI language models have limitations. They can produce output that
          appears plausible but is legally inaccurate, outdated, or unsuitable
          for your specific circumstances, jurisdiction, or transaction. The AI
          does not know the full context of your situation unless you tell it,
          and even then it may make errors.
        </p>
        <p>
          <strong>
            Every AI-generated document must be reviewed by qualified legal
            counsel before it is signed, executed, sent to a counterparty, or
            relied upon in any legal context.
          </strong>{" "}
          Do not execute any document generated by LouisAI without first having
          it reviewed by a lawyer licensed to practice in the relevant
          jurisdiction.
        </p>
        <p>
          <strong>
            LouisAI is not responsible for any harm arising from reliance on
            AI-generated documents.
          </strong>{" "}
          If you use or execute a document generated by the Service without
          obtaining appropriate legal review, you do so at your own risk.
          LouisAI disclaims all liability for errors, omissions, or
          consequences arising from AI-generated drafts.
        </p>
        <p>
          The purpose of LouisAI's AI drafting tools is to accelerate the
          drafting process and give your lawyer a better starting point — not to
          replace your lawyer.
        </p>
      </section>

      {/* 6. Disclaimer of Warranties */}
      <section className="public-about__section public-legal__section public-reveal">
        <h2>6. Disclaimer of Warranties</h2>
        <p>
          The Service is provided "as is" and "as available" without warranties
          of any kind, express or implied.
        </p>
        <p>LouisAI does not warrant that:</p>
        <ul>
          <li>
            The Service will be error-free, uninterrupted, or free from security
            vulnerabilities
          </li>
          <li>
            Any AI-generated document will be accurate, legally sufficient, or
            appropriate for your purpose
          </li>
          <li>
            The Service will meet your specific legal or business requirements
          </li>
        </ul>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, LOUISAI HEREBY
          DISCLAIMS ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED,
          STATUTORY, OR OTHERWISE. LOUISAI SPECIFICALLY DISCLAIMS ALL IMPLIED
          CONDITIONS OR WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, TITLE, AND NON-INFRINGEMENT. NO ADVICE OR INFORMATION,
          WHETHER ORAL OR WRITTEN, OBTAINED FROM LOUISAI OR THROUGH THE SERVICE
          WILL CREATE ANY WARRANTY NOT EXPRESSLY STATED HEREIN.
        </p>
      </section>

      {/* 7. Contact */}
      <section className="public-about__section public-legal__section public-reveal">
        <h2>7. Contact</h2>
        <p>For questions about these Terms:</p>
        <p>
          <strong>LouisAI</strong>
          <br />
          Vancouver, British Columbia, Canada
          <br />
          <a href="mailto:louisaiproject@gmail.com" className="public-site-footer__link">
            louisaiproject@gmail.com
          </a>
        </p>
      </section>

      <div className="public-landing__cta-row">
        <button type="button" className="pill-button" onClick={onGoHome}>
          Back to Home
        </button>
      </div>
    </PublicPageShell>
  );
}
