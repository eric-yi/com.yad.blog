
/*
 * Eric Yi on 2014-05-13
 * yi_xiaobin@163.com
 */

Global = require('../global');
var global = Global.getGlobal();

exports.parameters = {
  title:                  global.getBlog().title,
  subtitle:               global.getBlog().subtitle,
  auth:                   global.getBlog().auth,
  auth_alias:             global.getBlog().auth_alias,
  email:                  global.getBlog().email,
  family_name:            global.getBlog().family_name,
  category_name:          global.getBlog().category_name,
  gallery_name:           global.getBlog().gallery_name,
  recent_post_name:       global.getBlog().recent_post_name,
  recent_post_preview:    global.getBlog().recent_post_preview,
  recent_comment_name:    global.getBlog().recent_comment_name,
  recent_comment_preview: global.getBlog().recent_comment_preview,
  link_name:              global.getBlog().link_name,
  summary_min:            global.getBlog().summary_min
};

exports.parameters_json =
  '{' +
  '"title":"' + global.getBlog().title + '",' +
  '"subtitle":"' + global.getBlog().subtitle + '",' +
  '"auth":"' + global.getBlog().auth + '",' +
  '"auth_alias":"' + global.getBlog().auth_alias + '",' +
  '"email":"' + global.getBlog().email + '",' +
  '"family_name":"' + global.getBlog().family_name + '", ' +
  '"category_name":"' + global.getBlog().category_name + '", ' +
  '"gallery_name":"' + global.getBlog().gallery_name + '", ' +
  '"recent_post_name":"' + global.getBlog().recent_post_name + '", ' +
  '"recent_post_preview":"' + global.getBlog().recent_post_preview + '", ' +
  '"recent_comment_name":"' + global.getBlog().recent_comment_name + '", ' +
  '"recent_comment_preview":"' + global.getBlog().recent_comment_preview + '", ' +
  '"link_name":"' + global.getBlog().link_name + '", ' +
  '"summary_min":"' + global.getBlog().summary_min + '"' +
  '}';

exports.page_size = global.getBlog().page_size;
exports.page_prev = global.getBlog().page_prev;
exports.page_next = global.getBlog().page_next;
