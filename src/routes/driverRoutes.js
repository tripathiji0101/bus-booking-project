const express = require('express');
const router = express.Router();
const {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} = require('../controllers/driverController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .get(protect, authorize('Super Admin', 'Admin'), getDrivers)
  .post(protect, authorize('Super Admin', 'Admin'), createDriver);

router.route('/:id')
  .get(protect, authorize('Super Admin', 'Admin'), getDriverById)
  .put(protect, authorize('Super Admin', 'Admin'), updateDriver)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteDriver);

module.exports = router;
