const User = require('../models/User');

const createSuperAdmin = async () => {
  try {

    // Check if a Super Admin already exists
    const superAdminExists = await User.findOne({
      role: 'Super Admin'
    });

    if (superAdminExists) {
      console.log('✓ Super Admin already exists');
      return;
    }

    // Check if all required environment variables exist
    if (
      !process.env.SUPER_ADMIN_NAME ||
      !process.env.SUPER_ADMIN_EMAIL ||
      !process.env.SUPER_ADMIN_PHONE ||
      !process.env.SUPER_ADMIN_PASSWORD
    ) {
      console.log(
        '⚠ Super Admin environment variables are missing'
      );
      return;
    }

    // Create Super Admin
    await User.create({
      full_name: process.env.SUPER_ADMIN_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      phone: process.env.SUPER_ADMIN_PHONE,
      password: process.env.SUPER_ADMIN_PASSWORD,
      role: 'Super Admin',
      status: 'active'
    });

    console.log('✓ Super Admin created successfully');

  } catch (error) {

    console.error(
      'Failed to create Super Admin:',
      error.message
    );

  }
};

module.exports = createSuperAdmin;