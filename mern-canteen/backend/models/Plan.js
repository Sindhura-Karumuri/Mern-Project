const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Plan extends Model {}
Plan.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  duration_in_days: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, modelName: 'plan', timestamps: true });

module.exports = Plan;
