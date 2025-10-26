import React from "react";

export default function PlanCard({ plan, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-full">
      <img
  src={
    plan.image
      ? `http://localhost:5000${plan.image.replace(/\\/g, "/")}`
      : "/default-image.png"
  }
  alt={plan.name}
  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
/>

      <div className="p-4 flex flex-col flex-grow">
        <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {plan.name}
        </h5>
        <p className="text-gray-700 dark:text-gray-200 font-medium mb-1">₹{plan.price}</p>
        <p className="text-gray-500 dark:text-gray-400 mb-3">{plan.duration} days</p>
        <div className="flex space-x-2 mt-auto">{children}</div>
      </div>
    </div>
  );
}
