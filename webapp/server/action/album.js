
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

});

router.get('/path/:path', function(req, res) {
  var path = req.params.path;
  Base.listAlbum(path, res);
});

router.post('/open', function(req, res) {
  logger.debug('enter album open');
  logger.debug('body: ' + req.body);
  var id = req.body.album_id;
  var passkey = req.body.passkey;
  logger.debug('id = ' + id + ', passkey = ' + passkey);
  Base.openAlbum(id, passkey, res);
});

router.get('/path/:path/thumb/:num', function(req, res) {
  var path = req.params.path;
  var num = parseInt(req.params.num);
  Base.getAlbumThumb(path, num, res);
});

router.get('/page', function(req, res) {
  logger.debug('enter alubm page');
  var condition = {};
  condition.thumb_num = 10;
  var page = Base.genPage(req);
  page.num = 0;
  logger.debug('condition: ' + condition);
  Base.getAlbumsByPage(condition, page, res);
});

router.get('/page/:page_num', function(req, res) {
  var condition = {};
  condition.thumb_num = 10;
  var page = Base.genPage(req);
  page.num = req.params.page_num;
  Base.getAlbumsByPage(condition, page, res);
});

router.get('/test', function(req, res) {
  res.render('test_alubm.htm', Constants.parameters);
});

module.exports = router;
