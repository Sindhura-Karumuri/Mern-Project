import React from 'react';

export default function MenuCard({ item, onOrder, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-full">
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
      )}
      <div className="p-4 flex flex-col flex-grow">
        <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.name}</h5>
        {item.category && <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{item.category}</p>}
        <p className="text-gray-700 dark:text-gray-200 font-medium mb-3">₹{item.price}</p>
        {onOrder && (
          <button
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded transition"
            onClick={() => onOrder(item.id)}
          >
            Order
          </button>
        )}
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
