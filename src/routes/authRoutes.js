const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { loginLimiter } = require('../middlewares/rateLimiter');
const { registerUser, loginUser } = require('../controllers/authController');

router.post(
  '/register',
  [
    body('full_name')
      .trim()
      .notEmpty()
      .withMessage('Full name is required'),

    body('email')
      .isEmail()
      .withMessage('Please enter a valid email'),

    body('phone')
      .isLength({ min: 10, max: 10 })
      .withMessage('Phone must be 10 digits'),

    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
  ],
  registerUser
);

router.post('/login', loginLimiter, loginUser);

module.exports = router;