var express             = require('express');
var router              = express.Router();
var session             = require('express-session');
var db                  = require('./../../models');
var Point               = db.Point;


router.get('/', function(req,res){
  Point.findAll()
  .then(function(data){
    res.send(data);
  });
});

// POST a new anything point
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
    lat : req.body.lat,
    long : req.body.long,
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

router.get('/within/:meters/:lat/:long', function(req, res){
  db.sequelize.query('SELECT *, earth_distance(ll_to_earth( ' + req.params.lat +
    ',' + req.params.long + '  ), ll_to_earth(lat,long)) as distance_from_current_location FROM "Points" WHERE earth_box(ll_to_earth(' +
    req.params.lat +',' + req.params.long + '), ' + 'earth_distance(ll_to_earth( ' + req.params.lat +
    ',' + req.params.long + '  ), ll_to_earth(lat,long))' + ') @> ll_to_earth(lat, long);')
  .spread(function(results, metadata){
    res.send({
      success : true,
      results : results
    });
  });
});

module.exports = router;