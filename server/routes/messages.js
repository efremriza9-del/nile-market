const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

router.get('/conversations', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'name')
    .populate('receiver', 'name')
    .populate('product', 'name images');

    const conversations = {};
    messages.forEach(msg => {
      if (!conversations[msg.conversation]) {
        conversations[msg.conversation] = {
          conversation: msg.conversation,
          lastMessage: msg,
          product: msg.product,
          otherUser: msg.sender._id.toString() === req.user._id.toString() ? msg.receiver : msg.sender,
          unread: 0,
        };
      }
      if (!msg.read && msg.receiver._id.toString() === req.user._id.toString()) {
        conversations[msg.conversation].unread++;
      }
    });

    res.json(Object.values(conversations));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:conversationId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name');

    await Message.updateMany(
      { conversation: req.params.conversationId, receiver: req.user._id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, productId, text } = req.body;
    const conversationId = [req.user._id, receiverId, productId].sort().join('_');

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      receiver: receiverId,
      product: productId,
      text,
    });

    await message.populate('sender', 'name');
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
