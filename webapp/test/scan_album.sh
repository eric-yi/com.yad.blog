#!/bin/sh

# Eric Yi on 2015-06-23
# yi_xiaobin@163.com

ALBUM_DIR=$(cd ../"$(dirname "$0")"/client/public/album; pwd)

for file in $(ls $ALBUM_DIR)
do
  album_path=$ALBUM_DIR/$file
  thumb_path=$album_path/thumb
  rm -rf $thumb_path
  mkdir $thumb_path
  for album_img in $(ls $album_path)
  do
    if [ -f $album_path/$album_img ]; then
      thumb_img=$thumb_path/_thumb_$album_img
      cp $album_path/$album_img $thumb_img
      sips -Z 100 $thumb_img
    fi
  done
done


