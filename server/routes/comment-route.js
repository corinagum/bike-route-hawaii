var express             = require('express');
var router              = express.Router();
var session             = require('express-session');
var db                  = require('./../../models');
var Comment               = db.Comment;

router.post('/',function(req, res){
  Comment.create(req.body.comment);
});

module.exports = router;