import PublicPageShell from "./PublicPageShell";

export default function PublicPrivacyPage({
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
        <p className="public-legal__updated">Last Updated: March 31, 2026</p>
        <h1>Privacy Policy</h1>
      </section>

      {/* 1. Who We Are */}
      <section className="public-about__section public-legal__section public-reveal">
        <h2>1. Who We Are</h2>
        <p>
          LouisAI is a legal operations platform for Canadian startup founders.
          We are incorporated and headquartered in Vancouver, British Columbia,
          Canada.
        </p>
        <p>
          LouisAI is not a law firm and does not provide legal advice. We
          provide software tools to help founders draft, organize, and manage
          corporate legal documents more efficiently.
        </p>
        <p>
          This Privacy Policy explains what personal information we collect when
          you use the LouisAI platform, how we use and protect it, and what
          rights you have under Canadian privacy law.
        </p>
        <p>
          If you have any questions about this policy, contact us at{" "}
          <a href="mailto:louisaiproject@gmail.com" className="public-site-footer__link">
            louisaiproject@gmail.com
          </a>.
        </p>
      </section>

      {/* 2. Data Retention */}
      <section className="public-about__section public-legal__section public-reveal">
        <h2>2. Data Retention</h2>
        <p>
          We will only retain your personal information for as long as necessary
          to fulfill the purposes we collected it for, including for the purposes
          of satisfying any legal, accounting, or reporting requirements. We
          retain your personal information while your account is active and for a
          reasonable period afterward to support account recovery, comply with
          legal obligations, and resolve disputes.
        </p>
        <p>Our current retention guidelines are as follows:</p>
        <ul>
          <li>
            <strong>Documents and company data:</strong> Retained while your
            account is active, plus 90 days after account deletion (to allow for
            data export and recovery)
          </li>
          <li>
            <strong>Security audit logs:</strong> Retained for 2 years from the
            date of the logged event
          </li>
          <li>
            <strong>Inactive accounts:</strong> Accounts with no login activity
            for 24 consecutive months will be flagged for deletion. We will send
            you at least one notice by email at least 30 days before deletion.
            You may reactivate your account by logging in before that deadline.
          </li>
        </ul>
        <p>
          After the applicable retention period, data is securely deleted from
          our systems. We cannot recover data after permanent deletion.
        </p>
        <p>
          Under some circumstances we may anonymize your personal information so
          that it can no longer be associated with you. We reserve the right to
          use such anonymous and de-identified data for any legitimate business
          purpose without further notice to you or your consent.
        </p>
        <p>
          We will refine these retention periods as the platform matures and
          will update this policy when we do.
        </p>
      </section>

      {/* 3. Contact Us */}
      <section className="public-about__section public-legal__section public-reveal">
        <h2>3. Contact Us</h2>
        <p>Privacy inquiries, access requests, and complaints:</p>
        <p>
          <strong>LouisAI</strong>
          <br />
          Vancouver, British Columbia, Canada
          <br />
          <a href="mailto:louisaiproject@gmail.com" className="public-site-footer__link">
            louisaiproject@gmail.com
          </a>
        </p>
        <p>
          We aim to respond to all privacy inquiries within 10 business days.
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
