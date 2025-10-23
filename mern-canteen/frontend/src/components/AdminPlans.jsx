import React, { useEffect, useState } from 'react';
import API from '../api';
import PlanCard from './PlanCard';

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlan, setNewPlan] = useState({ name: '', price: '', duration_in_days: '', image: '' });
  const [editingPlan, setEditingPlan] = useState(null);

  const fetchPlans = async () => {
    try {
      const res = await API.get('/plans');
      setPlans(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSave = async () => {
    try {
      if (editingPlan) {
        await API.put(`/plans/${editingPlan.id}`, newPlan);
        alert('Plan updated successfully');
      } else {
        await API.post('/plans', newPlan);
        alert('Plan added successfully');
      }
      setNewPlan({ name: '', price: '', duration_in_days: '', image: '' });
      setEditingPlan(null);
      fetchPlans();
    } catch (err) {
      console.error(err);
      alert('Error saving plan');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setNewPlan({
      name: plan.name,
      price: plan.price,
      duration_in_days: plan.duration_in_days,
      image: plan.image || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await API.delete(`/plans/${id}`);
      fetchPlans();
    } catch (err) {
      console.error(err);
      alert('Failed to delete plan');
    }
  };

  return (
    <div className="my-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Plans</h2>

      {/* Add/Edit Plan Form */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md mb-6 transition-shadow hover:shadow-xl">
        <h5 className="text-lg font-medium mb-3">{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h5>
        <div className="grid gap-3">
          <input
            type="text"
            placeholder="Name"
            className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={newPlan.name}
            onChange={e => setNewPlan({ ...newPlan, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={newPlan.price}
            onChange={e => setNewPlan({ ...newPlan, price: e.target.value })}
          />
          <input
            type="number"
            placeholder="Duration (days)"
            className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={newPlan.duration_in_days}
            onChange={e => setNewPlan({ ...newPlan, duration_in_days: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={newPlan.image}
            onChange={e => setNewPlan({ ...newPlan, image: e.target.value })}
          />
          <div className="flex space-x-3 mt-2">
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition"
              onClick={handleSave}
            >
              {editingPlan ? 'Update Plan' : 'Add Plan'}
            </button>
            {editingPlan && (
              <button
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-semibold rounded-lg transition"
                onClick={() => {
                  setEditingPlan(null);
                  setNewPlan({ name: '', price: '', duration_in_days: '', image: '' });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Existing Plans */}
      <h4 className="text-xl font-semibold mb-3">Existing Plans</h4>
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading plans...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className="relative group">
              <PlanCard plan={plan} />
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow-sm transition"
                  onClick={() => handleEdit(plan)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow-sm transition"
                  onClick={() => handleDelete(plan.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
