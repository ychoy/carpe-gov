var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var actionItem = require('./actionItem');

var BillSchema = new Schema({
  title: {
    type: String,
    required: true
  },
	summary: {
    type: String,
    required: true
  },
	sponsor: {
    type: String,
    required: true
  },
	textUrl: {
    type: String,
    required: true
  },
	latestAction: {
    type: String,
    required: true
  },
  issues: {
    type: [String],
    required: true
  },
  actionItems: [actionItem.schema]
});

var Bill = mongoose.model('Bill', BillSchema);
module.exports = Bill;
