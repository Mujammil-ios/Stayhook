import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (name: string, email: string, password: string, role?: 'admin' | 'manager' | 'staff') => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: () => {},
  forgotPassword: async () => ({ success: false }),
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved auth on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    // Simulate API call
    setIsLoading(true);
    
    try {
      // Simple validation
      if (!email || !password) {
        return { success: false, message: 'Email and password are required' };
      }
      
      if (password.length < 6) {
        return { success: false, message: 'Invalid password' };
      }
      
      // Mock successful login - in a real app, this would verify credentials with a server
      // Using a timeout to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user - in a real app this would come from your backend
      const newUser: User = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0], // Extract name from email
        email: email,
        role: 'admin',
      };
      
      // Save to state and localStorage
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function
  const signup = async (name: string, email: string, password: string, role: 'admin' | 'manager' | 'staff' = 'admin') => {
    // Simulate API call
    setIsLoading(true);
    
    try {
      // Simple validation
      if (!name || !email || !password) {
        return { success: false, message: 'All fields are required' };
      }
      
      if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }
      
      // Mock API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user - in a real app this would be done on your backend
      const newUser: User = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
      };
      
      // Save to state and localStorage
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'An error occurred during signup' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Mock forgot password function
  const forgotPassword = async (email: string) => {
    // Simulate API call
    setIsLoading(true);
    
    try {
      // Simple validation
      if (!email) {
        return { success: false, message: 'Email is required' };
      }
      
      // Mock API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { 
        success: true, 
        message: 'If an account exists with this email, we have sent a password reset link' 
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: 'An error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  // Create the context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};