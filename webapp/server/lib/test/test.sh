#!/bin/bash
# Eric Yi on 2014-06-18
# yi_xiaobin@163.com

node-gyp configure
node-gyp build
echo "=======================run======================="
node ./hello.js

