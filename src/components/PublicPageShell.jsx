import PublicSiteFooter from "./PublicSiteFooter";

export default function PublicPageShell({
  pageClassName = "public-pricing",
  headerClassName = "public-pricing__header",
  brandClassName = "brand",
  actionsClassName = "public-pricing__actions",
  contentClassName = "public-pricing__content",
  onGoHome,
  actions = [],
  brandExtra = null,
  decor = null,
  children,
}) {
  return (
    <div className={pageClassName}>
      {decor}
      <header className={headerClassName}>
        <div className={brandClassName}>
          {typeof onGoHome === "function" ? (
            <button type="button" className="brand__logo-button" onClick={onGoHome}>
              <span className="brand__logo-text">LouisAI</span>
            </button>
          ) : (
            <span className="brand__logo-text">LouisAI</span>
          )}
          {brandExtra}
        </div>
        <nav className={actionsClassName}>
          {actions.map((action) => (
            <button
              key={action.key ?? action.label}
              type={action.type ?? "button"}
              className={action.className ?? "header-actions__link"}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </nav>
      </header>

      <main className={contentClassName}>{children}</main>
      <PublicSiteFooter />
    </div>
  );
}
