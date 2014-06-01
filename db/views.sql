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
  yad_blog_comment
where
  target_type = 1;

CREATE OR REPLACE VIEW yad_blog_v_rep_comment
AS
select
  *
from
  yad_blog_comment
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


CREATE OR REPLACE VIEW yad_blog_v_comment_article
AS
select
  a.id as article_id,
  a.title as title,
  r.name as auth,
  r.id as comment_id,
  r.target_type as target_type,
  r.target_id as target_id,
  r.content as content,
  r.reply_time reply_time
from
  yad_blog_comment r,
  yad_blog_article a
where
  r.target_type in (1, 2)
  and r.article_id = a.id
order by r.reply_time desc;

CREATE OR REPLACE VIEW yad_blog_v_comment_info
AS
select
  *
from
  yad_blog_comment
where
  target_type in (1, 2)
  and family_id is null
union all
select
 r.id as id,
 r.target_type as target_type,
 r.target_id as target_id,
 r.family_id as family_id,
 r.article_id as article_id,
 f.name as name,
 f.email as email,
 r.content as content,
 r.reply_time as reply_time
from
  yad_blog_comment r,
  yad_blog_master_family f
where
  r.target_type in (1, 2)
  and r.family_id = f.id;

