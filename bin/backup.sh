#!/bin/sh

######################################
# bakcup entire blog
# include database and applicaton
#-------------------------------------
# Eric Yi, yi_xiaobin@163.com
# 07/11/2015
######################################

HOME=$(cd ../"$(dirname "$0")"; pwd)
DATE=$(date +%Y%m%d)
BACKUP=$HOME/backup
DB_HOST=192.168.59.103
DB_PORT=3306
DB_USER=yad
DB_PASSWORD=yad
DBDUMP=/usr/local/mysql-5.6.17-osx10.7-x86_64/bin/mysqldump

rm -rf $BACKUP/com.yad.blog.$DATE.tar.gz
mkdir -p $BACKUP
tar -czvf $BACKUP/com.yad.blog.$DATE.tar.gz $HOME

rm -rf $BACKUP/db.$DATE.sql
$DBDUMP -u$DB_USER -p$DB_PASSWORD -h$DB_HOST -P$DB_PORT yad_blog > $BACKUP/db.$DATE.sql
