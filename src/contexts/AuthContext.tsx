import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'employee';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: 'admin' | 'hr' | 'employee') => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('hrms_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string) => {
    // This is a mock login with static data
    // In a real app, this would call an API
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation
    if (email === 'admin@example.com' && password === 'password') {
      const user = {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin' as const
      };
      setUser(user);
      localStorage.setItem('hrms_user', JSON.stringify(user));
    } else if (email === 'hr@example.com' && password === 'password') {
      const user = {
        id: '2',
        name: 'HR Manager',
        email: 'hr@example.com',
        role: 'hr' as const
      };
      setUser(user);
      localStorage.setItem('hrms_user', JSON.stringify(user));
    } else if (email === 'employee@example.com' && password === 'password') {
      const user = {
        id: '3',
        name: 'John Employee',
        email: 'employee@example.com',
        role: 'employee' as const
      };
      setUser(user);
      localStorage.setItem('hrms_user', JSON.stringify(user));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (name: string, email: string, password: string, role: 'admin' | 'hr' | 'employee') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would call an API to register the user
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role
    };
    
    setUser(newUser);
    localStorage.setItem('hrms_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrms_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};