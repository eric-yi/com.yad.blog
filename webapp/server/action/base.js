
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
		filename = global.getServer().view + '/' + global.getBlog().template_notfound + '.' + global.getBlog().article_suffix;
  	content = service.getArticleContent(filename);
	}
  return content;
};

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
