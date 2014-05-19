-- Eric Yi on 2014-05-09
-- yi_xiaobin@163.com

CREATE TABLE IF NOT EXISTS yad_blog_category (
  id int(11) not null auto_increment primary key,
  name varchar(50) not null,
  parent_id int(11) not null,
  position int(5) not null,
  path_name varchar(50) not null
) character set utf8 COMMENT='';


CREATE TABLE IF NOT EXISTS yad_blog_category_family (
  id int(11) not null auto_increment primary key,
  category_id int(11) not null,
  family_id int(11) not null
) character set utf8 COMMENT='';

CREATE TABLE IF NOT EXISTS yad_blog_article (
  id int(11) not null auto_increment primary key,
  family_id int(11) not null,
  category_id int(11) not null,
  title varchar(200) not null,
  path_name varchar(50) not null,
  publish_time datetime not null
) character set utf8 COMMENT='';

CREATE TABLE IF NOT EXISTS yad_blog_reply (
  id int(11) not null auto_increment primary key,
  target_type int(3) not null,    -- 1:article 2:reply 3:about
  target_id int(11) default null,
  family_id int(11) default null,
  article_id int(11) default null,
  name varchar(50) default null,
  email varchar(100) default null,
  content varchar(200) not null,
  reply_time datetime not null
) character set utf8 COMMENT='';

CREATE TABLE IF NOT EXISTS yad_blog_about (
  id int(11) not null auto_increment primary key,
  name varchar(50) not null,
  email varchar(100) not null,
  path_name varchar(200) not null,
  write_time datetime not null
) character set utf8 COMMENT='';

CREATE TABLE IF NOT EXISTS yad_blog_link (
  id int(11) not null auto_increment primary key,
  name varchar(50) not null,
  url varchar(200) not null
) character set utf8 COMMENT='';

CREATE TABLE IF NOT EXISTS yad_blog_master_family (
  id int(11) not null auto_increment primary key,
  username varchar(50) not null,
  password varchar(50) not null,
  name varchar(50) not null,
  member_id int(3) not null,      -- 1,admin 2:dad 3:mom 4:daughter 5:son
  position int(3) default null,
  email varchar(100) default null,
  qq varchar(50) default null,
  weibo varchar(50) default null,
  weico varchar(50) default null
) character set utf8 COMMENT='';
