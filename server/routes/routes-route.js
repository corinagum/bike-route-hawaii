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

router.post('/start', function(req, res){
  route.create({
    startTime : moment().format(),
    status : 'started',
    routeCoordinates : {
      0 : req.body.currentCoordinate
    }
  })
  .then(function(data) {
    res.send({
      success : true,
      message : "New route created"
    });
  });
});

// FOR CONTINUOUSLY UPDATING; NOT FOR ENDING THE BIKE ROUTE
router.put('/:id', function(req, res){
  route.findOne({
    where : {
      id : req.params.id
    }
  })
  .then(function(data){
    if(!data){
      res.send({
        success : false,
        message : 'Route could not be found'
      });
    } else {
      data.dataValues.status = req.body.status;
      data.dataValues.routeCoordinates[Object.keys(data.dataValues.routeCoordinates).length] = req.body.currentCoordinate;
      console.log(data.dataValues);
      route.update(data.dataValues, {
        where : {
          id : req.params.id
        }
      })
      .then(function(data){
        res.send({
          success : true,
          message : 'Modified route'
        });
      });
    }
  });
});

router.put('/:id/end', function(req,res){
  route.findOne({
    where : {
      id : req.params.id
    }
  })
  .then(function(data){
    if(!data){
      res.send({
        success : false,
        message : 'Route could not be found'
      });
    } else {
      var now = moment().format();
      data.dataValues.status = 'ended';
      data.dataValues.endTime = now;
      data.dataValues.duration = (moment(data.dataValues.startTime).diff(now)).format('hh:mm:ss');
      console.log(data.dataValues.duration);
      route.update(data.dataValues, {
        where : {
            id : req.params.id
        }
      })
      .then(function(data) {
        res.send( {
          success : true,
          message : "Ended route"
        });
      });
    }
  });
});

module.exports = router;