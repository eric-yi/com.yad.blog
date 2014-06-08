
/*
 * Eric Yi on 2014-05-15
 * yi_xiaobin@163.com
 */

var express = require('express');
var router = express.Router();
Base = require('./base');
ModelProxy = require('../model/model_proxy');
string_util = require('../common/string_util');

router.get('/', function(req, res) {
  Base.getLinks(null, function(links) {
    var json = Model.toJson(links);
    res.send(json);
  });
});

router.post('/add', function(req, res) {
 Base.tipAdmin(req, res, function() {
  var name = string_util.formToSql(req.body.a_link_name, '"');
  var url = string_util.formToSql(req.body.a_link_url, '"');
  var link = ModelProxy.copyLink({
    name:   name,
    url:    url
  });
  Base.service.addLink(link, function(result) {
    Base.sendMessage(res, result);
  });
 });
});

router.get('/:id/delete', function(req, res) {
  var id = req.params.id;
  Base.service.deleteLink(id, function(result) {
    Base.sendMessage(res, result);
  });
});

module.exports = router;
