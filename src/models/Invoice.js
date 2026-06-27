const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  invoice_number: {
    type: String,
    required: true,
    unique: true,
  },
  pdf_url: {
    type: String,
    required: true,
  },
}, {
  timestamps: { createdAt: 'generated_at', updatedAt: false }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
