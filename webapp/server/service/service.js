
/*
 * Eric Yi on 2014-05-12
 * yi_xiaobin@163.com
 */

Global = require('../global');
var cached = Global.getGlobal().getServer().cached;
ModelProxy = require('../model/model_proxy');
Cache = require('./cache');
var cache = Cache.getCache();

Service = function() {
  this.dao;
};

Service.prototype.setDao = function(dao) {
  this.dao = dao;
};

Service.prototype.getDao = function(dao) {
  return this.dao;
}

Service.prototype.getArticles = function(condition, callback) {
  var _dao = this.dao;
  getReplyForArticle(_dao, function(replies) {
    var sql = 'select a.*, c.name as category_name, c.path_name as category_path_name, c.parent_name as category_parent_name, c.parent_path_name as category_parent_path_name, f.name as family_name from yad_blog_article a, yad_blog_v_category c, yad_blog_master_family f where a.category_id = c.id and a.family_id = f.id order by a.publish_time desc';
    var page;
    var model;
    if (condition != null) {
      if (condition.page != null)   page = condition.page;
      if (condition.model != null)  model = condition.model;
    }

    var container = new Container(condition=condition, sql=sql, callback=callback);
    if (!cacheQuery(container)) {
      _dao.query(sql, function(results) {
        var list = [];
        for (var index in results) {
          var result = results[index];
          var article = ModelProxy.genArticle(result);
          var category = ModelProxy.genCategoryWithPrefix(result);
          var reply_list = [];
          fetchReply(reply_list, article.id, 1, replies);
          list.push({article: article, category: category, writer: result['family_name'], replies: reply_list, reply_num: reply_list.length});
        }
        putCache(sql, list);
        var dataset = paging(page, list);
        if (page) {
          dataset = {dataset: dataset, page: page};
        }
        callback(dataset);
      });
    }
  });
};

Service.prototype.getCategories = function(condition, callback) {
  var sql = 'select * from yad_blog_category';
  this.dao.query(sql, function(results) {
    var list = convertCategory(results);
    callback(list);
  });
};

Service.prototype.getFamilies = function(condition, callback) {
  var sql = 'select * from yad_blog_master_family order by position asc';
  this.dao.query(sql, function(results) {
    var list = [];
    for (var index in results) {
      var result = results[index];
      var family = ModelProxy.genFamily(result);
      list.push(family);
    }
    callback(list);
  });
};

Service.prototype.getFamilyCategory = function(condition, callback) {
  var sql = 'select * from yad_blog_category_family';
  this.dao.query(sql, function(results) {
    var list = [];
    for (var index in results) {
      var result = results[index];
      var cf = ModelProxy.genCategoryFamily(result);
      list.push(cf);
    }
    callback(list);
  });
};

Service.prototype.getCategoryInFamily = function(condition, callback) {
  var sql = 'select * from yad_blog_category';
  var _dao = this.dao;
  _dao.query(sql, function(category_results) {
    sql = 'select id, name from yad_blog_master_family where position != -1 order by position asc';
    _dao.query(sql, function(family_results) {
      sql = 'select * from yad_blog_category_family';
      _dao.query(sql, function(cf_results) {
        var category_list = convertCategory(category_results);
        var level1 = [];
        for (var n in category_list) {
          var category = category_list[n];
          if (category.parent_id == 0)
            level1.push(category);
        }
        level1.sort(function(c1, c2) {
          return c1.position>c2.position ? 1 : -1;
        });

        var category_arrs = [];
        for (var n in level1) {
          var l1 = level1[n];
          var level2 = [];
          for (var m in category_list) {
            var l2 = category_list[m];
            if (l2.parent_id == l1.id)
              level2.push(l2);
          }
          level2.sort(function(c1, c2) {
            return c1.position>c2.position ? 1 : -1;
          });
          category_arrs.push({l1: l1, l2: level2});
        }

        var list = [];
        for (var index in family_results) {
          var member_info = [];
          var result = family_results[index];
          var family_id = result['id'];
          var family_name = result['name'];
          var categories = [];
          for (var n in cf_results) {
            var cf = ModelProxy.genCategoryFamily(cf_results[n]);
            if (cf.family_id == family_id) {
              for (var m in category_arrs) {
                var c_info = category_arrs[m];
                var l1 = c_info.l1;
                if (l1.id == cf.category_id) {
                  categories.push(l1);
                  for (var i in c_info.l2) {
                    categories.push(c_info.l2[i])
                  }
                }
              }
            }
          }
          member_info = {name: family_name, categories: categories};
          list.push(member_info);
        }
        callback(list);
      });
    });
  });

};

Service.prototype.getLinks = function(link, callback) {
  var sql = 'select * from yad_blog_link';
  if (link != null) {

  }
  this.dao.query(sql, function(results) {
    var list = [];
    for (var index in results) {
      var result = results[index];
      var link = ModelProxy.genLink(result);
      list.push(link);
    }
    callback(list);
  });
};

function getReplyForArticle(dao, callback) {
  var sql = 'select * from yad_blog_reply where target_type != 3';
  var container = new Container(condition=null, sql=sql, callback=callback);
  if (!cacheQuery(container)) {
    dao.query(sql, function(results) {
      var list = [];
      for (var index in results) {
        var result = results[index];
        var reply = ModelProxy.genReply(result);
        list.push(reply);
      }
      putCache(sql, list);
      callback(list);
    });
  }
}

function fetchReply(results, id, target_type, replies) {
  for (var n in replies) {
    var reply = replies[n];
    if (reply.target_id==id && reply.target_type==target_type) {
      results.push(reply);
      fetchReply(results, reply.id, 2, replies);
    }
  }
}

function paging(page, dataset) {
  if (page) {
    page.total = dataset.length;
    var start = page.num * page.size;
    var end = parseInt(start) + parseInt(page.size);
    end = end > page.total ? page.total : end;
    page.current = end - start;
    if (end == 0) return [];
    return dataset.slice(start, end);
  }

  return dataset;
}

function cacheQuery(container) {
  var sql = container.sql;
  if (cached && cache.contains(sql)) {
    console.log('get form cahce');
    var page;
    if (container.condition)	page = container.condition.page;
    var dataset = paging(page, cache.get(sql));
    container.callback(dataset)
    return true;
  }

  return false;
}

function putCache(sql, list) {
  if (cached)
    cache.put(sql, list);
}

function convertCategory(results) {
  var list = [];
  for (var index in results) {
    var result = results[index];
    var category = ModelProxy.genCategory(result);
    list.push(category);
  }
  return list;
}

Container = function(condition, sql, callback) {
  var _condition;
  var _sql;
  var _callback;

  if (condition)  this._condition = condition;
  if (sql)        this._sql = sql;
  if (callback)   this._callback = callback;

  return {
    condition: this._condition,
    sql: this._sql,
    callback: this._callback
  };
}

var service = new Service();
exports.getService = function() {
  return service;
};
