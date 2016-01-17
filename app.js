var express = require('express');
var app = express();

var morgan = require('morgan');
app.use( morgan( 'dev' ) );

var mongoose = require('mongoose');
mongoose.connect('mongodb://jepquestions');

app.use(express.static('./public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

app.set('view engine', 'ejs');

var mongoPath = 'mongodb://localhost/jeopprep';
var mongoose = require('mongoose');
mongoose.connect(mongoPath);

var index = require('./routes/index');
app.use('/', index);

var users = require('./routes/users');
app.use('/api/users', users);

var clues = require('./routes/clues');
app.use('/api/clues', clues);



var port = 8080;
app.listen(port, function(){
  console.log('...listening on ' + port);
});
