const { validationResult } = require('express-validator');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => err.msg)
    });
  }

  let {
    full_name,
    email,
    phone,
    password
  } = req.body;

  // Security:
  // Normalize email to lowercase
  email = email.toLowerCase().trim();

  // Security:
  // Enforce minimum password length
  if (password.length < 8) {
    res.status(400);
    throw new Error(
      'Password must be at least 8 characters'
    );
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Security:
  // Prevent duplicate phone numbers
  const phoneExists = await User.findOne({ phone });

  if (phoneExists) {
    res.status(400);
    throw new Error(
      'Phone number already registered'
    );
  }

  const user = await User.create({
    full_name,
    email,
    phone,
    password
  });

  res.status(201).json({
    _id: user._id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });

});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {

  let { email, password } = req.body;

  // Security:
  // Normalize email before searching
  email = email.toLowerCase().trim();

  const user = await User.findOne({ email });

  if (
    user &&
    (await user.matchPassword(password))
  ) {

    // Security:
    // Block suspended/inactive users
    if (user.status !== 'active') {
      res.status(401);
      throw new Error(
        'User account is not active'
      );
    }

    res.json({
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } else {
    res.status(401);
    throw new Error(
      'Invalid email or password'
    );
  }

});

module.exports = {
  registerUser,
  loginUser,
};
