var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var actionItemSchema = new Schema({
  title: String,
  description: String,
  dueDate: String,
  status: Boolean
});

var actionItem = mongoose.model('Action Item', actionItemSchema);

module.exports = actionItem;
