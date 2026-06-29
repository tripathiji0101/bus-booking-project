const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile_image: user.profile_image,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
// Security:
// Update only allowed profile fields
    user.full_name =
      req.body.full_name ?? user.full_name;

    user.phone =
      req.body.phone ?? user.phone;

    user.profile_image =
      req.body.profile_image ?? user.profile_image;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      full_name: updatedUser.full_name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      profile_image: updatedUser.profile_image,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {

  const {
    currentPassword,
    newPassword
  } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Security:
  // Verify current password
  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  // Security:
  // Enforce minimum password length
  if (newPassword.length < 8) {
    res.status(400);
    throw new Error(
      'Password must be at least 8 characters'
    );
  }

  // Security:
  // Prevent reusing the current password
  const samePassword = await user.matchPassword(newPassword);

  if (samePassword) {
    res.status(400);
    throw new Error(
      'New password cannot be the same as the current password'
    );
  }

  // Update password
  user.password = newPassword;

  await user.save();

  res.json({
    message: 'Password changed successfully'
  });

});

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
};
