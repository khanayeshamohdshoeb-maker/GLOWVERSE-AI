import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Eye, EyeOff, Sparkles, CheckCircle2, Lock } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, loginUser, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (mode === 'forgot') {
        setForgotSubmitted(true);
        setLoading(false);
        showToast('Password reset instructions sent to your email', 'info');
        return;
      }

      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const bodyPayload = mode === 'login'
        ? { email, password }
        : { email, password, displayName };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify your details.');
      }

      loginUser(data.user.email, data.user.displayName);
      setAuthModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginUser('guest@glowverse.ai', 'Aria Vance (Guest Explorer)');
    setAuthModalOpen(false);
    showToast('Logged in as Guest Luxury Explorer', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] border border-[#E8DCCB] rounded-2xl max-w-md w-full p-8 shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 text-[#302B27]/60 hover:text-[#302B27] p-1.5 rounded-full hover:bg-[#F8F4ED] transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="font-serif text-2xl text-[#302B27]">GLOWVERSE AI</div>
          <p className="text-xs text-[#302B27]/60 font-sans tracking-wide">
            {mode === 'login' && 'Sign in to access your personal beauty profile and ritual history'}
            {mode === 'register' && 'Create your account to save skin analyses and customized routines'}
            {mode === 'forgot' && 'Reset your password securely'}
          </p>
        </div>

        {/* Tab switch between Login and Register */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-[#F8F4ED] rounded-lg border border-[#E8DCCB] text-xs font-semibold">
            <button
              onClick={() => { setMode('login'); setErrorMessage(null); }}
              className={`py-2 rounded transition-colors ${mode === 'login' ? 'bg-[#FFFFFF] text-[#302B27] shadow-xs' : 'text-[#302B27]/60 hover:text-[#302B27]'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMessage(null); }}
              className={`py-2 rounded transition-colors ${mode === 'register' ? 'bg-[#FFFFFF] text-[#302B27] shadow-xs' : 'text-[#302B27]/60 hover:text-[#302B27]'}`}
            >
              Register
            </button>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Forgot confirmation */}
        {forgotSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#96734C] mx-auto" />
            <h4 className="font-serif text-lg text-[#302B27]">Instructions Dispatched</h4>
            <p className="text-xs text-[#302B27]/70">
              If an account is associated with <span className="font-semibold text-[#302B27]">{email}</span>, a secure password reset link has been dispatched.
            </p>
            <button
              onClick={() => { setMode('login'); setForgotSubmitted(false); }}
              className="text-xs font-semibold text-[#96734C] hover:underline pt-2 inline-block"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-[#302B27] mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aria Vance"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#F8F4ED] border border-[#E8DCCB] rounded-lg text-xs text-[#302B27] focus:outline-[#96734C]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#302B27] mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F8F4ED] border border-[#E8DCCB] rounded-lg text-xs text-[#302B27] focus:outline-[#96734C]"
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-[#302B27]">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-[#96734C] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F8F4ED] border border-[#E8DCCB] rounded-lg text-xs text-[#302B27] focus:outline-[#96734C] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#302B27]/50 hover:text-[#302B27] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#302B27] hover:bg-[#433C37] text-white text-xs font-semibold uppercase tracking-widest rounded-lg transition-colors cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
            </button>

            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-center text-xs text-[#302B27]/60 hover:text-[#302B27] underline"
              >
                Back to Sign In
              </button>
            )}

          </form>
        )}

        {/* Guest Exploration Option */}
        <div className="pt-2 border-t border-[#E8DCCB] text-center space-y-2">
          <div className="text-[11px] text-[#302B27]/60">Or explore without credentials:</div>
          <button
            onClick={handleGuestLogin}
            className="w-full py-2.5 bg-[#F8F4ED] hover:bg-[#E8DCCB]/60 text-[#302B27] border border-[#E8DCCB] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#96734C]" />
            <span>Continue as Guest Explorer</span>
          </button>
        </div>

      </div>
    </div>
  );
};
