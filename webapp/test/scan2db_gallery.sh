#!/bin/sh

# Eric Yi on 2015-06-22
# yi_xiaobin@163.com

GALLERY_DIR=$(cd ../"$(dirname "$0")"/client/public/gallery; pwd)
DB_HOST="192.168.59.103"
DB_USERNAME="root"
DB_PASSWORD="root"
DB_NAME="yad_blog"

rm -rf $GALLERY_DIR/_thumb_*
sql=`mysql -h$DB_HOST -u$DB_USERNAME -p$DB_PASSWORD $DB_NAME << EOF
delete * from yad_blog_gallery;
exit;
EOF`
echo $sql

for file in $(ls $GALLERY_DIR)
do
  f_img=$GALLERY_DIR/$file
  f_thumb=$GALLERY_DIR/_thumb_$file
  cp $f_img $f_thumb
  sips -Z 100 $f_thumb
  sql=`mysql -h$DB_HOST -u$DB_USERNAME -p$DB_PASSWORD $DB_NAME<< EOF
insert into yad_blog_gallery(family_id, path, place, info, publish_time) values ('1', '$file', 'Shanghai', 'test for gallery', '2015-06-15');
exit
EOF`
  echo $sql
done


