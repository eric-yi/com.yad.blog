
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
file_util = require('../common/file_util');
string_util = require('../common/string_util');
date_util = require('../common/date_util');

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
  getCommentForArticle(_dao, function(comments) {
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

      if (condition.family_id != null) {
        sql += ' and a.family_id = ' + condition.family_id;
      }
    }
    sql += ' and a.status = 0';
    sql += ' order by a.publish_time desc';
    var container = new Container(condition=condition, sql=sql, callback=callback);
    if (condition.page && condition.page.sql) {
      _dao.total(sql, function(total) {
        condition.page.total = total;
        handlePage(condition.page);
        sql += ' limit ' + condition.page.start + ', ' + condition.page.end;
        container.sql = sql;
        fetchArticles(_dao, container, comments);
      });
    } else {
      fetchArticles(_dao, container, comments);
    }
  });
};

Service.prototype.getArticleParameter = function(id, callback) {
  var sql = 'select a.*, c.name as category_name, c.path_name as category_path_name, c.parent_id as category_parent_id, c.parent_name as category_parent_name, c.parent_path_name as category_parent_path_name, f.name as family_name, r.reply_num as reply_num from yad_blog_article a, yad_blog_v_category c, yad_blog_master_family f, (select article_id, count(*) as reply_num from yad_blog_comment where article_id ="' + id + '") r where a.category_id = c.id and a.family_id = f.id and a.id = "' + id + '"';
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

Service.prototype.getAbstractComments = function(condition, callback) {
  handlePage(condition.page);
  var sql = 'select * from yad_blog_v_comment_article limit ' + condition.page.start + ', ' + condition.page.end;
  this.dao.query(sql, function(results) {
    var list = [];
    for (var n  in results) {
      var result = results[n];
      var comment = ModelProxy.genComplexComment(result);
      list.push(comment);
    }
    callback(list);
  });
};

Service.prototype.getCommentForArticleId = function(article_id, callback) {
  var sql = 'select * from yad_blog_v_comment_info where article_id = "' + article_id + '" order by target_type, reply_time';
  queryComment(this.dao, sql, callback);
};

Service.prototype.getCommentForAbout = function(callback) {
  var sql = 'select * from yad_blog_comment where target_type in (3, 4) order by reply_time';
  queryComment(this.dao, sql, callback);
};

Service.prototype.getArticleContent = function(filename) {
  return file_util.read(filename);
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

Service.prototype.getRootCategoriesInFamily = function(id, callback) {
	var sql = 'select c.* from yad_blog_category c, yad_blog_category_family f where c.parent_id = 0 and c.id = f.category_id and f.family_id = ' + id + ' order by c.position';
	if (id == 1)
		sql = 'select * from yad_blog_category where parent_id = 0 order by position';
	this.dao.query(sql, function(results) {
		var category_list = convertCategory(results);
		callback(category_list);
	});
};

Service.prototype.getSecondCategories = function(parent_id, callback) {
	var sql = 'select * from yad_blog_category where parent_id = ' + parent_id + ' order by position';
	this.dao.query(sql, function(results) {
		var category_list = convertCategory(results);
		callback(category_list);
	});
};


Service.prototype.getCategoriesInFamily = function(family_id, callback) {
	var sql = 'select c.* from yad_blog_category_family cf , yad_blog_category c where cf.family_id = ' + family_id + ' and (cf.category_id = c.id or cf.category_id = c.parent_id)';
	this.dao.query(sql, function(results) {
		var category_list = convertCategory(results);
		callback(category_list);
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

Service.prototype.addLink = function(link, callback) {
  var _dao = this.dao;
  var sql = 'select * from yad_blog_link where name = ' + link.name + ' or url = ' + link.url;
  _dao.query(sql, function(results) {
    if (results.length > 0) {
      callback(-11);
    } else {
      sql = 'insert into yad_blog_link(name, url) values(' + link.name + ', ' + link.url + ')';
      _dao.insert(sql, function(result) {
        callback(1);
      });
    }
  });
}

Service.prototype.deleteLink = function(id, callback) {
  var sql = 'delete from yad_blog_link where id = ' + id;
  this.dao.del(sql, function(result) {
    callback(1);
  });
}

Service.prototype.addComment = function(comment, callback) {
  var sql = 'insert into yad_blog_comment(target_type, target_id, family_id, article_id, name, email, content, reply_time) values('
            + comment.target_type + ', '
            + comment.target_id + ', '
            + comment.family_id + ', '
            + comment.article_id + ', '
            + comment.name + ', '
            + comment.email + ', '
            + comment.content + ', '
            + comment.reply_time + ')';
  this.dao.insert(sql, function(result) {
    callback(result);
  });
};

Service.prototype.getInfo = function(callback) {
  var sql = 'select a.*, b.* from yad_blog_info a, (select count(*) as about_reply_num from yad_blog_comment where target_type = 3) b';
  this.dao.query(sql, function(results) {
    var info = ModelProxy.genInfo(results[0]);
    callback(info);
  });
};

Service.prototype.getFamilyByLogin = function(username, password, callback) {
  var sql = 'select * from yad_blog_master_family where username = "' + username + '" and password = "' + password + '"';
  this.dao.query(sql, function(results) {
    var info = {code: -2};
    if (results.length > 0) {
      info.code = 0;
      info.family = ModelProxy.genFamily(results[0]);
    }
    callback(info);
  });
};

Service.prototype.addFamily = function(family, callback) {
  var _dao = this.dao;
  var sql = 'select * from yad_blog_master_family where username = ' + family.username + 'or name = ' + family.name;
  if (family.member_id == 2 || family.member_id == 3)
    sql += ' or member_id = ' + family.member_id;
  _dao.query(sql, function(rs) {
    if (rs.length > 0) {
      callback(-11);
    } else {
      sql = 'insert into yad_blog_master_family(username, password, name, member_id, position, email, qq, weibo, weico) values('
      + family.username + ','
      + family.password + ','
      + family.name + ','
      + family.member_id + ','
      + family.position + ','
      + family.email + ','
      + family.qq + ','
      + family.weibo + ','
      + family.weico + ')';
      _dao.insert(sql, function(result) {
        callback(1);
      });
    }
  });
};

Service.prototype.deleteFamily = function(id, callback) {
  var _dao = this.dao;
  resourcesInFamily(_dao, id, function(resource) {
    var category_ids = resource.category_ids;
    var articles = resource.articles;
    if (articles.length > 0) {
      callback(-11);
    } else if (category_ids.length > 0) {
      callback(-12);
    } else {
      sql = 'delete from yad_blog_master_family where id = ' + id;
      _dao.del(sql, function(result) {
        callback(1);
      });
    }
  });
};

Service.prototype.updateFamily = function(family, callback) {
  var _dao = this.dao;
  var sql = 'select * from yad_blog_master_family where name = ' + family.name;
  _dao.query(sql, function(rs) {
    if (rs.length > 0) {
      callback(-1);
    } else {
      sql = 'update yad_blog_master_family set' +
        ' name = ' + family.name +
        ', password = ' + family.password +
        ', email = ' + family.email +
        ', qq = ' + family.qq +
        ', weibo = ' + family.weibo +
        ', weico = ' + family.weico +
        ' where id = ' + family.id;
      _dao.update(sql, function(result) {
        callback(result);
      });
    }
  });
};

Service.prototype.addArticle = function(article, callback) {
  var _dao = this.dao;
  var sql = 'insert into yad_blog_article(family_id, category_id, title, path_name, publish_time) values('
      + article.family_id + ','
      + article.category_id + ','
      + article.title + ','
      + '-1' + ', "'
      + date_util.formatTime(article.publish_time) + '")';
  _dao.insertReturnId(sql, function(id) {
    article.path_name = id;
    sql = 'update yad_blog_article set path_name = ' + article.path_name + ' where id = ' + id;
    _dao.update(sql, function(result) {
      var filename = global.getBlog().article_path + '/' + article.path_name + '.' + global.getBlog().article_suffix;
      file_util.write(filename, article.content);
      filename = global.getBlog().article_path + '/' + article.path_name + '_summary.' + global.getBlog().article_suffix;
      file_util.write(filename, article.summary);
      callback(1);
    });
  });
};

Service.prototype.deleteArticle = function(id, callback) {
  var sql = 'update yad_blog_article set status = -1 where id = ' + id;
  this.dao.update(sql, function(result) {
    callback(1);
  });
};

Service.prototype.updateArticle = function(article, callback) {
  var content = article.content;
  article.path_name = article.id;
  var filename = global.getBlog().article_path + '/' + article.path_name + '.' + global.getBlog().article_suffix;
  file_util.write(filename, content);
  var sql = 'update yad_blog_article set' +
    ' category_id = ' + article.category_id +
    ', title = ' + article.title +
    ', publish_time = "' + date_util.formatTime(article.publish_time) + '"' +
    ' where id = ' + article.id;
  this.dao.update(sql, function(result) {
    callback(1);
  });
};

Service.prototype.addCategory = function(category, callback) {
  var _dao = this.dao;
  var sql = 'select * from yad_blog_category where name = ' + category.name + ' or path_name = ' + category.path_name + 'and parent_id = ' + category.parent_id;
  _dao.query(sql, function(rs) {
    if (rs.length > 0) {
      callback(-11);
    } else {
      if (!category.position)
        category.position = 20;
      sql = 'insert into yad_blog_category(name, parent_id, position, path_name) values('
      + category.name + ', '
      + category.parent_id + ', '
      + category.position + ', '
      + category.path_name + ') ';
      _dao.insert(sql, function(result) {
        callback(1);
      });
    }
  });
};

Service.prototype.deleteCategory = function(id, callback) {
  var _dao = this.dao;
  resourcesInCategory(_dao, id, function(resource) {
    var article_ids = resource.article_ids;
    var category_ids = resource.category_ids;
    if (article_ids.length > 0) {
      callback(-11);
    } else if (category_ids.length > 1) {
      callback(-12);
    } else {
      var sql = 'delete from yad_blog_category where id = ' + id;
      _dao.del(sql, function(result) {
        callback(1);
      });
    }
  });
};

Service.prototype.updateCategory = function(category, callback) {
  var sql = 'update yad_blog_category set' +
    ' name = ' + category.name +
    ', parent_id = ' + category.parent_id +
    ' where id = ' + category.id;
  this.dao.update(sql, function(result) {
    callback(1);
  });
};

Service.prototype.updateAbout = function(content) {
	var filename = global.getServer().view + '/' + global.getBlog().about_content + '.' + global.getBlog().article_suffix;
	file_util.writeContent(filename, content);	
};

function resourcesInFamily(_dao, id, callback) {
  var sql = 'select category_id from yad_blog_category_family where family_id = ' + id;
  _dao.query(sql, function(category_ids) {
    sql = 'select * from yad_blog_article where family_id = ' + id;
    _dao.query(sql, function(articles) {
      callback({
        category_ids: category_ids,
        articles:     articles
      });
    });
  });
}

function resourcesInCategory(_dao, id, callback) {
  var sql = 'select * from yad_blog_v_category where parent_id = ' + id;

  _dao.query(sql, function(results) {
    var ids = id;
    var cat_idList = [];
    cat_idList.push(id);
    for (var n in results) {
      var cat_id = results[n].id;
      ids += ',' + cat_id;
      cat_idList.push(cat_id);
    }
    sql = 'select * from yad_blog_article where category_id in (' + ids + ')';
    _dao.query(sql, function(results) {
      var ar_idList = [];
      for (var n in results) {
        ar_idList.push(results[n].id);
      }
      callback({
        category_ids:     cat_idList,
        article_ids:      ar_idList
      });
    });
  });
}

function queryComment(_dao, sql, callback) {
  _dao.query(sql, function(results) {
    var list = [];
    for (var n  in results) {
      var result = results[n];
      var comment = ModelProxy.genComment(result);
      list.push(comment);
    }
    callback(list);
  });
}

function fetchArticles(_dao, container, comments) {
  if (!cacheQuery(container)) {
    _dao.query(container.sql, function(results) {
      var list = [];
      for (var index in results) {
        var result = results[index];
        var article = ModelProxy.genArticle(result);
        var summary_path = global.getBlog().article_path + '/' + article.id + global.getBlog().article_summary_suffix + '.' + global.getBlog().article_suffix;
        article.summary = string_util.escape_html(file_util.read(summary_path));
        var category = ModelProxy.genCategoryWithPrefix(result);
        var comment_list = [];
        fetchComment(comment_list, article.id, 1, comments);
        list.push({article: article, category: category, writer: result['family_name'], comments: comment_list, reply_num: comment_list.length});
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

function getCommentForArticle(dao, callback) {
  var sql = 'select * from yad_blog_comment where target_type != 3';
  var container = new Container(condition=null, sql=sql, callback=callback);
  if (!cacheQuery(container)) {
    dao.query(sql, function(results) {
      var list = [];
      for (var index in results) {
        var result = results[index];
        var comment = ModelProxy.genComment(result);
        list.push(comment);
      }
      putCache(sql, list);
      callback(list);
    });
  }
}

function fetchComment(results, id, target_type, comments) {
  for (var n in comments) {
    var comment = comments[n];
    if (comment.target_id==id && comment.target_type==target_type) {
      results.push(comment);
      fetchComment(results, comment.id, 2, comments);
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
    condition:  _condition,
    sql:        _sql,
    callback:   _callback
  };
}

var service = new Service();
exports.getService = function() {
  return service;
};
