const express = require('express')
const router = express.Router()

const User = require('../models/user-schema')
const tokenService = require('../auth/token-service')
const ensureAuth = require('../auth/ensure-auth')()

router
  .get('/validate', ensureAuth, (req, res) => {
    res.json({ valid: true })
  })
  .post('/signup', (req, res, next) => {
    const { username, password } = req.body
    delete req.body.password

    if (!username || !password) {
      return next({
        code: 400,
        error: 'Username and password required',
      })
    }

    User.find({ username })
      .countDocuments()
      .then(userCount => {
        if (userCount > 0)
          throw { code: 400, error: `Username ${username} already exists` }

        const user = new User(req.body)
        user.generateHash(password)
        return user.save()
      })
      .then(user => tokenService.sign(user))
      .then(token => res.json({ token }))
      .catch(next)
  })
  .post('/signin', (req, res, next) => {
    const { username, password } = req.body
    delete req.body.password

    User.findOne({ username })
      .then(user => {
        if (!user || !user.compareHash(password)) {
          throw { code: 400, error: 'Invalid username or password' }
        }
        return tokenService.sign(user)
      })
      .then(token => res.json({ token }))
      .catch(next)
  })

module.exports = router
