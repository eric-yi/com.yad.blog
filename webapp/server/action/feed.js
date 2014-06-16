#!/usr/bin/env node

/*
 * Eric Yi on 2014-06-15
 * yi_xiaobin@163.com
 */
var express = require('express');
var router = express.Router();
Base = require('./base');

router.get('/', function(req, res) {
  Base.getFeed(function(html) {
		res.send(html);
	});
});


module.exports = router;
