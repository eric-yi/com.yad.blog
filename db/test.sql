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

insert into yad_blog_article
	(id, category_id, title, path_name, publish_time)
values
	(1, 2, '标题1', '1', '2014-05-14 12:00:00'),
	(2, 3, '标题2', '2', '2014-04-14 12:00:00'),
	(3, 4, '标题3', '3', '2014-03-14 12:00:00'),
	(4, 6, '标题4', '4', '2014-02-14 12:00:00'),
	(5, 7, '标题5', '5', '2014-01-14 12:00:00'),
	(6, 8, '标题6', '6', '2013-12-14 12:00:00'),
	(7, 2, '标题7', '7', '2013-11-14 12:00:00'),
	(8, 3, '标题8', '8', '2013-10-14 12:00:00'),
	(9, 6, '标题9', '9', '2013-09-14 12:00:00');
