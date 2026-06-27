const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact_number: {
    type: String,
    required: true,
  },
  license_number: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active',
  },
  driver_image: {
    type: String,
    default: null,
  },
  assigned_bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    default: null,
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;
