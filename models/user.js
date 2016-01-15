var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');

var UserSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  token: {type: String},
  answered: {type: Number}, // Total questions answered
  correct: {type: Number} // Questions answered correctly
});

module.exports = mongoose.model('User', UserSchema);
