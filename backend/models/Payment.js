const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Payment extends Model {}
Payment.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  planId: { type: DataTypes.INTEGER, allowNull: true },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM('Pending','Succeeded','Failed'), defaultValue: 'Pending' },
  provider_payment_id: { type: DataTypes.STRING, allowNull: true },
  metadata: { type: DataTypes.JSON, allowNull: true }
}, { sequelize, modelName: 'payment', timestamps: true });

module.exports = Payment;
