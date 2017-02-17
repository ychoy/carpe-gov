var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');
  //controllers = require('./controllers');

//app.user(bodyParser.urlencoded({extended: true}));

// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('/views/index.html' , { root : __dirname});
});

app.listen(process.env.PORT || 3000);
