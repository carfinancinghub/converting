// Updated cars.js with admin approve and edit support
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Car = require('../models/Car');
const authorizeRoles = require('../middleware/authorize');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'myCarHaulSecret2025';

// Auth middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided.' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// GET all cars (admin = all, seller = own, buyer = available)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { role, userId } = req.user;
    let cars;

    if (role === 'admin') {
      cars = await Car.find().sort({ needsReview: -1, make: 1 });
    } else if (role === 'seller') {
      cars = await Car.find({ sellerId: userId });
    } else {
      cars = await Car.find({ status: 'Available' });
    }

    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET seller-specific cars
router.get('/seller/:sellerId', authMiddleware, async (req, res) => {
  try {
    const cars = await Car.find({ sellerId: req.params.sellerId });
    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new car (seller only)
router.post('/', authMiddleware, authorizeRoles('seller'), async (req, res) => {
  try {
    const { make, model, year, price, status, sellerId, needsReview } = req.body;
    if (!make || !model || !year || !price || !sellerId) {
      return res.status(400).json({ message: 'Missing required car fields' });
    }
    const newCar = new Car({
      make,
      model,
      year,
      price,
      status: status || 'Available',
      sellerId,
      needsReview: needsReview ?? false,
    });
    await newCar.save();
    res.status(201).json(newCar);
  } catch (err) {
    console.error('Error saving car:', err);
    res.status(500).json({ message: 'Error adding car', error: err.message });
  }
});

// PATCH approve car (admin only)
router.patch('/:id/approve', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { needsReview: false },
      { new: true }
    );
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json({ message: 'Car approved', car });
  } catch (err) {
    console.error('Error approving car:', err);
    res.status(500).json({ message: 'Failed to approve car' });
  }
});

// PATCH update car details (admin only)
router.patch('/:id', authMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const updateFields = (({ make, model, year, price, status }) => ({
      ...(make && { make }),
      ...(model && { model }),
      ...(year && { year }),
      ...(price && { price }),
      ...(status && { status }),
    }))(req.body);

    const car = await Car.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json({ message: 'Car updated', car });
  } catch (err) {
    console.error('Error updating car:', err);
    res.status(500).json({ message: 'Failed to update car' });
  }
});

module.exports = router;
