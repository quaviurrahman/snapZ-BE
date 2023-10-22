const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');

// Create a new topic
router.post('/', async (req, res) => {
  try {
    const topic = new Topic(req.body);
    const savedTopic = await topic.save();
    res.json(savedTopic);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a topic
router.put('/:topicId', async (req, res) => {
  try {
    const updatedTopic = await Topic.findByIdAndUpdate(req.params.topicId, req.body, { new: true });
    res.json(updatedTopic);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a topic
router.delete('/:topicId', async (req, res) => {
  try {
    await Topic.findByIdAndRemove(req.params.topicId);
    res.json({ message: 'Topic deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a list of topic
router.get('/topiclist',async (req,res) => {
  try {
    const topicList = await Topic.find()
    res.json (topicList)
  } catch (err) {
    res.status(400).json ({error: err.message})
  }
});

module.exports = router;