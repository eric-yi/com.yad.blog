
/*
 * Eric Yi on 2014-05-17
 * yi_xiaobin@163.com
 */

function test() {
  var EventEmitter = require('events').EventEmitter;
  EventEmitter.call(loop);
  console.log('invoke');
}

loop = function() {
  while (true) {
    console.log('looping');
  };
}

test();
