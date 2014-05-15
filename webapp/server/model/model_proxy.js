
/*
 * Erci Yi on 2014-05-12
 * yi_xiaobin@163.com
 */
// common function
exports.toArray = function(models) {
	var arr = [];
	for (var n in models) {
		var model = models[n];
		arr.push(model);
	}
	return arr;
};

exports.toJson = function(models) {
	var json = '[';
	var isFirst = true;
	for (var n in models) {
		var model = models[n];
		if (!isFirst) json += ', ';
		json += model.toJson();	
		if (isFirst)	isFirst = false;
	}
	json += ']';
	return json;
};

exports.toArticleInCatetoryJson = function(models) {
	var json = '[';
	var isFirst = true;
	for (var n in models) {
		var model = models[n];
		var article = model.article;	
		var category = model.category;
		if (!isFirst) json += ', ';
		json += article.toJson(category);	
		if (isFirst)	isFirst = false;
	}
	json += ']';
	return json;
};


// only for single model
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

exports.genCategoryWithPrefix = function(row) {
	Category = require('./category');
	var category = new Category();
	if (row['category_id'] != null)									category.setId(row['category_id']);
	if (row['category_name'] != null)								category.setName(row['category_name']);
	if (row['category_parent_id'] != null)					category.setParent_id(row['category_parent_id']);
	if (row['category_path_name'] != null)					category.setPath_name(row['category_path_name']);
	if (row['category_parent_name'] != null)				category.setParent_name(row['category_parent_name']);
	if (row['category_parent_path_name'] != null)		category.setParent_path_name(row['category_parent_path_name']);

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
