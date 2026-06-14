import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ShieldAlert, Key, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';

const AdminLogin = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!usernameOrEmail || !password) {
      setError('Please fill in all credentials.');
      setLoading(false);
      return;
    }

    try {
      await login(usernameOrEmail, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 relative">
      {/* Background glow overlay */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />

      <GlassCard className="max-w-md w-full p-8 md:p-10 border border-white/10" hoverEffect={false}>
        <div className="flex flex-col items-center gap-4 text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight">Admin Console</h1>
            <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-mono">Sign in to manage association modules</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <ShieldAlert size={14} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Username or Email</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                <User size={16} />
              </span>
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Enter username"
                className="glass-input w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-white"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Key size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 rounded-xl text-sm font-bold mt-2 shadow-lg flex items-center justify-center gap-2 text-white"
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                Secure Login
                <ShieldCheck size={16} />
              </>
            )}
          </button>
        </form>

      </GlassCard>
    </div>
  );
};

export default AdminLogin;
