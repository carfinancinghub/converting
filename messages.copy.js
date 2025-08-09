const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const auth = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const { sendMessageNotification } = require('../utils/notificationService');

router.get('/', auth, asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user.id,
  })
    .populate('participants', 'email role')
    .sort({ lastUpdated: -1 });

  res.json(conversations);
}));

router.post('/start', auth, asyncHandler(async (req, res) => {
  const { participantIds } = req.body;

  if (!participantIds || !participantIds.includes(req.user.id)) {
    throw new Error('Invalid participant IDs');
  }

  const existingConversation = await Conversation.findOne({
    participants: { $all: participantIds, $size: participantIds.length },
  });

  if (existingConversation) {
    return res.json(existingConversation);
  }

  const conversation = new Conversation({
    participants: participantIds,
  });

  await conversation.save();
  res.status(201).json(conversation);
}));

router.get('/:conversationId', auth, asyncHandler(async (req, res) => {
  const messages = await Message.find({ conversationId: req.params.conversationId })
    .populate('senderId', 'email role')
    .sort({ createdAt: 1 });

  res.json(messages);
}));

router.post('/:conversationId/send', auth, asyncHandler(async (req, res) => {
  const { content } = req.body;
  const conversation = await Conversation.findById(req.params.conversationId);

  if (!conversation) throw new Error('Conversation not found');
  if (!conversation.participants.includes(req.user.id)) {
    throw new Error('Not authorized to send messages in this conversation');
  }

  const message = new Message({
    conversationId: req.params.conversationId,
    senderId: req.user.id,
    senderRole: req.user.role,
    content,
  });

  await message.save();

  conversation.lastMessage = content;
  conversation.lastUpdated = new Date();
  await conversation.save();

  const recipientId = conversation.participants.find(
    (id) => id.toString() !== req.user.id.toString()
  );

  await sendMessageNotification({
    senderId: req.user.id,
    recipientId,
    conversationId: req.params.conversationId,
  });

  const io = req.app.get('socketio');
  io.to(req.params.conversationId).emit('receiveMessage', message);

  res.status(201).json(message);
}));

module.exports = router;