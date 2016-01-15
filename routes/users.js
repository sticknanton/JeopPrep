var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mongoose = require('mongoose');

router.get('/', function(req, res){  //GET request to api/users...
  User.find({}, function(err, databaseUsers){  //get all users from db
    res.json({users: databaseUsers}); // send down as json
  });
});

router.post('/', function(req, res){  // POST request to /api/users
  var newUser = new User( req.body.user );  // Make new user from sign up form
  newUser.save(function(err, databaseUser){  // Save user to the db, which will encrypt password
    res.json(databaseUser);  // Send the new user as json
  });
});

// Whenever user answers question, update stats
router.patch('/', function(req, res){  // PATCH request to /api/users
  if(req.user){  // IF a user has been found via token
    req.user.answered++; // No matter what, add to total questions answered
    req.user.correct += req.body.user.correct;  //user.correct should equal 0 or 1
    req.user.save(function(err, dbUser){  // Save the user with updated stats
      res.json(dbUser); // Send the updated user as JSON
    });
  }
});

// When user tries to login, assign token if password is correct
router.post('/authenticate', function(req, res){  // POST request to /api/users/authenticate
  User.findOne({username: req.body.username}, function(err, dbUser){
    if (dbUser){ // if there is a user
      // Check password
      dbUser.authenticate(req.body.password, function(err, isMatch){
        if(isMatch){  // If correct
          dbUser.setToken(err, function(){ // use setToken method
            // Send token as json to be stored in cookie to show user is logged in
            res.json({description: 'success', token: dbUser.token});
          });
        }
      });
    } else { // if no user found, return error
      res.json({description: 'No User Found', status: 302});
    }
  });
});

module.exports = router;
