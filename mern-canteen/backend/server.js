const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');

const authRoutes = require('./routes/auth');
const plansRoutes = require('./routes/plans');
const menuRoutes = require('./routes/menu');
const ordersRoutes = require('./routes/orders');
const paymentsRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('MERN Canteen Backend - MySQL + Razorpay'));

async function start() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
  }
}

start();
