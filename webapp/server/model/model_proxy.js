
/*
 * Erci Yi on 2014-05-12
 * yi_xiaobin@163.com
 */

exports.genArticle = function(row) {
	Article = require('./Article');
	var article = new Article();
	if (row['id'] != null)							article.setId(row['id']);
	if (row['title'] != null)						article.setTitle(row['title']);
	if (row['path_name'] != null)				article.setPath_name(row['path_name']);
	if (row['publish_time'] != null)		article.setPublish_time(row['publish_time']);

	return article;
};
