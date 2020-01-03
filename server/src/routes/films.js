const express = require('express')
const router = express.Router()
const Film = require('../models/film-schema')

router
  .get('/', (req, res, next) => {
    const query = {}
    if (req.query.search) {
      query.$text = { $search: req.query.search }
    }
    Film.find(query)
      .lean()
      .then(films => res.json(films))
      .catch(next)
  })
  .get('/:id', (req, res, next) => {
    Film.findById(req.params.id)
      .lean()
      .then(film => res.json(film))
      .catch(next)
  })
  .post('/', (req, res, next) => {
    new Film(req.body)
      .save()
      .then(newFilm => res.json(newFilm))
      .catch(next)
  })
  .delete('/:id', (req, res, next) => {
    return Film.findByIdAndRemove(req.params.id)
      .then(deletedFilm => res.json(deletedFilm))
      .catch(next)
  })

module.exports = router
