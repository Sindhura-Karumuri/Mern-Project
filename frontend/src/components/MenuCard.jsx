import React from "react";

export default function MenuCard({ item, onOrder }) {
  return (
    <div className="card">
      <img
        src={item.image || "/default-image.png"}
        alt={item.name}
        className="card-img"
        onError={(e) => (e.target.src = "/default-image.png")}
      />
      <div className="card-content">
        <h5>{item.name}</h5>
        <p>{item.category}</p>
        <p className="price">₹{item.price}</p>
        {onOrder && (
          <button className="btn" onClick={onOrder}>
            Order
          </button>
        )}
      </div>
    </div>
  );
}
