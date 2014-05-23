
/*
 * Eric Yi on 2014-05-10
 * yi_xiaobin@163.com
 */

module.exports = function() {
  var id;
  var family_id;
  var category_id;
  var title;
  var path_name;
  var publish_time;
	var summary;

  return {
    id:           this.id,
    family_id:    this.family_id,
    category_id:  this.category_id,
    title:        this.title,
    path_name:    this.path_name,
    publish_time: this.publish_time,
    summary: 			this.summary,

    toJson: function() {
      return '{"id":"' + this.id +
        '", "category_id":"' + this.category_id +
        '", "family_id":"' + this.family_id +
        '", "title":"' + this.title +
        '", "path_name":"' + this.path_name +
        '", "publish_time":"' + this.publish_time +
        '"}';
    },

    toComplexJson: function(category, writer, reply_num) {
      return '{"id":"' + this.id +
        '", "summary":"' + this.summary +
        '", "category_id":"' + this.category_id +
        '", "family_id":"' + this.family_id +
        '", "title":"' + this.title +
        '", "path_name":"' + this.path_name +
        '", "publish_time":"' + this.publish_time +
        '", "category_name":"' + category.name +
        '", "category_path_name":"' + category.path_name +
        '", "category_parent_id":"' + category.parent_id +
        '", "category_parent_name":"' + category.parent_name +
        '", "category_parent_path_name":"' + category.parent_path_name +
        '", "writer":"' + writer +
        '", "reply_num":"' + reply_num +
        '"}';

    }
  };
};
