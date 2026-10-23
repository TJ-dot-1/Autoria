import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { FiMail, FiLock, FiArrowRight, FiShield, FiArrowLeft, FiCheck } from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (loginError) setLoginError('');
  };

  const handleFillCredentials = (email, password) => {
    setFormData({ email, password });
    setErrors({});
    if (loginError) setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setLoginError('');

    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        if (result.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setLoginError(result.message || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Unable to connect to login service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#061426] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient neon glows (AutoHub Panel 1) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#2684FF]/25 via-[#6BCBFF]/20 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#2684FF]/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        
        {/* Top Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A8B7CC] hover:text-[#6BCBFF] transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Return to Marketplace</span>
          </Link>
          <span className="text-[10px] uppercase font-bold text-[#6BCBFF] px-2.5 py-0.5 rounded-full bg-[#2684FF]/15 border border-[#2684FF]/30">
            Secure Portal
          </span>
        </div>

        {/* Branding Header (AutoHub Panel 1 Style) */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2684FF]/30 to-[#6BCBFF]/10 border border-[#2684FF]/50 p-3.5 flex items-center justify-center shadow-[0_0_25px_rgba(38,132,255,0.4)]">
            <img src="/auto.png" alt="Autoria" className="w-full h-full object-contain filter drop-shadow" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Auto<span className="text-[#6BCBFF]">ria</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#6BCBFF] font-bold">
            Drive Your Dream
          </p>
          <p className="text-xs text-[#A8B7CC]">
            Explore. Compare. Drive. All in One Auto Platform.
          </p>
        </div>

        {/* Glassmorphism Login Card */}
        <div className="p-8 rounded-3xl bg-[#0B1D33]/85 backdrop-blur-xl border border-[rgba(107,203,255,0.22)] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(38,132,255,0.18)]">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs text-center font-medium">
                {loginError}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#A8B7CC] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6BCBFF]">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3.5 py-3 rounded-xl text-xs sm:text-sm bg-[#061426] text-white placeholder-[#A8B7CC]/50 border ${
                    errors.email ? 'border-red-500' : 'border-[rgba(107,203,255,0.2)]'
                  } focus:outline-none focus:border-[#2684FF] focus:shadow-[0_0_15px_rgba(38,132,255,0.3)] transition-all`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-[#A8B7CC] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6BCBFF]">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3.5 py-3 rounded-xl text-xs sm:text-sm bg-[#061426] text-white placeholder-[#A8B7CC]/50 border ${
                    errors.password ? 'border-red-500' : 'border-[rgba(107,203,255,0.2)]'
                  } focus:outline-none focus:border-[#2684FF] focus:shadow-[0_0_15px_rgba(38,132,255,0.3)] transition-all`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Submit Button (AutoHub Panel 1 Glowing Pill Button) */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-sm font-bold text-white transition-all duration-300 ${
                isLoading
                  ? 'bg-white/20 cursor-wait'
                  : 'bg-gradient-to-r from-[#2684FF] to-[#1255CC] hover:from-[#3B92FF] hover:to-[#1C64E3] shadow-[0_0_25px_rgba(38,132,255,0.5)] hover:shadow-[0_0_35px_rgba(38,132,255,0.7)] transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Get Started</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Demo Credentials for Convenience */}
            <div className="pt-4 border-t border-[rgba(107,203,255,0.12)]">
              <span className="text-[10px] uppercase font-bold text-[#A8B7CC] block text-center mb-2">
                Quick Demo Sign-In
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFillCredentials('admin@autoria.com', 'admin123')}
                  className="px-2.5 py-2 rounded-xl text-[11px] font-semibold text-[#6BCBFF] bg-[#061426] border border-[#2684FF]/30 hover:border-[#6BCBFF] hover:bg-[#2684FF]/10 text-center transition-all truncate"
                >
                  Admin Account
                </button>
                <button
                  type="button"
                  onClick={() => handleFillCredentials('john.doe@example.com', 'Password123')}
                  className="px-2.5 py-2 rounded-xl text-[11px] font-semibold text-[#A8B7CC] bg-[#061426] border border-[rgba(107,203,255,0.15)] hover:border-[#6BCBFF] hover:text-white hover:bg-[#2684FF]/10 text-center transition-all truncate"
                >
                  User Account
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* Security assurance */}
        <div className="text-center text-xs text-[#6B7D96] flex items-center justify-center gap-1.5">
          <FiShield className="w-3.5 h-3.5 text-[#6BCBFF]" />
          <span>Encrypted with 256-bit SSL certificate</span>
        </div>

      </div>
    </div>
  );
};

export default Login;