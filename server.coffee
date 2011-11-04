express = require('express')
server = express.createServer()
port = process.env.PORT || 2828

server.configure ->
  server.set 'views', __dirname + '/views'
  server.use express.methodOverride()
  server.use express.bodyParser()
  server.use express.static(__dirname + '/public')
  server.use server.router

server.get '/', (req, res) ->
  res.render 'index.jade', locals: { title: 'CentroMan'}

server.listen port
