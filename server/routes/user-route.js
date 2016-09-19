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
  // console.log(req.user);
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
    name : req.body.user.name,
    age : req.body.user.age,
    gender : req.body.user.gender,
    zipcode : req.body.user.zipcode,
    email: req.body.user.email,
    location: req.body.user.location,
    paths : req.body.user.paths,
    liked : req.body.user.liked,
    suggested : req.body.user.suggested,
    commentType : req.body.user.commentType,
    comment : req.body.user.comment
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