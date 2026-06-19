import React from "react";

export default function MenuCard({ item, onOrder, ordered }) {
  return (
    <div className={`card${ordered ? " card-ordered" : ""}`}>
      <div className="card-img-wrap">
        <img
          src={item.image || "/default-image.png"}
          alt={item.name}
          onError={(e) => (e.target.src = "/default-image.png")}
        />
        {ordered && (
          <div className="ordered-overlay">
            <span className="ordered-badge">✓ Ordered</span>
          </div>
        )}
      </div>
      <div className="card-content">
        <div>
          <span className="category-badge">{item.category}</span>
          <h5 style={{ marginTop: "0.4rem" }}>{item.name}</h5>
        </div>
        <p className="price">₹{item.price}</p>
        {onOrder && (
          <button
            className={`btn order-btn${ordered ? " btn-reorder" : ""}`}
            onClick={onOrder}
          >
            {ordered ? "Order Again" : "Order"}
          </button>
        )}
      </div>
    </div>
  );
}
