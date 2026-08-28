import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-amber-500/40 space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl mx-auto flex items-center justify-center font-bold text-2xl">
              ⚠️
            </div>
            <h2 className="text-2xl font-black text-white">Restaurar Sessão Rota Nova</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Foi detectado um estado de sessão antigo ou incompatível. Clique no botão abaixo para restaurar o sistema.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl shadow-lg text-sm transition-all"
            >
              Restaurar Sessão e Ir para o Início
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
