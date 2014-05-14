
/*
 * Eric Yi on 2014-05-12
 * yi_xiaobin@163.com
 */

ModelProxy = require('../model/model_proxy');

Service = function() {
	this.dao;	
};

Service.prototype.setDao = function(dao) {
	this.dao = dao;
};

Service.prototype.getDao = function(dao) {
	return this.dao;
}

Service.prototype.getArticles = function(article, callback) {
	var sql = 'select * from yad_blog_article';
	if (article != null) {

	}
	this.dao.query(sql, function(results) {
		var list = [];
		for (var index in results) {
			var result = results[index];
			var article = ModelProxy.genArticle(result);
			list.push(article);
		}
		callback(list);
	});
}

Service.prototype.getCategories = function(category, callback) {
	var sql = 'select * from yad_blog_category';
	if (category != null) {

	}
	this.dao.query(sql, function(results) {
		var list = [];
		for (var index in results) {
			var result = results[index];
			var category = ModelProxy.genCategory(result);
			list.push(category);
		}
		callback(list);
	});
}

Service.prototype.getLinks = function(link, callback) {
	var sql = 'select * from yad_blog_link';
	if (link != null) {

	}
	this.dao.query(sql, function(results) {
		var list = [];
		for (var index in results) {
			var result = results[index];
			var link = ModelProxy.genLink(result);
			list.push(link);
		}
		callback(list);
	});
}

var service = new Service();
exports.getService = function() {
	return service;
};
