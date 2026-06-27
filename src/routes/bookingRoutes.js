const express = require('express');
const router = express.Router();
const {
  getAvailability,
  reserveSeat,
  confirmBooking,
  cancelBooking,
  completeBooking,
  getAllBookings,
  getMyBookings,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', protect, authorize('Super Admin', 'Admin'), getAllBookings);
router.get('/mybookings', protect, getMyBookings);
router.get('/availability/:routeId', getAvailability);
router.post('/reserve', protect, reserveSeat);
router.post('/confirm/:id', protect, confirmBooking);
router.post('/complete/:id', protect, authorize('Super Admin', 'Admin'), completeBooking);
router.post('/cancel/:id', protect, cancelBooking);

module.exports = router;
