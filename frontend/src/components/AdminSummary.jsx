import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await API.get('/admin/summary');
        setSummary(res.data);
      } catch (err) {
        console.error('Failed to fetch summary', err);
        setError('Failed to load summary.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="text-gray-500 dark:text-gray-400 animate-pulse mt-6 text-center">
        Loading admin summary...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 mt-6 text-center">{error}</div>;
  }

  const stats = [
    { label: 'Total Users', value: summary.totalUsers },
    { label: 'Active Subscriptions', value: summary.activeSubscriptions },
    { label: 'Daily Orders', value: summary.dailyOrders },
    { label: 'Revenue', value: `₹${summary.revenue || 0}` },
    { label: 'Menu Items', value: summary.menuCount },
  ];

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow flex flex-col items-center justify-center"
          >
            <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</div>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
