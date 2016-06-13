var express             = require('express');
var router              = express.Router();
var session             = require('express-session');
var db                  = require('./../../models');
var User               = db.User;


router.get('/', function(req,res){
  User.findAll()
  .then(function(data){
    res.send(data);
  });
});

router.get('/:id', function(req,res){
  User.max(userId)
  .then(function(data){
    res.send(data);
  });
});

router.post('/', function(req,res){
  User.create()
  .then(function(data){
    res.send({
      success : true,
      newId : data.dataValues.id,
      user : data.dataValues
    });
  });
});

router.put('/:id', function(req,res){

  User.update({
    type : req.body.user.type,
    name : req.body.user.name,
    description  : req.body.user.description,
    info :req.body.user.info,
    fid :req.body.user.fid,
    site_id:req.body.user.site_id,
    street :req.body.user.street,
    side :req.body.user.side,
    geolink :req.body.user.geolink,
    photolink :req.body.user.photolink,
    upDownVote : req.body.user.upDownVote,
    votesCounter : req.body.user.votesCounter,
    safetyCounter : req.body.user.votesCounter
  }, {
    where : {id : req.params.id}
  })
  .then(function(data){
    res.send({
      success: true,
      user : data.dataValues,
      message : "Updated user"
    });
  });
});


module.exports = router;