var express = require('express')

var app = express.createServer();
var vert = require('./app.js').app;


app.configure('development',function() {
  app.use(express.vhost('local.web9.com', vert ));
  app.listen(80,function() {
    console.log('listening at 80')
  });
});
