import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ROLE_ROUTES } from '../../context/AuthContext';
import PasswordInput from '../../components/PasswordInput';

const DEMO_ACCOUNTS = [
  { label: 'Super Admin',         email: 'superadmin@mesobcenter.et', password: 'super123',   style: 'bg-purple-50 hover:bg-purple-100 text-purple-800' },
  { label: 'MESOB Manager',       email: 'manager@mesobcenter.et',    password: 'manager123', style: 'bg-red-50 hover:bg-red-100 text-red-800' },
  { label: 'Institution Manager', email: 'inst.manager@mesobcenter.et', password: 'inst123',  style: 'bg-orange-50 hover:bg-orange-100 text-orange-800' },
  { label: 'Employee',            email: 'employee@mesobcenter.et',   password: 'emp123',     style: 'bg-blue-50 hover:bg-blue-100 text-blue-800' },
  { label: 'Technician',            email: 'ict@mesobcenter.et',        password: 'ict123',     style: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800' },
  { label: 'Citizen',             email: 'citizen@example.com',       password: 'citizen123', style: 'bg-green-50 hover:bg-green-100 text-green-800' },
];

export default function LoginPage() {
  const { login, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      navigate(ROLE_ROUTES[user.role] || '/', { replace: true });
    }
  }, [isLoggedIn, user, navigate]);

  function fillDemo(demoEmail, demoPassword) {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = login(email.trim(), password);
    if (!result.success) {
      setError(result.message);
      return;
    }
    navigate(ROLE_ROUTES[result.user.role] || '/', { replace: true });
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1e3a8a] text-white mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">HAWASSA MESOB</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold py-3 rounded-xl transition shadow-md hover:shadow-lg"
            >
              Sign in
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Demo Accounts (click to fill)</p>
            <div className="space-y-2 text-sm max-h-72 overflow-y-auto pr-1">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc.email, acc.password)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition flex justify-between items-center gap-2 ${acc.style}`}
                >
                  <span><strong>{acc.label}</strong></span>
                  <span className="text-xs opacity-70 truncate">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">Sign up</Link>
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/" className="text-blue-500 hover:underline">← Back to public website</Link>
        </p>
      </div>
    </div>
  );
}
