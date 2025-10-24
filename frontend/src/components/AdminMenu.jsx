import React, { useEffect, useState } from 'react';
import API from '../api';
import MenuCard from './MenuCard';

export default function AdminMenu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: '', image: '' });
  const [editingItem, setEditingItem] = useState(null);

  const fetchMenu = async () => {
    try {
      const res = await API.get('/menu');
      setMenu(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleSave = async () => {
    try {
      if (editingItem) {
        await API.put(`/menu/${editingItem.id}`, newItem);
        alert('Menu item updated');
      } else {
        await API.post('/menu', newItem);
        alert('Menu item added');
      }
      setNewItem({ name: '', price: '', category: '', image: '' });
      setEditingItem(null);
      fetchMenu();
    } catch (err) {
      console.error(err);
      alert('Error saving menu item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem({ name: item.name, price: item.price, category: item.category, image: item.image || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await API.delete(`/menu/${id}`);
      fetchMenu();
    } catch (err) {
      console.error(err);
      alert('Failed to delete item');
    }
  };

  return (
    <div className="my-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Menu</h2>

      {/* Add/Edit Form */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md mb-6 transition-shadow hover:shadow-xl">
        <h5 className="text-lg font-medium mb-3">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h5>
        <div className="grid gap-3">
          <input
            type="text"
            placeholder="Name"
            className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={newItem.name}
            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={newItem.price}
            onChange={e => setNewItem({ ...newItem, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={newItem.category}
            onChange={e => setNewItem({ ...newItem, category: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={newItem.image}
            onChange={e => setNewItem({ ...newItem, image: e.target.value })}
          />
          <div className="flex space-x-3 mt-2">
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition"
              onClick={handleSave}
            >
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
            {editingItem && (
              <button
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-semibold rounded-lg transition"
                onClick={() => {
                  setEditingItem(null);
                  setNewItem({ name: '', price: '', category: '', image: '' });
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
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading menu...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {menu.map(item => (
            <div key={item.id} className="relative group">
              <MenuCard item={item} />
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow-sm transition"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow-sm transition"
                  onClick={() => handleDelete(item.id)}
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
