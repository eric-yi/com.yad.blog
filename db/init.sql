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
  (1, 'admin', 'cd7ef0d9aa21a51918377a4fb60a1dd6', '伊爱戴', 1, -1),
  (2, 'dad', 'cd7ef0d9aa21a51918377a4fb60a1dd6', '苗爸', 2, 3),
  (3, 'mom', 'cd7ef0d9aa21a51918377a4fb60a1dd6', '苗妈', 3, 2),
  (4, 'dola', 'cd7ef0d9aa21a51918377a4fb60a1dd6', '苗苗', 4, 1);
