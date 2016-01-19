// MODULES //

var express = require('express');
var app = express();

var morgan = require('morgan');
app.use( morgan( 'dev' ) );

app.use(express.static('./public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');

var mongoPath = 'mongodb://localhost/jepquestions';
var mongoose = require('mongoose');
mongoose.connect(mongoPath);

// CUSTOM MIDDLEWARE //

var loadUser = require('./middleware/loadUser');
app.use(loadUser);

// ROUTES //

var index = require('./routes/index');
app.use('/', index);

var users = require('./routes/users');
app.use('/api/users', users);

var clues = require('./routes/clues');
app.use('/api/clues', clues);

// LISTEN //

var port = 8080;
app.listen(port, function(){
  console.log('...listening on ' + port);
});
