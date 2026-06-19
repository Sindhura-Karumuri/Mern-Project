import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import API from '../api';
import toast from 'react-hot-toast';
import './Dashboard.css';

const statusClass = (s = '') => {
  const v = s.toLowerCase();
  if (v === 'pending')   return 'status-badge status-pending';
  if (v === 'completed') return 'status-badge status-delivered';
  if (v === 'cancelled') return 'status-badge status-cancelled';
  return 'status-badge status-default';
};

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [orders, setOrders]           = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [editing, setEditing]         = useState(false);
  const [name, setName]               = useState(user?.name || '');
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    Promise.all([
      API.get('/orders/my'),
      API.get('/plans/my'),
    ])
      .then(([o, s]) => {
        setOrders(o.data || []);
        setSubscription(s.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    if (!name.trim()) return toast.error('Name cannot be empty.');
    try {
      setSaving(true);
      const { data } = await API.put('/auth/profile', { name: name.trim() });
      if (setUser) setUser((prev) => ({ ...prev, name: data.name }));
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Profile</h1>
      </div>

      {/* Profile card */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '1rem', padding: '1.75rem', marginBottom: '2rem',
        boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), #ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.75rem', color: '#fff', fontWeight: 800, flexShrink: 0,
        }}>
          {user.name[0].toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          {editing ? (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                className="chat-input"
                style={{ maxWidth: 260, borderRadius: '0.5rem', padding: '0.5rem 0.75rem' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button className="btn order-btn" style={{ marginTop: 0, padding: '0.5rem 1rem' }} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button className="btn" style={{ marginTop: 0, padding: '0.5rem 1rem', background: 'var(--bg-page)', color: 'var(--text-primary)', border: '1px solid var(--border)' }} onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</span>
              <button className="btn" style={{ marginTop: 0, padding: '0.3rem 0.85rem', fontSize: '0.8rem' }} onClick={() => setEditing(true)}>
                Edit
              </button>
            </div>
          )}
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>{user.email}</p>
          <span className="status-badge status-confirmed" style={{ marginTop: '0.5rem', display: 'inline-block' }}>
            {user.role}
          </span>
        </div>
      </div>

      {/* Subscription */}
      <h2 className="section-title">Active Subscription</h2>
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
      ) : subscription ? (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '1rem', padding: '1.5rem', boxShadow: 'var(--shadow-card)',
          borderLeft: '4px solid #10b981', marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{subscription.name}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {subscription.duration} days · ₹{subscription.price}
              </div>
            </div>
            <span className="status-badge status-delivered">✅ Active</span>
          </div>
        </div>
      ) : (
        <div className="empty-state" style={{ marginBottom: '1rem' }}>
          <div className="empty-state-icon">💳</div>
          <p>No active subscription. Go to Dashboard to subscribe.</p>
        </div>
      )}

      {/* Orders */}
      <h2 className="section-title" style={{ marginTop: '2rem' }}>Order History</h2>
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🧾</div>
          <p>No orders yet.</p>
        </div>
      ) : (
        <ul className="orders-list">
          {[...orders].reverse().map((o) => (
            <li key={o._id}>
              <div className="order-meta">
                <span className="order-id">#{o._id}</span>
                <div className="order-items">
                  {o.items.map((i, idx) => (
                    <span key={idx}>{i.name} × {i.quantity}{idx < o.items.length - 1 ? ', ' : ''}</span>
                  ))}
                </div>
                <span className={statusClass(o.status)}>{o.status}</span>
              </div>
              <span className="order-total">₹{o.totalAmount}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
