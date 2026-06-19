import React, { useEffect, useState } from 'react';
import API from '../api';

const STAT_CARDS = [
  { key: 'totalUsers',          label: 'Total Students', icon: '👥', color: '#6366f1' },
  { key: 'activeSubscriptions', label: 'Subscriptions',  icon: '💳', color: '#10b981' },
  { key: 'dailyOrders',         label: "Today's Orders", icon: '🧾', color: '#f59e0b' },
  { key: 'revenue',             label: 'Total Revenue',  icon: '💰', color: '#ec4899', prefix: '₹' },
  { key: 'menuCount',           label: 'Menu Items',     icon: '🍽️', color: '#8b5cf6' },
];

// Simple SVG bar chart
function BarChart({ bars, height = 120 }) {
  const max = Math.max(...bars.map((b) => b.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: height + 40 }}>
      {bars.map((bar) => {
        const barH = Math.round((bar.value / max) * height);
        return (
          <div key={bar.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: bar.color, marginBottom: 4 }}>
              {bar.prefix || ''}{bar.value}
            </span>
            <div
              style={{
                width: '100%', height: barH || 4, backgroundColor: bar.color,
                borderRadius: '6px 6px 0 0', transition: 'height 0.6s ease',
                opacity: 0.85,
              }}
            />
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 6, textAlign: 'center', lineHeight: 1.2 }}>
              {bar.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Donut chart using SVG
function DonutChart({ segments, size = 120 }) {
  const r = 45;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;

  let offset = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        {segments.map((seg) => {
          const dash = (seg.value / total) * circumference;
          const gap  = circumference - dash;
          const el = (
            <circle
              key={seg.label}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="18"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          );
          offset += dash;
          return el;
        })}
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text-primary)">
          {total}
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {segments.map((seg) => (
          <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-muted)' }}>{seg.label}</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', marginLeft: 'auto' }}>{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminSummary() {
  const [summary, setSummary]   = useState(null);
  const [orders, setOrders]     = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    Promise.all([
      API.get('/admin/summary'),
      API.get('/orders'),
      API.get('/admin/payments'),
    ])
      .then(([s, o, p]) => {
        setSummary(s.data);
        setOrders(o.data || []);
        setPayments(p.data || []);
      })
      .catch(() => setError('Failed to load summary.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500 dark:text-gray-400 animate-pulse text-center py-8">Loading summary...</p>;
  if (error)   return <p className="text-red-500 text-center py-8">{error}</p>;

  // Orders by status
  const statusCount = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const orderBars = [
    { label: 'Pending',   value: statusCount['Pending']   || 0, color: '#f59e0b' },
    { label: 'Completed', value: statusCount['Completed'] || 0, color: '#10b981' },
    { label: 'Cancelled', value: statusCount['Cancelled'] || 0, color: '#ef4444' },
  ];

  // Revenue by type
  const orderRevenue = payments.filter(p => p.status === 'Succeeded' && !p.plan).reduce((s, p) => s + p.amount, 0);
  const subRevenue   = payments.filter(p => p.status === 'Succeeded' &&  p.plan).reduce((s, p) => s + p.amount, 0);

  const revenueBars = [
    { label: 'Food Orders',   value: orderRevenue, color: '#6366f1', prefix: '₹' },
    { label: 'Subscriptions', value: subRevenue,   color: '#ec4899', prefix: '₹' },
  ];

  // Payment status donut
  const payDonut = [
    { label: 'Succeeded', value: payments.filter(p => p.status === 'Succeeded').length, color: '#10b981' },
    { label: 'Pending',   value: payments.filter(p => p.status === 'Pending').length,   color: '#f59e0b' },
    { label: 'Failed',    value: payments.filter(p => p.status === 'Failed').length,     color: '#ef4444' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
        {STAT_CARDS.map(({ key, label, icon, color, prefix }) => (
          <div key={key} style={{
            background: 'var(--bg-page)', border: '1px solid var(--border)',
            borderRadius: '0.875rem', padding: '1.25rem', textAlign: 'center',
            boxShadow: 'var(--shadow-card)',
            borderTop: `3px solid ${color}`,
          }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>{icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>
              {prefix || ''}{summary[key] ?? 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontWeight: 500 }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>

        {/* Orders by status */}
        <div style={{ background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            📦 Orders by Status
          </h3>
          <BarChart bars={orderBars} />
        </div>

        {/* Revenue breakdown */}
        <div style={{ background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            💰 Revenue Breakdown
          </h3>
          <BarChart bars={revenueBars} />
        </div>

        {/* Payment status donut */}
        <div style={{ background: 'var(--bg-page)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            💳 Payment Status
          </h3>
          <DonutChart segments={payDonut} />
        </div>

      </div>
    </div>
  );
}
