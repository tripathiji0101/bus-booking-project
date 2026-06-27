const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await connectDB();
    
    // Check if an admin already exists
    const adminExists = await User.findOne({ role: { $in: ['Admin', 'Super Admin'] } });
    
    if (adminExists) {
      console.log(`Admin user already exists with email: ${adminExists.email}`);
      process.exit(0);
    }
    
    // Create admin user
    const adminUser = await User.create({
      full_name: 'Admin',
      email: 'admin@example.com',
      phone: '0000000000',
      password: 'password123',
      role: 'Admin',
      status: 'active'
    });
    
    console.log(`Admin user created successfully!`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: password123`);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
