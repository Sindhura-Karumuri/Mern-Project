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
      const { data } = await API.post("/payments/create-order", { planId });
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Canteen Subscription",
        description: "Plan purchase",
        order_id: data.order.id,
        prefill: { name: user.name, email: user.email },
        handler: async (response) => {
          try {
            await API.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: data.paymentId,
            });
            alert("Payment successful! Subscription updated.");
          } catch (err) {
            console.error(err);
            alert("Payment verification failed.");
          } finally {
            setProcessingPlan(null);
          }
        },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
      setProcessingPlan(null);
    }
  };

  const Card = ({ children }) => <div className="card">{children}</div>;

  const MenuCard = ({ item }) => (
    <Card>
      {item.image && <img src={item.image} alt={item.name} />}
      <div className="card-content">
        <h5>
          <Link to={`/menu/${item.id}`}>{item.name}</Link>
        </h5>
        <p>{item.category}</p>
        <p className="price">₹{item.price}</p>
      </div>
    </Card>
  );

  const PlanCard = ({ plan }) => (
    <Card>
      {plan.image && <img src={plan.image} alt={plan.name} />}
      <div className="card-content">
        <h5>{plan.name}</h5>
        <p className="price">₹{plan.price}</p>
        <p className="duration">{plan.duration_in_days} days</p>

        {user ? (
          <button
            onClick={() => subscribe(plan.id)}
            disabled={processingPlan === plan.id}
            className="btn"
          >
            {processingPlan === plan.id ? "Processing..." : "Subscribe"}
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
      ) : (
        <div className="grid">
          {menu.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <h2 className="section-subtitle">💳 Subscription Plans</h2>
      {loading.plans ? (
        <p className="loading-text">Loading plans...</p>
      ) : (
        <div className="grid">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
