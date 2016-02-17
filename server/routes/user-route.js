var express = require('express');
var router = express.Router();
var session             = require('express-session');
var bodyParser          = require('body-parser');
var db                  = require('./../models');
var user                = db.user;

router.use(bodyParser.json());

router.get('/:id', function(req, res) {
  user.findOne({
    where : {
      id : req.params.id
    }
  })
  .then(function(user){
    if(!user) {
      res.send({
        success : false,
        message : "Could not find user"
      });
    } else {
        res.send({
        success: true,
        user : user
      });
    }
  });
});

router.post('/register', function(req, res) {
  user.findOne({
    where : {
      username : req.body.register.username
    }
  })
  .then(function(data){
    if(!data) {
      user.create({
        username : req.body.register.username,
        password : req.body.register.password,
        email : req.body.register.email,
        firstName : req.body.register.firstName,
        lastName : req.body.register.lastName
      })
      .then(function(user) {
        res.send({
          success : true,
          message : 'New user created'
        });
      });
    } else {
      res.send({
        success : false,
        message : 'User already exists'
      });
    }
  });
});

router.put('/:id', function(req, res){
  user.update({
      username : req.body.register.username,
      password : req.body.register.password,
      email : req.body.register.email,
      firstName : req.body.register.firstName,
      lastName : req.body.register.lastName
  }, {
    where : {
      id : req.params.id
    }
  })
  .then(function(user) {
    if(!user) {
      res.send({
        success : false,
        message : 'User could not be found'
      });
    }
    res.send({
      success : true,
      message : 'User information updated'
    });
  });
});