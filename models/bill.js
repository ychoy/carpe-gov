var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var actionItem = require('./actionItem');

var BillSchema = new Schema({
  title:{
    type: String,
    required: [true, "Please enter Title"]
  },
  summary: String,
  sponsor: String,
  textUrl: String,
  latestAction: String,
  issues: [String],
  actionItems: [actionItem.schema]
});

var Bill = mongoose.model('Bill', BillSchema);
module.exports = Bill;
