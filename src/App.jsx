import { useLayoutEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import PublicLandingPage from "./components/PublicLandingPage";
import PublicUseCasePage from "./components/PublicUseCasePage";
import { FEATURE_SLUGS_BY_ID } from "./data/features";
import PublicAboutPage from "./components/PublicAboutPage";
import LearnPage from "./components/learn/LearnPage";
import LearnTermDetail from "./components/learn/LearnTermDetail";
import PublicPrivacyPage from "./components/PublicPrivacyPage";
import PublicTermsPage from "./components/PublicTermsPage";
import ComingSoonPage from "./components/ComingSoonPage";
import PublicEditorPage from "./components/PublicEditorPage";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const goHome = () => navigate("/");
  const goUseCases = () => navigate("/", { state: { scrollTo: "use-cases", nonce: Date.now() } });
  const goComingSoon = () => navigate("/coming-soon");
  const goAbout = () => navigate("/about");
  const goLearn = () => navigate("/learn");
  const openUseCase = (id) => {
    const slug = FEATURE_SLUGS_BY_ID[id] ?? id;
    navigate(`/use-case/${slug}`, { state: { scrollTo: "top", nonce: Date.now() } });
  };

  useLayoutEffect(() => {
    const resetScroll = () => {
      const targets = [
        document.scrollingElement,
        document.documentElement,
        document.body,
        document.getElementById("root"),
      ].filter(Boolean);

      targets.forEach((target) => {
        target.scrollTop = 0;
        target.scrollLeft = 0;
      });
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    const scrollToUseCases = () => {
      const section = document.querySelector(".landing__features");
      if (!section) {
        resetScroll();
        return;
      }

      section.scrollIntoView({ block: "start", behavior: "auto" });
    };

    if (location.pathname === "/" && location.state?.scrollTo === "use-cases") {
      scrollToUseCases();
      window.requestAnimationFrame(scrollToUseCases);
      window.setTimeout(scrollToUseCases, 80);
      return;
    }

    if (location.pathname.startsWith("/use-case/") || location.state?.scrollTo === "top") {
      resetScroll();
      window.requestAnimationFrame(resetScroll);
      window.setTimeout(resetScroll, 80);
      window.setTimeout(resetScroll, 250);
    }
  }, [location.key, location.pathname, location.state]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLandingPage
            onGetStarted={goComingSoon}
            onSignIn={goComingSoon}
            onViewPricing={goComingSoon}
            onViewAbout={goAbout}
            onViewLearn={goLearn}
            onViewUseCases={goUseCases}
            onOpenUseCase={openUseCase}
            onViewPrivacy={() => navigate("/privacy")}
            onViewTerms={() => navigate("/terms")}
          />
        }
      />
      <Route
        path="/use-case/:useCaseId"
        element={
          <PublicUseCasePage
            onGoHome={goHome}
            onViewUseCases={goUseCases}
            onOpenUseCase={openUseCase}
            onGetStarted={goComingSoon}
            onSignIn={goComingSoon}
            onViewPricing={goComingSoon}
            onViewAbout={goAbout}
            onViewLearn={goLearn}
            onViewPrivacy={() => navigate("/privacy")}
            onViewTerms={() => navigate("/terms")}
          />
        }
      />
      <Route
        path="/about"
        element={
          <PublicAboutPage
            isAuthenticated={false}
            onGoHome={goHome}
            onViewPricing={goComingSoon}
            onSignIn={goComingSoon}
            onGetStarted={goComingSoon}
            onSignOut={goComingSoon}
            onViewLearn={goLearn}
            onViewPrivacy={() => navigate("/privacy")}
            onViewTerms={() => navigate("/terms")}
            onViewUseCases={goUseCases}
          />
        }
      />
      <Route
        path="/learn"
        element={
          <LearnPage
            isAuthenticated={false}
            onGoHome={goHome}
            onViewPricing={goComingSoon}
            onSignIn={goComingSoon}
            onGetStarted={goComingSoon}
          />
        }
      />
      <Route
        path="/learn/:type/:slug"
        element={
          <LearnTermDetail
            isAuthenticated={false}
            onGoHome={goHome}
            onViewPricing={goComingSoon}
            onSignIn={goComingSoon}
            onGetStarted={goComingSoon}
          />
        }
      />
      <Route
        path="/privacy"
        element={
          <PublicPrivacyPage
            onGoHome={goHome}
            onGetStarted={goComingSoon}
            onViewPricing={goComingSoon}
          />
        }
      />
      <Route
        path="/terms"
        element={
          <PublicTermsPage
            onGoHome={goHome}
            onGetStarted={goComingSoon}
            onViewPricing={goComingSoon}
          />
        }
      />
      <Route
        path="/coming-soon"
        element={<ComingSoonPage onGoHome={goHome} />}
      />
      <Route
        path="/editor/:templateId"
        element={<PublicEditorPage />}
      />
      {/* Catch-all */}
      <Route
        path="*"
        element={
          <PublicLandingPage
            onGetStarted={goComingSoon}
            onSignIn={goComingSoon}
            onViewPricing={goComingSoon}
            onViewAbout={goAbout}
            onViewLearn={goLearn}
            onViewUseCases={goUseCases}
            onOpenUseCase={openUseCase}
            onViewPrivacy={() => navigate("/privacy")}
            onViewTerms={() => navigate("/terms")}
          />
        }
      />
    </Routes>
  );
}
