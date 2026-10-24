import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { FiMail, FiLock, FiArrowRight, FiShield, FiArrowLeft, FiUser, FiPhone, FiCheckCircle } from 'react-icons/fi';

const Login = ({ initialMode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  // If URL has query ?mode=register or route is /register, start in register mode
  const searchParams = new URLSearchParams(location.search);
  const requestedMode = searchParams.get('mode') || (location.pathname === '/register' ? 'register' : initialMode);

  const [authMode, setAuthMode] = useState(requestedMode); // 'login' or 'register'
  
  // Login Form State
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register Form State
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: 'seller' // 'seller' or 'buyer'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Change input handler
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (authError) setAuthError('');
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (authError) setAuthError('');
  };

  // Sign In submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setAuthError('');

    const newErrors = {};
    if (!loginData.email) newErrors.email = 'Email is required';
    if (!loginData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(loginData.email, loginData.password);
      if (result.success) {
        // If coming from sell car or has redirect in query, honor it
        const redirect = searchParams.get('redirect');
        if (redirect) {
          navigate(redirect);
        } else if (result.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          // Direct regular users and sellers to their personal user dashboard
          navigate('/dashboard');
        }
      } else {
        setAuthError(result.message || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Unable to connect to login service.');
    } finally {
      setIsLoading(false);
    }
  };

  // Register submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setAuthError('');

    const newErrors = {};
    if (!registerData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!registerData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!registerData.email.trim()) newErrors.email = 'Email address is required';
    if (!registerData.password) newErrors.password = 'Password is required';
    if (registerData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await register({
        firstName: registerData.firstName.trim(),
        lastName: registerData.lastName.trim(),
        email: registerData.email.trim(),
        phone: registerData.phone.trim() || undefined,
        password: registerData.password,
        role: 'user'
      });

      if (result.success) {
        // Automatically route to car listing page!
        navigate('/admin/add-car');
      } else {
        setAuthError(result.message || 'Registration failed. Please try a different email.');
      }
    } catch (error) {
      console.error('Register error:', error);
      setAuthError(error.message || 'Registration failed. Please verify your details.');
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
            {authMode === 'register' ? 'Seller Registration' : 'Verified Access'}
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
            {authMode === 'register' ? 'Register & List Your Car' : 'Drive Your Dream'}
          </p>
          <p className="text-xs text-[#A8B7CC]">
            {authMode === 'register' 
              ? 'Create a free seller account to publish vehicles to thousands of buyers.' 
              : 'Explore. Compare. Drive. All in One Auto Platform.'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="p-1 rounded-2xl bg-[#0B1D33]/90 border border-white/10 flex">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setAuthError(''); setErrors({}); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              authMode === 'login'
                ? 'bg-gradient-to-r from-[#2684FF] to-[#1255CC] text-white shadow-[0_0_15px_rgba(38,132,255,0.4)]'
                : 'text-[#A8B7CC] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setAuthError(''); setErrors({}); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              authMode === 'register'
                ? 'bg-gradient-to-r from-[#2684FF] to-[#1255CC] text-white shadow-[0_0_15px_rgba(38,132,255,0.4)]'
                : 'text-[#A8B7CC] hover:text-white'
            }`}
          >
            Register / Sell Car
          </button>
        </div>

        {/* Glassmorphism Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B1D33]/85 backdrop-blur-xl border border-[rgba(107,203,255,0.22)] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(38,132,255,0.18)]">
          
          {authError && (
            <div className="p-3.5 mb-5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs text-center font-medium">
              {authError}
            </div>
          )}

          <AnimatePresence mode="wait">
            {authMode === 'login' ? (
              /* SIGN IN FORM */
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
                onSubmit={handleLoginSubmit}
              >
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
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className={`block w-full pl-10 pr-3.5 py-3 rounded-xl text-base sm:text-sm bg-[#061426] text-white placeholder-[#A8B7CC]/50 border ${
                        errors.email ? 'border-red-500' : 'border-[rgba(107,203,255,0.2)]'
                      } focus:outline-none focus:border-[#2684FF] focus:shadow-[0_0_15px_rgba(38,132,255,0.3)] transition-all`}
                      placeholder="name@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
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
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className={`block w-full pl-10 pr-3.5 py-3 rounded-xl text-base sm:text-sm bg-[#061426] text-white placeholder-[#A8B7CC]/50 border ${
                        errors.password ? 'border-red-500' : 'border-[rgba(107,203,255,0.2)]'
                      } focus:outline-none focus:border-[#2684FF] focus:shadow-[0_0_15px_rgba(38,132,255,0.3)] transition-all`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] hover:from-[#3B92FF] hover:to-[#1C64E3] shadow-[0_0_25px_rgba(38,132,255,0.5)] transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 mt-2"
                >
                  {isLoading ? <span>Authenticating...</span> : (
                    <>
                      <span>Sign In &amp; Continue</span>
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Switch to Register */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setAuthError(''); }}
                    className="text-xs text-[#A8B7CC] hover:text-[#6BCBFF] transition-colors"
                  >
                    Don't have an account? <span className="text-[#6BCBFF] font-semibold underline underline-offset-2">Register to list a car</span>
                  </button>
                </div>
              </motion.form>
            ) : (
              /* REGISTRATION FORM */
              <motion.form
                key="register-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3.5"
                onSubmit={handleRegisterSubmit}
              >
                {/* Account Type Banner */}
                <div className="p-3 rounded-xl bg-[#2684FF]/10 border border-[#2684FF]/30 flex items-center gap-2.5 text-xs text-[#6BCBFF]">
                  <FiCheckCircle className="w-4 h-4 shrink-0 text-[#6BCBFF]" />
                  <span>Free registration — list vehicles for sale or daily rental immediately!</span>
                </div>

                {/* First & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A8B7CC] mb-1">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6BCBFF]">
                        <FiUser className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        name="firstName"
                        value={registerData.firstName}
                        onChange={handleRegisterChange}
                        placeholder="John"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-base sm:text-xs bg-[#061426] text-white border ${
                          errors.firstName ? 'border-red-500' : 'border-[rgba(107,203,255,0.2)]'
                        } focus:outline-none focus:border-[#2684FF] transition-all`}
                      />
                    </div>
                    {errors.firstName && <p className="mt-1 text-[11px] text-red-400">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A8B7CC] mb-1">
                      Last Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={registerData.lastName}
                      onChange={handleRegisterChange}
                      placeholder="Doe"
                      className={`w-full px-3 py-2.5 rounded-xl text-base sm:text-xs bg-[#061426] text-white border ${
                        errors.lastName ? 'border-red-500' : 'border-[rgba(107,203,255,0.2)]'
                      } focus:outline-none focus:border-[#2684FF] transition-all`}
                    />
                    {errors.lastName && <p className="mt-1 text-[11px] text-red-400">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A8B7CC] mb-1">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6BCBFF]">
                      <FiMail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      placeholder="your.email@example.com"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-base sm:text-xs bg-[#061426] text-white border ${
                        errors.email ? 'border-red-500' : 'border-[rgba(107,203,255,0.2)]'
                      } focus:outline-none focus:border-[#2684FF] transition-all`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-[11px] text-red-400">{errors.email}</p>}
                </div>

                {/* Phone Number (Optional) */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A8B7CC] mb-1">
                    Phone Number <span className="text-[#6B7D96] normal-case">(optional for buyer inquiries)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6BCBFF]">
                      <FiPhone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={registerData.phone}
                      onChange={handleRegisterChange}
                      placeholder="+254 700 000 000"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-base sm:text-xs bg-[#061426] text-white border border-[rgba(107,203,255,0.2)] focus:outline-none focus:border-[#2684FF] transition-all"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A8B7CC] mb-1">
                      Password <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      placeholder="Min 6 characters"
                      className={`w-full px-3 py-2.5 rounded-xl text-base sm:text-xs bg-[#061426] text-white border ${
                        errors.password ? 'border-red-500' : 'border-[rgba(107,203,255,0.2)]'
                      } focus:outline-none focus:border-[#2684FF] transition-all`}
                    />
                    {errors.password && <p className="mt-1 text-[11px] text-red-400">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A8B7CC] mb-1">
                      Confirm <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="Repeat password"
                      className={`w-full px-3 py-2.5 rounded-xl text-base sm:text-xs bg-[#061426] text-white border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-[rgba(107,203,255,0.2)]'
                      } focus:outline-none focus:border-[#2684FF] transition-all`}
                    />
                    {errors.confirmPassword && <p className="mt-1 text-[11px] text-red-400">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#2684FF] to-[#1255CC] hover:from-[#3B92FF] hover:to-[#1C64E3] shadow-[0_0_25px_rgba(38,132,255,0.5)] transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 mt-3"
                >
                  {isLoading ? <span>Creating Account...</span> : (
                    <>
                      <span>Register &amp; List Your Car</span>
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Switch to Sign In */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    className="text-xs text-[#A8B7CC] hover:text-[#6BCBFF] transition-colors"
                  >
                    Already registered? <span className="text-[#6BCBFF] font-semibold underline underline-offset-2">Sign in to your account</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
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