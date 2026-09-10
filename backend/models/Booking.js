const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  startCity: { type: String, required: true },
  destination: { type: String, required: true },
  journeyDate: { type: String, required: true },
  busNumber: { type: String, required: true },
  companyName: { type: String, default: 'Unique Travels' },
  busType: { type: String, default: '' },
  seats: { type: [String], required: true },
  passengers: { type: Array, default: [] },
  pricePerSeat: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true, unique: true },
  paymentStatus: { type: String, default: 'Paid' }
}, { timestamps: true, collection: 'bookings' });

module.exports = mongoose.model('booking', BookingSchema);
