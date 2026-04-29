import { Routes, Route, useNavigate } from "react-router-dom";
import PublicLandingPage from "./components/PublicLandingPage";
import PublicUseCasePage from "./components/PublicUseCasePage";
import PublicAboutPage from "./components/PublicAboutPage";
import LearnPage from "./components/learn/LearnPage";
import LearnTermDetail from "./components/learn/LearnTermDetail";
import PublicPrivacyPage from "./components/PublicPrivacyPage";
import PublicTermsPage from "./components/PublicTermsPage";
import ComingSoonPage from "./components/ComingSoonPage";
import PublicEditorPage from "./components/PublicEditorPage";

export default function App() {
  const navigate = useNavigate();

  const goHome = () => navigate("/");
  const goComingSoon = () => navigate("/coming-soon");
  const goAbout = () => navigate("/about");
  const goLearn = () => navigate("/learn");
  const openUseCase = (id) => navigate(`/use-case/${id}`);

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
            onViewUseCases={() => openUseCase("ai-drafting")}
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
            onOpenUseCase={openUseCase}
            onViewPrivacy={() => navigate("/privacy")}
            onViewTerms={() => navigate("/terms")}
          />
        }
      />
    </Routes>
  );
}
