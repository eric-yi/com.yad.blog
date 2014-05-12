-- Eric Yi on 2014-05-09
-- yi_xiaobin@163.com

CREATE TABLE IF NOT EXISTS yad_blog_category (
  id int(11) not null auto_increment primary key,
  name varchar(50) not null,
  parent_id int(11) not null,
  position int(5) not null,
  path_name varchar(50) not null
) character set utf8 COMMENT='';

CREATE TABLE IF NOT EXISTS yad_blog_article (
  id int(11) not null auto_increment primary key,
	category_id int(11) not null,
  title varchar(200) not null,
  path_name varchar(50) not null,
  publish_time datetime not null
) character set utf8 COMMENT='';

CREATE TABLE IF NOT EXISTS yad_blog_reply (
  id int(11) not null auto_increment primary key,
  target_type int(3) not null,    -- 1:article 2:about 3:reply
  target_id int(11) default null, -- when target_type is 2, target_id is null
  name varchar(50) not null,
  email varchar(100) not null,
  content_path varchar(200) not null,
  reply_time datetime not null
) character set utf8 COMMENT='';

CREATE TABLE IF NOT EXISTS yad_blog_about (
  id int(11) not null auto_increment primary key,
  name varchar(50) not null,
  email varchar(100) not null,
  path_name varchar(200) not null,
  write_time datetime not null
) character set utf8 COMMENT='';

