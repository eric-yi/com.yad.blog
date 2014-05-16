
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

exports.genPage = function(req) {
  var page = Model.genPage();
  page.size = Constants.page_size;
  page.prev = Constants.page_prev;
  page.next = Constants.page_next;
  page.num = 0;
  var params = req.params;
  if (params.page_num)    page.num = params.page_num;

  return page;	
};

exports.service = service;
exports.getCategories = getCategories;
exports.getLinks = getLinks;
exports.getArticles = getArticles;
