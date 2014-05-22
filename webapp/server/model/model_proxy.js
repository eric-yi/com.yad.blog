
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
    if (model.reply_num)  reply_num = model.reply_num;
    if (!isFirst)         json += ', ';
    json += article.toComplexJson(category, writer, reply_num);
    if (isFirst)          isFirst = false;
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

  return article;
};

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

exports.genReply = function(row) {
  Reply = require('./reply');
  var reply = new Reply();
  if (row['id'] != null)          reply.id = row['id'];
  if (row['target_type'] != null) reply.target_type = row['target_type'];
  if (row['target_id'] != null)   reply.target_id = row['target_id'];
  if (row['family_id'] != null)   reply.target_id = row['family_id'];
  if (row['name'] != null)        reply.name = row['name'];
  if (row['email'] != null)       reply.email = row['email'];
  if (row['content'] != null)     reply.content = row['content'];
  if (row['reply_time'] != null)  reply.reply_time = row['reply_time'];

  return reply;
};

exports.genComplexReply = function(row) {
  ReplyComplex = require('./reply_complex');
  var reply = new ReplyComplex();
  if (row['article_id'] != null)  reply.article_id = row['article_id'];
  if (row['title'] != null)       reply.title = row['title'];
  if (row['auth'] != null)        reply.auth = row['auth'];
  if (row['reply_id'] != null)    reply.reply_id = row['reply_id'];
  if (row['target_type'] != null) reply.target_type = row['target_type'];
  if (row['target_id'] != null)   reply.target_id = row['target_id'];
  if (row['family_id'] != null)   reply.target_id = row['family_id'];
  if (row['name'] != null)        reply.name = row['name'];
  if (row['email'] != null)       reply.email = row['email'];
  if (row['content'] != null)     reply.reply_path = row['content'];
  if (row['reply_time'] != null)  reply.reply_time = row['reply_time'];

  return reply;
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
}
