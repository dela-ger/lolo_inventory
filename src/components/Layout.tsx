import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccessPage, roleLabels } from '../utils/permissions';
import {
  LayoutDashboard, Package, ShoppingCart, Truck, FolderTree, BarChart3,
  Users, Activity, Settings, LogOut, Menu, X, ChevronDown, AlertTriangle
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
  { path: '/inventory', label: 'Inventory', icon: Package, page: 'inventory' },
  { path: '/sales', label: 'Sales', icon: ShoppingCart, page: 'sales' },
  { path: '/suppliers', label: 'Suppliers', icon: Truck, page: 'suppliers' },
  { path: '/categories', label: 'Categories', icon: FolderTree, page: 'categories' },
  { path: '/reports', label: 'Reports', icon: BarChart3, page: 'reports' },
  { path: '/users', label: 'Users', icon: Users, page: 'users' },
  { path: '/activity', label: 'Activity Log', icon: Activity, page: 'activity' },
  { path: '/settings', label: 'Settings', icon: Settings, page: 'settings' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const accessibleItems = navItems.filter(item => user && canAccessPage(user.role, item.page));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-gray-900">L</div>
            <div>
              <h1 className="font-bold text-sm">Lolo's Auto Store</h1>
              <p className="text-xs text-gray-400">Inventory System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {accessibleItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-amber-500/10 text-amber-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-700">
          <div className="px-3 py-2 mb-2 bg-amber-500/10 rounded-lg">
            <p className="text-xs text-amber-400 flex items-center gap-1">
              <AlertTriangle size={12} /> Demo Mode
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Data stored locally</p>
          </div>
          <div className="px-3 py-2">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">{user ? roleLabels[user.role] : ''}</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">Lolo's Auto Store</h2>
          </div>
          <div className="relative">
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
              <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-sm font-bold">
                {user?.name.charAt(0)}
              </div>
              <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
