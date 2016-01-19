var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');

var UserSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  token: {type: String},
  answered: {type: Number}, // Total questions answered
  correct: {type: Number} // Questions answered correctly
}, {collection: 'jep-users'});

UserSchema.pre('save', function(next){ // before saving new user to Db
  if ( this.isModified('password')) { // upon any changes to password
    this.password = bcrypt.hashSync(this.password, 10); // run bcrypt on password to make secure
  }
  return next; // move on to next thing
});

// ~~~ Generate and assign token to user when logging in with correct password ~~~
UserSchema.methods.setToken = function(err, done){
  var scope = this;
  crypto.randomBytes(256, function(err, buf) { //generates token
    if (err) { return done(err); }
    scope.token = buf; //assigns token to user
    scope.save(function(err){ //save (update) user to Db with new token
      if (err) { return done(err); }
      done();
    });
  });
};

// ~~~ Check if password is correct on login ~~~
UserSchema.methods.authenticate = function(passwordTry, callback){
  bcrypt.compare( passwordTry, this.password, function(err, isMatch){
    if (err) { return callback(err); }
    callback( null, isMatch );
  });
};

module.exports = mongoose.model('User', UserSchema);
