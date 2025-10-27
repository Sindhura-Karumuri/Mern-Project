import React from 'react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          About Our Canteen
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
              Our Mission
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              To provide fresh, nutritious, and delicious meals to our campus community while 
              offering convenient meal plans and exceptional service that enhances the student experience.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
              Our Vision
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              To be the premier dining destination on campus, known for quality food, 
              sustainable practices, and innovative technology that makes dining convenient and enjoyable.
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
            Why Choose Us?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Fresh Ingredients</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We source fresh, local ingredients daily to ensure the highest quality meals.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Quick Service</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Fast ordering and preparation to fit your busy schedule between classes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Flexible Plans</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Various meal plans to suit different budgets and dietary preferences.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
            Our Story
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
            <p className="mb-4">
              Founded in 2020, our canteen has been serving the campus community with dedication 
              and passion. What started as a small food service has grown into a comprehensive 
              dining solution that caters to diverse tastes and dietary needs.
            </p>
            <p className="mb-4">
              We believe that good food brings people together and fuels academic success. 
              Our team of experienced chefs and staff work tirelessly to create meals that 
              not only taste great but also provide the nutrition students need to excel.
            </p>
            <p>
              With our modern online ordering system and flexible meal plans, we've made 
              campus dining more convenient than ever. Join thousands of satisfied students 
              who trust us for their daily meals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}