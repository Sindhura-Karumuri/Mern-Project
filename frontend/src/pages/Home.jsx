import React, { useEffect, useState, useContext } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "./Home.css";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [plans, setPlans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState({ menu: true, plans: true, orders: true });
  const [processingPlan, setProcessingPlan] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setError("");
      try {
        const [menuRes, plansRes, ordersRes] = await Promise.all([
          API.get("/menu"),
          API.get("/plans"),
          user ? API.get("/orders/my") : Promise.resolve({ data: [] }),
        ]);

        setMenu(menuRes.data || []);
        setPlans(plansRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading({ menu: false, plans: false, orders: false });
      }
    };
    fetchData();
  }, [user]);

  const getImageURL = (path) => {
  if (!path) return "/default-image.png"; // fallback
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // backend URL
  // If path is absolute (starts with http) return it as is
  if (path.startsWith("http")) return path;
  // Otherwise, prepend backend URL
  return `${baseURL}${path.startsWith("/") ? "" : "/"}${path}`;
};


  // Place Order
  const placeOrder = async (menuItemId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const menuItem = menu.find((m) => m._id === menuItemId);
      if (!menuItem) throw new Error("Menu item not found");

      const items = [{ name: menuItem.name, quantity: 1, price: menuItem.price }];
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Create Razorpay order
      const { data: orderData } = await API.post("/payments/create-food-order", {
        items,
        totalAmount,
      });

      // Import Razorpay utility
      const { initiateFoodPayment } = await import("../utils/razorpay");

      // Initiate payment
      await initiateFoodPayment(
        orderData,
        user,
        async (paymentResponse) => {
          // Payment successful, verify and create order
          try {
            const { data } = await API.post("/payments/verify-food-payment", paymentResponse);
            setOrders((prev) => [...prev, data.order]);
            alert("Payment successful! Order placed.");
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        (error) => {
          console.error("Payment failed:", error);
          alert(error || "Payment failed. Please try again.");
        }
      );
    } catch (err) {
      console.error("Order Error:", err);
      alert(err.response?.data?.message || err.message || "Error placing order");
    }
  };

  // Subscribe to a Plan
  const subscribe = async (planId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setProcessingPlan(planId);

      const plan = plans.find((p) => p._id === planId);
      if (!plan) throw new Error("Plan not found");

      // Create Razorpay order
      const { data: orderData } = await API.post("/payments/create-plan-order", {
        planId,
        userId: user._id,
      });

      // Import Razorpay utility
      const { initiatePlanPayment } = await import("../utils/razorpay");

      // Initiate payment
      await initiatePlanPayment(
        orderData,
        user,
        async (paymentResponse) => {
          // Payment successful, verify subscription
          try {
            const { data } = await API.post("/payments/verify-plan-payment", {
              ...paymentResponse,
              userId: user._id,
              planId,
            });
            alert(`Successfully subscribed to ${plan.name}!`);
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("Payment verification failed. Please contact support.");
          } finally {
            setProcessingPlan(null);
          }
        },
        (error) => {
          console.error("Payment failed:", error);
          alert(error || "Payment failed. Please try again.");
          setProcessingPlan(null);
        }
      );
    } catch (err) {
      console.error("Subscription error:", err);
      alert(err.response?.data?.message || err.message || "Subscription failed. Try again.");
      setProcessingPlan(null);
    }
  };



  const Card = ({ children }) => <div className="card">{children}</div>;

  const MenuCard = ({ item }) => (
    <Card>
      <img
        src={getImageURL(item.image)}
        alt={item.name}
        className="card-img"
        onError={(e) => (e.target.src = "/default-image.png")}
      />
      <div className="card-content">
        <h5>{item.name}</h5>
        <p>{item.category}</p>
        <p className="price">₹{item.price}</p>
        {user && (
          <button className="btn" onClick={() => placeOrder(item._id)}>
            Order
          </button>
        )}
      </div>
    </Card>
  );

  const PlanCard = ({ plan }) => (
    <Card>
      <img
        src={getImageURL(plan.image)}
        alt={plan.name}
        className="card-img"
        onError={(e) => (e.target.src = "/default-image.png")}
      />
      <div className="card-content">
        <h5>{plan.name}</h5>
        <p className="price">₹{plan.price}</p>
        <p className="duration">{plan.duration} days</p>
        {user ? (
          <button
            onClick={() => subscribe(plan._id)}
            disabled={processingPlan === plan._id}
            className="btn"
          >
            {processingPlan === plan._id ? "Processing..." : "Subscribe"}
          </button>
        ) : (
          <Link to="/login" className="btn">
            Login to Subscribe
          </Link>
        )}
      </div>
    </Card>
  );

  return (
    <div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to AromaOfEmotions</h1>
            <p className="hero-subtitle">
              Experience fresh meals, quick orders, and seamless subscriptions — all in one place.
              Stay energized and enjoy delicious food crafted with care every day!
            </p>
            {!user && (
              <Link to="/login" className="hero-btn">
                Get Started Today
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <div className="container">
        <h1 className="section-title">🍴 Our Menu</h1>
      {error && <p className="error-text">{error}</p>}
      {loading.menu ? (
        <p className="loading-text">Loading menu...</p>
      ) : menu.length ? (
        <div className="grid">
          {menu.map((item) => (
            <MenuCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <p>No menu items available.</p>
      )}

      <h2 className="section-subtitle">💳 Subscription Plans</h2>
      {loading.plans ? (
        <p className="loading-text">Loading plans...</p>
      ) : plans.length ? (
        <div className="grid">
          {plans.map((plan) => (
            <PlanCard key={plan._id} plan={plan} />
          ))}
        </div>
      ) : (
        <p>No subscription plans available.</p>
      )}

      {user && (
        <>
          <h2 className="section-title">🛒 My Orders</h2>
          {loading.orders ? (
            <p className="loading-text">Loading orders...</p>
          ) : orders.length ? (
            <ul className="orders-list">
              {orders.map((order) => (
                <li key={order._id} className="flex flex-col gap-1">
                  <span>
                    <strong>Order ID:</strong> {order._id}
                  </span>
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.name} x {item.quantity} - ₹{item.price * item.quantity}
                    </span>
                  ))}
                  <span>
                    <strong>Status:</strong> {order.status} - <strong>Total:</strong> ₹
                    {order.totalAmount}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders yet.</p>
          )}
        </>
      )}
      </div>
    </div>
  );
}
