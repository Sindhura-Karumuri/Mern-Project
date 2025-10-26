import React, { useEffect, useState } from "react";
import API from "../api";
import MenuCard from "./MenuCard";

export default function AdminMenu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "", image: null });
  const [editingItem, setEditingItem] = useState(null);

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
    try {
      const formData = new FormData();
      formData.append("name", newItem.name);
      formData.append("price", newItem.price);
      formData.append("category", newItem.category);
      if (newItem.image) formData.append("image", newItem.image);

      if (editingItem) {
        await API.put(`/menu/${editingItem._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Menu item updated");
      } else {
        await API.post("/menu", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Menu item added");
      }

      setNewItem({ name: "", price: "", category: "", image: null });
      setEditingItem(null);
      fetchMenu();
    } catch (err) {
      console.error(err);
      alert("Error saving menu item");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      price: item.price,
      category: item.category,
      image: null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await API.delete(`/menu/${id}`);
      fetchMenu();
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  return (
    <div className="my-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Menu</h2>

      {/* Add/Edit Form */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md mb-6">
        <h5 className="text-lg font-medium mb-3">
          {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
        </h5>
        <div className="grid gap-3">
          <input
            type="text"
            placeholder="Name"
            className="p-3 border rounded-lg"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            className="p-3 border rounded-lg"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            className="p-3 border rounded-lg"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          />
          <input
            type="file"
            className="p-3 border rounded-lg"
            onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
          />
          <div className="flex space-x-3 mt-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={handleSave}>
              {editingItem ? "Update Item" : "Add Item"}
            </button>
            {editingItem && (
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                onClick={() => {
                  setEditingItem(null);
                  setNewItem({ name: "", price: "", category: "", image: null });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Existing Menu */}
      <h4 className="text-xl font-semibold mb-3">Existing Menu</h4>
      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading menu...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {menu.map((item) => (
            <MenuCard key={item._id} item={item}>
              <button
                className="px-2 py-1 bg-yellow-400 text-white rounded"
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </MenuCard>
          ))}
        </div>
      )}
    </div>
  );
}
