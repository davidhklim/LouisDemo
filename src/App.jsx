import { Routes, Route, useNavigate } from "react-router-dom";
import PublicLandingPage from "./components/PublicLandingPage";
import PublicUseCasePage from "./components/PublicUseCasePage";
import PublicPrivacyPage from "./components/PublicPrivacyPage";
import PublicTermsPage from "./components/PublicTermsPage";
import ComingSoonPage from "./components/ComingSoonPage";

export default function App() {
  const navigate = useNavigate();

  const goHome = () => navigate("/");
  const goComingSoon = () => navigate("/coming-soon");
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
            onViewAbout={goComingSoon}
            onViewLearn={goComingSoon}
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
            onGetStarted={goComingSoon}
            onSignIn={goComingSoon}
            onViewPricing={goComingSoon}
            onViewAbout={goComingSoon}
            onViewLearn={goComingSoon}
            onViewPrivacy={() => navigate("/privacy")}
            onViewTerms={() => navigate("/terms")}
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
      {/* Catch-all */}
      <Route
        path="*"
        element={
          <PublicLandingPage
            onGetStarted={goComingSoon}
            onSignIn={goComingSoon}
            onViewPricing={goComingSoon}
            onViewAbout={goComingSoon}
            onViewLearn={goComingSoon}
            onOpenUseCase={openUseCase}
            onViewPrivacy={() => navigate("/privacy")}
            onViewTerms={() => navigate("/terms")}
          />
        }
      />
    </Routes>
  );
}
