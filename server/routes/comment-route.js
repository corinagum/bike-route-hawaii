var express             = require('express');
var router              = express.Router();
var session             = require('express-session');
var db                  = require('./../../models');
var Comment               = db.Comment;

router.post('/',function(req, res){
  Comment.create(req.body.comment);
});

router.get('/',function(req, res){
  Comment.findAll()
    .then(function(data){
      res.send(data);
    });
});

module.exports = router;