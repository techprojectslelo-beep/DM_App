import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Sun, Moon, ShieldCheck } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const Login = ({ isDark, setIsDark, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Your requested text colors
  const slateText = isDark ? 'text-slate-300' : 'text-slate-600';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.post('/login.php', { email, password });
      
      if (response.data.status === 'success') {
        onLogin(response.data.user);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server Connection Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex transition-all duration-500 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      
      {/* LEFT SIDE: Branding & Artistic Curve */}
      <div className="hidden lg:flex w-[45%] relative bg-indigo-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-indigo-400 to-transparent"></div>
        
        <div className="relative z-10 w-full flex flex-col items-center justify-center p-12 text-white">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-[32px] flex items-center justify-center mb-8 border border-white/20">
             <ShieldCheck size={48} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-[0.25em] text-center leading-tight">
            Digital<br/>Marketing<br/><span className="text-indigo-200">Suite</span>
          </h1>
          <div className="mt-8 h-1 w-12 bg-indigo-300 rounded-full"></div>
        </div>

        {/* THE CONCAVE S-CURVE SEPARATOR */}
        <div className="absolute top-0 right-[-2px] h-full w-24 z-20">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M0 0 C 50 0, 50 50, 100 50 L 100 100 L 0 100 Z" 
              fill={isDark ? "#0f172a" : "#f8fafc"} 
              transform="rotate(180 50 50)"
            />
          </svg>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="flex-1 flex flex-col relative">
        <button 
          onClick={() => setIsDark(!isDark)}
          className={`absolute top-8 right-8 p-3 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white border-slate-100 text-slate-400'
          }`}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className={`text-3xl font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Sign In
              </h2>
              <p className={`text-[11px] font-bold uppercase tracking-[0.2em] mt-3 ${slateText}`}>
                TechCryptors Internal Access
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-widest">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${slateText}`}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-14 pl-12 rounded-2xl border-2 outline-none transition-all font-bold text-sm ${
                      isDark 
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                      : 'bg-white border-slate-100 text-slate-900 focus:border-indigo-600'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${slateText}`}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full h-14 pl-12 rounded-2xl border-2 outline-none transition-all font-bold text-sm ${
                      isDark 
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' 
                      : 'bg-white border-slate-100 text-slate-900 focus:border-indigo-600'
                    }`}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Enter Portal"} <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;