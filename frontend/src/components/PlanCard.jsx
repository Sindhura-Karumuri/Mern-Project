import React from "react";

export default function PlanCard({ plan, onSubscribe, processing, subscribed }) {
  return (
    <div className={`card${subscribed ? " card-subscribed" : ""}`}>
      <img
        src={plan.image || "/default-image.png"}
        alt={plan.name}
        className="card-img"
        onError={(e) => (e.target.src = "/default-image.png")}
      />
      <div className="card-content">
        <h5>{plan.name}</h5>
        <p className="price">₹{plan.price}</p>
        <p className="duration">{plan.duration_in_days || plan.duration} days</p>
        {onSubscribe && (
          <button
            className={`btn plan-btn${subscribed ? " btn-subscribed" : ""}`}
            onClick={onSubscribe}
            disabled={processing || subscribed}
          >
            {processing ? "Processing..." : subscribed ? "✅ Subscribed" : "Subscribe"}
          </button>
        )}
      </div>
    </div>
  );
}
