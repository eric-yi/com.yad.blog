-- Eric Yi on 2014-05-15
-- yi_xiaobin@163.com

CREATE OR REPLACE VIEW yad_blog_v_cate_child
AS
select
  *
from
  yad_blog_category
where
  parent_id != 0;

CREATE OR REPLACE VIEW yad_blog_v_cate_parent
AS
select
  *
from
  yad_blog_category
where
  parent_id = 0;

CREATE OR REPLACE VIEW yad_blog_v_rep_article
AS
select
  *
from
  yad_blog_reply
where
  target_type = 1;

CREATE OR REPLACE VIEW yad_blog_v_rep_reply
AS
select
  *
from
  yad_blog_reply
where
  target_type = 2;

CREATE OR REPLACE VIEW yad_blog_v_category
AS
select
  id as id,
  parent_id as parent_id,
  name as name,
  path_name as path_name,
  '' as parent_name,
  '' as parent_path_name
from
  yad_blog_v_cate_parent
union all
select
  child.id as id,
  child.parent_id as parent_id,
  child.name as name,
  child.path_name as path_name,
  parent.name as parent_name,
  parent.path_name as parent_path_name
from
  yad_blog_v_cate_parent parent,
  yad_blog_v_cate_child child
where
  child.parent_id = parent.id;


CREATE OR REPLACE VIEW yad_blog_v_reply_article
AS
select
	a.id as article_id,
	a.title as title,
	r.name as auth,
	r.id as reply_id,
	r.target_type as target_type,
	r.target_id as target_id,
	r.content as content,
	r.reply_time reply_time
from
	yad_blog_reply r,
	yad_blog_article a
where
	r.target_type in (1, 2)
	and r.article_id = a.id
order by r.reply_time desc;

