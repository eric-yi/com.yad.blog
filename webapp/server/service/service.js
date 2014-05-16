
/*
 * Eric Yi on 2014-05-12
 * yi_xiaobin@163.com
 */

ModelProxy = require('../model/model_proxy');
Cache = require('./cache');
var cache = Cache.getCache();

Service = function() {
	this.dao;	
};

Service.prototype.setDao = function(dao) {
	this.dao = dao;
};

Service.prototype.getDao = function(dao) {
	return this.dao;
}

Service.prototype.getArticles = function(condition, callback) {
	var sql = 'select a.*, c.name as category_name, c.path_name as category_path_name, c.parent_name as category_parent_name, c.parent_path_name as category_parent_path_name from yad_blog_article a, yad_blog_v_category c where a.category_id = c.id order by a.publish_time desc';
	var page;
	var model;
	if (condition != null) {
		if (condition.page != null)			page = condition.page;
		if (condition.model != null)		model = condition.model;
	}
	if (cache.contains(sql)) {
		var dataset = makePage(page, cache.get(sql));	
		callback(dataset);
	} else {
		this.dao.query(sql, function(results) {
			var list = [];
			for (var index in results) {
				var result = results[index];
				var article = ModelProxy.genArticle(result);
				var category = ModelProxy.genCategoryWithPrefix(result);
				list.push({article: article, category: category});
			}
			cache.put(sql, list);
			var dataset = makePage(page, list);
			callback(list);
		});
	}
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

function makePage(page, dataset) {
	if (page) {
		var start = page.next * page.size;
		var end = start + page.size > page.total ? page.total : start + page.size;
		return dataset.splice[start, end];
	}

	return null;
}


var service = new Service();
exports.getService = function() {
	return service;
};
