const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({

  // Security:
  // Prevent empty or invalid source names
  source: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Source must be at least 2 characters'],
    maxlength: [100, 'Source cannot exceed 100 characters'],
  },

  // Security:
  // Prevent empty or invalid destination names
  destination: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Destination must be at least 2 characters'],
    maxlength: [100, 'Destination cannot exceed 100 characters'],
  },

  departure_time: {
    type: Date,
    required: true,
  },

  arrival_time: {
    type: Date,
    required: true,
  },

  // Security:
  // Prevent invalid route distance
  distance: {
    type: Number,
    required: true,
    min: [1, 'Distance must be greater than 0'],
  },

  // Example: 5h 30m
  duration: {
    type: String,
    required: true,
    trim: true,
    maxlength: [20, 'Duration is too long'],
  },

  // Security:
  // Prevent negative ticket price
  base_price: {
    type: Number,
    required: true,
    min: [0, 'Base price cannot be negative'],
  },

  assigned_bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  }

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Security:
// A route cannot start and end at the same place.
routeSchema.pre('validate', function (next) {

  if (
    this.source.trim().toLowerCase() ===
    this.destination.trim().toLowerCase()
  ) {
    return next(
      new Error('Source and destination cannot be the same')
    );
  }

  // Security:
  // Arrival time must be after departure time.
  if (this.arrival_time <= this.departure_time) {
    return next(
      new Error('Arrival time must be after departure time')
    );
  }

  next();
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;