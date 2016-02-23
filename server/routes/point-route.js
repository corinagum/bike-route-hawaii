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

router.post('/', function(req,res){
  Point.create({
    type : req.body.point.type,
    name : req.body.point.name,
    description  : req.body.point.description,
    info :req.body.point.info,
    fid :req.body.point.fid,
    site_id:req.body.point.site_id,
    street :req.body.point.street,
    side :req.body.point.side,
    lat : req.body.point.lat,
    long : req.body.point.long,
    geolink :req.body.point.geolink,
    photolink :req.body.point.photolink
  })
  .then(function(data){
    var geoJSONHistory = {
      "type" : "FeatureCollection",
      "features" : []
    };
    var geoJSONBikeShare = {
      "type" : "FeatureCollection",
      "features" : []
    };
    for(var i=0; i<data.length; i++){
      var point = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [ data[i].long, data[i].lat, 0]
        },
        "properties" : data[i]
      };
      if(data[i].type === "OldHawaiiImage"){
        geoJSONHistory.features.push(point);
      }
      if(data[i].type === "BikeShare"){
        geoJSONBikeShare.features.push(point);
      }

    }
    res.send({
      success : true,
      numberOfResults : data.length,
      geoJSONHistory : geoJSONHistory,
      geoJSONBikeShare : geoJSONBikeShare
    });
  });
});

router.put('/:id', function(req,res){
  Point.update({
    type : req.body.point.type,
    name : req.body.point.name,
    description  : req.body.point.description,
    info :req.body.point.info,
    fid :req.body.point.fid,
    site_id:req.body.point.site_id,
    street :req.body.point.street,
    side :req.body.point.side,
    geolink :req.body.point.geolink,
    photolink :req.body.point.photolink
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
    ',' + req.params.long + '  ), ll_to_earth(lat,long)) as distance_from_current_location FROM "Points" WHERE (earth_box(ll_to_earth(' +
    req.params.lat +',' + req.params.long + '), ' + req.params.meters + ') @> ll_to_earth(lat, long)) ORDER BY distance_from_current_location ASC;')
  .spread(function(data, metadata){
    var geoJSONHistory = {
      "type" : "FeatureCollection",
      "features" : []
    };
    var geoJSONBikeShare = {
      "type" : "FeatureCollection",
      "features" : []
    };
    for(var i=0; i<data.length; i++){
      var point = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [ data[i].long, data[i].lat, 0]
        },
        "properties" : data[i]
      };
      if(data[i].type === "OldHawaiiImage"){
        geoJSONHistory.features.push(point);
      }
      if(data[i].type === "BikeShare"){
        geoJSONBikeShare.features.push(point);
      }

    }
    res.send({
      success : true,
      numberOfResults : data.length,
      geoJSONHistory : geoJSONHistory,
      geoJSONBikeShare : geoJSONBikeShare
    });
  });

  router.get('/bounds/:NElat/:NElong/:SWlat/:SWlong', function(req, res){
    Point.findAll({
      where : {
        lat : {
          $between: [req.params.SWlat, req.params.NElat]
        },
        long : {
          between : [req.params.SWlong, req.params.NElong]
        }
      }
    })
    .then(function(data){
      var geoJSONHistory = {
        "type" : "FeatureCollection",
        "features" : []
      };
      var geoJSONBikeShare = {
        "type" : "FeatureCollection",
        "features" : []
      };
      for(var i=0; i<data.length; i++){
        var point = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [ data[i].long, data[i].lat, 0]
          },
          "properties" : data[i]
        };
        if(data[i].type === "OldHawaiiImage"){
          geoJSONHistory.features.push(point);
        }
        if(data[i].type === "BikeShare"){
          geoJSONBikeShare.features.push(point);
        }

      }
      res.send({
        success : true,
        numberOfResults : data.length,
        geoJSONHistory : geoJSONHistory,
        geoJSONBikeShare : geoJSONBikeShare
      });
    });
  });
});

module.exports = router;