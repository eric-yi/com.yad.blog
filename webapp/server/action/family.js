
/*
 * Eric Yi on 2014-05-17
 * yi_xiaobin@163.com
 */

var express = require('express');
var router = express.Router();
Base = require('./base');
ModelProxy = require('../model/model_proxy');

router.get('/', function(req, res) {
  Base.getFamilies(null, function(families) {
    var json = ModelProxy.toFamilyJson(families);
    res.send(json);
  });
});

router.get('/current', function(req, res) {
	var json = '{}';
  var family = req.session.family;
  if (family)
		json = ModelProxy.copyFamily(family).toJson();
	res.send(json);
});

module.exports = router;
