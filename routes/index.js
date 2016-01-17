var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = mongoose.connection;



router.get('/', function (req, res) {
console.log(db);
  res.render('index', {title: "Jeopardy Machine"});
});



module.exports = router;
