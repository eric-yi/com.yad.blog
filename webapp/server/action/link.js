
/*
 * Eric Yi on 2014-05-15
 * yi_xiaobin@163.com
 */

var express = require('express');
var router = express.Router();
Base = require('./base');
Model = require('../model/model_proxy');

/* GET home page. */
router.get('/list', function(req, res) {
	Base.getLinks(null, function(links) {
		var json = Model.toJson(links);
		res.send(json);
	});
});

module.exports = router;

