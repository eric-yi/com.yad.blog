
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

router.get('/id/:id', function(req, res) {
  var id = req.params.id;
  //var content = Base.getArticleById(id);
	// res.send(content);
 	Base.getArticleContentById(id, res);
});

router.get('/id/:id/parameter', function(req, res) {
  var id = req.params.id;
	Base.getArticleParameter(id, res);
});

router.get('/page', function(req, res) {
  var condition = {};
  var page = Base.genPage(req);
	page.num = 0;
  Base.getArticlesByPage(condition, page, res);
});

router.get('/page/:page_num', function(req, res) {
  var condition = {};
  var page = Base.genPage(req);
	page.num = req.params.page_num
  Base.getArticlesByPage(condition, page, res);
});

router.get('/category/:root', function(req, res) {
  var tree = [];
  tree.push(req.params.root);
  var page = Base.genPage(req);
  page.num = req.query.page;
  var condition = {category: tree};
  Base.getArticlesByPage(condition, page, res);
});

router.get('/category/:root/:child', function(req, res) {
  var tree = [];
  tree.push(req.params.root);
  tree.push(req.params.child);
  var page = Base.genPage(req);
  page.num = req.query.page;
  var condition = {category: tree};
  Base.getArticlesByPage(condition, page, res);
});

router.get('/family/:fid', function(req, res) {
	var fid = req.params.fid;
  var page = Base.genPage(req);
  page.num = req.query.page;
  var condition = {fid: fid};
  Base.getArticlesByPage(condition, page, res);
});

router.get('/recent', function(req, res) {
	Base.getRecentArticle(req, res);
});

router.get('/template', function(req, res) {
	var content = Base.getArticleTemplate();
	res.send(content);
});


module.exports = router;
