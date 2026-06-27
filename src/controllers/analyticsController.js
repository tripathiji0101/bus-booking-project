const Booking = require('../models/Booking');
const Route = require('../models/Route');
const Bus = require('../models/Bus');
const Driver = require('../models/Driver');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const activeRoutes = await Route.countDocuments();
  const activeBuses = await Bus.countDocuments({ status: 'active' });
  const activeDrivers = await Driver.countDocuments({ status: 'active' });

// Performance:
// Calculate total revenue directly in MongoDB

const revenueResult = await Booking.aggregate([
  {
    $match: {
      payment_status: 'completed'
    }
  },
  {
    $group: {
      _id: null,
      totalRevenue: {
        $sum: '$total_amount'
      }
    }
  }
]);

const totalRevenue =
  revenueResult[0]?.totalRevenue || 0;

  // Simplified monthly revenue
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

// Performance:
// Calculate monthly revenue inside MongoDB

const monthlyRevenueResult =
await Booking.aggregate([
  {
    $match: {
      payment_status: 'completed',
      created_at: {
        $gte: startOfMonth
      }
    }
  },
  {
    $group: {
      _id: null,
      monthlyRevenue: {
        $sum: '$total_amount'
      }
    }
  }
]);

const monthlyRevenue =
monthlyRevenueResult[0]?.monthlyRevenue || 0;
  res.json({
    totalRevenue,
    monthlyRevenue,
    totalBookings,
    activeRoutes,
    activeBuses,
    activeDrivers,
  });
});

module.exports = {
  getDashboardAnalytics,
};
