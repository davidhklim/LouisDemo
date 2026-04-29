import { Link } from "react-router-dom";

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

const MailIcon = () => (
  <svg
    className="public-site-footer__mail-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M4.75 6.75h14.5v10.5H4.75V6.75Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="m5.25 7.25 6.75 5.5 6.75-5.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PublicSiteFooter = () => {
  return (
    <footer className="public-site-footer">
      <div className="public-site-footer__inner">
        <div className="public-site-footer__grid">
          <section className="public-site-footer__section">
            <h2>Stay updated</h2>
            <a
              href={UPDATE_MAILTO}
              className="public-site-footer__email-link"
              aria-label="Email LouisAI to join the update list"
            >
              <MailIcon />
              {UPDATE_EMAIL}
            </a>
          </section>

          <section className="public-site-footer__section">
            <h2>Legal</h2>
            <p>
              <Link to="/privacy" className="public-site-footer__link">Privacy Policy</Link>
            </p>
            <p>
              <Link to="/terms" className="public-site-footer__link">Terms of Use</Link>
            </p>
          </section>

          <section className="public-site-footer__section">
            <h2>Contact</h2>
            <p>
              <strong>Email:</strong>{" "}
              <a href={UPDATE_MAILTO} className="public-site-footer__link">
                {UPDATE_EMAIL}
              </a>
            </p>
            <p>
              <strong>Location:</strong> Vancouver, British Columbia
            </p>
          </section>
        </div>
      </div>
    </footer>
  );
};

export default PublicSiteFooter;
