#!/bin/bash

# Eric Yi on 2014-07-23
# yi_xiaobin@163.com

CUR_DIR=$(cd "$(dirname "$0")"; pwd)
DB_HOST=127.0.0.1
DB_USERNAME=yad
DB_PASSWORD=yad
DB_NAME=yad_blog

db_create() {
	create_sql="create database $DB_NAME;
use $DB_NAME;
source $CUR_DIR/tables.sql;
source $CUR_DIR/init.sql;
source $CUR_DIR/views.sql;"
	run_sql $create_sql
}

db_clear() {
	clear_sql="drop database $DB_NAME;"
	run_sql $clear_sql
}

db_usercreate() {
	cuser_sql="create user $DB_USERNAME identified by '$DB_PASSWORD';
grant all privileges on yad_blog.*  to '$DB_USERNAME'@'localhost' identified by '$DB_PASSWORD';
grant all privileges on yad_blog.*  to '$DB_USERNAME'@'127.0.0.1' identified by '$DB_PASSWORD';
flush privileges;"
}

run_sql() {
	sql_script=$(echo $@)
	echo $sql_script
	script=`mysql -h$DB_HOST -u$DB_USERNAME -p$DB_PASSWORD << EOF
					$sql_script
					exit
EOF`
	echo $script
}

case "$1" in
	install)
		db_create		
		;;
	uninstall)
		db_clear
		;;
	*)
		echo "unknowed argument"
		exit 1
esac


