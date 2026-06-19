import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import AdminSummary from '../components/AdminSummary';
import AdminPlans from '../components/AdminPlans';
import AdminMenu from '../components/AdminMenu';
import AdminOrders from '../components/AdminOrders';
import AdminPayments from '../components/AdminPayments';
import AdminUsers from '../components/AdminUsers';

const TABS = [
  { id: 'summary',  label: '📊 Summary' },
  { id: 'orders',   label: '🧾 Orders' },
  { id: 'menu',     label: '🍽️ Menu' },
  { id: 'plans',    label: '💳 Plans' },
  { id: 'users',    label: '👥 Users' },
  { id: 'payments', label: '💰 Payments' },
];

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Top bar */}
      <div className="bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, {user.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Tab bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {activeTab === 'summary'  && <AdminSummary />}
          {activeTab === 'orders'   && <AdminOrders />}
          {activeTab === 'menu'     && <AdminMenu />}
          {activeTab === 'plans'    && <AdminPlans />}
          {activeTab === 'users'    && <AdminUsers />}
          {activeTab === 'payments' && <AdminPayments />}
        </div>
      </div>
    </div>
  );
}
