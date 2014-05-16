
/*
 * Eric Yi on 2014-05-16
 * yi_xiaobin@163.com
 */

module.exports = function() {
  var total;
  var size;
  var num;
	var current;
	var last;
	var next;

  return {
		total: this.total,
		size: this.size,
		num: this.num,
		current: this.current,
		last: this.last,
		next: this.next,

		toJson: function() {
			return 	'{"total":" ' + this.total + 
							'", "size":"' + this.size +
							'", "num":"' + this.num +
							'", "current":"' + this.current +
							'", "last":"' + this.last +
							'", "next":"' + this.next +
							'"}';
		}
  };
};
