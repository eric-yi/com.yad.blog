
/*
 * Eric Yi on 2014-05-14
 * yi_xiaobin@163.com
 */
Global= require('../global');
var global = Global.getGlobal();

DaoFactory = require('../dao/dao_factory');
var dao_factory = DaoFactory.getFactory();
dao_factory.createDao('mysql');
var dao = dao_factory.getDao();
dao.init(global.getDatabase());

Service = require('../service/service');
var service = Service.getService();
service.setDao(dao);

Constants = require('./constants');
Model = require('../model/model_proxy');

tag = require('../common/tag');
date_util = require('../common/date_util');
Tree = require('../common/tree');

Message = function() {
  this.success = false;
  this.msg = '';

  return {
    success:  this.success,
    msg:      this.msg,

    toSuccessJson: function() {
      this.success = true;
      this.msg = 1;
      return '{"success":"' + this.success + '", "msg":"' + this.msg + '"}';
    },

    toJson: function() {
      return '{"success":"' + this.success + '", "msg":"' + this.msg + '"}';
    }
  };
};

init = function() {
  console.log('initialize ...');
};

init();

getCategoryInFamily = function(condition, callback) {
  service.getCategoryInFamily(condition, function(list) {
    callback(list);
  });
};

getCategories = function(condition, callback) {
  service.getCategories(condition, function(list) {
    var level1 = [];
    for (var n in list) {
      var category = list[n];
      if (category.parent_id == 0)
        level1.push(category);
    }
    level1.sort(function(c1, c2) {
      return c1.position>c2.position ? 1 : -1;
    });

    var arrs = [];
    for (var n in level1) {
      var l1 = level1[n];
      arrs.push(l1);
      var level2 = [];
      for (var m in list) {
        var l2 = list[m];
        if (l2.parent_id == l1.id)
          level2.push(l2);
      }
      level2.sort(function(c1, c2) {
        return c1.position>c2.position ? 1 : -1;
      });
      for (var m in level2) {
        arrs.push(level2[m]);
      }
    }
    callback(arrs);
  });
};

getLinks = function(link, callback) {
  service.getLinks(link, function(list) {
    callback(list);
  });
};

getArticles = function(condition, callback) {
  service.getArticles(condition, function(list) {
    callback(list);
  });
};

getFamilies = function(condition, callback) {
  service.getFamilies(condition, function(list) {
    callback(list);
  });
};

getArticleById = function(id) {
  var filename = global.getBlog().article_path + '/' + id + '.' + global.getBlog().article_suffix;
  var content = service.getArticleContent(filename);
  if (!content) {
    content = getViewHtml(global.getBlog().template_nofound);
  }
  return content;
};

getArticleSummary = function(id) {
  var filename = global.getBlog().article_path + '/' + id + global.getBlog().article_summary_suffix + '.' + global.getBlog().article_suffix;
  var content = service.getArticleContent(filename);
  return content;
};

getArticleTemplate = function() {
  return getViewHtml(global.getBlog().template_article);
};

getAboutTemplate = function() {
  return getViewHtml(global.getBlog().template_about);
};

getAboutContent = function() {
  return getViewHtml(global.getBlog().about_content);
};

function getViewHtml(name) {
  var filename = global.getServer().view + '/' + name + '.' + global.getBlog().article_suffix;
  var content = service.getArticleContent(filename);
  return content;
}

exports.getAbout = function(res) {
  service.getInfo(function(info) {
    var template_html = getAboutTemplate();
    var year = '';
    var month = '';
    var day = '';
    var auth = '';
    var storytitle = '';
    var reply_num = 0;
    if (info) {
      if (info.about_time) {
        var d = date_util.split(info.about_time)
        year = d.year;
        month = d.month;
        day = d.day;
      }
      if (info.auth)              auth = info.auth;
      if (info.about_title)       storytitle = info.about_title;
      if (info.about_reply_num)   reply_num = info.about_reply_num;
    }
    var storycontent = getAboutContent();
    var args = {
      year:                 year,
      month:                month,
      day:                  day,
      storytitle:           storytitle,
      storycontent:         storycontent,
      auth:                 auth,
      reply_num:            reply_num
    };

    if (reply_num != 0) {
      service.getCommentForAbout(function(comments) {
        var comment_list = sortComments(comments);
        args.comment_list = comment_list;
        sendArticle(res, template_html, args);
      });
    } else {
      sendArticle(res, template_html, args);
    }
  });
};


exports.getArticleContentById = function(id, res) {
  service.getArticleParameter(id, function(parameter) {
    var template_html = getArticleTemplate();
    var year = '';
    var month = '';
    var day = '';
    var auth = '';
    var storytitle = '';
    var root_category = '';
    var root_category_path = '';
    var cur_category = '';
    var cur_category_path = '';
    var reply_num = 0;
    if (parameter) {
      if (parameter.publish_time) {
        var d = date_util.split(parameter.publish_time)
        year = d.year;
        month = d.month;
        day = d.day;
      }
      if (parameter.family_id)                  auth_id = parameter.family_id;
      if (parameter.family_name)                auth = parameter.family_name;
      if (parameter.title)                      storytitle = parameter.title;
      if (parameter.category_name)              cur_category = parameter.category_name;
      if (parameter.category_path_name)         cur_category_path = parameter.category_path_name;
      if (parameter.category_parent_name)       root_category = parameter.category_parent_name;
      if (parameter.category_parent_path_name)  root_category_path = parameter.category_parent_path_name;
      if (parameter.reply_num)                  reply_num = parameter.reply_num;
    }
    var storycontent = getArticleById(id);
    var args = {
      id:                   id,
      year:                 year,
      month:                month,
      day:                  day,
      storytitle:           storytitle,
      storycontent:         storycontent,
      auth_id:              auth_id,
      auth:                 auth,
      cur_category:         cur_category,
      cur_category_path:    cur_category_path,
      root_category:        root_category,
      root_category_path:   root_category_path,
      reply_num:            reply_num
    };

    if (reply_num != 0) {
      service.getCommentForArticleId(id, function(comments) {
        var comment_list = sortComments(comments);
        args.comment_list = comment_list;
        sendArticle(res, template_html, args);
      });
    } else {
      sendArticle(res, template_html, args);
    }
  });
};

function sortComments(comments) {
  var root = new Tree(null, null);
  var redList = [];
  for (var n in comments) {
    var comment = comments[n];
    if (comment.target_type == 1 || comment.target_type == 3)
      pushChildTree(redList, comment, root);
  }
  for (var m in root.children)
    putChildComment(root.children[m], comments, redList);
  return treeToComment(root, 1);
}

function treeToComment(tree, sort_type) {
  comment_list = [];
  putNodeToComment(comment_list, tree, sort_type);
  return comment_list;
}

function putNodeToComment(comment_list, tree, sort_type) {
  if (tree.node != null)
    comment_list.push({comment: tree.node});
  tree.sortChildren(sort_type);
  for (var n in tree.children) {
    var child = tree.children[n];
    if (child.node.target_type != 1 && child.node.target_type != 3)
      comment_list.push({comment: child.node, label: 'start'});
    putNodeToComment(comment_list, child, sort_type);
    if (child.node.target_type != 1 && child.node.target_type != 3)
      comment_list.push({comment: child.node, label: 'end'});
  }
}

function putChildComment(tree, comments, redList) {
  for (var n in comments) {
    var comment = comments[n];
    var red = false;
    for (var m in redList) {
      var red_id = redList[m];
      if (red_id == comment.id) {
        red = true;
        break;
      }
    }
    if (red)
      continue;

    if (tree.node && (comment.target_type == 2 || comment.target_type == 4) && comment.target_id == tree.node.id) {
      var child = pushChildTree(redList, comment, tree);
      putChildComment(child, comments, redList);
    }
  }
}

function pushChildTree(redList, comment, tree) {
  redList.push(comment.id);
  var serial = comment.reply_time.getTime();
  var node = new Tree(comment, serial);
  tree.children.push(node);
  return node;
}

function sendArticle(res, template_html, args) {
  var tag_article = new tag.Article(args);
  var html = tag.apply(template_html, tag_article.toList());;
  res.send(html);
}

exports.getBaseDatas = function(callback) {
  getCategories(null, function(categories) {
    getLinks(null, function(links) {
      var datas = {
        blog: Constants.parameters,
        categories: categories,
        links: links
      };
      callback(datas);
    });
  });
};

function genPage(req) {
  var page = Model.genPage();
  page.size = Constants.page_size;
  page.prev = Constants.page_prev;
  page.next = Constants.page_next;
  page.num = 0;
  var params = req.params;
  if (params.page_num)    page.num = params.page_num;

  return page;
}

exports.getArticlesInAction = function(condition, res) {
  getArticles(condition, function(dataset) {
    var json = ModelProxy.toArticleJson(dataset);
    res.send(json);
  });
};

exports.getArticlesByPage = function(condition, page, res) {
  condition.page = page;
  getArticles(condition, function(dataset) {
    var json = ModelProxy.toArticlePageJson(dataset);
    res.send(json);
  });
};

exports.getArticleParameter = function(id, res) {
  service.getArticleParameter(id, function(parameter) {
    var json = '{';
    json += '"article_notfound":"' + global.getBlog().article_notfound + '"'
    if (parameter) {
      if (parameter.publish_time) {
        json += ', "publish_time":"' + parameter.publish_time + '"';
      }
    }
    json += '}';
    res.send(json);
  });
};

exports.getRecentArticle = function(req, res) {
  var condition = {};
  var page = genPage(req);
  page.num = 0;
  page.sql = true;
  page.size = Constants.parameters.recent_post_preview;
  condition.page = page;
  Base.service.getAbstractArticles(condition, function(articles) {
    var json = ModelProxy.toJson(articles);
    res.send(json);
  });
};

exports.getRecentComments = function(req, res) {
  var condition = {};
  var page = genPage(req);
  page.num = 0;
  page.sql = true;
  page.size = Constants.parameters.recent_comment_preview;
  condition.page = page;
  Base.service.getAbstractComments(condition, function(comments) {
    var json = ModelProxy.toJson(comments);
    res.send(json);
  });
};

exports.service = service;
exports.getCategories = getCategories;
exports.getCategoryInFamily = getCategoryInFamily;
exports.getLinks = getLinks;
exports.getArticles = getArticles;
exports.getFamilies = getFamilies;
exports.getArticleById = getArticleById;
exports.genPage = genPage;
exports.getArticleTemplate = getArticleTemplate;
exports.getArticleSummary = getArticleSummary;
exports.Message = Message;
