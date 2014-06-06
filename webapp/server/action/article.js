#!/usr/bin/env node

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
  Base.getArticleContentById(id, res);
});

router.get('/id/:id/body', function(req, res) {
  var id = req.params.id;
  var content = Base.getArticleById(id);
  res.send(content);
});

router.get('/id/:id/parameter', function(req, res) {
  var id = req.params.id;
  Base.getArticleParameter(id, res);
});

router.get('/id/:id/summary', function(req, res) {
  var id = req.params.id;
  var content = Base.getArticleSummary(id);
  res.send(content);
});

router.get('/page', function(req, res) {
  var condition = {};
  var page = Base.genPage(req);
  page.num = 0;
  Base.handleArticleCondition(req, condition);
  Base.getArticlesByPage(condition, page, res);
});

router.get('/page/:page_num', function(req, res) {
  var condition = {};
  var page = Base.genPage(req);
  page.num = req.params.page_num;
  Base.handleArticleCondition(req, condition);
  Base.getArticlesByPage(condition, page, res);
});

router.get('/category/:root', function(req, res) {
  var tree = [];
  tree.push(req.params.root);
  var page = Base.genPage(req);
  page.num = req.query.page;
  var condition = {category: tree};
  Base.handleArticleCondition(req, condition);
  Base.getArticlesByPage(condition, page, res);
});

router.get('/category/:root/:child', function(req, res) {
  var tree = [];
  tree.push(req.params.root);
  tree.push(req.params.child);
  var page = Base.genPage(req);
  page.num = req.query.page;
  var condition = {category: tree};
  Base.handleArticleCondition(req, condition);
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

router.post('/add', function(req, res) {
  Base.tipLogin(req, res, function() {
    var family_id = req.body.family_id;
		var category_id = req.body.category_id;
    var title = req.body.title;
    var content = req.body['post-editor'];
    var publish_time = new Date();

		var article = ModelProxy.copyArticle({
				family_id:		string_util.formToSql(family_id, '"'),
        category_id:  string_util.formToSql(category_id, '"'),
        title:        string_util.formToSql(title, '"'),
        content:      content,
        publish_time: publish_time
    });
		Base.service.addArticle(article, function(result) {
			if (result == 1) { 
      	Base.sendSuccessMsg(res);
			} else {
				var message = new Message();
				message.msg = result;
				res.send(message.toJson());
			}
		});
  });
});

router.post('/:id/edit', function(req, res) {
  Base.tipLogin(req, res, function() {
    var id = req.params.id;
    var catetory_id = req.body.category_id;
    var title = req.body.title;
    var content = req.body.content;
    var publish_time = new Date();

    var article = ModelProxy.copyArticle({
        id:           id,
        catetory_id:  category_id,
        title:        title,
        content:      content,
        publish_time: publish_time
    });
    Base.service.updateArticle(article, function(result) {
      Base.sendSuccessMsg(res);
    });
  });

});

router.get('/:id/delete', function(req, res) {
  Base.tipLogin(req, res, function() {
  	var id = req.params.id;
    Base.service.deleteArticle(id, function(result) {
      Base.sendSuccessMsg(res);
    });
  });
});

module.exports = router;
