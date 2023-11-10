const express = require('express');
const router = express.Router();
const Post = require('../models/Post.js');
const Topic = require('../models/Topic.js');
const _ = require('lodash');
const checkAuth = require('../routes/checkAuth.js')

// Get list of Topics with latest posts
router.get('/lastTopicPosts', checkAuth, async (req,res) => {
    try {
        const pipeline = [
            {
              $lookup: {
                from: 'topics', // Collection name
                localField: 'topicId',
                foreignField: '_id',
                as: 'topic',
              },
            },
            {
              $unwind: '$topic',
            },
            {
              $project: {
                _id: 1, // Include the _id of the post
                text: 1,
                createdDate: 1,
                topicId: 1,
                'topic.title': 1, // Include the title from the joined topic
                'topic.description': 1, // Include the description from the joined topic
                'topic._id': 1 //Include the id of the joined topic
              },
            },
          ];
      
          const customView = await Post.aggregate(pipeline);

        const groupedPosts = _.groupBy(customView, 'topicId')
        const lastTopicPosts = {};
        for (const groupID in groupedPosts) {
            const group = groupedPosts[groupID]
            lastTopicPosts[groupID] = _.maxBy(group,'_id')
        }
        res.json(lastTopicPosts)

            } catch (err) {
                res.status(400).json({ error: err.message });
              }
})



module.exports = router;