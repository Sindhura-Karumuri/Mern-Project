import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import AdminSummary from '../components/AdminSummary';
import AdminPlans from '../components/AdminPlans';
import AdminMenu from '../components/AdminMenu';
import AdminOrders from '../components/AdminOrders';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return <p className="text-center py-10">Loading user...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium">{user.name} ({user.role})</span>
          <button
            className="px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mb-10">
        <AdminSummary />
      </div>

      {/* Plans Management */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4"></h2>
        <div className="space-y-4">
          <AdminPlans />
        </div>
      </div>

      {/* Menu Management */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4"></h2>
        <div className="space-y-4">
          <AdminMenu />
        </div>
      </div>

      {/* Orders Management */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
        <div className="space-y-4">
          <AdminOrders />
        </div>
      </div>
    </div>
  );
}
