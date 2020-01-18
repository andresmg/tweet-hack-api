require('../config/db.config')

const User = require('../models/user.model')
const Tweet = require('../models/tweet.model')
const Comment = require('../models/comment.model')
const faker = require('faker')

const userIds = []

Promise.all([
  User.deleteMany(),
  Tweet.deleteMany(),
  Comment.deleteMany()
])
  .then(() => {
    for (let i = 0; i < 100; i++) {
      const user = new User({
        name: faker.name.findName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: '123123123',
        avatar: faker.image.avatar(),
        bio: faker.lorem.sentence(),
        validated: true,
        createdAt: faker.date.past()
      })

      user.save()
        .then(user => {
          console.log(user.username)
          userIds.push(user._id)

          for(let j = 0; j < 100; j++) {
            const tweet = new Tweet({
              user: user._id,
              body: faker.lorem.paragraph(),
              image: faker.random.image(),
              createdAt: faker.date.past()
            })

            tweet.save()
              .then((t) => {
                for (let k = 0; k < 10; k++) {
                  const c = new Comment({
                    user: userIds[Math.floor(Math.random() * userIds.length)],
                    tweet: t._id,
                    text: faker.lorem.paragraph(),
                    createdAt: faker.date.past()
                  })

                  c.save()
                }
              })
              .catch(console.error)
          }
        })
        .catch(console.error)
    }
  })
