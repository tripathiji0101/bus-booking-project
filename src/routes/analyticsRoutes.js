const express = require('express');
const router = express.Router();
const { getDashboardAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/dashboard', protect, authorize('Super Admin', 'Admin'), getDashboardAnalytics);

module.exports = router;
