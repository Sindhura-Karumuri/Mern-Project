import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading orders...</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md transition-shadow hover:shadow-xl">
      <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">All Orders</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['Order ID', 'User', 'Item', 'Qty', 'Total', 'Status', 'Actions'].map((head) => (
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
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <td className="px-4 py-2">{o.id}</td>
                <td className="px-4 py-2">{o.userId}</td>
                <td className="px-4 py-2">{o.menuItem?.name || o.menuItemId}</td>
                <td className="px-4 py-2">{o.quantity}</td>
                <td className="px-4 py-2">₹{o.totalPrice}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      o.status === 'Completed'
                        ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100'
                        : o.status === 'Cancelled'
                        ? 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100'
                        : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition"
                    onClick={() => updateStatus(o.id, 'Completed')}
                  >
                    Complete
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
                    onClick={() => updateStatus(o.id, 'Cancelled')}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
