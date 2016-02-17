var express             = require('express');
var session             = require('express-session');
var app                 = express();
var bodyParser          = require('body-parser');
var db                  = require('./../models');
var User                = db.User;
var Task                = db.Task;

app.use(bodyParser.json());
app.use(express.static('www'));


var server = app.listen(process.env.PORT || 4000, function() {
  db.sequelize.sync();
});
