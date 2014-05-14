
/*
 * Erci Yi on 2014-05-12
 * yi_xiaobin@163.com
 */

exports.genArticle = function(row) {
	Article = require('./article');
	var article = new Article();
	if (row['id'] != null)							article.setId(row['id']);
	if (row['title'] != null)						article.setTitle(row['title']);
	if (row['path_name'] != null)				article.setPath_name(row['path_name']);
	if (row['publish_time'] != null)		article.setPublish_time(row['publish_time']);

	return article;
};

exports.genCategory = function(row) {
	Category = require('./category');
	var category = new Category();
	if (row['id'] != null)							category.setId(row['id']);
	if (row['name'] != null)						category.setName(row['name']);
	if (row['parent_id'] != null)				category.setParent_id(row['parent_id']);
	if (row['position'] != null)				category.setPosition(row['position']);
	if (row['path_name'] != null)				category.setPath_name(row['path_name']);

	return category;
};

exports.genLink = function(row) {
	Link = require('./link');
	var link = new Link();
	if (row['id'] != null)							link.setId(row['id']);
	if (row['name'] != null)						link.setName(row['name']);
	if (row['url'] != null)							link.setUrl(row['url']);

	return link;
};
