/*
 * Eric Yi on 2014-05-08
 * yi_xiaobin@163.com
 */

var stringUtil = require('./common/stringUtil');

Server = function() {
  var host = '0.0.0.0';
  var port = 9426;
	var cached = false;
	
	return {
    host: this.host,
    port: this.port,
		cached: this.cached	
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
		host: this.hhost,
		port: this.hport,
		username: this.husername,
		password: this.hpassword,
		name: this.hname,
		max_connections: this.hmax_connections
  };
};

Blog = function() {
	var article_path = 'articles';
	var about_path = 'about.html';
	var title = '伊爱戴@钟爱一生';
	var subtitle = '媛媛心爱，苗苗心疼';
	var auth = '伊爱戴';
	var auth_alias = 'yad';
	var email = 'yi_xiaobin@163.com';
	var page_size = 10;

	return {
		article_path: this.harticle_path,
		about_path: this.habout_path,
		title: this.htitle,
		subtitle: this.subtitle,
		auth: this.hauth,
		auth_alias: this.hauth_alias,
		email: this.hemail,
		page_size: this.hpage_size
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
      ak = stringUtil.trim(a);
			if (ak != '' && ak.charAt(0) != '#') {
      	this.props[ak] = [];
      	entries = qs.parse(articles[a], '\n', '=');	
      	for (var e in entries) {
        	if (e != '' && entries[e] != '') {
          	ek = stringUtil.trim(e);
						if (ek != '' && ek.charAt(0) != '#')
          		this.props[ak][ek] = stringUtil.trim(entries[e]);
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

  this.database.host = get(this.props, 'database', 'host');
  this.database.port = get(this.props, 'database', 'port');
  this.database.username = get(this.props, 'database', 'username');
  this.database.password = get(this.props, 'database', 'password');
  this.database.name = get(this.props, 'database', 'name');
  this.database.max_connections = get(this.props, 'database', 'max_connection');

	this.blog.article_path = get(this.props, 'blog', 'article.path');
	this.blog.about_path = get(this.props, 'blog', 'about.path');
	this.blog.title = get(this.props, 'blog', 'title');
	this.blog.subtitle = get(this.props, 'blog', 'subtitle');
	this.blog.auth = get(this.props, 'blog', 'auth');
	this.blog.auth_alias = get(this.props, 'blog', 'auth.alias');
	this.blog.email = get(this.props, 'blog', 'email');
	this.blog.page_size = get(this.props, 'blog', 'page.size');
};

Config.prototype.server = this.server;
Config.prototype.database = this.database;
Config.prototype.blog = this.blog;

get = function(props, a, e) {
  if (a == null || e == null) return null;
  if (a != null)              a = stringUtil.trim(a)
  if (e != null)              e = stringUtil.trim(e)
  if (a == '' || e == '')     return null;
  return props[a][e];
};

var config = new Config();
exports.getConfig = function() {
  return config;
};
