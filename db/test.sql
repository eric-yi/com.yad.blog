-- Eric Yi on 2014-05-14
-- yi_xiaobin@163.com

insert into yad_blog_info
  (title, subtitle, auth, auth_alias, email, about_title, about_time)
values
  ('伊爱戴@钟爱一生', '媛媛心爱，苗苗心疼', '伊爱戴',
   'yad', 'yi_xiaobin@163.com', '关于美好家庭', sysdate());

insert into yad_blog_master_family
  (id, username, password, name, member_id, position)
values
  (1, 'admin', 'cd7ef0d9aa21a51918377a4fb60a1dd6', '家庭管理员', 1, -1),
  (2, 'dad', 'cd7ef0d9aa21a51918377a4fb60a1dd6', '爸爸', 2, 3),
  (3, 'mom', 'cd7ef0d9aa21a51918377a4fb60a1dd6', '妈妈', 3, 2),
  (4, 'dola', 'cd7ef0d9aa21a51918377a4fb60a1dd6', '苗苗', 4, 1);

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

insert into yad_blog_category_family
  (id, family_id, category_id)
values
  (1, 2, 1),
  (2, 3, 5);

insert into yad_blog_link
  (id, name, url)
values
  (1, '163', 'http://www.163.com'),
  (2, 'sina', 'http://www.sina.com'),
  (3, 'sohu', 'http://www.sohu.com');

insert into yad_blog_article
  (id, family_id, category_id, title, path_name, publish_time)
values
  (1, 2, 2, '标题1', '1', '2014-05-14 12:00:00'),
  (2, 2, 3, '标题2', '2', '2014-04-14 12:00:00'),
  (3, 2, 4, '标题3', '3', '2014-03-14 12:00:00'),
  (4, 2, 6, '标题4', '4', '2014-02-14 12:00:00'),
  (5, 2, 7, '标题5', '5', '2014-01-14 12:00:00'),
  (6, 2, 8, '标题6', '6', '2013-12-14 12:00:00'),
  (7, 2, 2, '标题7', '7', '2013-11-14 12:00:00'),
  (8, 2, 3, '标题8', '8', '2013-10-14 12:00:00'),
  (9, 2, 6, '标题9', '9', '2013-09-14 12:00:00'),
  (11, 3, 2, '标题1', '1', '2014-05-14 12:00:00'),
  (12, 3, 3, '标题2', '2', '2014-04-14 12:00:00'),
  (13, 3, 4, '标题3', '3', '2014-03-14 12:00:00'),
  (14, 3, 6, '标题4', '4', '2014-02-14 12:00:00'),
  (15, 3, 7, '标题5', '5', '2014-01-14 12:00:00'),
  (16, 3, 8, '标题6', '6', '2013-12-14 12:00:00'),
  (17, 3, 2, '标题7', '7', '2013-11-14 12:00:00'),
  (18, 4, 3, '标题8', '8', '2013-10-14 12:00:00'),
  (19, 4, 6, '标题9', '9', '2013-09-14 12:00:00'),
  (21, 4, 2, '标题1', '1', '2014-05-14 12:00:00'),
  (22, 4, 3, '标题2', '2', '2014-04-14 12:00:00'),
  (23, 4, 4, '标题3', '3', '2014-03-14 12:00:00'),
  (24, 4, 6, '标题4', '4', '2014-02-14 12:00:00'),
  (25, 4, 7, '标题5', '5', '2014-01-14 12:00:00'),
  (26, 4, 8, '标题6', '6', '2013-12-14 12:00:00'),
  (27, 2, 2, '标题7', '7', '2013-11-14 12:00:00'),
  (28, 3, 3, '标题8', '8', '2013-10-14 12:00:00'),
  (29, 4, 6, '标题9', '9', '2013-09-14 12:00:00'),
  (30, 2, 6, '面向GC的Java编程', '9', '2015-05-18 12:00:00');


insert into yad_blog_comment
  (id, target_type, target_id, article_id, name, email, content, reply_time)
values
  (1, 1, 1, 1, 'r1', 'test@mail.com', 'r1', '2014-05-04 12:00:00'),
  (2, 1, 1, 1, 'r2', 'test@mail.com', 'r2', '2014-05-04 12:00:00'),
  (3, 2, 1, 1, 'r1', 'test@mail.com', 'r11', '2014-05-04 12:00:00'),
  (4, 2, 1, 1, 'r1', 'test@mail.com', 'r12', '2014-05-04 12:00:00'),
  (5, 2, 3, 1, 'r1', 'test@mail.com', 'r1sfsdf', '2014-05-04 12:00:00'),
  (6, 2, 5, 1, 'r1', 'test@mail.com', 'r1ssss', '2014-05-04 12:00:00'),
  (7, 1, 2, 2, 'r1', 'test@mail.com', 'r1ss', '2014-05-04 12:00:00'),
  (8, 2, 7, 2, 'r1', 'test@mail.com', 'r1ss', '2014-05-04 12:00:00');

insert into yad_blog_album
  (family_id, path, name, place, info, publish_time, open, passkey)
values
  (1, 'album1', 'album1', 'Shanghai', 'test for album', '2015-06-15', 1, '1234'),
  (2, 'album2', 'album2', 'Shanghai', 'test for album', '2015-06-15', 1, null);

insert into yad_blog_album
  (family_id, path, name, place, info, publish_time, open, passkey)
values
  (1, 'thailand_150526', '2015泰国行.第一天', '泰国沙巴', '2015泰国沙巴曼谷行', '2015-05-26', 1, '150526'),
  (1, 'thailand_150527', '2015泰国行.第二天', '泰国沙巴', '2015泰国沙巴曼谷行', '2015-05-27', 1, '150527'),
  (1, 'thailand_150528', '2015泰国行.第三天', '泰国沙巴', '2015泰国沙巴曼谷行', '2015-05-28', 1, '150528'),
  (1, 'thailand_150529', '2015泰国行.第四天', '泰国沙巴曼谷', '2015泰国沙巴曼谷行', '2015-05-29', 1, '150529'),
  (1, 'thailand_150530', '2015泰国行.第五天', '泰国曼谷', '2015泰国沙巴曼谷行', '2015-05-30', 1, '150530'),
  (1, 'thailand_150531', '2015泰国行.第六天', '泰国曼谷', '2015泰国沙巴曼谷行', '2015-05-31', 1, '150531');
  (1, 'album2', 'album2', 'Shanghai', 'test for album', '2015-06-15', 1, null);


insert into yad_blog_gallery
  (family_id, path, place, info, publish_time)
values
  (1, 'img1.jpg', 'Shanghai', 'test for gallery', '2015-06-15');

