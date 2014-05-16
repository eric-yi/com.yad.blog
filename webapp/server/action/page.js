
/*
 * Eric Yi on 2014-05-15
 * yi_xiaobin@163.com
 */

var express = require('express');
var router = express.Router();
Base = require('./base');
ModelProxy = require('../model/model_proxy');

router.get('/', function(req, res) {
  var page = Base.genPage(req);
  page.num = 0;
  paging(res, page);
});

router.get('/:page_num', function(req, res) {
  var page = Base.genPage(req);
  paging(res, page);
});

function paging(res, page) {
  var condition = {page: page};
  Base.getArticles(condition, function(dataset) {
    var json = ModelProxy.toArticlePageJson(dataset);
    res.send(json);
  });
}

module.exports = router;

