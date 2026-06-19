import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/users')
      .then((r) => setUsers(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading users...</p>;
  if (!users.length) return <p className="text-gray-500 dark:text-gray-400 text-center">No students found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {['Name', 'Email', 'Subscription', 'Joined'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{u.name}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{u.email}</td>
              <td className="px-4 py-3">
                {u.subscription ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full text-xs font-semibold">
                    {u.subscription.name} — ₹{u.subscription.price}
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 rounded-full text-xs">
                    No plan
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                {new Date(u.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
