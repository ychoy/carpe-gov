var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var actionItemSchema = new Schema({
  title:{
    type: String,
    required: [true, "Please enter Title"]
  },
  rep1Name: String,
  rep2Name: String,
  rep3Name: String,
  rep1ActionUrl: String,
  rep2ActionUrl: String,
  rep3ActionUrl: String,
  dueDate: String,
  status: Boolean
});

var actionItem = mongoose.model('Action Item', actionItemSchema);

module.exports = actionItem;
