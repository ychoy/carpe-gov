var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BillSchema = new Schema({
  title: String,
	summary: String,
	sponsor: String,
	textUrl: String,
	latestAction: String
});

var Bill = mongoose.model('Bill', BillSchema);
module.exports = Bill;

