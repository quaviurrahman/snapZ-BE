const express = require('express');
const router = express.Router();
const Post = require('../models/Post.js');
const Topic = require('../models/Topic.js');
const { get } = require('lodash');

// Create a new post for a topic
router.post('/:topicId', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    const post = new Post({
      text: req.body.text,
      topicId: req.params.topicId,
    });
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a post
router.put('/:postId', async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, req.body, { new: true });
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a post
router.delete('/:postId', async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.postId);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a list if post
router.get('/postlist', async (req,res) => {
  try {
    const postList = await Post.find()
    res.json(postList)
  } catch (err) {
    res.status(400).json({ error: err.message})
  }
});

// Get all posts of a Topic
router.get('/:topicId', async (req, res) => {
  try {
    const filteredPosts = await Post.find({"topicId" : req.params.topicId})
    res.json(filteredPosts)
  } catch (err) {
    res.status(400).json({error: err.message})
  }
})

module.exports = router;