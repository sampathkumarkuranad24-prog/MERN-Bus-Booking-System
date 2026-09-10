const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

router.post('/', async (req, res) => {
  try {
    const {
      startCity, destination, journeyDate, busNumber, companyName, busType,
      seats, passengers, pricePerSeat, totalAmount, paymentMethod, transactionId
    } = req.body;

    if (!startCity || !destination || !journeyDate || !busNumber || !Array.isArray(seats) || !seats.length || !paymentMethod || !transactionId) {
      return res.status(400).json({ message: 'Missing booking or payment details.' });
    }

    const booking = await Booking.create({
      userId: String(req.user._id || req.user.email),
      userEmail: req.user.email,
      userName: req.user.name || 'Passenger',
      startCity,
      destination,
      journeyDate,
      busNumber,
      companyName: companyName || 'Unique Travels',
      busType: busType || '',
      seats,
      passengers: Array.isArray(passengers) ? passengers : [],
      pricePerSeat: Number(pricePerSeat || 0),
      totalAmount: Number(totalAmount || 0),
      paymentMethod,
      transactionId,
      paymentStatus: 'Paid'
    });

    res.status(201).json({ message: 'Booking saved successfully', booking });
  } catch (err) {
    console.error('Booking save error:', err);
    if (err.code === 11000) return res.status(409).json({ message: 'This transaction has already been saved.' });
    res.status(500).json({ message: 'Unable to save booking.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.user.email }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    console.error('Booking history error:', err);
    res.status(500).json({ message: 'Unable to load booking history.' });
  }
});

module.exports = router;
