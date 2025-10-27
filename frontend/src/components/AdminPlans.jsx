import React, { useEffect, useState } from "react";
import API from "../api";

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: "",
    duration: "",
    image: "",
  });
  const [editingPlan, setEditingPlan] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchPlans = async () => {
    try {
      const res = await API.get("/plans");
      setPlans(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSave = async () => {
    if (!newPlan.name || !newPlan.price || !newPlan.duration) {
      return alert("Please fill all required fields");
    }

    try {
      setSaving(true);
      const planData = {
        name: newPlan.name,
        price: Number(newPlan.price),
        duration: Number(newPlan.duration),
        image: newPlan.image
      };

      if (editingPlan) {
        await API.put(`/plans/${editingPlan._id}`, planData);
        alert("Plan updated successfully!");
      } else {
        await API.post("/plans", planData);
        alert("Plan added successfully!");
      }

      setNewPlan({ name: "", price: "", duration: "", image: "" });
      setEditingPlan(null);
      fetchPlans();
    } catch (err) {
      console.error(err);
      alert("Error saving plan");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setNewPlan({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      image: plan.image || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await API.delete(`/plans/${id}`);
      alert("Plan deleted successfully!");
      fetchPlans();
    } catch (err) {
      console.error(err);
      alert("Failed to delete plan");
    }
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {editingPlan ? "Edit Plan" : "Add New Plan"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Plan Name"
            className="form-input"
            value={newPlan.name}
            onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price (₹)"
            className="form-input"
            value={newPlan.price}
            onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
          />
          <input
            type="number"
            placeholder="Duration (days)"
            className="form-input"
            value={newPlan.duration}
            onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
          />
          <input
            type="url"
            placeholder="Image URL"
            className="form-input"
            value={newPlan.image}
            onChange={(e) => setNewPlan({ ...newPlan, image: e.target.value })}
          />
        </div>
        <div className="flex space-x-3 mt-4">
          <button 
            className={`btn-primary ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : editingPlan ? "Update Plan" : "Add Plan"}
          </button>
          {editingPlan && (
            <button
              className="btn-secondary"
              onClick={() => {
                setEditingPlan(null);
                setNewPlan({ name: "", price: "", duration: "", image: "" });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Plans List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Subscription Plans ({plans.length})
        </h3>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading plans...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {plans.map((plan) => (
                  <tr key={plan._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <img src={plan.image} alt={plan.name} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{plan.name}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-semibold">₹{plan.price}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{plan.duration} days</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition"
                          onClick={() => handleEdit(plan)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition"
                          onClick={() => handleDelete(plan._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
