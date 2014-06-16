
/*
 * Eric Yi on 2014-06-15
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

Rss = function(args) {
  var title = '';
  if (args && args.tile)                this.title = args.title;
  var link = '';
  if (args && args.link)                this.link = args.link;
  var index_link = '';
  if (args && args.index_link)          this.index_link = args.index_link;
  var description = '';
  if (args && args.description)         this.description = args.description;
  var lastBuildDate = '';
  if (args && args.lastBuildDate)       this.lastBuildDate = args.lastBuildDate;
  var generator = '';
  if (args && args.generator)           this.generator = args.generator;
	var items;

  return {
    title:                              this.title,
    link:                               this.link,
    index_link:                         this.index_link,
    description:                        this.description,
    lastBuildDate:                      this.lastBuildDate,
    generator:                          this.generator,
		items:															this.imtes,

    toList: function() {
      return {
        title:                          this.title,
        link:                           this.link,
        index_link:                     this.index_link,
        description:                    this.description,
        lastBuildDate:                  this.lastBuildDate,
        generator:                      this.generator,
				items:													this.items
      };
    }
  };
};

Item = function(args) {
  var title = '';
  if (args && args.tile)                this.title = args.title;
  var link = '';
  if (args && args.link)                this.link = args.link;
  var comments = '';
  if (args && args.comments)            this.comments = args.comments;
  var pubDate = '';
  if (args && args.pubDate)             this.pubDate = args.pubDate;
  var creator = '';
  if (args && args.creator)             this.creator = args.creator;
  var category = '';
  if (args && args.category)            this.category = args.category;
  var guid = '';
  if (args && args.guid)                this.guid = args.guid;
  var description = '';
  if (args && args.description)         this.description = args.description;
  var content = '';
  if (args && args.content)         		this.content = args.content;
  var commentRss = '';
  if (args && args.commentRss)          this.commentRss = args.commentRss;
  var slash = '';
  if (args && args.slash)               this.slash = args.slash;

  return {
    title:                              this.title,
    link:                               this.link,
    comments:                           this.comments,
    pubDate:                            this.pubDate,
    creator:                            this.creator,
    category:                           this.category,
    guid:                               this.guid,
    description:                        this.description,
    content:                        		this.content,
    commentRss:                         this.commentRss,
    slash:                              this.slash,


    toList: function() {
      return {
        title:                          this.title,
        link:                           this.link,
        comments:                       this.comments,
        pubDate:                        this.pubDate,
        creator:                        this.creator,
        category:                       this.category,
        guid:                           this.guid,
        description:                    this.description,
        content:                    		this.content,
        commentRss:                     this.commentRss,
        slash:                          this.slash
      };
    }
  };
};

exports.Rss = Rss;
exports.Rss_Item = Item;
