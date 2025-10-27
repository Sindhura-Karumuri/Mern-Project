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

      const { data } = await API.post("/orders", {
        items,
        totalAmount,
        paymentStatus: "pending",
      });

      setOrders((prev) => [...prev, data]);
      alert("Order placed successfully!");
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

      const { data } = await API.post("/payments/create-order", {
        planId,
        userId: user._id,
      });

      if (data.success) {
        alert(`Successfully subscribed to ${plan.name}!`);
      } else {
        throw new Error(data.message || "Subscription failed");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      alert(err.response?.data?.message || err.message || "Subscription failed. Try again.");
    } finally {
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
    <div className="container">
      <h1 className="section-title">🍴 Canteen Menu</h1>
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
  );
}
