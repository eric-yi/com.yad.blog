
/*
 * Eric Yi on 2014-05-19
 * yi_xiaobin@163.com
 */

var express = require('express');
var router = express.Router();
Base = require('./base');

router.get('/article', function(req, res) {
	Base.getRecentArticle(req, res);
});

router.get('/reply', function(req, res) {
	Base.getRecentReply(req, res);
});

module.exports = router;
