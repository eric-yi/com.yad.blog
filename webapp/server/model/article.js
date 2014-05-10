
/*
 * Eric Yi on 2014-05-10
 * yi_xiaobin@163.com
 */

module.exports = function() {
  var id;
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

    setPulish_time: function(p_publish_time) {
      pulish_time = p_pulish_time;
    },
    getPublish_time: function() {
      return pulish_time;
    }
  };
};
