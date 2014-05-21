
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
		filename = global.getServer().view + '/' + global.getBlog().template_nofound + '.' + global.getBlog().article_suffix;
  	content = service.getArticleContent(filename);
	}
  return content;
};

getArticleTemplate = function() {
	var filename = global.getServer().view + '/' + global.getBlog().template_article + '.' + global.getBlog().article_suffix;
	console.log(filename);
  var content = service.getArticleContent(filename);
  return content;
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
			if (parameter.family_name)									auth = parameter.family_name;
			if (parameter.title)												storytitle = parameter.title;
			if (parameter.category_name)								cur_category = parameter.category_name;
			if (parameter.category_path_name)						cur_category_path = parameter.category_path_name;
			if (parameter.category_parent_name)					root_category = parameter.category_parent_name;
			if (parameter.category_parent_path_name)		root_category_path = parameter.category_parent_path_name;
			if (parameter.reply_num)										reply_num = parameter.reply_num;
		}
		var storycontent = getArticleById(id);
		var args = {
			id:									id,
			year:								year,
			month:							month,
			day:								day,
			storytitle:					storytitle,
			storycontent:				storycontent,
			auth:								auth,
			cur_category:				cur_category,
			cur_category_path:	cur_category_path,
			root_category:			root_category,
			root_category_path:	root_category_path,
			reply_num:					reply_num
		};

		if (reply_num != 0) {
			service.getReplyForArticleId(id, function(replies) {
				var reply_list = sortReplies(replies);	
				args.reply_list = reply_list;
				sendArticle(res, template_html, args);
			});
		} else {
			sendArticle(res, template_html, args);
		}	
	});
};


function sortReplies(replies) {
	var root = new Tree(null, null);
	var redList = [];
	putChildReply(root, replies, redList);
	return root.genNodeList();
}

function putChildReply(tree, replies, redList) {
	for (var n in replies) {
		var reply = replies[n];
		var red = false;
		for (var m in redList) {
			var red_id = redList[m];
			if (red_id == reply.id) {
				red = true;
				break;
			}
		}
		if (red)
			continue;
	
		if (reply.target_type == 1 || (tree.node && reply.target_type == 2 && reply.target_id == tree.node.id)) {
			redList.push(reply.id);
			var serial = reply.reply_time.getTime();
			var child = new Tree(reply, serial);
			tree.children.push(child);
			putChildReply(child, replies, redList);
		}
	}
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
  Base.getArticles(condition, function(dataset) {
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

exports.getRecentReply = function(req, res) {
	var condition = {};
	var page = genPage(req);
	page.num = 0;
	page.sql = true;
	page.size = Constants.parameters.recent_reply_preview;
	condition.page = page;
	Base.service.getAbstractReplies(condition, function(replies) {
		var json = ModelProxy.toJson(replies);
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
