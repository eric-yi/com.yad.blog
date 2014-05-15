
/*
 * Eric Yi on 2014-05-10
 * yi_xiaobin@163.com
 */

module.exports = function() {
  var id;
  var category_id;
  var title;
  var path_name;
  var publish_time;

  return {
    setId: function(p_id) {
      id = p_id;
    },
    getId: function() {
      return id;
    },
	
		setCategory_id: function(p_category_id) {
      category_id = p_category_id;
    },
    getCategory_id: function() {
      return category_id;
    },

    setTitle: function(p_title) {
      title = p_title;
    },
    getTitle: function() {
      return title;
    },

    setPath_name: function(p_path_name) {
      path_name = p_path_name;
    },
    getPath_name: function() {
      return path_name;
    },

    setPublish_time: function(p_publish_time) {
      publish_time = p_publish_time;
    },
    getPublish_time: function() {
      return publish_time;
    },
		
		toJson: function() {
			return 	'{"id":" ' + id + 
							'", "category_id":"' + category_id +
							'", "title":"' + title +
							'", "path_name":"' + path_name +
							'", "publish_time":"' + publish_time +
							'"}';
		},
							
		toJson: function(category) {
			return 	'{"id":" ' + id + 
							'", "category_id":"' + category_id +
							'", "title":"' + title +
							'", "path_name":"' + path_name +
							'", "publish_time":"' + publish_time +
							'", "category_name":"' + category.getName() +
							'", "category_path_name":"' + category.getPath_name() +
							'", "category_parent_id":"' + category.getParent_id() +
							'", "category_parent_name":"' + category.getParent_name() +
							'", "category_parent_path_name":"' + category.getParent_path_name() +
							'"}';

		}
  };
};
