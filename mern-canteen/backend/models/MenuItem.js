const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class MenuItem extends Model {}
MenuItem.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.ENUM('Breakfast','Lunch','Snacks'), allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  available: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { sequelize, modelName: 'menuItem', timestamps: true });

module.exports = MenuItem;
