import { useNavigate } from "react-router-dom";
import "./Learn.css";

/**
 * LearnRelatedTemplates — shows links to related templates from the template library.
 * If user is authenticated, links go to /template/:id.
 * If not, shows a prompt to sign in.
 */
export default function LearnRelatedTemplates({
  templateIds = [],
  isAuthenticated = false,
  onSignIn,
}) {
  const navigate = useNavigate();

  if (templateIds.length === 0) return null;

  return (
    <section className="learn-detail__section">
      <h2 className="learn-detail__section-title">Related templates</h2>
      <div className="learn-templates">
        {templateIds.map((tplId) => {
          // Format the template ID into a readable title
          const readableTitle = tplId
            .replace(/^tpl-/, "")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return (
            <button
              key={tplId}
              type="button"
              className="learn-templates__item"
              onClick={() => {
                if (isAuthenticated) {
                  navigate(`/template/${tplId}`);
                } else if (onSignIn) {
                  onSignIn();
                }
              }}
            >
              <span className="learn-templates__icon">&#x1F4C4;</span>
              <span className="learn-templates__name">{readableTitle}</span>
              {!isAuthenticated && (
                <span className="learn-templates__lock">Sign in to view</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
