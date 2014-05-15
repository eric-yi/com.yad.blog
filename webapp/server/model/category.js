
/*
 * Eric Yi on 2014-05-14
 * yi_xiaobin@163.com
 */

module.exports = function() {
	var id;
	var name;
	var parent_id;
	var position;
	var path_name;
	var parent_name;
	var parent_path_name;
	
	return {
		setId: function(p_id) {
			id = p_id;
		},
		getId: function() {
			return id;
		},

		setName: function(p_name) {
			name = p_name;
		},
		getName: function() {
			return name;
		},

		setParent_id: function(p_parent_id) {
			parent_id = p_parent_id;
		},
		getParent_id: function() {
			return parent_id;
		},

		setPosition: function(p_position) {
			position = p_position;
		},
		getPosition: function() {
			return position;
		},

		setPath_name: function(p_path_name) {
			path_name = p_path_name;
		},
		getPath_name: function() {
			return path_name;
		},

		setParent_name: function(p_parent_name) {
			parent_name = p_parent_name;
		},
		getParent_name: function() {
			return parent_name;
		},

		setParent_path_name: function(p_parent_path_name) {
			parent_path_name = p_parent_path_name;
		},
		getParent_path_name: function() {
			return parent_path_name;
		},

		toArray: function() {
			return {
				id:	id,
				name:	name,
				parent_id: parent_id,
				position: position,
				path_name: path_name,
				parent_name: parent_name,
				parent_path_name: parent_path_name
			};
		},

		toJson: function() {
			return 	'{"id":" ' + id + 
							'", "name":"' + name +
							'", "parent_id":"' + parent_id +
							'", "position":"' + position +
							'", "path_name":"' + path_name +
							'", "parent_name":"' + parent_name +
							'", "parent_path_name":"' + parent_path_name +
							'"}';
		}
	};
};
