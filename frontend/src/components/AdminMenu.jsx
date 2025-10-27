import React, { useEffect, useState } from "react";
import API from "../api";

export default function AdminMenu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "Breakfast", image: "" });
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchMenu = async () => {
    try {
      const res = await API.get("/menu");
      setMenu(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleSave = async () => {
    if (!newItem.name || !newItem.price || !newItem.category) {
      return alert("Please fill all required fields");
    }

    try {
      setSaving(true);
      const itemData = {
        name: newItem.name,
        price: Number(newItem.price),
        category: newItem.category,
        image: newItem.image
      };

      if (editingItem) {
        await API.put(`/menu/${editingItem._id}`, itemData);
        alert("Menu item updated successfully!");
      } else {
        await API.post("/menu", itemData);
        alert("Menu item added successfully!");
      }

      setNewItem({ name: "", price: "", category: "Breakfast", image: "" });
      setEditingItem(null);
      fetchMenu();
    } catch (err) {
      console.error(err);
      alert("Error saving menu item");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await API.delete(`/menu/${id}`);
      alert("Menu item deleted successfully!");
      fetchMenu();
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Item Name"
            className="form-input"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price (₹)"
            className="form-input"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
          <select
            className="form-input"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Snacks">Snacks</option>
            <option value="Beverages">Beverages</option>
          </select>
          <input
            type="url"
            placeholder="Image URL"
            className="form-input"
            value={newItem.image}
            onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
          />
        </div>
        <div className="flex space-x-3 mt-4">
          <button 
            className={`btn-primary ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : editingItem ? "Update Item" : "Add Item"}
          </button>
          {editingItem && (
            <button
              className="btn-secondary"
              onClick={() => {
                setEditingItem(null);
                setNewItem({ name: "", price: "", category: "Breakfast", image: "" });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Menu Items List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Menu Items ({menu.length})
        </h3>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading menu...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {menu.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.category}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-semibold">₹{item.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition"
                          onClick={() => handleDelete(item._id)}
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
