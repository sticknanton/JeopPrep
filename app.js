var express = require('express');
var app = express();

var morgan = require('morgan');
app.use( morgan( 'dev' ) );

app.use(express.static('./public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

app.set('view engine', 'ejs');


var index = require('./routes/index');
app.use('/', index);


var port = 8080;
app.listen(port, function(){
  console.log('...listening on ' + port);
});
