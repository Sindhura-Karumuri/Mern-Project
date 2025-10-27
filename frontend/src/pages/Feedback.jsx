import React, { useState } from 'react';

export default function Feedback() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    rating: 5,
    category: 'food',
    feedback: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the feedback to your backend
    console.log('Feedback submitted:', form);
    setSubmitted(true);
    setForm({ name: '', email: '', rating: 5, category: 'food', feedback: '' });
  };

  const StarRating = ({ rating, onRatingChange }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`text-2xl transition-colors duration-200 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            }`}
          >
            ⭐
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Share Your Feedback
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Feedback Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              We Value Your Opinion
            </h2>
            
            {submitted && (
              <div className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 p-4 rounded-lg mb-6">
                Thank you for your feedback! We appreciate your input and will use it to improve our services.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Overall Rating *
                </label>
                <StarRating 
                  rating={form.rating} 
                  onRatingChange={(rating) => setForm({ ...form, rating })}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {form.rating} out of 5 stars
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="food">Food Quality</option>
                  <option value="service">Service</option>
                  <option value="website">Website/App</option>
                  <option value="pricing">Pricing</option>
                  <option value="cleanliness">Cleanliness</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Feedback *
                </label>
                <textarea
                  name="feedback"
                  value={form.feedback}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Please share your thoughts, suggestions, or any issues you've experienced..."
                  className="form-input"
                ></textarea>
              </div>
              
              <button type="submit" className="btn-primary w-full">
                Submit Feedback
              </button>
            </form>
          </div>
          
          {/* Feedback Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Why Your Feedback Matters
            </h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <div className="text-3xl mb-3">💡</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Continuous Improvement
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Your feedback helps us identify areas for improvement and implement changes that matter to you.
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <div className="text-3xl mb-3">🍽️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Better Food Experience
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We use your input to enhance our menu, improve food quality, and introduce new dishes you'll love.
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Enhanced Service
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Your suggestions help us streamline our processes and provide faster, more efficient service.
                </p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Community Building
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We value our community and your feedback helps us create a dining experience that brings people together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}