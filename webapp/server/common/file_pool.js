
/*
 * Eric Yi on 2014-05-17
 * yi_xiaobin@163.com
 */ 

FilePool = function() {
  var openfiles = 200;
  var keeptime = 30 * 1000;
  var maxsize = 1000;

  var EventEmitter = require('events').EventEmitter;
  this pool = [];
};

FilePool.prototype.init = function(params) {
  if (params) {
    if (params.openfiles)   this.openfiles = params.openfiles;
    if (params.keeptime)    this.keeptime = params.keeptime;
    if (params.maxsize)     this.maxsize = params.maxsize;
  }
};

FilePool.prototype.read = function(filename) {
  var file_entry;
  for (var n in pool) {
    file_entry = pool[n];
    if (file_entry.filename == filename) {
      file_entry.access();
      return file_entry.content;
    }
  };

  var content = require('fs').readFileSync(content, 'utf-8');
  file_entry = new FileEntry(filename, content);
  pool.push(file_entry);
  return content;
};



FileEntry = function(filename, content) {
  var _filename;
  var _content;
  var _access;

  _filename = filename;
  _content = content;
  _access = new Date().getTime();

  return {
    filename: _filename,
    content: _content,

    access: function() {
      _access = new Date().getTime();
    }
  };
};

