import { Component } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-deep flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={28} className="text-red-400" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-3">Algo deu errado</h1>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Ocorreu um erro inesperado. Você pode tentar recarregar a página ou voltar ao início.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary px-5 py-2.5 text-sm"
              >
                <RefreshCw size={16} />
                Recarregar
              </button>
              <a
                href="/"
                className="btn-secondary px-5 py-2.5 text-sm"
              >
                <Home size={16} />
                Início
              </a>
            </div>
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-400 transition-colors">
                  Detalhes do erro
                </summary>
                <pre className="mt-2 p-3 bg-black/30 border border-white/5 rounded-lg text-xs text-red-400 overflow-auto max-h-40">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
