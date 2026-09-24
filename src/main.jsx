import React, { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SpeedInsights } from '@vercel/speed-insights/react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Atlas ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#090a0d',
          color: '#f8fafc',
          padding: '40px 20px',
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '550px',
            backgroundColor: '#13141b',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#f87171', marginBottom: '10px' }}>
              Aviso de Ejecución
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
              Se detectó un conflicto en los datos almacenados temporalmente en tu navegador.
            </p>
            <div style={{
              backgroundColor: '#090a0d',
              padding: '12px',
              borderRadius: '10px',
              color: '#fca5a5',
              fontSize: '11px',
              fontFamily: 'monospace',
              textAlign: 'left',
              marginBottom: '20px',
              overflowX: 'auto'
            }}>
              {this.state.error?.message || 'Error desconocido'}
            </div>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#ffffff',
                color: '#090a0d',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Limpiar Caché y Reiniciar Atlas
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
      <SpeedInsights />
    </ErrorBoundary>
  </StrictMode>,
)
