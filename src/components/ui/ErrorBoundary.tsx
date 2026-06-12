// src/components/ui/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";
import { colors } from "../../design/colors";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    this.setState({ errorInfo });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            background: colors.card,
            borderRadius: "16px",
            border: `1px solid ${colors.border}`,
            margin: "20px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
          <h2
            style={{
              color: colors.text.primary,
              marginBottom: "12px",
              fontSize: "20px",
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              color: colors.text.secondary,
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
            <button
              onClick={this.handleReset}
              style={{
                padding: "8px 20px",
                background: colors.cardLight,
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                color: colors.text.primary,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <button
              onClick={this.handleReload}
              style={{
                padding: "8px 20px",
                background: colors.status.success,
                border: "none",
                borderRadius: "8px",
                color: "#1a1a2e",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Reload Page
            </button>
          </div>
          {this.state.errorInfo && process.env.NODE_ENV === "development" && (
            <details
              style={{
                marginTop: "20px",
                padding: "12px",
                background: colors.cardLight,
                borderRadius: "8px",
                textAlign: "left",
                fontSize: "12px",
                overflow: "auto",
              }}
            >
              <summary
                style={{ color: colors.text.secondary, cursor: "pointer" }}
              >
                Error Details
              </summary>
              <pre style={{ color: colors.status.danger, marginTop: "8px" }}>
                {this.state.error?.stack}
                {"\n\n"}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
