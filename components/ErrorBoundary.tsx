import React, { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-red-500 text-2xl font-bold animate-pulse tracking-wider">
            Sorry, something went wrong. Please try refreshing the page.
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

