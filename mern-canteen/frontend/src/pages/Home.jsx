import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState({ menu: true, plans: true });
  const [processingPlan, setProcessingPlan] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, plansRes] = await Promise.all([API.get('/menu'), API.get('/plans')]);
        setMenu(menuRes.data || []);
        setPlans(plansRes.data || []);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading({ menu: false, plans: false });
      }
    };
    fetchData();
  }, []);

  const subscribe = async (planId) => {
    if (!user) {
      navigate('/login');
      return;
    }
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
          } catch (err) {
            console.error(err);
            alert('Payment verification failed.');
          } finally {
            setProcessingPlan(null);
          }
        },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert('Payment failed. Try again.');
      setProcessingPlan(null);
    }
  };

  const MenuCard = ({ item }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 duration-300 overflow-hidden">
      {item.image && <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />}
      <div className="p-4">
        <h5 className="text-lg font-semibold">
          <Link to={`/menu/${item.id}`} className="hover:underline">
            {item.name}
          </Link>
        </h5>
        <p className="text-gray-500 dark:text-gray-400">{item.category}</p>
        <p className="font-medium mt-2">₹{item.price}</p>
      </div>
    </div>
  );

  const PlanCard = ({ plan }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 duration-300 overflow-hidden">
      {plan.image && <img src={plan.image} alt={plan.name} className="w-full h-40 object-cover" />}
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <h5 className="text-lg font-semibold">{plan.name}</h5>
          <p className="mt-1">₹{plan.price}</p>
          <p className="text-gray-500 dark:text-gray-400">{plan.duration_in_days} days</p>
        </div>
        {user ? (
          <button
            onClick={() => subscribe(plan.id)}
            disabled={processingPlan === plan.id}
            className={`mt-4 px-4 py-2 rounded-lg font-semibold text-white transition-colors duration-300 ${
              processingPlan === plan.id
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
            }`}
          >
            {processingPlan === plan.id ? 'Processing...' : 'Subscribe'}
          </button>
        ) : (
          <Link
            to="/login"
            className="mt-4 inline-block px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-center"
          >
            Login to Subscribe
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Canteen Menu</h1>

      {loading.menu ? (
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading menu...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {menu.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <h2 className="text-2xl font-semibold mt-10 mb-6">Plans</h2>
      {loading.plans ? (
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading plans...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
