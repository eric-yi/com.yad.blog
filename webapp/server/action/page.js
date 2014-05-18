
/*
 * Eric Yi on 2014-05-15
 * yi_xiaobin@163.com
 */

var express = require('express');
var router = express.Router();
Base = require('./base');
ModelProxy = require('../model/model_proxy');

router.get('/', function(req, res) {
  var condition = {};
  var page = Base.genPage(req);
  page.num = 0;
  Base.getArticlesByPage(condition, page, res);
});

router.get('/:page_num', function(req, res) {
  var condition = {};
  var page = Base.genPage(req);
  Base.getArticlesByPage(condition, page, res);
});


module.exports = router;
