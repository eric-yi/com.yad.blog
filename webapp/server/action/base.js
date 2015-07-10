#!/usr/bin/env node

/*
 * Eric Yi on 2014-05-14
 * yi_xiaobin@163.com
 */
var multipart = require('multipart');
var sys = require('sys');
var events = require('events');
var posix = require('posix');
var fs = require('fs');

Global= require('../global');
var global = Global.getGlobal();

logger_util = require('../common/logger_util');
var logger = logger_util.getLogger();

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
file_util = require('../common/file_util');
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

getArticleContent = function(id, root_dir) {
  var filename = root_dir + '/' + id + '.' + global.getBlog().article_suffix;
  logger.debug('article filename: ' + filename);
  var content = service.getFileContent(filename);
  if (!content) {
    content = getViewHtml(global.getBlog().template_nofound);
  }
  return content;
};


getArticleById = function(id) {
  return getArticleContent(id, global.getBlog().article_path);
};

getArticleSummary = function(id) {
  var filename = global.getBlog().article_path + '/' + id + global.getBlog().article_summary_suffix + '.' + global.getBlog().article_suffix;
  var content = service.getFileContent(filename);
  return content;
};

getArticleTemplate = function() {
  return getViewHtml(global.getBlog().template_article);
};

getChamberTemplate = function() {
  return getViewHtml(global.getBlog().template_chamber);
};

getAboutTemplate = function() {
  return getViewHtml(global.getBlog().template_about);
};

getResumeTemplate = function() {
  return getViewHtml(global.getBlog().template_resume);
};

getAboutContent = function() {
  return getViewHtml(global.getBlog().about_content);
};

getFeedContent = function() {
  var filename = global.getServer().view + '/' + global.getBlog().template_feed + '.xml';
  var content = service.getFileContent(filename);
  return content;
};

function getViewHtml(name) {
  var filename = global.getServer().view + '/' + name + '.' + global.getBlog().article_suffix;
  logger.debug("view html filename: " + filename);
  var content = service.getFileContent(filename);
  return content;
}

function getResumeHtml(member, name) {
  var filename = global.getResume().path + '/' + member + '/' + name + '.htm';
  logger.debug('resume html: ' + filename);
  var content = service.getFileContent(filename);
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
      logger.debug('enter getAbout info');
      if (info.about_time) {
        var d = date_util.split(info.about_time);
        year = d.year;
        month = d.month;
        day = d.day;
      }
      if (info.auth)              auth = info.auth;
      if (info.about_title)       storytitle = info.about_title;
      if (info.about_reply_num)   reply_num = info.about_reply_num;
    }
    logger.debug('before getAboutContent');
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

    logger.debug('send about');
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

exports.getResume = function(member) {
  var template_html = getResumeTemplate();
  var name = '';
  var job = '';
  var birthday = '';
  var email = '';
  var residence = '';
  var mobile = '';
  var diplomas = '';
  var github = '';
  var motto = '';
  var introduce = getResumeHtml(member, 'introduce');
  var prologue = getResumeHtml(member, 'prologue');
  var education = getResumeHtml(member, 'education');
  var skills = getResumeHtml(member, 'skills');
  var works = getResumeHtml(member, 'works');
  var projects = getResumeHtml(member, 'projects');
  var interests = getResumeHtml(member, 'interests');
  var contact = getResumeHtml(member, 'contact');

  var resume = global.getResume();
  logger.debug('resume = ' + resume.toString());
  if (member == 'dad') {
    name = resume.dad_name;
    job = resume.dad_job;
    birthday = resume.dad_birthday;
    email = resume.dad_email;
    residence = resume.dad_residence;
    mobile = resume.dad_mobile;
    diplomas = resume.dad_diplomas;
    github = resume.dad_github;
    motto = resume.dad_motto;
  }
  var args = {
    name:         name,
    job:          job,
    birthday:     birthday,
    email:        email,
    residence:    residence,
    mobile:       mobile,
    diplomas:     diplomas,
    introduce:    introduce,
    prologue:     prologue,
    github:       github,
    motto:        motto,
    education:    education,
    skills:       skills,
    works:        works,
    projects:     projects,
    interests:    interests,
    contact:      contact
  };
  var tag_resume = new tag.Resume(args);
  var html = tag.apply(template_html, tag_resume.toList());

  return html;
};

exports.getFeed = function(callback) {
  var feed_tag = require('../common/feed_tag');
  var rss = new feed_tag.Rss();
  var blog = global.getBlog();
  var server = global.getServer();
  rss.title = blog.title;
  rss.link = server.url + ':' + server.port;
  rss.index_link = server.url;
  rss.description = blog.subtitle;
  rss.lastBuildDate = '2014-';
  rss.generator = 'yad blog';

  var condition = {};
  var page = Model.genPage();
  page.sql = true;
  page.num = 0;
  page.size = blog.recent_feed;
  condition.page = page;
  service.getArticles(condition, function(dataset) {
    var items = [];
    for (var n in dataset.dataset) {
      var data = dataset.dataset[n];
      var item = new feed_tag.Rss_Item();
      item.title = data.article.title;
      item.link = server.protocol + rss.link + '/feed/id/' + data.article.id;
      item.comments = '';
      item.creator = data.writer;
      var category_name = '';
      if (data.category.parent_name)
        category_name = data.category.parent_name + '-';
      category_name += data.category.name;
      item.category = category_name;
      item.guid =	'';
      item.description = '';
      item.content = getArticleById(data.article.id);
      item.commentRss = '';
      item.slash = '';
      items.push(item);
    }
    rss.items = items;
    var content = getFeedContent();
    var html = tag.apply(content, rss.toList());

    callback(html);
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

function callArticleContentById(id, callback) {
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
        var tag_article = new tag.Article(args);
        var html = tag.apply(template_html, tag_article.toList());;
        callback(html);
      });
    } else {
      var tag_article = new tag.Article(args);
      var html = tag.apply(template_html, tag_article.toList());;
      callback(html);
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
  var html = tag.apply(template_html, tag_article.toList());
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
    logger.debug('getArticlesByPage');
    var json = ModelProxy.toArticlePageJson(dataset);
    res.send(json);
  });
};

exports.getArticleParameter = function(id, res) {
  service.getArticleParameter(id, function(parameter) {
    var json = '{';
    json += '"id":"' + id + '"';
    json += ', "article_notfound":"' + global.getBlog().article_notfound + '"'
    if (parameter) {
      if (parameter.title)
        json += ', "title":"' + parameter.title + '"';
      if (parameter.publish_time)
        json += ', "publish_time":"' + parameter.publish_time + '"';
      if (parameter.category_id)
        json += ', "category_id":"' + parameter.category_id + '"';
      if (parameter.category_name)
        json += ', "category_name":"' + parameter.category_name + '"';
      if (parameter.category_parent_id)
        json += ', "category_parent_id":"' + parameter.category_parent_id + '"';
      if (parameter.category_parent_name)
        json += ', "category_parent_name":"' + parameter.category_parent_name + '"';
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
  handleArticleCondition(req, condition);
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

function sendSuccessMsg(res) {
  var message = new Message();
  var data = message.toSuccessJson();
  res.send(data);
}

function sendFailMsg(res, msg) {
  var message = new Message();
  message.msg = msg;
  res.send(message.toJson());
}

function sendMessage(res, msg) {
  if (msg == 1) {
    sendSuccessMsg(res);
  } else {
    sendFailMsg(res, msg);
  }
}

function handleArticleCondition(req, condition) {
  if (isLogin(req)) {
    //condition.family_id = req.session.family.id;
  }
};

function isLogin(req) {
  if (req.session.family)
    return true;
  return false;
}

function tipLogin(req, res, callback) {
  if (!isLogin(req)) {
    var message = new Message();
    message.msg = -1;
    res.send(messsage.toJson());
  } else {
    callback();
  }
}

function requestLogin(req, res) {
  if (isLogin(req)) {
    sendSuccessMsg(res);
    return true;
  }
  return false;
}

function isAdmin(req) {
  if (isLogin(req)) {
    if (req.session.family.id == 1)
      return true;
  }

  return false;
}

function tipAdmin(req, res, callback) {
  if (isAdmin(req)) {
    callback();
  } else {
    var message = new Message();
    message.msg = -2;
    res.send(messsage.toJson());
  }
}

function busboyUpload(req, res) {
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename);
    fstream = fs.createWriteStream(global.getServer().image_upload_path+ '/' + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
      res.redirect('back');
    });
  });
}

function streamUpload(req, res) {
  console.log('upload image');
  console.log(req);
  // Request body is binary
  req.setBodyEncoding('binary');

  // Handle request as multipart
  var stream = new multipart.Stream(req);
  console.log(stream);

  // Create promise that will be used to emit event on file close
  var closePromise = new events.Promise();

  // Add handler for a request part received
  stream.addListener('part', function(part) {
    sys.debug('Received part, name = ' + part.name + ', filename = ' + part.filename);
    console.log('Received part, name = ' + part.name + ', filename = ' + part.filename);

    var openPromise = null;

    // Add handler for a request part body chunk received
    part.addListener('body', function(chunk) {
      // Calculate upload progress
      var progress = (stream.bytesReceived / stream.bytesTotal * 100).toFixed(2);
      var mb = (stream.bytesTotal / 1024 / 1024).toFixed(1);

      sys.debug('Uploading ' + mb + 'mb (' + progress + '%)');

      // Ask to open/create file (if not asked before)
      if (openPromise == null) {
        sys.debug('Opening file');
        openPromise = posix.open('./uploads/' + part.filename, process.O_CREAT | process.O_WRONLY, 0600);
      }

      // Add callback to execute after file is opened
      // If file is already open it is executed immediately
      openPromise.addCallback(function(fileDescriptor) {
        // Write chunk to file
        write_chunk(req, fileDescriptor, chunk, 
                    (stream.bytesReceived == stream.bytesTotal), closePromise);
      });
    }); 
  });

  // Add handler for the request being completed
  stream.addListener('complete', function() {
    sys.debug('Request complete');

    // Wait until file is closed
    closePromise.addCallback(function() {
      // Render response
      res.sendHeader(200, {'Content-Type': 'text/plain'});
      res.sendBody('Thanks for playing!');
      res.finish();

      sys.puts('\n=> Done');
    });
  });
}

/*
 * Write chunk of uploaded file
 */
function write_chunk(request, fileDescriptor, chunk, isLast, closePromise) {
  // Pause receiving request data (until current chunk is written)
  request.pause();
  // Write chunk to file
  sys.debug('Writing chunk');
  posix.write(fileDescriptor, chunk).addCallback(function() {
    sys.debug('Wrote chunk');
    // Resume receiving request data
    request.resume();
    // Close file if completed
    if (isLast) {
      sys.debug('Closing file');
      posix.close(fileDescriptor).addCallback(function() {
        sys.debug('Closed file');

        // Emit file close promise
        closePromise.emitSuccess();
      });
    }
  });
}

function writeHtml(res, html) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('<html>');
  res.write(html);
  res.write('</html>');
  res.end();
}

exports.listGallery = function(condition, res) {
  getGallery(condition, function(dataset) {
    logger.debug('listGallery');
    var json = ModelProxy.toGalleryJson(dataset);
    logger.debug('listGallery json');
    res.send(json);
  });
};

getGallery = function(condition, callback) {
  service.getGallery(condition, function(list) {
    callback(list);
  });
};

getAlbums = function(condition, callback) {
  service.getAlbums(condition, function(list) {
    callback(list);
  });
};

exports.getAlbumsByPage = function(condition, page, res) {
  condition.page = page;
  getAlbums(condition, function(dataset) {
    var json = ModelProxy.toAlbumPageJson(dataset);
    res.send(json);
  });
};

exports.listAlbum = function(path, res) {
  var album_path = global.getServer().album_path;
  logger.debug('album_path:' + album_path);
  logger.debug('path:' + path);
  var files = file_util.listFiles(album_path+'/'+path);
  logger.debug("files: " + files);
  var json = '[';
  var first = true;
  files.forEach(function(file) {
    if (!first) json += ', ';
    json += '{';
    json += '"img":"/album/' + path + '/' + file + '",';
    json += '"thumb":"/album/' + path + '/thumb/' + '_thumb_' + file + '"';
    json += '}';
    if (first) first = false;
  });
  json += ']';
  logger.debug('json: ' + json);
  res.send(json);
};

exports.getAlbumThumb = function(path, num, res) {
  var album_path = global.getServer().album_path;
  var files = file_util.listFiles(album_path+'/'+path+'/thumb');
  var json = '[';
  var first = true;
  for (var n in files) {
    if (n >= num)
      break;
    var file = files[n];
    if (!first) json += ', ';
    json += '{';
    json += '"thumb":"/album/' + path + '/thumb/' + '_thumb_' + file + '"';
    json += '}';
    if (first) first = false;
  }
  json += ']';
  res.send(json);
};

exports.openAlbum = function(id, passkey, res) {
  service.getAlbum(id, passkey, function(album) {
    if (album) {
      sendSuccessMsg(res);
    } else {
      sendFailMsg(res);
    }
  });
};

getArticleById = function(id, root_dir) {
  var filename = global.getBlog().article_path + '/' + id + '.' + global.getBlog().article_suffix;
  logger.debug('article filename: ' + filename);
  var content = service.getFileContent(filename);
  if (!content) {
    content = getViewHtml(global.getBlog().template_nofound);
  }
  return content;
};


exports.getChamberArticle = function(id, passkey, res) {
  service.getPrivateArticle(id, passkey, function(result) {
    logger.debug('get chamber article');
    if (result) {
      var template_html = getChamberTemplate();
      var d = date_util.split(result.publish_time)
      var year = d.year;
      var month = d.mnoth;
      var day = d.day;
      var storytitle = result.title;
      var storycontent = getArticleContent(id, global.getBlog().chamber_path);
      var args = {
        id:                   id,
        year:                 year,
        month:                month,
        day:                  day,
        storytitle:           storytitle,
        storycontent:         storycontent
      };

      sendArticle(res, template_html, args);
    } else {
      res.send("");
    }
  });
};

function filtArticles(articles, rule) {
  var filters = [];
  articles.forEach(function(article) {
    switch(rule) {
      case 1: // private, need password
        if (article.haskey)
          filters.push(article);
        break;
      case 0: // public, open
      default:
        if (!article.haskey)
          filters.push(article);
        break;
    }
  });
  return filters;
}

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
exports.isLogin = isLogin;
exports.requestLogin = requestLogin;
exports.tipLogin = tipLogin;
exports.handleArticleCondition = handleArticleCondition;
exports.sendSuccessMsg = sendSuccessMsg;
exports.sendFailMsg = sendFailMsg;
exports.sendMessage = sendMessage;
exports.isAdmin = isAdmin;
exports.tipAdmin = tipAdmin;
exports.getAboutContent = getAboutContent;
exports.callArticleContentById = callArticleContentById;
exports.imageUpload = busboyUpload;
exports.writeHtml = writeHtml;
exports.logger = logger;

