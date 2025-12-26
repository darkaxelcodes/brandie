import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { PreferencesProvider } from './contexts/PreferencesContext.tsx';
import { ToastProvider } from './contexts/ToastContext.tsx';
import { TourProvider } from './contexts/TourContext.tsx';
import { analyticsService } from './lib/analytics';

analyticsService.init();

// Add error handling for better error reporting
const handleError = (event: ErrorEvent) => {
  console.error('Unhandled error:', event.error);
  // You could also send to an error tracking service here
};

window.addEventListener('error', handleError);

// Add performance monitoring
if ('performance' in window && 'measure' in performance) {
  performance.mark('app-start');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <PreferencesProvider>
          <TourProvider>
            <App />
          </TourProvider>
        </PreferencesProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>
);

// Measure initial load performance
if ('performance' in window && 'measure' in performance) {
  window.addEventListener('load', () => {
    performance.mark('app-loaded');
    performance.measure('app-startup', 'app-start', 'app-loaded');
    console.log('App startup time:', performance.getEntriesByName('app-startup')[0].duration, 'ms');
  });
}