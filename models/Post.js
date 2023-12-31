const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  createdDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);