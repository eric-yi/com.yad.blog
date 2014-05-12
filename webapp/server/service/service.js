
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

Service.prototype.getArticle = function(article, callback) {
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

var service = new Service();

exports.getService = function() {
	return service;
};
