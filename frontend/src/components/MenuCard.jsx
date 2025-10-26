import React from "react";

export default function MenuCard({ item, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-full">
      <img
  src={
    item.image
      ? `http://localhost:5000${item.image.replace(/\\/g, "/")}`
      : "/default-image.png"
  }
  alt={item.name}
  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
/>

      <div className="p-4 flex flex-col flex-grow">
        <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.name}</h5>
        {item.category && <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{item.category}</p>}
        <p className="text-gray-700 dark:text-gray-200 font-medium mb-3">₹{item.price}</p>
        <div className="flex space-x-2 mt-auto">{children}</div>
      </div>
    </div>
  );
}
