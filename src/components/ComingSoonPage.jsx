import PublicPageShell from "./PublicPageShell";

const UPDATE_EMAIL = "louisaiproject@gmail.com";
const UPDATE_MAILTO = `mailto:${UPDATE_EMAIL}?subject=${encodeURIComponent(
  "I would like to stay updated!"
)}&body=${encodeURIComponent(`Hi LouisAI team,

I would like to stay updated.

Name: [your name]
Company: [company name]
Role: [your role]
Location: [city/province]
Interested in: [mailing list / pilot project / investor information]

Notes:
[add anything else you want us to know]`)}`;

export default function ComingSoonPage({ onGoHome }) {
  const actions = [
    {
      key: "home",
      label: "Home",
      onClick: onGoHome,
    },
  ];

  return (
    <PublicPageShell
      pageClassName="coming-soon-page"
      headerClassName="coming-soon-page__header"
      actionsClassName="coming-soon-page__actions"
      contentClassName="coming-soon-page__content"
      onGoHome={onGoHome}
      actions={actions}
    >
      <section className="coming-soon public-reveal">
        <p className="coming-soon__eyebrow">LouisAI</p>
        <h1>Coming Soon</h1>
        <p>
          Please contact us to be added to our mailing list and if interested
          in participating in our pilot project.
        </p>
        <div className="coming-soon__actions">
          <button type="button" className="coming-soon__home-btn" onClick={onGoHome}>
            Back to Home
          </button>
          <a
            href={UPDATE_MAILTO}
            className="coming-soon__email-link"
            aria-label="Email LouisAI"
          >
            {UPDATE_EMAIL}
          </a>
        </div>
      </section>
    </PublicPageShell>
  );
}
