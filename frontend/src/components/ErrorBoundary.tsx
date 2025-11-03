"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Shield, AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-charcoal px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-500/10 p-6 border border-red-500/50">
                <AlertCircle className="size-12 text-red-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              אופס, משהו השתבש
            </h1>
            <p className="text-zinc-300 mb-6">
              אנחנו מתנצלים על אי הנוחות. אנא נסה לרענן את הדף או צור איתנו קשר.
            </p>
            {this.state.error && (
              <details className="mb-6 text-right">
                <summary className="text-sm text-zinc-400 cursor-pointer mb-2">
                  פרטי שגיאה
                </summary>
                <pre className="text-xs text-red-400 bg-black/50 p-4 rounded-lg overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="size-4" />
                נסה שוב
              </button>
              <a
                href="/"
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="size-4" />
                חזור לדף הבית
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

