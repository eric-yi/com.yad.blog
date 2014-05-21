
/*
 * Eric Yi on 2014-05-21
 * yi_xiaobin@163.com
 */

module.exports = function(_node, _serial) {
	if (_node)		this.node = _node;
	if (_serial)	this.serial = _serial;
	this.children = [];

	return {
		node:			this.node,
		serial:		this.serial,
		children:	this.children,

		sortChildren: function(type) {
			switch (type) {
				case 1:			// asc
					this.children.sort(function(c1, c2) {
						return c1.serial>c2.serial ? 1 : -1;
					});
					break;
				case 2:			// desc
					this.children.sort(function(c1, c2) {
						return c2.serial>c1.serial ? 1 : -1;
					});
					break;
				default:
					break;
			}
		},
		genNodeList: function(type) {
			list = [];
			listNode(list, this, type);
			return list;
		}
	};
};

function listNode(list, tree, type) {
	if (tree.node != null)
		list.push(tree.node);
	tree.sortChildren(type);
	for (var n in tree.children) {
		listNode(list, tree.children[n], type);
	}
}
