const Tweet = require('../models/tweet.model');
const User = require('../models/user.model');
const Like = require('../models/like.model');
const Comment = require('../models/comment.model');
const createError = require('http-errors');

module.exports.index = (req, res, next) => {
  const criteria = req.query.search
    ? {
      body: new RegExp(req.query.search, "i")
    }
    : {}

  Tweet.find(criteria)
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('user')
    .populate('comments')
    .populate('likes')
    .then(tweets => {
      res.json(tweets)
    })
    .catch(next)
}

module.exports.like = (req, res, next) => {
  const params = { tweet: req.params.id, user: req.currentUser.id }

  Like.findOne(params)
    .then(like => {
      if (like) {
        Like.findByIdAndRemove(like._id)
          .then(() => {
            res.json({ likes: -1 })
          })
          .catch(next)
      } else {
        const like = new Like(params)

        like.save()
          .then(() => {
            res.json({ likes: 1})
          })
          .catch(next)
      }
    })
    .catch(next)
}

module.exports.addComment = (req, res, next) => {
  const tweetId = req.params.id

  const comment = new Comment({
    text: req.body.text,
    user: req.currentUser.id,
    tweet: tweetId
  })
  
  comment.save()
    .then(c => res.json(c))
    .catch(next)
}

module.exports.show = (req, res, next) => {
  Tweet.findOne({ _id: req.params.id })
    .populate('user')
    .populate({
      path: 'comments',
      options: {
        sort: {
          createdAt: -1
        }
      },
      populate: {
        path: 'user'
      }
    })
    .then(tweet => {
      if (tweet) {
        res.json(tweet)
      } else {
        throw createError(404, 'tweet not found');
      }
    })
    .catch(next)
}

module.exports.create = (req, res, next) => {
  const tweet = new Tweet({
    user: req.currentUser.id,
    body: req.body.body,
    image: req.file ? req.file.url : undefined
  })
  
  tweet.save()
    .then(tweet => res.status(201).json(tweet))
    .catch(next)
}

module.exports.profile = (req, res, next) => {
  User.findOne({ username: req.params.username })
    .populate({
      path: 'tweets',
      populate: {
        path: 'user'
      }
    })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        throw createError(404, 'user not found');
      }
    })
    .catch(next)
}