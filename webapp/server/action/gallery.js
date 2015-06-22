
/*
 * Eric Yi on 2015-06-12
 * yi_xiaobin@163.com
 */

var express = require('express');
var router = express.Router();
Base = require('./base');
ModelProxy = require('../model/model_proxy');
string_util = require('../common/string_util');
var logger = Base.logger;

router.get('/', function(req, res) {
  var condition = {};
  Base.listGallery(condition, res);
});

router.get('/list', function(req, res) {
  var condition = {};
  Base.listGallery(condition, res);
});

router.get('/page', function(req, res) {
  logger.debug('enter gallery/page');
  var condition = {};
  var page = Base.genPage(req);
  page.num = 0;
  logger.debug('condition: ' + condition);
  Base.getGalleriesByPage(condition, page, res);
});

router.get('/page/:page_num', function(req, res) {
  var condition = {};
  var page = Base.genPage(req);
  page.num = req.params.page_num;
  Base.getGalleriesByPage(condition, page, res);
});

router.get('/test', function(req, res) {
  res.render('test_gallery.htm', Constants.parameters);
});

module.exports = router;
