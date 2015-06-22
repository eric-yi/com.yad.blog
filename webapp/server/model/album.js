
/*
 * Eric Yi on 2015-06-14
 * yi_xiaobin@163.com
 */

module.exports = function() {
  var id;
  var family_id;
  var name;
  var place;
  var info;
  var publish_time;
  var open;

  return {
    id:           this.id,
    family_id:    this.family_id,
    name:         this.name,
    place:        this.place,
    info:         this.info,
    publish_time: this.publish_time,
    open:         this.open,

    toJson: function() {
      return '{"id":"' + this.id + 
        '", "family_id":"' + this.family_id +
        '", "name":"' + this.name +
        '", "place":"' + this.place +
        '", "info":"' + this.info +
        '", "publish_time":"' + this.publish_time +
        '", "open":"' + this.open +
        '"}';
    }
  };
};
