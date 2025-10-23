import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import AdminDashboard from './AdminDashboard';
import MenuCard from '../components/MenuCard';
import PlanCard from '../components/PlanCard';
import API from '../api';

const Loading = ({ message = 'Loading...' }) => (
  <p className="text-gray-500 dark:text-gray-400 animate-pulse">{message}</p>
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
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium">{user.name} ({user.role})</span>
          <button
            className="px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Menu Section */}
      <h2 className="text-2xl font-semibold mb-4">Menu</h2>
      {loading.menu ? <Loading /> : menu.length === 0 ? (
        <p>No menu items available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {menu.map(item => (
            <MenuCard
              key={item.id}
              item={item}
              onOrder={placeOrder}
              className="transition-transform transform hover:scale-105 duration-300 shadow-md hover:shadow-xl rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Plans Section */}
      <h2 className="text-2xl font-semibold mb-4">Plans</h2>
      {loading.plans ? <Loading /> : plans.length === 0 ? (
        <p>No plans available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {plans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onSubscribe={() => subscribe(plan.id)}
              processing={processingPlan === plan.id}
              className="transition-transform transform hover:scale-105 duration-300 shadow-md hover:shadow-xl rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Orders Section */}
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
      {loading.orders ? <Loading /> : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="space-y-2">
          {orders.map(o => (
            <li
              key={o.menuItemId}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex justify-between items-center"
            >
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

  if (!user) return <p className="text-center py-10">Loading user...</p>;

  const role = user.role?.toLowerCase();

  return role === 'admin' ? <AdminDashboard /> : <StudentDashboard user={user} logout={logout} />;
}
