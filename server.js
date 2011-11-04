(function() {
  var express, port, server;
  express = require('express');
  server = express.createServer();
  port = process.env.PORT || 2828;
  server.configure(function() {
    server.set('views', __dirname + '/views');
    server.use(express.methodOverride());
    server.use(express.bodyParser());
    server.use(express.static(__dirname + '/public'));
    return server.use(server.router);
  });
  server.get('/', function(req, res) {
    return res.render('index.jade', {
      locals: {
        title: 'Blast Mavens JS'
      }
    });
  });
  server.listen(port);
}).call(this);
