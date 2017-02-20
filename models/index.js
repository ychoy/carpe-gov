var mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/carpegov");

var bill = require('./bill');
var actionItem = require('./actionItem');

module.exports.bill = bill;
module.exports.actionItem = actionItem;
