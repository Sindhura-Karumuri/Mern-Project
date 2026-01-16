import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await API.get('/admin/payments');
      setPayments(res.data || []);
    } catch (err) {
      console.error(err);
      // If endpoint doesn't exist yet, show empty state
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading payments...</p>;
  if (payments.length === 0) return <p className="text-gray-500 dark:text-gray-400 text-center">No payment records found.</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md transition-shadow hover:shadow-xl">
      <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Payment History</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['Payment ID', 'User', 'Amount', 'Type', 'Status', 'Razorpay Order ID', 'Date'].map(head => (
                <th
                  key={head}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {payments.map(p => (
              <tr key={p._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <td className="px-4 py-2 text-sm">{p._id}</td>
                <td className="px-4 py-2">{p.user?.name || 'N/A'}</td>
                <td className="px-4 py-2 text-right">₹{p.amount}</td>
                <td className="px-4 py-2">
                  {p.plan ? (
                    <span className="px-2 py-1 bg-purple-200 text-purple-800 dark:bg-purple-700 dark:text-purple-100 rounded text-xs">
                      Subscription
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100 rounded text-xs">
                      Order
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      p.status === 'Succeeded'
                        ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100'
                        : p.status === 'Failed'
                        ? 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100'
                        : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm font-mono">{p.razorpay_order_id || 'N/A'}</td>
                <td className="px-4 py-2 text-sm">
                  {new Date(p.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
