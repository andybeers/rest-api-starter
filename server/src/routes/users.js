const express = require('express')
const router = express.Router()
const User = require('../models/user-schema')

router
  .get('/', (req, res, next) => {
    const query = {}
    if (req.query.username) {
      query.username = req.query.username
    }
    User.find(query, '-password', { lean: true })
      .then(users => res.json(users))
      .catch(next)
  })
  .get('/:id', (req, res, next) => {
    User.findById(req.params.id, '-password', { lean: true })
      .then(user => res.json(user))
      .catch(next)
  })
  .put('/:id', (req, res, next) => {
    if (req.user.id !== req.params.id) {
      throw {
        code: 403,
        error: 'Unauthorized user',
      }
    }
    User.findByIdAndUpdate(req.params.id, req.body, {
      lean: true,
      new: true,
      upsert: true,
    })
      .select('-password')
      .then(updatedUser => res.json(updatedUser))
      .catch(next)
  })
  .delete('/:id', (req, res, next) => {
    if (req.user.id !== req.params.id) {
      throw {
        code: 403,
        error: 'Unauthorized user',
      }
    }
    User.findByIdAndRemove(req.params.id)
      .select('-password')
      .then(removedUser => res.json(removedUser))
      .catch(next)
  })

module.exports = router
