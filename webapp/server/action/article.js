
/*
 * Eric Yi on 2014-05-15
 * yi_xiaobin@163.com
 */

var express = require('express');
var router = express.Router();
Base = require('./base');
ModelProxy = require('../model/model_proxy');

router.get('/', function(req, res) {
  Base.getArticlesInAction(null, res);
});

router.get('/:id', function(req, res) {
  var id = req.params.id;
  var content = Base.getArticleById(id);
  res.send(content);
});

router.get('/:id/parameter', function(req, res) {
  var id = req.params.id;
	Base.getArticleParameter(id, res);
});

module.exports = router;
