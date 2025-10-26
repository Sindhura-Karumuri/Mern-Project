import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginImage from '../assets/login.jpg'; // make sure the path is correct

export default function Login() {
  const { login, signup } = useContext(AuthContext);
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
      if (isSignup) await signup({ name: form.name, email: form.email, password: form.password });
      else await login(form.email, form.password);
      nav('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-500">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left: Illustration */}
        <div className="hidden md:flex items-center justify-center">
          <img
            src={LoginImage}
            alt="Login Illustration"
            className="w-full max-w-lg rounded-3xl shadow-2xl animate-fade-in"
          />
        </div>

        {/* Right: Login Form */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-10 flex flex-col justify-center transition-all hover:scale-[1.02] duration-300">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
            {isSignup ? 'Sign Up' : 'Log In'}
          </h2>

          {error && (
            <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 p-3 rounded mb-4 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            {isSignup && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-4 border rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-4 border rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-4 border rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-4 rounded-xl font-semibold text-white text-lg transition-all duration-300 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
              }`}
            >
              {loading ? (isSignup ? 'Signing up...' : 'Logging in...') : isSignup ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <hr className="my-6 border-gray-300 dark:border-gray-600" />

          <button
            onClick={() => setIsSignup(!isSignup)}
            disabled={loading}
            className="w-full text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition duration-300"
          >
            {isSignup ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
