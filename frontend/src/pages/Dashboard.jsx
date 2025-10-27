import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import AdminDashboard from "./AdminDashboard";
import MenuCard from "../components/MenuCard";
import PlanCard from "../components/PlanCard";
import API from "../api";
import "./Dashboard.css";

const Loading = ({ message = "Loading..." }) => (
  <p className="loading-text">{message}</p>
);

function StudentDashboard({ user, logout }) {
  const [menu, setMenu] = useState([]);
  const [plans, setPlans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState({ menu: true, plans: true, orders: true });
  const [processingPlan, setProcessingPlan] = useState(null);
  const [error, setError] = useState("");

  // Fetch menu, plans, and orders
  useEffect(() => {
    if (!user) return; // Wait for user to load

    const fetchData = async () => {
      setError("");
      setLoading({ menu: true, plans: true, orders: true });
      try {
        const [menuRes, plansRes, ordersRes] = await Promise.all([
          API.get("/menu"),
          API.get("/plans"),
          API.get("/orders/my"),
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

  // Place an order
  const placeOrder = async (menuItemId) => {
    if (!user) return alert("User not logged in. Please login first.");

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


// Subscribe to a plan
const subscribe = async (planId) => {
  if (!user || !user._id) {
    return alert("User not logged in. Please login to subscribe.");
  }

  try {
    setProcessingPlan(planId);

    // Find the plan object
    const plan = plans.find((p) => p._id === planId);
    if (!plan) throw new Error("Plan not found");

    // Make request to backend to subscribe
    const { data } = await API.post("/payments/create-order", {
      planId: plan._id,
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


  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>
            {user.name} ({user.role})
          </span>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              logout();
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {/* Menu Section */}
      <h2 className="section-title">Menu</h2>
      {loading.menu ? (
        <Loading />
      ) : menu.length === 0 ? (
        <p>No menu items available.</p>
      ) : (
        <div className="grid">
          {menu.map((item) => (
            <MenuCard key={item._id} item={item} onOrder={() => placeOrder(item._id)} />
          ))}
        </div>
      )}

      {/* Plans Section */}
      <h2 className="section-title">Plans</h2>
      {loading.plans ? (
        <Loading />
      ) : plans.length === 0 ? (
        <p>No plans available.</p>
      ) : (
        <div className="grid">
          {plans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              onSubscribe={() => subscribe(plan._id)}
              processing={processingPlan === plan._id}
            />
          ))}
        </div>
      )}

      {/* Orders Section */}
      <h2 className="section-title">My Orders</h2>
      {loading.orders ? (
        <Loading />
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order._id}>
              <strong>Order ID:</strong> {order._id}
              <br />
              {order.items.map((i, idx) => (
                <span key={idx}>
                  {i.name} x {i.quantity} - ₹{i.price * i.quantity}
                  <br />
                </span>
              ))}
              <strong>Status:</strong> {order.status} - <strong>Total:</strong> ₹{order.totalAmount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  if (user === null) return <p className="loading-text">Loading user...</p>;

  return user.role?.toLowerCase() === "admin" ? (
    <AdminDashboard />
  ) : (
    <StudentDashboard user={user} logout={logout} />
  );
}
