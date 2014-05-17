
/*
 * Eric Yi on 2014-05-14
 * yi_xiaobin@163.com
 */

module.exports = function() {
  var id;
  var name;
  var parent_id;
  var position;
  var path_name;
  var parent_name;
  var parent_path_name;

  return {
    id:               this.id,
    name:             this.name,
    parent_id:        this.parent_id,
    position:         this.position,
    path_name:        this.path_name,
    parent_name:      this.parent_name,
    parent_path_name: this.parent_path_name,

    toArray: function() {
      return {
        id:               this.id,
        name:             this.name,
        parent_id:        this.parent_id,
        position:         this.position,
        path_name:        this.path_name,
        parent_name:      this.parent_name,
        parent_path_name: this.parent_path_name
      };
    },

    toJson: function() {
      return '{"id":"' + this.id +
        '", "name":"' + this.name +
        '", "parent_id":"' + this.parent_id +
        '", "position":"' + this.position +
        '", "path_name":"' + this.path_name +
        '", "parent_name":"' + this.parent_name +
        '", "parent_path_name":"' + this.parent_path_name +
        '"}';
    }
  };
};
