var express             = require('express');
var session             = require('express-session');
var app                 = express();
var bodyParser          = require('body-parser');
var db                  = require('./../models/');
var user                = db.user;
var route               = db.route;
var passport            = require('passport');
var FacebookStrategy    = require('passport-facebook').Strategy;
var SECRET              = require('./../config/secret.js');

app.use(bodyParser.json());
app.use(express.static('www'));

app.use(session(SECRET.SESSION));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
 done(null, user);
});
passport.deserializeUser(function(user, done) {
 done(null, user);
});

passport.use(new FacebookStrategy({
   clientID: SECRET.FACEBOOK_APP_ID,
   clientSecret: SECRET.FACEBOOK_APP_SECRET,
   callbackURL: "http://localhost:4000/auth/facebook/callback",
   passReqToCallback : true
 },
 function(req, accessToken, refreshToken, profile, cb) {
   user.findOne({ where : {facebookId: profile.id }})
    .then(function (user) {
      if(!user){
        return cb("err");
      }
     return cb(err, user);
   });
 }
));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.use('/users', require('./routes/user-route.js'));
app.use('/routes', require('./routes/routes-route.js'));

var server = app.listen(process.env.PORT || 4000, function() {
  db.sequelize.sync();
});

