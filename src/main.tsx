import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface BoundaryState {
  hasError: boolean;
}

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  BoundaryState
> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-[100dvh] w-full bg-[#060b1a] text-amber-100 flex flex-col items-center justify-center p-6 text-center gap-4">
          <h1 className="font-display text-xl font-black uppercase tracking-wider text-amber-300">
            La Senda del Tiempo
          </h1>
          <p className="text-xs text-slate-300 max-w-xs">
            Se produjo un problema al cargar la pantalla. Pulsa para recargar.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider"
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
