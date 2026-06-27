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

  // Calculate total revenue (completed payments)
  const completedBookings = await Booking.find({ payment_status: 'completed' });
  const totalRevenue = completedBookings.reduce((acc, booking) => acc + booking.total_amount, 0);

  // Simplified monthly revenue
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthlyBookings = await Booking.find({
    payment_status: 'completed',
    created_at: { $gte: startOfMonth },
  });
  const monthlyRevenue = monthlyBookings.reduce((acc, booking) => acc + booking.total_amount, 0);

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
