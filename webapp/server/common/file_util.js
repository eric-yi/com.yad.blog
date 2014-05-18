
/*
 * Eric Yi on 2014-05-18
 * yi_xiaobin@163.com
 */

Path = require('path');
Fs = require('fs');
var mode = 0755;

exports.mkdir = function(dir) {
  var arr = dir.split('/');
  if(arr[0]==="."){
    arr.shift();
  }
  if(arr[0] == ".."){
    arr.splice(0, 2, arr[0]+"/"+arr[1])
  }
  function _mkdir(cur) {
    if(cur && !Fs.existsSync(cur)){
      Fs.mkdirSync(cur, mode)
    }
    if(arr.length){
      _mkdir(cur + "/" + arr.shift());
    }
  }
  arr.length && _mkdir(arr.shift());
}

exports.read = function(filename) {
  if (Fs.existsSync(filename))
    return content = Fs.readFileSync(filename, 'utf-8');
  return false;
};
