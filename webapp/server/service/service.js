
/*
 * Eric Yi on 2014-05-12
 * yi_xiaobin@163.com
 */

Global = require('../global');
var global = Global.getGlobal();
var server = global.getServer();
var cached = server.cached;
ModelProxy = require('../model/model_proxy');
Cache = require('./cache');
var cache = Cache.getCache();
FileUtil = require('../common/file_util');

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
    var sql = 'select a.*, c.name as category_name, c.path_name as category_path_name, c.parent_name as category_parent_name, c.parent_path_name as category_parent_path_name, f.name as family_name from yad_blog_article a, yad_blog_v_category c, yad_blog_master_family f where a.category_id = c.id and a.family_id = f.id';
    if (condition) {
			if (condition.category) {
      	var cate_tree = condition.category;
      	if (cate_tree.length == 2)
        	sql += ' and c.path_name = "' + cate_tree[1] + '"';
      	if (cate_tree.length == 1)
       	 sql += ' and (c.parent_path_name = "' + cate_tree[0] + '" or c.path_name = "' + cate_tree[0] + '")';
			}

			if (condition.fid != null) {
				sql += ' and f.id = "' + condition.fid + '"';
			}
    }
    sql += ' order by a.publish_time desc';
   	var container = new Container(condition=condition, sql=sql, callback=callback);
    if (condition.page && condition.page.sql) {
			_dao.total(sql, function(total) {
				condition.page.total = total;
				handlePage(condition.page);
				sql += ' limit ' + condition.page.start + ', ' + condition.page.end;
				container.sql = sql;
				fetchArticles(_dao, container, replies);
			});
		} else {
			fetchArticles(_dao, container, replies);
		}
  });
};

Service.prototype.getArticleParameter = function(id, callback) {
  var sql = 'select a.*, c.name as category_name, c.path_name as category_path_name, c.parent_name as category_parent_name, c.parent_path_name as category_parent_path_name, f.name as family_name, r.reply_num as reply_num from yad_blog_article a, yad_blog_v_category c, yad_blog_master_family f, (select article_id, count(*) as reply_num from yad_blog_reply where article_id ="' + id + '") r where a.category_id = c.id and a.family_id = f.id and a.id = "' + id + '"';
  this.dao.query(sql, function(results) {
		var result;
		if (results.length > 0) {
			result = results[0];
		}
    callback(result);
  });
};

Service.prototype.getAbstractArticles = function(condition, callback) {
	handlePage(condition.page);
	var sql = 'select * from yad_blog_article order by publish_time desc limit ' + condition.page.start + ', ' + condition.page.end;
  this.dao.query(sql, function(results) {
		var list = [];
		for (var n  in results) {
			var result = results[n];
     	var article = ModelProxy.genArticle(result);
			list.push(article);
		}
		callback(list);
	});
};

Service.prototype.getAbstractReplies = function(condition, callback) {
	handlePage(condition.page);
	var sql = 'select * from yad_blog_v_reply_article limit ' + condition.page.start + ', ' + condition.page.end;
  this.dao.query(sql, function(results) {
		var list = [];
		for (var n  in results) {
			var result = results[n];
     	var reply = ModelProxy.genComplexReply(result);
			list.push(reply);
		}
		callback(list);
	});
};

Service.prototype.getReplyForArticleId = function(article_id, callback) {
	var sql = 'select * from yad_blog_v_reply_info r where r.article_id = "' + article_id + '" order by r.target_type, reply_time desc';
	queryReply(this.dao, sql, callback);
};

Service.prototype.getArticleContent = function(filename) {
  return FileUtil.read(filename);
}

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

function queryReply(_dao, sql, callback) {
	_dao.query(sql, function(results) {
		var list = [];
		for (var n  in results) {
			var result = results[n];
     	var reply = ModelProxy.genReply(result);
			list.push(reply);
		}
		callback(list);
	});
}

function fetchArticles(_dao, container, replies) {
  if (!cacheQuery(container)) {
  	_dao.query(container.sql, function(results) {
    	var list = [];
      for (var index in results) {
        var result = results[index];
        var article = ModelProxy.genArticle(result);
        var category = ModelProxy.genCategoryWithPrefix(result);
        var reply_list = [];
        fetchReply(reply_list, article.id, 1, replies);
        list.push({article: article, category: category, writer: result['family_name'], replies: reply_list, reply_num: reply_list.length});
      }
      putCache(container.sql, list);
      var dataset = paging(container.condition.page, list);
      if (container.condition.page) {
        dataset = {dataset: dataset, page: container.condition.page};
      }
      container.callback(dataset);
    });
  }
}

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

function handlePage(page) {
	var start = page.num * page.size;
  var end = parseInt(start) + parseInt(page.size);
 	end = end > page.total ? page.total : end;
	page.start = start;
	page.end = end;
}

function paging(page, dataset) {
  if (page) {
		if (!page.sql)
			page.total = dataset.length;
    var start = page.num * page.size;
    var end = parseInt(start) + parseInt(page.size);
		if (page.sql)
			end = parseInt(start) + dataset.length;
		else
    	end = end > page.total ? page.total : end;
    page.current = end - start;
		page.start = start;
		page.end = end;

    if (page.end == 0) return [];
		if (page.sql)
			return dataset;
		else
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
		var dataset = cache.get(sql);
		if (page && !page.sql)
    	dataset = paging(page, cache.get(sql));
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

  if (condition)  _condition = condition;
  if (sql)        _sql = sql;
  if (callback)   _callback = callback;

  return {
    condition: _condition,
    sql:			_sql,
    callback: _callback
  };
}

var service = new Service();
exports.getService = function() {
  return service;
};
