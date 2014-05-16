
/*
 * Eric Yi on 2014-05-15
 * yi_xiaobin@163.com
 */

var express = require('express');
var router = express.Router();
Base = require('./base');
ModelProxy = require('../model/model_proxy');

router.get('/list', function(req, res) {
	var page = Base.genPage(req);
	var condition = {page: page};
	Base.getArticles(condition, function(dataset) {
		var json = ModelProxy.toArticleJson(dataset);
		res.send(json);
	});
});

module.exports = router;

