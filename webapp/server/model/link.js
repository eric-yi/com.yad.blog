
/*
 * Eric Yi on 2014-05-14
 * yi_xiaobin@163.com
 */

module.exports = function() {
  var id;
  var name;
  var url;

  return {
    id:   this.id,
    name: this.name,
    url:  this.url,

    toJson: function() {
      return '{"id":"' + this.id +
        '", "name":"' + this.name +
        '", "url":"' + this.url +
        '"}';
    }
  };
};
