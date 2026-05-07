'use client'

import { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error('ErrorBoundary caught:', error, info)
    // Optional: send to Sentry if configured
    if (typeof window !== 'undefined' && 'Sentry' in window) {
      try {
        // @ts-expect-error optional global
        window.Sentry?.captureException?.(error)
      } catch { /* ignore */ }
    }
  }

  reset = () => this.setState({ error: null })

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="w-12 h-12 flex items-center justify-center bg-priority-urg/10 text-red-400 rounded-full mx-auto mb-4">
              <AlertTriangle size={24} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h1>
            <p className="text-[13px] text-text-secondary mb-6">
              SABAKU hit an error. Reload the page to recover. Your local strips are safe.
            </p>
            {process.env.NODE_ENV !== 'production' && (
              <pre className="text-[11px] text-left text-red-400 bg-bg-secondary p-3 rounded border border-red-500/20 mb-4 overflow-auto max-h-40">
                {this.state.error.message}
                {'\n'}
                {this.state.error.stack}
              </pre>
            )}
            <div className="flex gap-2 justify-center">
              <button
                onClick={this.reset}
                className="px-4 py-2 text-[13px] border border-border text-text-secondary hover:text-text-primary rounded transition-colors"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-[13px] font-medium bg-accent text-white rounded hover:bg-accent-hover transition-colors"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
