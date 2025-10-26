import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, signup } = useContext(AuthContext);
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password || (isSignup && !form.name)) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      setLoading(true);
      if (isSignup) {
        await signup({ name: form.name, email: form.email, password: form.password });
      } else {
        await login(form.email, form.password);
      }
      nav('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 transition-shadow hover:shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {isSignup ? 'Sign Up' : 'Log In'}
          </h2>

          {error && (
            <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {isSignup && (
              <input
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
              />
            )}

            <input
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />

            <input
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />

            <button
              type="submit"
              className={`w-full p-3 rounded-lg font-semibold text-white transition-colors duration-300 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
              }`}
              disabled={loading}
            >
              {loading ? (isSignup ? 'Signing up...' : 'Logging in...') : isSignup ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <hr className="my-4 border-gray-300 dark:border-gray-600" />

          <button
            onClick={() => setIsSignup(!isSignup)}
            disabled={loading}
            className="w-full text-blue-600 dark:text-blue-400 hover:underline transition"
          >
            {isSignup ? 'Already have an account? Log In' : 'No account? Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
