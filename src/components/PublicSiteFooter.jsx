import { useState } from "react";
import { Link } from "react-router-dom";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PublicSiteFooter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextEmail = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(nextEmail)) {
      setStatus("Please enter a valid email.");
      return;
    }

    setStatus("Thanks. You are on the update list.");
    setEmail("");
  };

  return (
    <footer className="public-site-footer">
      <div className="public-site-footer__inner">
        <div className="public-site-footer__grid">
          <section className="public-site-footer__section">
            <h2>Stay updated.</h2>
            <p>
              Subscribe to receive updates on our progress, pilot program, and industry insights.
            </p>
            <form className="public-site-footer__form" onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email."
                aria-label="Enter your email"
              />
              <button type="submit" className="pill-button primary-button">
                Subscribe
              </button>
            </form>
            {status ? <p className="public-site-footer__status">{status}</p> : null}
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
              <a href="mailto:louisaiproject@gmail.com" className="public-site-footer__link">
                louisaiproject@gmail.com
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
