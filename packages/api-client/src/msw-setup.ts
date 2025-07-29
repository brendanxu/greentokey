import { setupWorker } from 'msw/browser';
import { setupServer } from 'msw/node';
import { handlers } from './msw-handlers';

// Browser setup
export const worker = setupWorker(...handlers);

// Node.js setup (for testing)
export const server = setupServer(...handlers);

// Browser initialization function
export const startMocking = async (): Promise<void> => {
  if (typeof window !== 'undefined') {
    // Browser environment
    await worker.start({
      onUnhandledRequest: 'warn',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    console.log('🎭 MSW: Mock service worker started');
  }
};

// Stop mocking
export const stopMocking = (): void => {
  if (typeof window !== 'undefined') {
    worker.stop();
    console.log('🎭 MSW: Mock service worker stopped');
  }
};

// Development helper to toggle mocking
export const toggleMocking = async (): Promise<void> => {
  if (typeof window !== 'undefined') {
    const isMocking = localStorage.getItem('greenlink_enable_mocking') === 'true';
    
    if (isMocking) {
      stopMocking();
      localStorage.setItem('greenlink_enable_mocking', 'false');
      console.log('🎭 MSW: Mocking disabled');
    } else {
      await startMocking();
      localStorage.setItem('greenlink_enable_mocking', 'true');
      console.log('🎭 MSW: Mocking enabled');
    }
    
    // Reload page to apply changes
    window.location.reload();
  }
};

// Check if mocking should be enabled
export const shouldEnableMocking = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Enable in development or when explicitly enabled
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isExplicitlyEnabled = localStorage.getItem('greenlink_enable_mocking') === 'true';
  const isDisabled = localStorage.getItem('greenlink_enable_mocking') === 'false';
  
  // Default to enabled in development unless explicitly disabled
  if (isDevelopment && !isDisabled) return true;
  
  // Explicitly enabled in any environment
  if (isExplicitlyEnabled) return true;
  
  return false;
};

// Initialize mocking based on environment and settings
export const initializeMocking = async (): Promise<boolean> => {
  if (shouldEnableMocking()) {
    await startMocking();
    return true;
  }
  return false;
};

// Development utilities for browser console
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Add global functions for development
  (window as any).greenlinkAPI = {
    enableMocking: () => toggleMocking(),
    disableMocking: () => toggleMocking(),
    isMockingEnabled: shouldEnableMocking,
    handlers,
  };
  
  console.log('🎭 MSW: Development utilities available at window.greenlinkAPI');
}