
/*
 * Eric Yi on 2014-05-20
 * yi-xiaobin@163.com
 */

ejs = require('ejs');

escape = function(html) {
  return html;
};

exports.apply = function(html, params) {
  params.open = '<%yad';
  params.close = '%>';
  params.escape = escape;
  return ejs.render(html, params);
};

Article = function(args) {
  var id = '';
  if (args && args.id)                  this.id = args.id;
  var year = '';
  if (args && args.year)                this.year = args.year;
  var month = '';
  if (args && args.month)               this.month = args.month;
  var day = '';
  if (args && args.day)                 this.day = args.day;
  var storytitle = '';
  if (args && args.storytitle)          this.storytitle = args.storytitle;
  var storycontent = '';
  if (args && args.storycontent)        this.storycontent = args.storycontent;
  var auth_id = '';
  if (args && args.auth_id)             this.auth_id = args.auth_id;
  var auth = '';
  if (args && args.auth)                this.auth = args.auth;
  var root_category = '';
  if (args && args.root_category)       this.root_category = args.root_category;
  var root_category_path = '';
  if (args && args.root_category_path)  this.root_category_path = args.root_category_path;
  var cur_category = '';
  if (args && args.cur_category)        this.cur_category = args.cur_category;
  var cur_category_path = '';
  if (args && args.cur_category_path)   this.cur_category_path = args.cur_category_path;
  var reply_num = 0;
  if (args && args.reply_num != null)   this.reply_num = args.reply_num;
  var comment_list = '';
  if (args && args.comment_list)        this.comment_list = args.comment_list;
  var feed = '';
  if (args && args.feed)                this.feed = args.feed;

  return {
    id:                                 this.id,
    year:                               this.year,
    month:                              this.month,
    day:                                this.day,
    storytitle:                         this.storytitle,
    storycontent:                       this.storycontent,
    auth_id:                            this.auth_id,
    auth:                               this.auth,
    root_category:                      this.root_category,
    root_category_path:                 this.root_category_path,
    cur_category:                       this.cur_category,
    cur_category_path:                  this.cur_category_path,
    reply_num:                          this.reply_num,
    comment_list:                       this.comment_list,
    feed:                               this.feed,

    toList: function() {
      return {
        id:                             this.id,
        year:                           this.year,
        month:                          this.month,
        day:                            this.day,
        storytitle:                     this.storytitle,
        storycontent:                   this.storycontent,
        auth_id:                        this.auth_id,
        auth:                           this.auth,
        root_category:                  this.root_category,
        root_category_path:             this.root_category_path,
        cur_category:                   this.cur_category,
        cur_category_path:              this.cur_category_path,
        reply_num:                      this.reply_num,
        comment_list:                   this.comment_list,
        feed:                           this.feed
      };
    }
  };
};

exports.Article = Article;
