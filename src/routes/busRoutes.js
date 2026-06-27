const express = require('express');
const router = express.Router();
const {
  createBus,
  getBuses,
  getBusById,
  updateBus,
  deleteBus,
} = require('../controllers/busController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .get(getBuses)
  .post(protect, authorize('Super Admin', 'Admin'), createBus);

router.route('/:id')
  .get(getBusById)
  .put(protect, authorize('Super Admin', 'Admin'), updateBus)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteBus);

module.exports = router;
