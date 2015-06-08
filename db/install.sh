#!/bin/bash

# Eric Yi on 2014-07-23
# yi_xiaobin@163.com

CUR_DIR=$(cd "$(dirname "$0")"; pwd)
#DB_HOST=127.0.0.1
DB_HOST=192.168.59.103
DB_USERNAME=yad
DB_PASSWORD=yad
DB_ROOT_USERNAME=root
DB_ROOT_PASSWORD=root
DB_NAME=yad_blog

db_create() {
  sql=`mysql -h$DB_HOST -u$DB_USERNAME -p$DB_PASSWORD << EOF
use $DB_NAME;
source $CUR_DIR/tables.sql;
source $CUR_DIR/init.sql;
source $CUR_DIR/views.sql;
exit;
EOF`
  echo sql
}

db_clear() {
  sql=`mysql -h$DB_HOST -u$DB_ROOT_USERNAME -p$DB_ROOT_PASSWORD << EOF
drop database $DB_NAME;"
exit;
EOF`
  echo sql
}

db_createdb() {
  sql=`mysql -h$DB_HOST -u$DB_ROOT_USERNAME -p$DB_ROOT_PASSWORD << EOF
create database $DB_NAME;"
exit;
EOF`
  echo sql
}

db_createuser() {
  sql=`mysql -h$DB_HOST -u$DB_ROOT_USERNAME -p$DB_ROOT_PASSWORD << EOF
create user $DB_USERNAME identified by '$DB_PASSWORD';
grant all privileges on yad_blog.*  to '$DB_USERNAME'@'localhost' identified by '$DB_PASSWORD';
grant all privileges on yad_blog.*  to '$DB_USERNAME'@'$DB_HOST' identified by '$DB_PASSWORD';
grant all privileges on yad_blog.*  to '$DB_USERNAME'@'%' identified by '$DB_PASSWORD';
exit;
EOF`
  echo sql
}

db_test() {
  sql=`mysql -h$DB_HOST -u$DB_USERNAME -p$DB_PASSWORD << EOF
use $DB_NAME;
source $CUR_DIR/test.sql;
exit;
EOF`
  echo sql
}


case "$1" in
  init)
    db_createdb
    db_createuser
    ;;
  install)
    db_create
    ;;
  uninstall)
    db_clear
    ;;
  test)
    db_test
    ;;
  *)
    echo "unknowed argument"
    exit 1
esac

