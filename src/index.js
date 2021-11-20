const http = require('http')
const config = require('config')
const app = require('./app')

const server = http.createServer(app)

module.exports = server

const API_PORT = config.server.port
const port = process.env.PORT || API_PORT

server.listen(port, () => {
  console.log(`Viter Server running on port ${port}`)
})
