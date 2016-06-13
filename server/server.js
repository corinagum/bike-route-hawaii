var express             = require('express');
var session             = require('express-session');
var app                 = express();
var bodyParser          = require('body-parser');
var db                  = require('./../models/');
var Point               = db.Point;

app.use(bodyParser.json());
app.use(express.static('www'));

app.all('/*', function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
 res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
 next();

});

app.use('/api/comments', require('./routes/comment-route.js'));
app.use('/api/points', require('./routes/point-route.js'));
app.use('/user', require('./routes/user-route.js'));
app.use('/routes', require('./routes/routes-route.js'));

var server = app.listen(process.env.PORT || 4000, function() {
  db.sequelize.sync();
});

