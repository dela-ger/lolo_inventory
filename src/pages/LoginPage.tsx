import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import logoImage from '../assets/logo.png';

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
    {
      email: 'admin@lolosauto.com',
      password: 'Admin123!',
      role: 'Super Admin',
    },
    {
      email: 'inventory@lolosauto.com',
      password: 'Inventory123!',
      role: 'Inventory Manager',
    },
    {
      email: 'sales@lolosauto.com',
      password: 'Sales123!',
      role: 'Sales Staff',
    },
    {
      email: 'staff@lolosauto.com',
      password: 'Staff123!',
      role: 'Staff',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f3] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-[420px]">

        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-9">
          <img
            src={logoImage}
            alt="Lolo's Auto Store"
            className="w-14 h-14 object-contain mb-5"
          />

          <h1 className="text-[26px] font-semibold tracking-tight text-gray-950">
            Lolo's Auto Store
          </h1>

          <p className="text-sm text-gray-500 mt-1.5">
            Inventory Management
          </p>
        </div>

        {/* Login */}
        <div className="bg-white border border-gray-200 rounded-2xl px-6 py-7 sm:px-8 sm:py-8">

          <div className="mb-7">
            <h2 className="text-xl font-semibold tracking-tight text-gray-950">
              Welcome back
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Sign in to continue to your dashboard.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="
                  w-full
                  h-11
                  px-3.5
                  bg-white
                  border border-gray-300
                  rounded-lg
                  text-sm text-gray-900
                  placeholder:text-gray-400
                  outline-none
                  transition
                  focus:border-gray-900
                  focus:ring-1
                  focus:ring-gray-900
                "
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-800"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="
                    w-full
                    h-11
                    px-3.5
                    pr-11
                    bg-white
                    border border-gray-300
                    rounded-lg
                    text-sm text-gray-900
                    placeholder:text-gray-400
                    outline-none
                    transition
                    focus:border-gray-900
                    focus:ring-1
                    focus:ring-gray-900
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-gray-700
                    transition-colors
                  "
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="
                group
                w-full
                h-11
                flex
                items-center
                justify-center
                gap-2
                bg-gray-950
                hover:bg-gray-800
                text-white
                text-sm
                font-medium
                rounded-lg
                transition-colors
              "
            >
              Sign in

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowDemo(!showDemo)}
              className="
                w-full
                text-center
                text-xs
                font-medium
                text-gray-500
                hover:text-gray-900
                transition-colors
              "
            >
              {showDemo ? 'Hide demo accounts' : 'View demo accounts'}
            </button>

            {showDemo && (
              <div className="mt-4 space-y-1">
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                    }}
                    className="
                      w-full
                      text-left
                      px-3
                      py-2.5
                      rounded-lg
                      hover:bg-gray-50
                      transition-colors
                    "
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-gray-800">
                        {account.role}
                      </span>

                      <span className="text-[11px] text-gray-400">
                        Use account
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {account.email}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-[11px] text-gray-400">
            Demo Mode · Data stored locally in this browser
          </p>
        </div>
      </div>
    </div>
  );
}

