const http = require('http')
const app = require('./src/app')
const port = process.env.PORT || 9000
require('./src/config/mongoose-setup')

const server = http.createServer(app)

server.listen(port, () => {
  console.log('Server started on port: ', server.address().port)
})
