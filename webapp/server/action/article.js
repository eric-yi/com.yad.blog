
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
	Base.getArticles(null, function(articles) {
		var json = Model.toArticleInCatetoryJson(articles);
		res.send(json);
	});
});

module.exports = router;

