import PublicPageShell from "./PublicPageShell";

export default function ComingSoonPage({ onGoHome }) {
  const actions = [
    {
      key: "home",
      label: "Home",
      onClick: onGoHome,
    },
  ];

  return (
    <PublicPageShell onGoHome={onGoHome} actions={actions}>
      <section className="coming-soon public-reveal">
        <h1>Coming Soon</h1>
        <p>
          We are building LouisAI for Canadian startup founders.
          <br />
          Please email{" "}
          <a href="mailto:louisaiproject@gmail.com" className="public-site-footer__link">
            louisaiproject@gmail.com
          </a>{" "}
          to stay updated.
        </p>
        <button type="button" className="pill-button primary-button" onClick={onGoHome}>
          Back to Home
        </button>
      </section>
    </PublicPageShell>
  );
}
