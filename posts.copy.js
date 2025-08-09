// File: posts.js
// Path: backend/routes/posts.js

const express = require('express');
const router = express.Router();
const Post = require('../../server/models/Post');
const { authenticateUser } = require('../middleware/authMiddleware');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts.' });
  }
});

// GET a specific post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post.' });
  }
});

// CREATE a post
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const post = new Post({
      authorId: req.user._id,
      title,
      content,
      tags
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post.' });
  }
});

module.exports = router;
