import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ROLE_ROUTES } from '../../context/AuthContext';
import PasswordInput from '../../components/PasswordInput';

// PUBLIC SIGNUP: Only Citizen role allowed
// Staff roles (Employee, Technician, Institution Manager, MESOB Manager, Super Admin)
// can only be created by Super Admin through User Management dashboard
export default function SignupPage() {
  const { signup, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [error, setError]           = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      navigate(ROLE_ROUTES[user.role] || '/', { replace: true });
    }
  }, [isLoggedIn, user, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) { setError('Full name is required.'); return; }
    
    // Name format validation
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name.trim())) {
      setError('Name should only contain letters and spaces.');
      return;
    }
    
    if (!email.trim()) { setError('Email is required.'); return; }
    
    if (!password) { setError('Password is required.'); return; }
    
    // Password strength validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    // Public signup always creates Citizen accounts only
    const result = signup(name, email, password, 'citizen');
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
          <p className="text-gray-500 mt-1">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Abebe Kebede"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <PasswordInput
                id="confirm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="••••••••"
              />
            </div>

            {/* Account Type Info - Citizens Only */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">Citizen Account</h4>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Public registration creates a Citizen account. Staff accounts (Employee, Technician, Manager roles) are created by administrators only.
                  </p>
                </div>
              </div>
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
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/" className="text-blue-500 hover:underline">← Back to public website</Link>
        </p>
      </div>
    </div>
  );
}
