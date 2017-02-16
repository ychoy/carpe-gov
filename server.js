var express = require('express'),
  app = express(),
  bodyParser = require('body-parser');

app.user(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT || 3000);
