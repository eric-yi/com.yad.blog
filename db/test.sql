-- Eric Yi on 2014-05-14
-- yi_xiaobin@163.com

insert into yad_blog_category
	(id, name, parent_id, position, path_name) 
values
	(1, 'root1', 0, 1, 'root1'),
	(2, 'cr11', 1, 1, 'cr1'),
	(3, 'cr12', 1, 2, 'cr2'),
	(4, 'cr13', 1, 3, 'cr3'),
	(5, 'root2', 0, 2, 'root2'),
	(6, 'cr21', 5, 1, 'cr21'),
	(7, 'cr22', 5, 2, 'cr22'),
	(8, 'cr23', 5, 3, 'cr23');

insert into yad_blog_link
	(id, name, url)
values
	(1, '163', 'www.163.com'),
	(2, 'sina', 'www.sina.com'),
	(3, 'sohu', 'www.sohu.com');
