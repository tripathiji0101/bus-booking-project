const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

  // Security:
  // Prevent empty or invalid user names
  full_name: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },

  // Security:
  // Validate email format
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\S+@\S+\.\S+$/,
      'Please enter a valid email address'
    ],
  },

  // Security:
  // Validate Indian mobile number
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [
      /^[6-9]\d{9}$/,
      'Please enter a valid 10-digit mobile number'
    ],
  },

  // Security:
  // Enforce minimum password length
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters'],
  },

  role: {
    type: String,
    enum: ['Super Admin', 'Admin', 'Passenger'],
    default: 'Passenger',
  },

  profile_image: {
    type: String,
    default: '',
  },

  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  }

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Performance:
// Create indexes for faster database queries
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

// Security:
// Prevent re-hashing password when password
// has not been modified.
userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );

});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(
    enteredPassword,
    this.password
  );
};

const User = mongoose.model('User', userSchema);

module.exports = User;