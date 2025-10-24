const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Order extends Model {}
Order.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  menuItemId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM('Pending','Completed','Cancelled'), defaultValue: 'Pending' }
}, { sequelize, modelName: 'order', timestamps: true });

module.exports = Order;
