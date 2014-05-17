
/*
 * Eric Yi on 2014-05-15
 * yi_xiaobin@163.com
 */

var express = require('express');
var router = express.Router();
Base = require('./base');
ModelProxy = require('../model/model_proxy');

router.get('/', function(req, res) {
  Base.getCategoryInFamily(null, function(categories) {
    var json = ModelProxy.toCategoryJson(categories);
    res.send(json);
  });
});

router.get('/list', function(req, res) {
  Base.getCategories(null, function(categories) {
    var json = ModelProxy.toJson(categories);
    res.send(json);
  });
});

module.exports = router;

