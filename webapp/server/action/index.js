var express = require('express');
var router = express.Router();
Constants = require('./constants');

/* GET home page. */
router.get('/', function(req, res) {
 	res.render('index.htm', Constants.parameters);
});

router.get('/parameters', function(req, res) {
  res.send(Constants.parameters_json);
});

module.exports = router;
