
/*
 * Eric Yi on 2014-05-15
 * yi_xiaobin@163.com
 */

var express = require('express');
var router = express.Router();
Base = require('./base');
ModelProxy = require('../model/model_proxy');

router.get('/', function(req, res) {
  Base.getArticles(null, function(dataset) {
    var json = ModelProxy.toArticleJson(dataset);
    res.send(json);
  });
});

router.get('/:id', function(req, res) {
  console.log('enter ' + req.params.id);

});

module.exports = router;

