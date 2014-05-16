
/*
 * Eric Yi on 2014-05-12
 * yi_xiaobin@163.com
 */

Global = require('../global');
var cached = Global.getGlobal().getServer().cached;
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
	var _dao = this.dao;
	getReplyForArticle(_dao, function(replies) {
		var sql = 'select a.*, c.name as category_name, c.path_name as category_path_name, c.parent_name as category_parent_name, c.parent_path_name as category_parent_path_name from yad_blog_article a, yad_blog_v_category c where a.category_id = c.id order by a.publish_time desc';
		var page;
		var model;
		if (condition != null) {
			if (condition.page != null)			page = condition.page;
			if (condition.model != null)		model = condition.model;
		}

		var container = new Container(condition=condition, sql=sql, callback=callback);
		if (!cacheQuery(container)) {
			_dao.query(sql, function(results) {
				var list = [];
				for (var index in results) {
					var result = results[index];
					var article = ModelProxy.genArticle(result);
					var category = ModelProxy.genCategoryWithPrefix(result);
					var reply_list = [];
					fetchReply(reply_list, article.id, 1, replies);
					list.push({article: article, category: category, replies: reply_list, reply_num: reply_list.length});
				}
				putCache(sql, list);
				var dataset = paging(page, list);
				callback(dataset);
			});
		}
	});
};

Service.prototype.getCategories = function(condition, callback) {
	var sql = 'select * from yad_blog_category';
	this.dao.query(sql, function(results) {
		var list = [];
		for (var index in results) {
			var result = results[index];
			var category = ModelProxy.genCategory(result);
			list.push(category);
		}
		callback(list);
	});
};

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
};

function getReplyForArticle(dao, callback) {
	var sql = 'select * from yad_blog_reply where target_type != 3';
	var container = new Container(condition=null, sql=sql, callback=callback);
	if (!cacheQuery(container)) {
		dao.query(sql, function(results) {
			var list = [];
			for (var index in results) {
				var result = results[index];
				var reply = ModelProxy.genReply(result);
				list.push(reply);
			}
			putCache(sql, list);
			callback(list);
		});
	}
}

function fetchReply(results, id, target_type, replies) {
	for (var n in replies) {
		var reply = replies[n];
		if (reply.target_id==id && reply.target_type==target_type) {
			results.push(reply);
			fetchReply(results, reply.id, 2, replies);
		}
	}
}

function paging(page, dataset) {
	if (page) {
		var start = page.next * page.size;
		var end = parseInt(start + page.size);
		end = end > page.total ? page.total : end;
		if (end == 0)	return [];
		return dataset.slice(start, end);
	}

	return dataset;
}

function cacheQuery(container) {
	var sql = container.sql;
	if (cached && cache.contains(sql)) {
		console.log('get form cahce');
		var page;
		if (container.condition)	page = container.condition.page;
		var dataset = paging(page, cache.get(sql));
		container.callback(dataset)
		return true;
	}

	return false;
}

function putCache(sql, list) {
	if (cached)
		cache.put(sql, list);
}

Container = function(condition, sql, callback) {
	var _condition;
	var _sql;
	var _callback;

	if (condition)		this._condition = condition;
	if (sql)					this._sql = sql;
	if (callback)			this._callback = callback;

	return {
		condition: this._condition,
		sql: this._sql,
		callback: this._callback
	};
}

var service = new Service();
exports.getService = function() {
	return service;
};
