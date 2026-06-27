const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  // Security:
  // Prevent empty, very short and oversized bus names
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Bus name must be at least 3 characters'],
    maxlength: [100, 'Bus name cannot exceed 100 characters'],
  },

  // Security:
  // Normalize bus numbers by removing spaces
  // and converting them to uppercase
  bus_number: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },

  // Security:
  // Prevent invalid ticket prices
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },

  bus_type: {
    type: String,
    required: true,
    enum: [
      'AC Seater',
      'AC Sleeper',
      'Non-AC Seater',
      'Non-AC Sleeper'
    ],
  },

  // Security:
  // Prevent invalid seat count
  total_seats: {
    type: Number,
    required: true,
    min: [1, 'Bus must have at least 1 seat'],
    max: [100, 'Bus cannot have more than 100 seats'],
  },

  amenities: [
    {
      type: String,
    }
  ],

  assigned_driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null,
  },

  bus_images: [
    {
      type: String,
    }
  ],

  status: {
    type: String,
    enum: ['active', 'maintenance', 'inactive'],
    default: 'active',
  }

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;