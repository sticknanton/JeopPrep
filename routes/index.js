var express = require('express');
var router = express.Router();




router.get('/', function (req, res) {
  console.log(mongoose);
  res.render('index', {title: "Jeopardy Machine", questions: questions});
});



module.exports = router;
