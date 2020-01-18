const mongoose = require('mongoose');
require('./comment.model')
require('./like.model')

const tweetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  body: {
    type: String,
    required: true
  },
  hashtags: {
    type: [String]
  },
  image: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})

tweetSchema.pre('save', function (next) {
  this.hashtags = this.body.match(/#[a-z]+/gi);
  next()
});

tweetSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'tweet',
  justOne: false,
});

tweetSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'tweet',
  justOne: false,
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
