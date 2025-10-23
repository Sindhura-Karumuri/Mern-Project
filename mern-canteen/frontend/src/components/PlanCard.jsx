import React from 'react';

export default function PlanCard({ plan, onSubscribe, children, processing }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-full">
      {plan.image && (
        <img
          src={plan.image}
          alt={plan.name}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
      )}
      <div className="p-4 flex flex-col flex-grow">
        <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {onSubscribe ? (
            <button
              disabled={processing}
              onClick={() => !processing && onSubscribe(plan.id)}
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 transition"
            >
              {plan.name} {processing ? '(Processing...)' : ''}
            </button>
          ) : (
            plan.name
          )}
        </h5>
        <p className="text-gray-700 dark:text-gray-200 font-medium">₹{plan.price}</p>
        <p className="text-gray-500 dark:text-gray-400">{plan.duration_in_days} days</p>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
