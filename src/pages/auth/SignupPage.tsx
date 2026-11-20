import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

// ─── Compass Icon ─────────────────────────────────────────────────────────────
const CompassIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#E8541A" />
    <polygon points="12,4 14,12 12,20 10,12" fill="white" opacity="0.9" />
    <polygon points="4,12 12,10 20,12 12,14" fill="white" opacity="0.6" />
    <circle cx="12" cy="12" r="2" fill="white" />
  </svg>
);

// ─── Eye Icons ────────────────────────────────────────────────────────────────
const EyeIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ─── SignupPage ───────────────────────────────────────────────────────────────
const SignupPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signup(fullName, email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/onboarding');
    } else {
      setError(result.error || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left Panel (dark teal) ── */}
      <div className="lg:w-1/2 bg-[#1A2F2F] flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden">
        <div className="relative">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:mb-16">
            <div className="w-9 h-9 rounded-xl bg-[#E8541A] flex items-center justify-center">
              <CompassIcon size={20} />
            </div>
            <div>
              <div className="font-bold text-white text-base leading-tight">TechPilot</div>
              <div className="text-[10px] text-white/40">by Rocky</div>
            </div>
          </div>

          {/* Label */}
          <div className="text-[#4FD1C5] font-mono text-xs font-semibold uppercase tracking-widest mb-4">
            YOUR BUILDING COMPASS
          </div>

          {/* Headline */}
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4 tracking-tight">
            <span className="text-white">Clarity for</span>
            <br />
            <span className="text-[#E8541A]">every build.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            TechPilot helps you choose how to build, what to use and what to do next.
          </p>
        </div>

        {/* Bottom tagline */}
        <div className="hidden lg:flex items-center gap-2 text-white/40 text-xs font-mono mt-12">
          <span>✦</span>
          <span>A better starting point for ambitious ideas</span>
        </div>
      </div>

      {/* ── Right Panel (cream form) ── */}
      <div className="flex-1 bg-[#F5F3EE] flex flex-col justify-between p-6 lg:p-12">
        <div className="flex justify-end">
          <p className="text-xs text-[#1A2F2F]/60">
            Already have an account?{' '}
            <Link to="/login" className="text-[#E8541A] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <div className="w-full max-w-sm mx-auto my-auto py-8">
          {/* Form header */}
          <div className="mb-8">
            <div className="text-xs font-mono font-semibold tracking-widest text-[#1A2F2F]/40 uppercase mb-2">
              GET STARTED
            </div>
            <h2 className="text-4xl font-bold text-[#1A2F2F] mb-1.5 tracking-tight">Create your account</h2>
            <p className="text-[#1A2F2F]/60 text-sm">Your next great build starts with a clearer first step.</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#1A2F2F]/70 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Rocky Sharma"
                required
                className="w-full bg-white border border-[#1A2F2F]/15 rounded-xl px-4 py-3 text-sm text-[#1A2F2F] placeholder-[#1A2F2F]/30 focus:outline-none focus:ring-2 focus:ring-[#1A2F2F]/20 shadow-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#1A2F2F]/70 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-white border border-[#1A2F2F]/15 rounded-xl px-4 py-3 text-sm text-[#1A2F2F] placeholder-[#1A2F2F]/30 focus:outline-none focus:ring-2 focus:ring-[#1A2F2F]/20 shadow-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#1A2F2F]/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full bg-white border border-[#1A2F2F]/15 rounded-xl px-4 py-3 pr-11 text-sm text-[#1A2F2F] placeholder-[#1A2F2F]/30 focus:outline-none focus:ring-2 focus:ring-[#1A2F2F]/20 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A2F2F]/40 hover:text-[#1A2F2F]/70 transition-colors"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1A2F2F] text-white font-semibold py-3.5 rounded-xl hover:bg-[#243d3d] disabled:opacity-60 transition-all flex items-center justify-center gap-2 mt-4 shadow-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>Create account →</>
              )}
            </button>
          </form>
        </div>

        <div />
      </div>
    </div>
  );
};

export default SignupPage;
