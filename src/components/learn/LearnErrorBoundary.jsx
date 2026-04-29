import { Component } from "react";
import "./Learn.css";

/**
 * LearnErrorBoundary — catches rendering errors inside the Learn pages and
 * shows a friendly fallback instead of crashing the whole app.
 *
 * Usage:
 *   <LearnErrorBoundary>
 *     <LearnPage ... />
 *   </LearnErrorBoundary>
 */
export default class LearnErrorBoundary extends Component {
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Log to console so developers can diagnose the root cause.
    // Do not surface the raw error or stack trace to the user.
    console.error("[LearnErrorBoundary] Rendering error in Learn page:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="learn-error-boundary">
          <p className="learn-error-boundary__message">
            Something went wrong loading this page. Please try again.
          </p>
          <button
            type="button"
            className="learn-error-boundary__retry"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
