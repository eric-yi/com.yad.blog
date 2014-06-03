
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

exports.toJson = genJson;

exports.toArticleJson = function(models) {
  return genArticleJson(models)
};

exports.toArticlePageJson = function(model) {
  var dataset = genArticleJson(model.dataset);
  var page = model.page.toJson();
  return '{"dataset":' + dataset + ',"page":' + page + '}';
};

exports.toCategoryJson = function(models) {
  var json = '[';
  var isFirst = true;
  for (var n in models) {
    var model = models[n];
    if (!isFirst) json += ', ';
    json += '{"name":"' + model.name + '","categories":';
    json += genJson(model.categories);
    json += '}'
    if (isFirst) isFirst = false;
  }

  json += ']';
  return json;
};

exports.toFamilyJson = function(models) {
  var families = [];
  for (var n in models) {
    var family = models[n];
    if (family.position != -1)
      families.push(family);
  }

  return genJson(families);
};

function genArticleJson(models) {
  var json = '[';
  var isFirst = true;
  for (var n in models) {
    var model = models[n];
    var article = model.article;
    var category = model.category;
    var writer = model.writer;
    var reply_num = 0;
    if (model.reply_num)    reply_num = model.reply_num;
    if (!isFirst)           json += ', ';
    json += article.toComplexJson(category, writer, reply_num);
    if (isFirst)            isFirst = false;
  }
  json += ']';
  return json;
};

function genJson(models) {
  var json = '[';
  var isFirst = true;
  for (var n in models) {
    var model = models[n];
    if (!isFirst) json += ', ';
    json += model.toJson();
    if (isFirst)  isFirst = false;
  }
  json += ']';
  return json;
};

// only for single model
exports.genArticle = function(row) {
  Article = require('./article');
  var article = new Article();
  if (row['id'] != null)            article.id = row['id'];
  if (row['category_id'] != null)   article.category_id = row['category_id'];
  if (row['family_id'] != null)     article.family_id = row['family_id'];
  if (row['title'] != null)         article.title = row['title'];
  if (row['path_name'] != null)     article.path_name = row['path_name'];
  if (row['publish_time'] != null)  article.publish_time = row['publish_time'];
  if (row['status'] != null)        article.status = row['status'];

  return article;
};

exports.copyArticle = function(_article) {
  Article = require('./article');
  var article = new Article();
  if (_article.id != null)          article.id = _article.id;
  if (_article.category_id != null) article.category_id = _article.category_id;
  if (_article.family_id != null)   article.family_id = _article.family_id;
  if (_article.title != null)       article.title = _article.title;
  if (_article.path_name != null)   article.path_name = _article.path_name;
  if (_article.publish_time != null)article.publish_time = _article.publish_time;
  if (_article.status != null)      article.status = _article.status;
  if (_article.content != null)     article.content = _article.content;

  return article;
};

exports.genCategory = function(row) {
  Category = require('./category');
  var category = new Category();
  if (row['id'] != null)        category.id = row['id'];
  if (row['name'] != null)      category.name = row['name'];
  if (row['parent_id'] != null) category.parent_id = row['parent_id'];

  return article;
};

exports.copyCategory = function(_catetory) {
  Category = require('./category');
  var category = new Category();
  if (_category.id != null)        category.id = _category.id;
  if (_category.name != null)      category.name = _category.name;
  if (_category.parent_id != null) category.parent_id = _category.parent_id;

  return category;
}

exports.genCategory = function(row) {
  Category = require('./category');
  var category = new Category();
  if (row['id'] != null)        category.id = row['id'];
  if (row['name'] != null)      category.name = row['name'];
  if (row['parent_id'] != null) category.parent_id = row['parent_id'];
  if (row['position'] != null)  category.position = row['position'];
  if (row['path_name'] != null) category.path_name = row['path_name'];

  return category;
};

exports.genCategoryWithPrefix = function(row) {
  Category = require('./category');
  var category = new Category();
  if (row['category_id'] != null)               category.id = row['category_id'];
  if (row['category_name'] != null)             category.name = row['category_name'];
  if (row['category_parent_id'] != null)        category.parent_id = row['category_parent_id'];
  if (row['category_path_name'] != null)        category.path_name = row['category_path_name'];
  if (row['category_parent_name'] != null)      category.parent_name = row['category_parent_name'];
  if (row['category_parent_path_name'] != null) category.parent_path_name = row['category_parent_path_name'];

  return category;
};

exports.genLink = function(row) {
  Link = require('./link');
  var link = new Link();
  if (row['id'] != null)    link.id = row['id'];
  if (row['name'] != null)  link.name = row['name'];
  if (row['url'] != null)   link.url = row['url'];

  return link;
};

exports.genComment = function(row) {
  Comment = require('./comment');
  var comment = new Comment();
  if (row['id'] != null)            comment.id = row['id'];
  if (row['target_type'] != null)   comment.target_type = row['target_type'];
  if (row['target_id'] != null)     comment.target_id = row['target_id'];
  if (row['family_id'] != null)     comment.target_id = row['family_id'];
  if (row['name'] != null)          comment.name = row['name'];
  if (row['email'] != null)         comment.email = row['email'];
  if (row['content'] != null)       comment.content = row['content'];
  if (row['reply_time'] != null)    comment.reply_time = row['reply_time'];

  return comment;
};

exports.genComplexComment = function(row) {
  CommentComplex = require('./comment_complex');
  var comment = new CommentComplex();
  if (row['article_id'] != null)    comment.article_id = row['article_id'];
  if (row['title'] != null)         comment.title = row['title'];
  if (row['auth'] != null)          comment.auth = row['auth'];
  if (row['comment_id'] != null)    comment.reply_id = row['reply_id'];
  if (row['target_type'] != null)   comment.target_type = row['target_type'];
  if (row['target_id'] != null)     comment.target_id = row['target_id'];
  if (row['family_id'] != null)     comment.target_id = row['family_id'];
  if (row['name'] != null)          comment.name = row['name'];
  if (row['email'] != null)         comment.email = row['email'];
  if (row['content'] != null)       comment.content = row['content'];
  if (row['replyt_time'] != null)   comment.reply_time = row['reply_time'];

  return comment;
};

exports.genFamily = function(row) {
  Family = require('./master_family');
  var family = new Family();
  if (row['id'] != null)          family.id = row['id'];
  if (row['position'] != null)    family.position = row['position'];
  if (row['username'] != null)    family.username = row['username'];
  if (row['password'] != null)    family.password = row['password'];
  if (row['name'] != null)        family.name = row['name'];
  if (row['member_id'] != null)   family.member_id = row['member_id'];
  if (row['email'] != null)       family.email = row['email'];
  if (row['qq'] != null)          family.qq = row['qq'];
  if (row['weibo'] != null)       family.weibo = row['weibo'];
  if (row['weico'] != null)       family.weico = row['weico'];

  return family;
};

exports.copyFamily = function(_family) {
  Family = require('./master_family');
  var family = new Family();
  if (_family.id != null)          family.id = _family.id;
  if (_family.position != null)    family.position = _family.position;
  if (_family.username != null)    family.username = _family.username;
  if (_family.password != null)    family.password = _family.password;
  if (_family.name != null)        family.name = _family.name;
  if (_family.member_id != null)   family.member_id = _family.member_id;
  if (_family.email != null)       family.email = _family.email;
  if (_family.qq != null)          family.qq = _family.qq;
  if (_family.weibo != null)       family.weibo = _family.weibo;
  if (_family.weico != null)       family.weico = _family.weico;

  return family;
};

exports.genCategoryFamily = function(row) {
  CF = require('./category_family');
  var cf = new CF();
  if (row['id'] != null)          cf.id = row['id'];
  if (row['category_id'] != null) cf.category_id = row['category_id'];
  if (row['family_id'] != null)   cf.family_id = row['family_id'];

  return cf;
};

exports.genPage = function() {
  Page = require('./page');
  var page = new Page();
  return page;
};

exports.genInfo = function(row) {
  Info = require('./info');
  var info = new Info();
  if (row['title'] != null)             info.title = row['title'];
  if (row['subtitle'] != null)          info.subtitle = row['subtitle'];
  if (row['auth'] != null)              info.auth = row['auth'];
  if (row['auth_alias'] != null)        info.auth_alias = row['auth_alias'];
  if (row['email'] != null)             info.email = row['email'];
  if (row['about_title'] != null)       info.about_title = row['about_title'];
  if (row['about_time'] != null)        info.about_time = row['about_time'];
  if (row['about_reply_num'] != null)   info.about_reply_num = row['about_reply_num'];

  return info;
};
