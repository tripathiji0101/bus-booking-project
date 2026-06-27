const Route = require('../models/Route');
console.log("ROUTE CONTROLLER LOADED");
const Bus = require('../models/Bus');
const Seat = require('../models/Seat');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a route
// @route   POST /api/routes
// @access  Private/Admin
const createRoute = asyncHandler(async (req, res) => {
  const route = await Route.create(req.body);

  const bus = await Bus.findById(route.assigned_bus);

  if (!bus) {
    res.status(404);
    throw new Error('Assigned bus not found');
  }

  const seats = [];

  for (let i = 1; i <= bus.total_seats; i++) {
    seats.push({
      route_id: route._id,
      seat_number: `A${i}`,
      seat_type: bus.bus_type.includes('Sleeper')
        ? 'sleeper'
        : 'seater',
      status: 'available'
    });
  }

  await Seat.insertMany(seats);
  console.log("Bus found:", bus.bus_number);
console.log("Total seats:", bus.total_seats);
console.log("Seats prepared:", seats.length);

await Seat.insertMany(seats);

console.log("Seats inserted successfully");

  res.status(201).json(route);
});
// @desc    Get all routes
// @route   GET /api/routes
// @access  Public
const getRoutes = asyncHandler(async (req, res) => {
  const { source, destination, date } = req.query;
  const filter = {};

  if (source) filter.source = new RegExp(source, 'i');
  if (destination) filter.destination = new RegExp(destination, 'i');
  if (date) {
    const searchDate = new Date(date);
    filter.departure_time = {
      $gte: new Date(searchDate.setHours(0, 0, 0)),
      $lt: new Date(searchDate.setHours(23, 59, 59))
    };
  }

  const routes = await Route.find(filter).populate('assigned_bus', 'bus_number bus_type total_seats amenities');
  res.json(routes);
});

// @desc    Get route by ID
// @route   GET /api/routes/:id
// @access  Public
const getRouteById = asyncHandler(async (req, res) => {
  const route = await Route.findById(req.params.id).populate('assigned_bus');
  if (route) {
    res.json(route);
  } else {
    res.status(404);
    throw new Error('Route not found');
  }
});

// @desc    Update a route
// @route   PUT /api/routes/:id
// @access  Private/Admin
const updateRoute = asyncHandler(async (req, res) => {
  const route = await Route.findById(req.params.id);

  if (route) {
    Object.assign(route, req.body);
    const updatedRoute = await route.save();
    res.json(updatedRoute);
  } else {
    res.status(404);
    throw new Error('Route not found');
  }
});

// @desc    Delete a route
// @route   DELETE /api/routes/:id
// @access  Private/Admin
const deleteRoute = asyncHandler(async (req, res) => {
  const route = await Route.findById(req.params.id);

  if (route) {
    await route.deleteOne();
    res.json({ message: 'Route removed' });
  } else {
    res.status(404);
    throw new Error('Route not found');
  }
});

module.exports = {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
};
