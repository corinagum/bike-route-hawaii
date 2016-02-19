var express             = require('express');
var router              = express.Router();
var session             = require('express-session');
// var bodyParser          = require('body-parser');
var db                  = require('./../../models');
var Point               = db.Point;


router.get('/', function(req,res){
  Point.findAll()
  .then(function(data){
    res.send(data);
  });
});

router.post('/', function(req,res){
  Point.create({
    type : req.body.type,
    name : req.body.name,
    description  : req.body.description,
    info :req.body.info,
    fid :req.body.fid,
    site_id:req.body.site_id,
    street :req.body.street,
    side :req.body.side,
    geolink :req.body.geolink,
    photolink :req.body.photolink
  })
  .then(function(point){
    res.send({
      success: true,
      message : "Created new point"
    });
  });
});

router.put('/:id', function(req,res){
  Point.update({
    type : req.body.type,
    name : req.body.name,
    description  : req.body.description,
    info :req.body.info,
    fid :req.body.fid,
    site_id:req.body.site_id,
    street :req.body.street,
    side :req.body.side,
    geolink :req.body.geolink,
    photolink :req.body.photolink
  }, {
    where : {id : req.params.id}
  })
  .then(function(point){
    res.send({
      success: true,
      message : "Updated point"
    });
  });
});

router.delete('/:id', function(req, res){
  Point.destroy({where : {id : req.params.id}})
  .then(function(point){
    res.send({
      success: true,
      message : "Deleted point"
    });
  });
});

module.exports = router;