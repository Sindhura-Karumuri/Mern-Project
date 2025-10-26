import React, { useEffect, useState } from "react";
import API from "../api";
import PlanCard from "./PlanCard";

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: "",
    duration_in_days: "",
    image: null,
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
    if (!newPlan.name || !newPlan.price || !newPlan.duration_in_days) {
      return alert("Please fill all fields");
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", newPlan.name);
      formData.append("price", newPlan.price);
      formData.append("duration_in_days", newPlan.duration_in_days);
      if (newPlan.image) formData.append("image", newPlan.image);

      if (editingPlan) {
        await API.put(`/plans/${editingPlan._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Plan updated successfully");
      } else {
        await API.post("/plans", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Plan added successfully");
      }

      setNewPlan({ name: "", price: "", duration_in_days: "", image: null });
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
      duration_in_days: plan.duration,
      image: null, // allow new upload
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await API.delete(`/plans/${id}`);
      fetchPlans();
    } catch (err) {
      console.error(err);
      alert("Failed to delete plan");
    }
  };

  const renderImagePreview = () => {
    if (newPlan.image) {
      return (
        <img
          src={URL.createObjectURL(newPlan.image)}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-lg mb-2"
        />
      );
    }
    if (editingPlan?.image) {
      return (
        <img
          src={`http://localhost:5000${editingPlan.image}`}
          alt="Current"
          className="w-32 h-32 object-cover rounded-lg mb-2"
        />
      );
    }
    return null;
  };

  return (
    <div className="my-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Plans</h2>

      {/* Add/Edit Form */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md mb-6">
        <h5 className="text-lg font-medium mb-3">
          {editingPlan ? "Edit Plan" : "Add New Plan"}
        </h5>
        <div className="grid gap-3">
          {renderImagePreview()}
          <input
            type="text"
            placeholder="Name"
            className="p-3 border rounded-lg"
            value={newPlan.name}
            onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            className="p-3 border rounded-lg"
            value={newPlan.price}
            onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
          />
          <input
            type="number"
            placeholder="Duration (days)"
            className="p-3 border rounded-lg"
            value={newPlan.duration_in_days}
            onChange={(e) =>
              setNewPlan({ ...newPlan, duration_in_days: e.target.value })
            }
          />
          <input
            type="file"
            className="p-3 border rounded-lg"
            onChange={(e) => setNewPlan({ ...newPlan, image: e.target.files[0] })}
          />
          <div className="flex space-x-3 mt-2">
            <button
              className={`px-4 py-2 rounded-lg text-white ${
                saving ? "bg-gray-400" : "bg-blue-600"
              }`}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : editingPlan ? "Update Plan" : "Add Plan"}
            </button>
            {editingPlan && (
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                onClick={() => {
                  setEditingPlan(null);
                  setNewPlan({ name: "", price: "", duration_in_days: "", image: null });
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
        <p className="text-gray-500 animate-pulse">Loading plans...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan._id} plan={plan}>
              <button
                className="px-2 py-1 bg-yellow-400 text-white rounded"
                onClick={() => handleEdit(plan)}
              >
                Edit
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => handleDelete(plan._id)}
              >
                Delete
              </button>
            </PlanCard>
          ))}
        </div>
      )}
    </div>
  );
}
