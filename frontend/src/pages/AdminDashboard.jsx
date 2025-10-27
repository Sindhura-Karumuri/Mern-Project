import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import AdminSummary from '../components/AdminSummary';
import AdminPlans from '../components/AdminPlans';
import AdminMenu from '../components/AdminMenu';
import AdminOrders from '../components/AdminOrders';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600 dark:text-gray-400">Loading user...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user.name}! Manage your canteen operations here.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Logged in as</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {user.name} ({user.role})
                </p>
              </div>
              <button onClick={handleLogout} className="btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="space-y-8">
          {/* Summary Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="w-1 h-8 bg-blue-600 rounded-full mr-3"></span>
              Dashboard Summary
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <AdminSummary />
            </div>
          </section>

          {/* Plans Management */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="w-1 h-8 bg-green-600 rounded-full mr-3"></span>
              Plans Management
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <AdminPlans />
            </div>
          </section>

          {/* Menu Management */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="w-1 h-8 bg-purple-600 rounded-full mr-3"></span>
              Menu Management
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <AdminMenu />
            </div>
          </section>

          {/* Orders Management */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="w-1 h-8 bg-orange-600 rounded-full mr-3"></span>
              Orders Management
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <AdminOrders />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
