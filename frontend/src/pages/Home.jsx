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
  const [loading, setLoading] = useState({ menu: true, plans: true });
  const [processingPlan, setProcessingPlan] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, plansRes] = await Promise.all([
          API.get("/menu"),
          API.get("/plans"),
        ]);
        setMenu(menuRes.data || []);
        setPlans(plansRes.data || []);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading({ menu: false, plans: false });
      }
    };
    fetchData();
  }, []);

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

      const options = {
        key: data.key || process.env.REACT_APP_RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        name: "Canteen Subscription",
        description: `Subscribe to ${plan.name}`,
        order_id: data.id,
        prefill: { name: user.name, email: user.email },
        handler: async (response) => {
          try {
            await API.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
              userId: user._id,
            });
            alert("Payment successful! Subscription updated.");
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification failed.");
          } finally {
            setProcessingPlan(null);
          }
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Try again.");
      setProcessingPlan(null);
    }
  };

const getImageURL = (path) =>
  path ? `http://localhost:5000${path.startsWith("/") ? path : "/" + path}` : "/default-image.png";




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
    </div>
  );
}
