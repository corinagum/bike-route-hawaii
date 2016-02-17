var express             = require('express');
var session             = require('express-session');
var app                 = express();
var bodyParser          = require('body-parser');
var db                  = require('./../models/');
var user                = db.user;
var route               = db.route;
var SECRET              = require('./config/secret.js');

app.use(bodyParser.json());
app.use(express.static('www'));

passport.use(new FacebookStrategy({
   clientID: SECRET.FACEBOOK_APP_ID,
   clientSecret: SECRET.FACEBOOK_APP_SECRET,
   callbackURL: "http://localhost:4000/auth/facebook/callback"
 },
 function(accessToken, refreshToken, profile, cb) {
   User.findOrCreate({ facebookId: profile.id }, function (err, user) {
     return cb(err, user);
   });
 }
));

app.use('/users', require('./routes/user-route.js'));
app.use('/routes', require('./routes/routes-route.js'));


var server = app.listen(process.env.PORT || 4000, function() {
  db.sequelize.sync();
});

