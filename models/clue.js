var mongoose = require('mongoose');

var ClueSchema = mongoose.Schema({
  category: {type: String},
  question: {type: String},
  answer: {type: String},
  value: {type: String}
}, {collection: 'questions'});

module.exports = mongoose.model('Clue', ClueSchema);
