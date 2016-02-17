var express             = require('express');
var session             = require('express-session');
var app                 = express();
var bodyParser          = require('body-parser');
var db                  = require('./../models/');
var user                = db.user;
var route                = db.route;

app.use(bodyParser.json());
app.use(express.static('www'));
app.use('/users', require('./routes/user-route.js'));
app.use('/routes', require('./routes/routes-route.js'));


var server = app.listen(process.env.PORT || 4000, function() {
  db.sequelize.sync();
});

