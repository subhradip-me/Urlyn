'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiClient from '@/lib/api-client';

// Helper function to generate JWT token for development
const generateDevToken = async (user) => {
  try {
    // Create JWT payload
    const payload = {
      id: user._id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };
    
    // For client-side, we'll create a mock JWT structure
    // In production, this would be generated server-side
    const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
    const payloadEncoded = btoa(JSON.stringify(payload));
    const signature = btoa('dev-signature'); // Mock signature for development
    
    return `${header}.${payloadEncoded}.${signature}`;
  } catch (error) {
    console.error('Error generating dev token:', error);
    return 'dev-token-fallback';
  }
};

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Auth context
const AuthContext = createContext(undefined);

// Auth actions
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
  SWITCH_PERSONA: 'SWITCH_PERSONA',
};

// Auth reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    
    case AUTH_ACTIONS.SWITCH_PERSONA:
      return {
        ...state,
        user: {
          ...state.user,
          currentPersona: action.payload.currentPersona,
          currentProfile: action.payload.currentProfile,
        },
      };
    
    default:
      return state;
  }
}

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  console.log('AuthProvider state:', { loading: state.loading, isAuthenticated: state.isAuthenticated, hasUser: !!state.user });

  // Initialize auth on mount with faster timeout
  useEffect(() => {
    const initAndTimeout = async () => {
      // Set a faster timeout for initialization (2 seconds instead of 10)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Auth initialization timeout')), 2000);
      });
      
      try {
        await Promise.race([initializeAuth(), timeoutPromise]);
      } catch (error) {
        console.error('Auth initialization failed or timed out:', error);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };
    
    initAndTimeout();
  }, []);

  const initializeAuth = async () => {
    try {
      // Development mode - automatically authenticate with mock user
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode - using mock user');
        const mockUser = {
          _id: '68d0e521d89923fb4cf80d54',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          personas: ['student', 'professional', 'creator', 'entrepreneur', 'researcher'], // All personas available
          currentPersona: 'student',
          preferences: {
            notifications: { email: true, push: true },
            privacy: { profileVisibility: 'public' },
            theme: 'system'
          }
        };
        
        // Generate a proper JWT token for development
        const mockToken = await generateDevToken(mockUser);
        
        // Set token in API client and localStorage for consistency
        localStorage.setItem('authToken', mockToken);
        apiClient.setToken(mockToken);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: mockUser, token: mockToken },
        });
        return;
      }
      
      const token = localStorage.getItem('authToken');
      console.log('Auth initialization - token exists:', !!token);
      
      if (token) {
        apiClient.setToken(token);
        
        // Add timeout to user fetch as well
        const userPromise = apiClient.getCurrentUser();
        const userTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('User fetch timeout')), 1500)
        );
        
        try {
          const user = await Promise.race([userPromise, userTimeout]);
          console.log('Auth initialization - user:', user);
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user, token },
          });
        } catch (userError) {
          console.error('Failed to get current user:', userError);
          // If token is invalid or request times out, remove it and set loading to false
          localStorage.removeItem('authToken');
          apiClient.setToken(null);
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } else {
        console.log('No token found, setting loading to false');
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      localStorage.removeItem('authToken');
      apiClient.setToken(null);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const response = await apiClient.login(email, password);
      const { user, token } = response;
      
      localStorage.setItem('authToken', token);
      apiClient.setToken(token);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token },
      });
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (firstName, lastName, email, password, persona = 'student') => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const response = await apiClient.register(firstName, lastName, email, password, persona);
      const { user, token } = response;
      
      localStorage.setItem('authToken', token);
      apiClient.setToken(token);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token },
      });
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    apiClient.setToken(null);
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const addPersona = async (persona) => {
    try {
      const response = await apiClient.addPersona(persona);
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: {
          personas: response.personas,
          currentPersona: response.currentPersona,
          currentProfile: response.currentProfile,
        },
      });
      
      return { success: true, message: response.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add persona';
      return { success: false, error: errorMessage };
    }
  };

  const switchPersona = async (persona) => {
    try {
      const response = await apiClient.switchPersona(persona);
      
      dispatch({
        type: AUTH_ACTIONS.SWITCH_PERSONA,
        payload: {
          currentPersona: response.currentPersona,
          currentProfile: response.currentProfile,
        },
      });
      
      return { success: true, message: response.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to switch persona';
      return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiClient.updateProfile(profileData);
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: response,
      });
      
      return { success: true, user: response };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    addPersona,
    switchPersona,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
