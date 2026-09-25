import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const demoAccounts = [
    { email: 'admin@lolosauto.com', password: 'Admin123!', role: 'Super Admin' },
    { email: 'inventory@lolosauto.com', password: 'Inventory123!', role: 'Inventory Manager' },
    { email: 'sales@lolosauto.com', password: 'Sales123!', role: 'Sales Staff' },
    { email: 'staff@lolosauto.com', password: 'Staff123!', role: 'Staff' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-gray-900">L</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Lolo's Auto Store</h1>
          <p className="text-gray-400 mt-1">Inventory Management System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold py-2.5 rounded-lg transition-colors">
              Sign In
            </button>
          </form>

          <div className="mt-4 text-center">
            <button onClick={() => setShowDemo(!showDemo)} className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              {showDemo ? 'Hide' : 'Show'} Demo Credentials
            </button>
          </div>

          {showDemo && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
              <p className="text-xs font-medium text-gray-500 mb-2">DEMO ACCOUNTS</p>
              <div className="space-y-2">
                {demoAccounts.map(acc => (
                  <button
                    key={acc.email}
                    onClick={() => { setEmail(acc.email); setPassword(acc.password); }}
                    className="w-full text-left p-2 rounded hover:bg-white transition-colors"
                  >
                    <p className="text-xs font-medium text-gray-800">{acc.role}</p>
                    <p className="text-xs text-gray-500">{acc.email} / {acc.password}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Demo Mode — Data stored locally in this browser
        </p>
      </div>
    </div>
  );
}
