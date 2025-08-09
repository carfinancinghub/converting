// File: comments.js
// Path: backend/routes/comments.js

const express = require('express');
const router = express.Router();
const Comment = require('../../server/models/Comment');
const { authenticateUser } = require('../middleware/authMiddleware');

// GET comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments.' });
  }
});

// POST a new comment
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { postId, content, parentCommentId } = req.body;
    const comment = new Comment({
      postId,
      content,
      parentCommentId: parentCommentId || null,
      authorId: req.user._id,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create comment.' });
  }
});

module.exports = router;
