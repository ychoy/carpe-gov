var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');

// serve static files from public folder
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

var controllers = require('./controllers');

//HTML endpoints
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// JSON API endpoints
app.get('/api', controllers.api.index);

app.get('/api/bills', controllers.bills.index);

app.get('/api/bills/:billId', controllers.bills.show);

app.post('/api/bills', controllers.bills.create);

app.put('/api/bills/:billId', controllers.bills.update);

app.delete('/api/bills/:billId', controllers.bills.destroy);

app.get('/api/bills/:billId/actionItems', controllers.actionItems.index);

app.post('/api/bills/:billId/actionItems', controllers.actionItems.create);

app.delete('/api/bills/:billId/actionItems/:actionItemId', controllers.actionItems.destroy);

app.put('/api/bills/:billId/actionItems/:actionItemId', controllers.actionItems.update);

app.listen(process.env.PORT || 3000);
