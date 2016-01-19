var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Clue = require('../models/clue');
router.get('/', function(req, res){
  // var random = (Math.floor((Math.random() * 3301) + 3000)).toString();
  //good show numbers 3677
  Clue.find({ show_number: random }, function(err, dbClues){
    res.json(dbClues);
  });
});
module.exports = router;
