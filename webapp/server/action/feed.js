#!/usr/bin/env node

/*
 * Eric Yi on 2014-06-15
 * yi_xiaobin@163.com
 */
var express = require('express');
var router = express.Router();
Base = require('./base');
Constants = require('./constants');

router.get('/', function(req, res) {
  Base.getFeed(function(html) {
		res.send(html);
	});
});

router.get('/id/:id', function(req, res) {
	var id = req.params.id;
	var params = Constants.parameters;
	params.article_id = id;
	res.render('feed.htm', params);
});

module.exports = router;
