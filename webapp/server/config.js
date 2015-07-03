/*
 * Eric Yi on 2014-05-08
 * yi_xiaobin@163.com
 */

var string_util = require('./common/string_util');

Server = function() {
  var host = '0.0.0.0';
  var port = 9426;
  var cached = false;
  var view;
  var session_expired = 30 * 60 * 1000;
  var url;
  var protocol = 'http';
  var upload_path = 'uploads';
  var image_upload_path = 'image_uploads';

  return {
    host: this.host,
    port: this.port,
    cached: this.cached,
    view: this.view,
    session_expired: this.session_expired,
    url: this.url,
    protocol: this.protocol,
    upload_path: this.upload_path,
    image_upload_path: this.image_upload_path
  };
};

var Database = function() {
  var host = '127.0.0.1';
  var port = 3306;
  var username;
  var password;
  var name = 'yad_blog';
  var max_connections = 5;

  return {
    host: this.host,
    port: this.port,
    username: this.username,
    password: this.password,
    name: this.name,
    max_connections: this.max_connections
  };
};

var Log = function() {
  var dir_path = 'logs';
  var common_log = 'yad.log';
  var error_log = 'error.log';
  var level = 'info';

  return {
    dir_path: this.dir_path,
    common_log: this.common_log,
    error_log: this.error_log,
    level: this.level
  };
};

Blog = function() {
  var chamber_path = 'chambers';
  var article_path = 'articles';
  var article_suffix = 'htm';
  var article_sumarry_suffix = '_summary';
  var article_notfound = 'the article not found';
  var title = '伊爱戴@钟爱一生';
  var subtitle = '媛媛心爱，苗苗心疼';
  var auth = '伊爱戴';
  var auth_alias = 'yad';
  var email = 'yi_xiaobin@163.com';
  var family_name = 'family';
  var category_name = 'categories';
  var gallery_name = 'gallery';
  var recent_post_name = 'recent post';
  var recent_post_preview = 15;
  var recnet_comment_name = 'recent comment';
  var recnet_comment_preview = 10;
  var link_name = 'link';
  var page_size = 10;
  var page_prev = 'previous page';
  var page_next = 'next page';
  var template_nofound = 'template_nofound';
  var template_article = 'template_article';
  var template_chamber = 'template_chamber';
  var template_about = 'template_about';
  var about_content = 'about_content';
  var recent_feed = 10;
  var template_feed = 'template_feed';
  var summary_min = 20;

  return {
    chamber_path:               this.chamber_path,
    article_path:               this.article_path,
    article_suffix:             this.article_suffix,
    article_summary_suffix:     this.article_summary_suffix,
    article_notfound:           this.article_notfound,
    title:                      this.title,
    subtitle:                   this.subtitle,
    auth:                       this.auth,
    auth_alias:                 this.auth_alias,
    email:                      this.email,
    category_name:              this.category_name,
    recent_post_name:           this.recent_post_name,
    recent_post_preview:        this.recent_post_preview,
    recent_comment_name:        this.recent_comment_name,
    recent_comment_preview:     this.recent_comment_preview,
    page_size:                  this.page_size,
    page_prev:                  this.page_prev,
    page_next:                  this.page_next,
    template_nofound:           this.template_notfound,
    template_article:           this.template_article,
    template_chamber:           this.template_chamber,
    template_about:             this.template_about,
    about_content:              this.about_content,
    recent_feed:                this.recent_feed,
    template_feed:              this.template_feed,
    summary_min:                this.summary_min
  };
};

Config = function() {
  this.props = [];
  this.server = new Server();
  this.database = new Database();
  this.blog = new Blog();
	this.log = new Log();
  this.x = 1;
};

Config.prototype.init = function(path) {
  var content = require('fs').readFileSync(path, 'utf-8');
  var qs = require('querystring');
  var articles = qs.parse(content, '[', ']');
  var entry;
  for (var a in articles) {
    if (a != '' && articles[a] != '') {
      ak = string_util.trim(a);
      if (ak != '' && ak.charAt(0) != '#') {
        this.props[ak] = [];
        entries = qs.parse(articles[a], '\n', '=');	
        for (var e in entries) {
          if (e != '' && entries[e] != '') {
            ek = string_util.trim(e);
            if (ek != '' && ek.charAt(0) != '#')
              this.props[ak][ek] = string_util.trim(entries[e]);
          }
        }
      }
    }
  }

  Path = require('path');

  this.server.host = get(this.props, 'server', 'host');
  this.server.port = get(this.props, 'server', 'port');
  var cached = false;
  var cached_str = get(this.props, 'server', 'cached');
  if (cached_str.toUpperCase() == 'ON')
    cached = true;
  this.server.cached = cached;
  this.server.session_expired = get(this.props, 'server', 'session.expired') * 60 * 1000;
  this.server.url = get(this.props, 'server', 'url');
  var protocol = get(this.props, 'server', 'protocol');
  this.server.protocol = protocol + '://';
  var upload_path = Path.join(__dirname, '..', get(this.props, 'server', 'upload.path'));
  this.server.upload_path = upload_path;
  this.server.image_upload_path = get(this.props, 'server', 'image.upload.path');
  var public_path = Path.join(__dirname, '../client/public');
  this.server.album = get(this.props, 'server', 'album.path');
  var album_path = Path.join(public_path, this.server.album);
  this.server.album_path = album_path;
  this.server.gallery = get(this.props, 'server', 'gallery.path');
  var gallery_path = Path.join(public_path, this.server.gallery);
  this.server.gallery_path = gallery_path;

  this.database.host = get(this.props, 'database', 'host');
  this.database.port = get(this.props, 'database', 'port');
  this.database.username = get(this.props, 'database', 'username');
  this.database.password = get(this.props, 'database', 'password');
  this.database.name = get(this.props, 'database', 'name');
  this.database.max_connections = get(this.props, 'database', 'max_connection');

  var chamber_path = Path.join(__dirname, '..', get(this.props, 'blog', 'chamber.path'));
  this.blog.chamber_path = chamber_path;
  var article_path = Path.join(__dirname, '..', get(this.props, 'blog', 'article.path'));
  this.blog.article_path = article_path;
  this.blog.article_suffix = get(this.props, 'blog', 'article.suffix');
  this.blog.article_summary_suffix = get(this.props, 'blog', 'article.summary.suffix');
  this.blog.article_notfound = get(this.props, 'blog', 'article.notfound');
  this.blog.title = get(this.props, 'blog', 'title');
  this.blog.subtitle = get(this.props, 'blog', 'subtitle');
  this.blog.auth = get(this.props, 'blog', 'auth');
  this.blog.auth_alias = get(this.props, 'blog', 'auth_alias');
  this.blog.email = get(this.props, 'blog', 'email');
  this.blog.family_name = get(this.props, 'blog', 'family.name');
  this.blog.category_name = get(this.props, 'blog', 'category.name');
  this.blog.gallery_name = get(this.props, 'blog', 'gallery.name');
  this.blog.recent_post_name = get(this.props, 'blog', 'recent.post.name');
  this.blog.recent_post_preview = get(this.props, 'blog', 'recent.post.preview');
  this.blog.recent_comment_name = get(this.props, 'blog', 'recent.comment.name');
  this.blog.recent_comment_preview = get(this.props, 'blog', 'recent.comment.preview');
  this.blog.link_name = get(this.props, 'blog', 'link.name');
  this.blog.page_size = get(this.props, 'blog', 'page.size');
  this.blog.page_prev = get(this.props, 'blog', 'page.prev');
  this.blog.page_next = get(this.props, 'blog', 'page.next');
  this.blog.template_notfound = get(this.props, 'blog', 'template.notfound');
  this.blog.template_article = get(this.props, 'blog', 'template.article');
  this.blog.template_chamber = get(this.props, 'blog', 'template.chamber');
  this.blog.template_about = get(this.props, 'blog', 'template.about');
  this.blog.about_content = get(this.props, 'blog', 'about.content');
  this.blog.recent_feed = get(this.props, 'blog', 'recent.feed');
  this.blog.template_feed = get(this.props, 'blog', 'template.feed');
  this.blog.summary_min = get(this.props, 'blog', 'summary.min');

  var log_path = Path.join(__dirname, '../..', get(this.props, 'log', 'dir.path'));
  this.log.dir_path =	log_path;
  this.log.common_log = log_path + '/' + get(this.props, 'log', 'common.log');
  this.log.error_log = log_path + '/' + get(this.props, 'log', 'error.log');
  this.log.level = get(this.props, 'log', 'level');
};

Config.prototype.server = this.server;
Config.prototype.database = this.database;
Config.prototype.blog = this.blog;
Config.prototype.log = this.log;

get = function(props, a, e) {
  if (a == null || e == null) return null;
  if (a != null)              a = string_util.trim(a)
    if (e != null)              e = string_util.trim(e)
      if (a == '' || e == '')     return null;
  return props[a][e];
};

var config = new Config();
exports.getConfig = function() {
  return config;
};
