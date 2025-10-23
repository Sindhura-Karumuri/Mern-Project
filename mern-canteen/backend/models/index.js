const sequelize = require('../config/db');
const User = require('./User');
const Plan = require('./Plan');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const Payment = require('./Payment');

// associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Plan.hasMany(Payment, { foreignKey: 'planId' });
Payment.belongsTo(Plan, { foreignKey: 'planId' });

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

Plan.hasMany(User, { foreignKey: 'planId' });
User.belongsTo(Plan, { foreignKey: 'planId' });

MenuItem.hasMany(Order, { foreignKey: 'menuItemId' });
Order.belongsTo(MenuItem, { foreignKey: 'menuItemId' });

module.exports = {
  sequelize,
  User,
  Plan,
  MenuItem,
  Order,
  Payment
};
