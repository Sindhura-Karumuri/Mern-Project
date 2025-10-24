import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import AdminSummary from '../components/AdminSummary';
import AdminPlans from '../components/AdminPlans';
import AdminMenu from '../components/AdminMenu';
import AdminOrders from '../components/AdminOrders';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return <p className="loading-text">Loading user...</p>;

  return (
    <div className="admin-dashboard-container">
      {/* Centered Pink Box */}
      <div className="admin-dashboard-box">
        {/* Header */}
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <span>{user.name} ({user.role})</span>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        {/* Summary Section */}
        <div className="section mb-10">
          <h2 className="section-title">Summary</h2>
          <div className="grid">
            <AdminSummary />
          </div>
        </div>
        {/* Plans Management */}
        <div className="section mb-10">
          <h2 className="section-title">Plans Management</h2>
          <div className="grid">
            <AdminPlans />
          </div>
        </div>

        {/* Menu Management */}
        <div className="section mb-10">
          <h2 className="section-title">Menu Management</h2>
          <div className="grid">
            <AdminMenu />
          </div>
        </div>

        {/* Orders Management */}
        <div className="section mb-10">
          <h2 className="section-title">Manage Orders</h2>
          <div className="grid orders-grid">
            <AdminOrders />
          </div>
        </div>
      </div>
    </div>
  );
}
