const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const User = require('./models/User');

const seedAdmin = async () => {
  try {
    const email = 'sharmaprince2287@gmail.com';
    const existingAdmin = await User.findOne({ email });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email,
        password: 'Prince@76',
        role: 'admin',
        authProvider: 'credentials',
        emailVerified: true
      });
      console.log('Production Admin account created');
    } else {
      console.log('Production Admin account already exists');
    }
  } catch (err) {
    console.error('Failed to seed admin:', err);
  }
};

seedAdmin();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  if(server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

module.exports = app;
