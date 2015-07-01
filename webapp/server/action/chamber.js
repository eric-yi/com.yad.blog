#!/usr/bin/env node

/*
 * Eric Yi on 2014-05-15
 * yi_xiaobin@163.com
 */

var express = require('express');
var router = express.Router();
logger_util = require('../common/logger_util');
var logger = logger_util.getLogger();
Base = require('./base');
ModelProxy = require('../model/model_proxy');

router.get('/', function(req, res) {
  res.render('chamber.htm', Constants.parameters);
});

router.post('/article', function(req, res) {
  logger.debug('open chamber');
  logger.debug('body = ' + req.body);
  logger.debug('id = ' + req.body.chamber_id);
  var id = req.body.chamber_id;
  var passkey = req.body.chamber_passkey;
  Base.getChamberArticle(id, passkey, res);
});


module.exports = router;
