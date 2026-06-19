import React, { useEffect, useState, useContext } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import toast from "react-hot-toast";
import "./Home.css";

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-img" />
    <div className="skeleton-body">
      <div className="skeleton-line short" />
      <div className="skeleton-line medium" />
      <div className="skeleton-line short" />
      <div className="skeleton-line btn-line" />
    </div>
  </div>
);

const SkeletonGrid = ({ count = 3 }) => (
  <div className="grid">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

const EmptyState = ({ icon, message }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <p>{message}</p>
  </div>
);

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [plans, setPlans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState({ menu: true, plans: true, orders: true });
  const [processingPlan, setProcessingPlan] = useState(null);
  const [orderedItems, setOrderedItems] = useState(new Set());
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
    if (!path) return "/default-image.png";
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    if (path.startsWith("http")) return path;
    return `${baseURL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const placeOrder = async (menuItemId) => {
    if (!user) { navigate("/login"); return; }
    try {
      const menuItem = menu.find((m) => m._id === menuItemId);
      if (!menuItem) throw new Error("Menu item not found");
      const items = [{ name: menuItem.name, quantity: 1, price: menuItem.price }];
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const { data: orderData } = await API.post("/payments/create-food-order", { items, totalAmount });
      const { initiateFoodPayment } = await import("../utils/razorpay");
      await initiateFoodPayment(
        orderData, user,
        async (paymentResponse) => {
          try {
            const { data } = await API.post("/payments/verify-food-payment", paymentResponse);
            setOrders((prev) => [...prev, data.order]);
            setOrderedItems((prev) => new Set([...prev, menuItemId]));
            toast.success("🎉 Payment successful! Order placed.");
          } catch (err) {
            console.error("Payment verification error:", err);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        (err) => {
          console.error("Payment failed:", err);
          toast.error(err || "Payment failed. Please try again.");
        }
      );
    } catch (err) {
      console.error("Order Error:", err);
      toast.error(err.response?.data?.message || err.message || "Error placing order");
    }
  };

  const subscribe = async (planId) => {
    if (!user) { navigate("/login"); return; }
    try {
      setProcessingPlan(planId);
      const plan = plans.find((p) => p._id === planId);
      if (!plan) throw new Error("Plan not found");
      const { data: orderData } = await API.post("/payments/create-plan-order", { planId, userId: user._id });
      const { initiatePlanPayment } = await import("../utils/razorpay");
      await initiatePlanPayment(
        orderData, user,
        async (paymentResponse) => {
          try {
            await API.post("/payments/verify-plan-payment", { ...paymentResponse, userId: user._id, planId });
            toast.success(`🎉 Successfully subscribed to ${plan.name}!`);
          } catch (err) {
            console.error("Payment verification error:", err);
            toast.error("Payment verification failed. Please contact support.");
          } finally {
            setProcessingPlan(null);
          }
        },
        (err) => {
          console.error("Payment failed:", err);
          toast.error(err || "Payment failed. Please try again.");
          setProcessingPlan(null);
        }
      );
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error(err.response?.data?.message || err.message || "Subscription failed. Try again.");
      setProcessingPlan(null);
    }
  };

  const Card = ({ children }) => <div className="card">{children}</div>;

  const MenuCard = ({ item }) => (
    <Card>
      <div className="card-img-wrap">
        <img
          src={getImageURL(item.image)}
          alt={item.name}
          onError={(e) => (e.target.src = "/default-image.png")}
        />
        {orderedItems.has(item._id) && (
          <div className="ordered-overlay">
            <span className="ordered-badge">✓ Ordered</span>
          </div>
        )}
      </div>
      <div className="card-content">
        <div>
          <span className="category-badge">{item.category}</span>
          <h5 style={{ marginTop: "0.35rem" }}>{item.name}</h5>
        </div>
        <p className="price">₹{item.price}</p>
        {user && (
          <button
            className={`btn${orderedItems.has(item._id) ? " btn-reorder" : ""}`}
            onClick={() => placeOrder(item._id)}
          >
            {orderedItems.has(item._id) ? "Order Again" : "Order"}
          </button>
        )}
      </div>
    </Card>
  );

  const PlanCard = ({ plan }) => (
    <Card>
      <div className="card-img-wrap">
        <img
          src={getImageURL(plan.image)}
          alt={plan.name}
          onError={(e) => (e.target.src = "/default-image.png")}
        />
      </div>
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
          <Link to="/login" className="btn" style={{ display: "block", textDecoration: "none" }}>
            Login to Subscribe
          </Link>
        )}
      </div>
    </Card>
  );

  return (
    <div className="home-page">
      <div className="hero-banner">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to AromaOfEmotions</h1>
            <p className="hero-subtitle">
              Experience fresh meals, quick orders, and seamless subscriptions — all in one place.
              Stay energized and enjoy delicious food crafted with care every day!
            </p>
            {!user && (
              <Link to="/login" className="hero-btn">Get Started Today</Link>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <h1 className="section-title">Our Menu</h1>
        {error && <p className="error-text">{error}</p>}
        {loading.menu ? (
          <SkeletonGrid count={4} />
        ) : menu.length ? (
          <div className="grid">
            {menu.map((item) => <MenuCard key={item._id} item={item} />)}
          </div>
        ) : (
          <EmptyState icon="🍽️" message="No menu items available right now." />
        )}

        <h2 className="section-subtitle">Subscription Plans</h2>
        {loading.plans ? (
          <SkeletonGrid count={3} />
        ) : plans.length ? (
          <div className="grid">
            {plans.map((plan) => <PlanCard key={plan._id} plan={plan} />)}
          </div>
        ) : (
          <EmptyState icon="📋" message="No subscription plans available right now." />
        )}

        {user && (
          <>
            <h2 className="section-title">My Orders</h2>
            {loading.orders ? (
              <SkeletonGrid count={2} />
            ) : orders.length ? (
              <ul className="orders-list">
                {orders.map((order) => (
                  <li key={order._id}>
                    <div className="order-meta">
                      <span className="order-id">#{order._id}</span>
                      <div className="order-items">
                        {order.items.map((item, idx) => (
                          <span key={idx}>{item.name} × {item.quantity}{idx < order.items.length - 1 ? ", " : ""}</span>
                        ))}
                      </div>
                    </div>
                    <span className="order-total">₹{order.totalAmount}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon="🧾" message="You haven't placed any orders yet." />
            )}
          </>
        )}
      </div>
    </div>
  );
}
