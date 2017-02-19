var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActionItemSchema = new Schema({
  title: String,
  description: String,
  dueDate: Date,
  status: Boolean
});

var ActionItem = mongoose.model('Action Item', ActionItemSchema);

module.exports = ActionItem;
