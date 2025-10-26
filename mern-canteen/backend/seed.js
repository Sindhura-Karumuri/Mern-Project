const sequelize = require('./config/db');
const User = require('./models/User');
const Plan = require('./models/Plan');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');
const Payment = require('./models/Payment');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // Drop tables in dependent-first order
    await Order.drop();
    await Payment.drop();
    await User.drop();
    await MenuItem.drop();
    await Plan.drop();

    // Recreate tables
    await sequelize.sync({ force: true });

    const adminPass = await bcrypt.hash('adminpass', 10);
    const userPass = await bcrypt.hash('studentpass', 10);

    // Users
    await User.create({ name: 'Admin User', email: 'admin@site.com', password: adminPass, role: 'admin' });
    await User.create({ name: 'Student User', email: 'student@site.com', password: userPass, role: 'student' });

    // Plans
    await Plan.bulkCreate([
      { name: 'Daily', price: 40, duration_in_days: 1 },
      { name: 'Weekly', price: 250, duration_in_days: 7 },
      { name: 'Monthly', price: 800, duration_in_days: 30 }
    ]);

    // Menu items
    await MenuItem.bulkCreate([
      { name: 'Masala Dosa', category: 'Breakfast', price: 40 },
      { name: 'Paneer Butter Masala with Rice', category: 'Lunch', price: 120 },
      { name: 'Tea & Biscuit', category: 'Snacks', price: 20 }
    ]);

    console.log('Seed completed');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
