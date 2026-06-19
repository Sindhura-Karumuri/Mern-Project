import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import AdminDashboard from "./AdminDashboard";
import MenuCard from "../components/MenuCard";
import PlanCard from "../components/PlanCard";
import API from "../api";
import toast from "react-hot-toast";
import "./Dashboard.css";

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
  <div className="skeleton-grid">
    {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

const EmptyState = ({ icon, message }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <p>{message}</p>
  </div>
);

const statusClass = (status = "") => {
  const s = status.toLowerCase();
  if (s === "pending") return "status-badge status-pending";
  if (s === "confirmed") return "status-badge status-confirmed";
  if (s === "delivered") return "status-badge status-delivered";
  if (s === "cancelled") return "status-badge status-cancelled";
  return "status-badge status-default";
};

function StudentDashboard({ user, logout }) {
  const [menu, setMenu] = useState([]);
  const [plans, setPlans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState({ menu: true, plans: true, orders: true });
  const [processingPlan, setProcessingPlan] = useState(null);
  const [subscribedPlanId, setSubscribedPlanId] = useState(null);
  const [orderedItems, setOrderedItems] = useState(new Set());
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
        // Set active subscription from user object
        if (user.subscription) {
          const subId = user.subscription?._id || user.subscription;
          setSubscribedPlanId(subId?.toString());
        }
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
    if (!user) return toast.error("Please login first.");

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
            setOrderedItems((prev) => new Set([...prev, menuItemId]));
            toast.success("🎉 Payment successful! Order placed.");
          } catch (err) {
            console.error("Payment verification error:", err);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        (error) => {
          console.error("Payment failed:", error);
          toast.error(error || "Payment failed. Please try again.");
        }
      );
    } catch (err) {
      console.error("Order Error:", err);
      toast.error(err.response?.data?.message || err.message || "Error placing order");
    }
  };


// Subscribe to a plan
const subscribe = async (planId) => {
  if (!user || !user._id) {
    return toast.error("Please login to subscribe.");
  }

  try {
    setProcessingPlan(planId);

    const plan = plans.find((p) => p._id === planId);
    if (!plan) throw new Error("Plan not found");

    // Create Razorpay order
    const { data: orderData } = await API.post("/payments/create-plan-order", { planId: plan._id });

    const { initiatePlanPayment } = await import("../utils/razorpay");

    await initiatePlanPayment(
      orderData,
      user,
      async (paymentResponse) => {
        try {
          const { data } = await API.post("/payments/verify-plan-payment", {
            ...paymentResponse,
            planId: plan._id,
          });
          setSubscribedPlanId(planId?.toString());
          toast.success(`🎉 Successfully subscribed to ${plan.name}!`);
        } catch (err) {
          console.error("Payment verification error:", err);
          toast.error("Payment verification failed. Please contact support.");
        } finally {
          setProcessingPlan(null);
        }
      },
      (error) => {
        console.error("Payment failed:", error);
        toast.error(error || "Payment failed. Please try again.");
        setProcessingPlan(null);
      }
    );
  } catch (err) {
    console.error("Subscription error:", err);
    toast.error(err.response?.data?.message || err.message || "Subscription failed. Try again.");
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
        <SkeletonGrid count={4} />
      ) : menu.length === 0 ? (
        <EmptyState icon="🍽️" message="No menu items available right now." />
      ) : (
        <div className="grid">
          {menu.map((item) => (
            <MenuCard key={item._id} item={item} onOrder={() => placeOrder(item._id)} ordered={orderedItems.has(item._id)} />
          ))}
        </div>
      )}

      {/* Plans Section */}
      <h2 className="section-title">Meal Plans</h2>
      {loading.plans ? (
        <SkeletonGrid count={3} />
      ) : plans.length === 0 ? (
        <EmptyState icon="📋" message="No meal plans available right now." />
      ) : (
        <div className="grid">
          {plans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              onSubscribe={() => subscribe(plan._id)}
              processing={processingPlan === plan._id}
              subscribed={subscribedPlanId === plan._id?.toString()}
            />
          ))}
        </div>
      )}

      {/* Orders Section */}
      <h2 className="section-title" id="my-orders">My Orders</h2>
      {loading.orders ? (
        <SkeletonGrid count={2} />
      ) : orders.length === 0 ? (
        <EmptyState icon="🧾" message="You haven't placed any orders yet." />
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order._id}>
              <div className="order-meta">
                <span className="order-id">#{order._id}</span>
                <div className="order-items">
                  {order.items.map((i, idx) => (
                    <span key={idx}>{i.name} × {i.quantity}{idx < order.items.length - 1 ? ", " : ""}</span>
                  ))}
                </div>
                <span className={statusClass(order.status)}>{order.status}</span>
              </div>
              <span className="order-total">₹{order.totalAmount}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  if (user === null) return (
    <div className="empty-state" style={{ minHeight: "100vh" }}>
      <div className="empty-state-icon">⏳</div>
      <p>Loading your dashboard...</p>
    </div>
  );

  return user.role?.toLowerCase() === "admin" ? (
    <AdminDashboard />
  ) : (
    <StudentDashboard user={user} logout={logout} />
  );
}
