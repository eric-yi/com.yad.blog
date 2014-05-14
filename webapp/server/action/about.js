var express = require('express');
var router = express.Router();
Constants = require('./constants');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('about.htm', Constants.parameters);
});

module.exports = router;

