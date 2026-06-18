const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/revorafit');

    const email = 'sharmaprince2287@gmail.com';
    const password = 'Prince@76';

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating password and role just in case...');
      existingAdmin.password = password;
      existingAdmin.role = 'admin';
      existingAdmin.authProvider = 'credentials';
      await existingAdmin.save();
      console.log('Admin user updated successfully.');
    } else {
      console.log('Creating new admin user...');
      const adminUser = new User({
        name: 'Admin',
        email,
        password,
        role: 'admin',
        authProvider: 'credentials',
        emailVerified: true
      });
      await adminUser.save();
      console.log('Admin user created successfully.');
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
