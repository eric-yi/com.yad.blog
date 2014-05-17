
/*
 * Eric Yi on 2014-05-1y
 * yi_xiaobin@163.com
 */

module.exports = function() {
  var id;
  var category_id;
  var family_id;

  return {
    id:           this.id,
    category_id:  this.category_id,
    family_id:    this.family_id,

    toJson: function() {
      return '{"id":"' + this.id + 
        '", "category_id":"' + this.category_id +
        '", "family_id":"' + this.family_id +
        '"}';
    }
  };
};
