var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Clue = require('../models/clue');

router.get('/', function(req, res){
  Clue.find({}, function(err, dbClues){
    res.json(dbClues);
  });
});

module.exports = router;
