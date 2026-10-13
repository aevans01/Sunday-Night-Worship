import { Component } from "react";
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    console.error(
      "UI_RENDER_ERROR: The page could not render. Reload or contact the church office.",
    );
  }
  render() {
    if (this.state.failed)
      return (
        <main className="portal-page" role="alert">
          <h1>We couldn’t load this page.</h1>
          <p>
            Please reload and try again. If the issue continues, contact the
            church office at (479) 646-7266.
          </p>
          <button
            className="portal-btn"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
          <p>
            <a href="/">Return home</a>
          </p>
        </main>
      );
    return this.props.children;
  }
}
