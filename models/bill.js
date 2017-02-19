var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var actionItem = require('./actionItem');

var BillSchema = new Schema({
  title: String,
	summary: String,
	sponsor: String,
	textUrl: String,
	latestAction: String,
  issues: [String],
  actionItems: [actionItem.schema]
});

var Bill = mongoose.model('Bill', BillSchema);
module.exports = Bill;
