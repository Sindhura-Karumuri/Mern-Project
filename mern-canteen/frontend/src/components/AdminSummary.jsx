import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminSummary() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    API.get('/admin/summary')
      .then(r => setSummary(r.data))
      .catch(err => console.error('Failed to fetch summary', err));
  }, []);

  if (!summary) {
    return <div className="text-gray-500 dark:text-gray-400 animate-pulse mt-4">Loading admin summary...</div>;
  }

  const stats = [
    { label: 'Total Users', value: summary.totalUsers },
    { label: 'Active Subscriptions', value: summary.activeSubscriptions },
    { label: 'Daily Orders', value: summary.dailyOrders },
    { label: 'Revenue', value: `₹${summary.revenue || 0}` },
    { label: 'Menu Items', value: summary.menuCount },
  ];

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow flex flex-col items-center"
        >
          <div className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
