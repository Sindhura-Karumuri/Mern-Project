import React, { useState } from 'react';

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "You can place an order by logging into your account, browsing our menu, and clicking the 'Order' button on any item. You can also subscribe to meal plans for regular meals."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and digital payments through Razorpay. You can also use your meal plan credits if you have an active subscription."
    },
    {
      question: "How do meal plans work?",
      answer: "Meal plans are subscription-based services that give you access to meals for a specific duration. You can choose from various plans based on your needs and budget. Once subscribed, you can order meals using your plan credits."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "Orders can be cancelled or modified within 15 minutes of placing them. After that, the kitchen begins preparation and changes may not be possible. Contact us immediately if you need to make changes."
    },
    {
      question: "What are your operating hours?",
      answer: "We're open Monday-Friday from 7:00 AM to 8:00 PM, Saturday from 8:00 AM to 6:00 PM, and Sunday from 9:00 AM to 5:00 PM. Online ordering is available 24/7 for next-day delivery."
    },
    {
      question: "Do you accommodate dietary restrictions?",
      answer: "Yes! We offer vegetarian, vegan, gluten-free, and other dietary options. Each menu item is clearly labeled with dietary information. If you have specific allergies, please contact us directly."
    },
    {
      question: "How long does food preparation take?",
      answer: "Most orders are ready within 10-15 minutes during regular hours. During peak times (lunch and dinner), it may take up to 20-25 minutes. You'll receive a notification when your order is ready."
    },
    {
      question: "Can I get a refund for my meal plan?",
      answer: "Meal plan refunds are available within 7 days of purchase if no meals have been consumed. After that, refunds are prorated based on unused meals. Contact our support team for assistance."
    },
    {
      question: "Is there a mobile app?",
      answer: "Currently, we operate through our web platform which is mobile-friendly. A dedicated mobile app is in development and will be available soon with additional features."
    },
    {
      question: "How do I report an issue with my order?",
      answer: "If you have any issues with your order, please contact us immediately through the contact form or call our support line. We'll resolve the issue promptly and ensure your satisfaction."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h1>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                <span className="text-2xl text-blue-600 dark:text-blue-400 transform transition-transform duration-200">
                  {openItems[index] ? '−' : '+'}
                </span>
              </button>
              
              {openItems[index] && (
                <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Still have questions?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a href="/contact" className="btn-primary inline-block">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}