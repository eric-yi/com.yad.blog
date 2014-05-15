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

CREATE OR REPLACE VIEW yad_blog_v_category
AS
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

