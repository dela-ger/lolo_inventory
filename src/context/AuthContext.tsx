import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '../data/seedData';
import { userStorage, sessionStorage, initStorage, productStorage, categoryStorage, supplierStorage, saleStorage, stockMovementStorage, activityStorage, settingsStorage } from '../services/storage';
import { seedData } from '../data/seedData';
import { Role } from '../utils/permissions';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!initStorage.isInitialized()) {
      seedData.products.forEach(p => productStorage.create(p));
      seedData.users.forEach(u => userStorage.create(u));
      seedData.categories.forEach(c => categoryStorage.create(c));
      seedData.suppliers.forEach(s => supplierStorage.create(s));
      seedData.sales.forEach(s => saleStorage.create(s));
      seedData.stockMovements.forEach(sm => stockMovementStorage.create(sm));
      seedData.activities.forEach(a => activityStorage.create(a));
      settingsStorage.set(seedData.settings);
      initStorage.setInitialized();
    }
    const session = sessionStorage.get();
    if (session) setUser(session);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const found = userStorage.getByEmail(email);
    if (!found) return { success: false, message: 'Invalid email or password' };
    if (found.password !== password) return { success: false, message: 'Invalid email or password' };
    if (found.status === 'inactive') return { success: false, message: 'Account is disabled. Contact administrator.' };
    const updated = { ...found, lastLogin: new Date().toISOString() };
    userStorage.update(found.id, { lastLogin: new Date().toISOString() });
    sessionStorage.set(updated);
    setUser(updated);
    return { success: true, message: 'Login successful' };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

// Toast/Notification Context
interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
