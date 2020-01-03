const path = require('path')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()

const auth = require('./routes/auth')
const films = require('./routes/films')
const users = require('./routes/users')
const ensureAuth = require('./auth/ensure-auth')()
const errorHandler = require('./routes/error-handler')

// HTTP Logging
app.use(morgan('dev'))
// @NOTE: would want this to be limited to a sensible whitelist, or only in lower envs, etc
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Serve static client bundle
app.use(express.static(path.join(__dirname, '../../app/build')))

// Routes:
app.use('/api/auth', auth)
app.use('/api/users', ensureAuth, users)
app.use('/api/films', films)

app.all('*', (req, res) => res.status(404).json({ error: 'Page not found' }))
app.use(errorHandler)

module.exports = app
