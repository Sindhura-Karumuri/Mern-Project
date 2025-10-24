import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import AdminDashboard from './AdminDashboard';
import MenuCard from '../components/MenuCard';
import PlanCard from '../components/PlanCard';
import API from '../api';
import './Dashboard.css'; // import the CSS file

const Loading = ({ message = 'Loading...' }) => (
  <p className="loading-text">{message}</p>
);

function StudentDashboard({ user, logout }) {
  const [menu, setMenu] = useState([]);
  const [plans, setPlans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState({ menu: true, plans: true, orders: true });
  const [processingPlan, setProcessingPlan] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setError('');
      try {
        const [menuRes, plansRes, ordersRes] = await Promise.all([
          API.get('/menu'),
          API.get('/plans'),
          API.get('/orders/my'),
        ]);
        setMenu(menuRes.data || []);
        setPlans(plansRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading({ menu: false, plans: false, orders: false });
      }
    };
    fetchData();
  }, []);

  const placeOrder = async (menuItemId) => {
    try {
      await API.post('/orders', { menuItemId, quantity: 1 });
      const orderedItem = menu.find(m => m.id === menuItemId);
      setOrders(prev => [
        ...prev,
        { menuItemId, menuItem: orderedItem, status: 'Pending', totalPrice: orderedItem?.price || 0 },
      ]);
      alert('Order placed!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error placing order');
    }
  };

  const subscribe = async (planId) => {
    try {
      setProcessingPlan(planId);
      const { data } = await API.post('/payments/create-order', { planId });
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Canteen Subscription',
        description: 'Plan purchase',
        order_id: data.order.id,
        prefill: { name: user.name, email: user.email },
        handler: async (response) => {
          try {
            await API.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: data.paymentId,
            });
            alert('Payment successful! Subscription updated.');
          } catch {
            alert('Payment verification failed.');
          } finally {
            setProcessingPlan(null);
          }
        },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert('Payment error. Try again.');
      setProcessingPlan(null);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>{user.name} ({user.role})</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {/* Menu Section */}
      <h2 className="section-title">Menu</h2>
      {loading.menu ? <Loading /> : menu.length === 0 ? (
        <p>No menu items available.</p>
      ) : (
        <div className="grid">
          {menu.map(item => (
            <MenuCard
              key={item.id}
              item={item}
              onOrder={placeOrder}
              className="card"
            />
          ))}
        </div>
      )}

      {/* Plans Section */}
      <h2 className="section-title">Plans</h2>
      {loading.plans ? <Loading /> : plans.length === 0 ? (
        <p>No plans available.</p>
      ) : (
        <div className="grid">
          {plans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onSubscribe={() => subscribe(plan.id)}
              processing={processingPlan === plan.id}
              className="card"
            />
          ))}
        </div>
      )}

      {/* Orders Section */}
      <h2 className="section-title">My Orders</h2>
      {loading.orders ? <Loading /> : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="orders-list">
          {orders.map(o => (
            <li key={o.menuItemId}>
              <span>{o.menuItem?.name || o.menuItemId}</span>
              <span>{o.status} - ₹{o.totalPrice}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return <p className="loading-text">Loading user...</p>;

  return user.role?.toLowerCase() === 'admin' 
    ? <AdminDashboard /> 
    : <StudentDashboard user={user} logout={logout} />;
}
