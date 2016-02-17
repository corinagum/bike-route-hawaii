var express = require('express');
var router = express.Router();
var session             = require('express-session');
var bodyParser          = require('body-parser');
var db                  = require('./../models');
var route                = db.route;

router.use(bodyParser.json());

router.get('/:id', function(req, res){
  route.findOne({
    where : {
      id : req.params.id
    }
  })
  .then(function(route){
    if(!route) {
      res.send({
        success : false,
        message : 'Route does not exist'
      });
    } else {
      res.send({
        success : true,
        route : route
      });
    }
  });
});

router.post('/start', function(req, res){
  route.create({
    startTime : req.body.startTime,
    status : 'started',
    routeCoordinates : {
      0 : req.body.currentCoordinate
    },
    coordinateTimes : {
      0 : req.body.startTime
    }
  });
});