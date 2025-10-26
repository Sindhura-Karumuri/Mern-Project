const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class User extends Model {}
User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('student','admin'), defaultValue: 'student' },
  planId: { type: DataTypes.INTEGER, allowNull: true },
  planExpiresAt: { type: DataTypes.DATE, allowNull: true }
}, { sequelize, modelName: 'user', timestamps: true });

module.exports = User;
