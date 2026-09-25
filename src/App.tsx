import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ToastProvider, useAuth, useToast } from './context/AuthContext';
import { canAccessPage } from './utils/permissions';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import { ProductFormPage, ProductDetailPage } from './pages/ProductPages';
import { SalesPage, NewSalePage, SaleDetailPage } from './pages/SalesPages';
import { SuppliersPage, CategoriesPage, ReportsPage, UsersPage, ActivityPage, SettingsPage } from './pages/ManagementPages';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

function ProtectedRoute({ children, page }: { children: React.ReactNode; page: string }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user && !canAccessPage(user.role, page)) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={28} className="text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Access Restricted</h2>
        <p className="text-sm text-gray-500 mt-1 text-center max-w-md">You don't have permission to access this page. Contact your administrator if you believe this is an error.</p>
      </div>
    );
  }
  return <>{children}</>;
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();
  const icons = { success: CheckCircle, error: AlertCircle, warning: AlertTriangle, info: Info };
  const colors = { success: 'bg-green-50 border-green-200 text-green-800', error: 'bg-red-50 border-red-200 text-red-800', warning: 'bg-amber-50 border-amber-200 text-amber-800', info: 'bg-blue-50 border-blue-200 text-blue-800' };

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm">
      {toasts.map(toast => {
        const Icon = icons[toast.type];
        return (
          <div key={toast.id} className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg ${colors[toast.type]} animate-slide-in`}>
            <Icon size={16} />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="p-0.5 hover:opacity-70"><X size={14} /></button>
          </div>
        );
      })}
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute page="dashboard"><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<ProtectedRoute page="dashboard"><DashboardPage /></ProtectedRoute>} />
        <Route path="inventory" element={<ProtectedRoute page="inventory"><InventoryPage /></ProtectedRoute>} />
        <Route path="inventory/new" element={<ProtectedRoute page="inventory-new"><ProductFormPage /></ProtectedRoute>} />
        <Route path="inventory/:id" element={<ProtectedRoute page="inventory"><ProductDetailPage /></ProtectedRoute>} />
        <Route path="inventory/:id/edit" element={<ProtectedRoute page="inventory-edit"><ProductFormPage /></ProtectedRoute>} />
        <Route path="sales" element={<ProtectedRoute page="sales"><SalesPage /></ProtectedRoute>} />
        <Route path="sales/new" element={<ProtectedRoute page="sales-new"><NewSalePage /></ProtectedRoute>} />
        <Route path="sales/:id" element={<ProtectedRoute page="sales"><SaleDetailPage /></ProtectedRoute>} />
        <Route path="suppliers" element={<ProtectedRoute page="suppliers"><SuppliersPage /></ProtectedRoute>} />
        <Route path="categories" element={<ProtectedRoute page="categories"><CategoriesPage /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute page="reports"><ReportsPage /></ProtectedRoute>} />
        <Route path="users" element={<ProtectedRoute page="users"><UsersPage /></ProtectedRoute>} />
        <Route path="activity" element={<ProtectedRoute page="activity"><ActivityPage /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute page="settings"><SettingsPage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
