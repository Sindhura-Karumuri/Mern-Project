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

  if (loading) return <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading orders...</p>;
  if (orders.length === 0) return <p className="text-gray-500 dark:text-gray-400 text-center">No orders found.</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md transition-shadow hover:shadow-xl">
      <h4 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">All Orders</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['Order ID', 'User', 'Items', 'Qty', 'Total', 'Status', 'Actions'].map(head => (
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
            {orders.map(o => (
              <tr key={o._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <td className="px-4 py-2">{o._id}</td>
                <td className="px-4 py-2">{o.user?.name || 'N/A'}</td>
                <td className="px-4 py-2">
                  {o.items.map((item, idx) => (
                    <div key={idx}>
                      {item.name} (₹{item.price} × {item.quantity})
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2 text-center">
                  {o.items.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                </td>
                <td className="px-4 py-2 text-right">₹{o.totalAmount}</td>
                <td className="px-4 py-2 text-center">
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
                <td className="px-4 py-2 flex space-x-2 justify-center">
                  <button
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition"
                    onClick={() => updateStatus(o._id, 'Completed')}
                  >
                    Complete
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
                    onClick={() => updateStatus(o._id, 'Cancelled')}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
