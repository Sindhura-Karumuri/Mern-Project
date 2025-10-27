import React from "react";

export default function PlanCard({ plan, onSubscribe, processing }) {
  return (
    <div className="card">
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
          <button className="btn" onClick={onSubscribe} disabled={processing}>
            {processing ? "Processing..." : "Subscribe"}
          </button>
        )}
      </div>
    </div>
  );
}
