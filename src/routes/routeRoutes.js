const express = require('express');
const router = express.Router();
const {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} = require('../controllers/routeController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .get(getRoutes)
  .post(protect, authorize('Super Admin', 'Admin'), createRoute);

router.route('/:id')
  .get(getRouteById)
  .put(protect, authorize('Super Admin', 'Admin'), updateRoute)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteRoute);

module.exports = router;
