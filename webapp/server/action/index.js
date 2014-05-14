var express = require('express');
var router = express.Router();
Constants = require('./constants');
Base = require('./base');

/* GET home page. */
router.get('/', function(req, res) {
	Base.getBaseDatas(function(datas) {	
  	res.render('index.htm', datas);
	});
});

module.exports = router;
