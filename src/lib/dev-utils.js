/**
 * Development utilities for debugging authentication and persona issues
 */

// Clear all authentication data and refresh
export const clearAuthAndRefresh = () => {
  if (typeof window !== 'undefined') {
    console.log('🔄 Clearing authentication data and refreshing...');
    localStorage.removeItem('authToken');
    window.location.reload();
  }
};

// Log current authentication state
export const logAuthState = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    console.log('🔍 Current auth state:', {
      hasToken: !!token,
      token: token ? token.substring(0, 15) + '...' : null,
      localStorage: localStorage,
      userAgent: navigator.userAgent
    });
  }
};

// Force refresh development token
export const refreshDevToken = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('🔄 Refreshing development token...');
    const newToken = `dev-token-68d0e521d89923fb4cf80d54`;
    localStorage.setItem('authToken', newToken);
    console.log('✅ New token set:', newToken.substring(0, 15) + '...');
  }
};

// Add to window object for easy debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.devUtils = {
    clearAuthAndRefresh,
    logAuthState,
    refreshDevToken
  };
}
