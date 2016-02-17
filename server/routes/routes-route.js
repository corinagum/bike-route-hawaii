var express             = require('express');
var router              = express.Router();
var session             = require('express-session');
var bodyParser          = require('body-parser');
var db                  = require('./../../models');
var route               = db.route;
var moment              = require('moment');

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

router.post('/end', function(req, res){
  route.create({
    startTime : req.body.route.startTime,
    endTime : req.body.route.endTime,
    duration: req.body.route.duration,
    distance : req.body.route.distance,
    routeCoordinates : req.body.route.coordinates,
  })
  .then(function(data) {
    res.send({
      success : true,
      message : "New route added"
    });
  });
});

router.delete('/:id/delete', function(req,res){
  route.findById(req.params.id)
  .then(function(data){
    if(!data){
      res.send({
        success : false,
        message : "Route does not exist"
      });
    } else {
      route.destroy({
        where : {
          id : req.params.id
        }
      })
      .then(function(){
        res.send({
          success : true,
          message : "Route deleted"
        });
      });
    }
  });
});

module.exports = router;