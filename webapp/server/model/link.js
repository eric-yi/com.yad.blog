
/*
 * Eric Yi on 2014-05-14
 * yi_xiaobin@163.com
 */

module.exports = function() {
  var id;
  var name;
  var url;

  return {
    setId: function(p_id) {
      id = p_id;
    },
    getId: function() {
      return id;
    },

    setName: function(p_name) {
      name = p_name;
    },
    getName: function() {
      return name;
    },

    setUrl: function(p_url) {
      url = p_url;
    },
    getUrl: function() {
      return url;
    }
  };
};
