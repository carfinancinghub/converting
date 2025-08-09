const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

router.get('/', auth, asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 });
  res.json(notifications);
}));

router.post('/', auth, asyncHandler(async (req, res) => {
  const { recipient, message, link } = req.body;
  const notification = new Notification({
    user: recipient,
    title: 'New Notification',
    message,
    link,
    type: 'general',
  });

  await notification.save();
  res.status(201).json(notification);
}));

router.patch('/:id/read', auth, asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) throw new Error('Notification not found');
  if (notification.user.toString() !== req.user.id) {
    throw new Error('Not authorized to modify this notification');
  }

  notification.read = true;
  await notification.save();
  res.json({ msg: '✅ Notification marked as read', notification });
}));

module.exports = router;