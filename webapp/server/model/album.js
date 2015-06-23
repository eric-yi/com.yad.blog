
/*
 * Eric Yi on 2015-06-14
 * yi_xiaobin@163.com
 */

logger_util = require('../common/logger_util');
var logger = logger_util.getLogger();

module.exports = function() {
  var id;
  var family_id;
  var path;
  var name;
  var place;
  var info;
  var publish_time;
  var open;
  var haskey;
  var thumbs;

  return {
    id:           this.id,
    family_id:    this.family_id,
    path:         this.path,
    name:         this.name,
    place:        this.place,
    info:         this.info,
    publish_time: this.publish_time,
    open:         this.open,
    haskey:       this.haskey,
    thumbs:       this.thumbs,

    toJson: function() {
      return '{"id":"' + this.id + 
        '", "family_id":"' + this.family_id +
        '", "path":"' + this.path +
        '", "name":"' + this.name +
        '", "place":"' + this.place +
        '", "info":"' + this.info +
        '", "publish_time":"' + this.publish_time +
        '", "open":"' + this.open +
        '", "haskey":"' + this.haskey +
        '"}';
    },

    toComplexJson: function(writer) {
      logger.debug('album toComplexJson');
      var thumbs_json = '[';
      var first = true;
      logger.debug('thumbs: ' + this.thumbs);
      this.thumbs.forEach(function(thumb) {
        logger.debug('album toComplexJson thumbs: ' + thumb);
        if (!first) thumbs_json += ', ';
        thumbs_json += '{"thumb":"' + thumb + '"}';
        if (first) first = false;
      });
      thumbs_json += ']';
      logger.debug('album toComplexJson thumbs_json: ' + thumbs_json);

      return '{"id":"' + this.id + 
        '", "family_id":"' + this.family_id +
        '", "path":"' + this.path +
        '", "name":"' + this.name +
        '", "place":"' + this.place +
        '", "info":"' + this.info +
        '", "publish_time":"' + this.publish_time +
        '", "open":"' + this.open +
        '", "haskey":"' + this.haskey +
        '", "writer":"' + writer +
        '", "thumbs":' + thumbs_json +
        '}';

    }
  };
};
