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

  return {
    host: this.host,
    port: this.port,
    cached: this.cached,
    view: this.view,
    session_expired: this.session_expired,
    url: this.url,
    protocol: this.protocol
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

Blog = function() {
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
  var template_about = 'template_about';
  var about_content = 'about_content';
  var recent_feed = 10;
  var template_feed = 'template_feed';
  var summary_min = 20;

  return {
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

  this.database.host = get(this.props, 'database', 'host');
  this.database.port = get(this.props, 'database', 'port');
  this.database.username = get(this.props, 'database', 'username');
  this.database.password = get(this.props, 'database', 'password');
  this.database.name = get(this.props, 'database', 'name');
  this.database.max_connections = get(this.props, 'database', 'max_connection');

  Path = require('path');
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
  this.blog.template_about = get(this.props, 'blog', 'template.about');
  this.blog.about_content = get(this.props, 'blog', 'about.content');
  this.blog.recent_feed = get(this.props, 'blog', 'recent.feed');
  this.blog.template_feed = get(this.props, 'blog', 'template.feed');
  this.blog.summary_min = get(this.props, 'blog', 'summary.min');
};

Config.prototype.server = this.server;
Config.prototype.database = this.database;
Config.prototype.blog = this.blog;

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
