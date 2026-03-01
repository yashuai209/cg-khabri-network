import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Newspaper, Lock, User, ArrowLeft } from 'lucide-react';

import { fetchApi } from '../lib/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetchApi('admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('admin_token', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full mb-8">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-red-600 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>
      </div>
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="relative group flex flex-col items-center">
              <img 
                src="/logo.png" 
                alt="CG Khabri Network" 
                className="h-28 w-auto object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="flex flex-col items-center mt-4">
                <div className="flex items-baseline font-black tracking-tighter leading-none">
                  <span className="text-3xl text-[#0F172A]">CG</span>
                  <span className="text-3xl text-red-600 mx-1">KHABRI</span>
                  <span className="text-3xl text-[#0F172A]">NETWORK</span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 mt-2">Chhattisgarh's No. 1 News Network</span>
              </div>
              <div className="hidden items-center justify-center w-16 h-16 bg-red-600 rounded-2xl shadow-xl shadow-red-200">
                <Newspaper className="text-white" size={32} />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-500 mt-2">Sign in to manage CG Khabri Network</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-gray-200 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-600/20 transition-all outline-none"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-red-600/20 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
