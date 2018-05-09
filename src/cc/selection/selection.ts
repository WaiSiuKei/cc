import {ISelection} from "./def";
import {INode, IShape, IStage} from "../dom/def";
import {EnterNode} from "./enterNode";
import {ITransition} from "../transition/def";

function ascending(a, b) {
	return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function remove() {
	let parent = this.parent as INode;
	if (parent) parent.removeChildren(this);
}

function propertyConstant(name, value) {
	return function () {
		this[name] = value;
	};
}

function propertyFunction(name, value) {
	return function () {
		let v = value.apply(this, arguments);
		this[name] = v;
	};
}

function constant(x) {
	return function () {
		return x;
	};
}

let keyPrefix = '$'; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
	let i = 0,
		node,
		groupLength = group.length,
		dataLength = data.length;

	// Put any non-null nodes that fit into update.
	// Put any null nodes into enter.
	// Put any remaining data into enter.
	for (; i < dataLength; ++i) {
		if (node = group[i]) {
			node.__data__ = data[i];
			update[i] = node;
		} else {
			enter[i] = new EnterNode(parent, data[i]);
		}
	}

	// Put any non-null nodes that don’t fit into exit.
	for (; i < groupLength; ++i) {
		if (node = group[i]) {
			exit[i] = node;
		}
	}
}

function bindKey(parent, group, enter, update, exit, data, key) {
	let i,
		node,
		nodeByKeyValue = {},
		groupLength = group.length,
		dataLength = data.length,
		keyValues = new Array(groupLength),
		keyValue;

	// Compute the key for each node.
	// If multiple nodes have the same key, the duplicates are added to exit.
	for (i = 0; i < groupLength; ++i) {
		if (node = group[i]) {
			keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
			if (keyValue in nodeByKeyValue) {
				exit[i] = node;
			} else {
				nodeByKeyValue[keyValue] = node;
			}
		}
	}

	// Compute the key for each datum.
	// If there a node associated with this key, join and add it to update.
	// If there is not (or the key is a duplicate), add it to enter.
	for (i = 0; i < dataLength; ++i) {
		keyValue = keyPrefix + key.call(parent, data[i], i, data);
		if (node = nodeByKeyValue[keyValue]) {
			update[i] = node;
			node.__data__ = data[i];
			nodeByKeyValue[keyValue] = null;
		} else {
			enter[i] = new EnterNode(parent, data[i]);
		}
	}

	// Add any remaining nodes that were not bound to data to exit.
	for (i = 0; i < groupLength; ++i) {
		if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
			exit[i] = node;
		}
	}
}

export class Selection implements ISelection {
	public groups: INode[][];
	public parents: INode[];

	private _enter: INode[][];
	private _exit: INode[][];

	constructor(groups: INode[][], parents: INode | INode[]) {
		this.parents = Array.isArray(parents) ? parents : [parents]
		this.groups = groups
	}

	static from(node: IStage): ISelection {
		return new Selection([[node]], node)
	}

	select(selector: Function) {
		let groups = this.groups,
			m = groups.length,
			subgroups = new Array(m)
		for (let j = 0; j < m; ++j) {
			for (let group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
				if ((node = group[i]) && (subnode = node.select(selector))) {
					subgroup[i] = subnode;
				}
			}
		}
		return new Selection(subgroups, this.parents);
	}

	selectAll(selector) {
		for (var groups = this.groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
			for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
				if (node = group[i]) {
					subgroups.push(node.selectAll(selector));
					parents.push(node);
				}
			}
		}

		return new Selection(subgroups, parents);
	}

	forEach(callback) {
		for (let groups = this.groups, j = 0, m = groups.length; j < m; ++j) {
			for (let group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
				if (node = group[i]) callback.call(node, node, i, group);
			}
		}

		return this;
	}

	filter(matcher: Function) {
		let subgroups
		for (let groups = this.groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
			for (let group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
				if ((node = group[i]) && matcher(node, i, group)) {
					subgroup.push(node);
				}
			}
		}

		return new Selection(subgroups, this.parents);
	}

	// sort(compare = ascending) {
    //
	// 	function compareNode(a, b) {
	// 		return a && b ? compare(a.dat, b.data) : Number(Boolean(a)) - Number(Boolean(b));
	// 	}
    //
	// 	for (var groups = this.groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
	// 		for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
	// 			if (node = group[i]) {
	// 				sortgroup[i] = node;
	// 			}
	// 		}
	// 		sortgroup.sort(compareNode);
	// 	}
    //
	// 	return new Selection(sortgroups, this.parents).order();
	// }
    //
	// order() {
	// 	for (let groups = this.groups, j = -1, m = groups.length; ++j < m;) {
	// 		for (let group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
	// 			if (node = group[i]) {
	// 				if (next && next !== node.nextSibling) next.insertAbove(next);
	// 				next = node;
	// 			}
	// 		}
	// 	}
    //
	// 	return this;
	// }

	on(type: string, callback: Function) {
		this.forEach((node) => node.addEventListener(type, callback));
		return this
	}

	once(type: string, callback: Function) {
		this.forEach((node) => node.once(type, callback));
		return this
	}

	off(type: string, callback: Function) {
		this.forEach((node) => node.removeListener(type, callback));
		return this
	}

	size() {
		let size = 0;
		this.forEach(function () { ++size; });
		return size;
	}

	node() {
		for (let groups = this.groups, j = 0, m = groups.length; j < m; ++j) {
			for (let group = groups[j], i = 0, n = group.length; i < n; ++i) {
				let node = group[i];
				if (node) return node;
			}
		}

		return null;
	}

	nodes() {
		let nodes = new Array(this.size()), i = -1;
		this.forEach(function () { nodes[++i] = this; });
		return nodes;
	}

	merge(selection: Selection) {
		for (var groups0 = this.groups, groups1 = selection.groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
			for (let group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
				if (node = group0[i] || group1[i]) {
					merge[i] = node;
				}
			}
		}

		for (; j < m0; ++j) {
			merges[j] = groups0[j];
		}

		return new Selection(merges, this.parents);
	}

	call() {
		let callback = arguments[0];
		arguments[0] = this;
		callback.apply(null, arguments);
		return this;
	}

	remove() {
		return this.forEach(remove);
	}

	datum(): any;
	datum(val: any): ISelection;
	datum(arg?: any): any {
		return arguments.length ? this.property('data', arguments[0]) : this.node().data;
	}

	property(name: string): any;
	property(name: string, value: any): ISelection;
	property(name: string, value?: any) {
		return arguments.length > 1
			? this.forEach((typeof value === 'function' ? propertyFunction : propertyConstant)(name, value))
			: this.node()[name];
	}

	data(): any;
	data(value: any, key: number): ISelection;
	data(value: any, key: string): ISelection;
	data(value?: any, key?: any): any {
		if (!value) {
			let data = new Array(this.size()), j = -1;
			this.forEach(function (d) { data[++j] = d; });
			return data;
		}

		let bind = key ? bindKey : bindIndex,
			parents = this.parents,
			groups = this.groups;

		if (typeof value !== 'function') value = constant(value);

		for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
			let parent = parents[j],
				group = groups[j],
				groupLength = group.length,
				data = value.call(parent, parent && parent.data, j, parents),
				dataLength = data.length,
				enterGroup = enter[j] = new Array(dataLength),
				updateGroup = update[j] = new Array(dataLength),
				exitGroup = exit[j] = new Array(groupLength);

			bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

			// Now connect the enter nodes to their following update node, such that
			// appendChild can insert the materialized enter node before this node,
			// rather than at the end of the parent node.
			for (let i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
				if (previous = enterGroup[i0]) {
					if (i0 >= i1) i1 = i0 + 1;
					while (!(next = updateGroup[i1]) && ++i1 < dataLength) ;
					previous._next = next || null;
				}
			}
		}

		let updateSelection = new Selection(update, parents);
		updateSelection._enter = enter;
		updateSelection._exit = exit;
		return updateSelection;
	}

	enter() {
		return new Selection(this._enter || [[]], this.parents);
	}

	exit() {
		return new Selection(this._exit || [[]], this.parents);
	}

	transition(callback: (IShape) => ITransition): ISelection {
		let animations = new Map<IStage, ITransition[]>()
		this.forEach(node => {
			let stage = node.root as IStage
			if (stage) {
				let transitions = animations.get(stage)
				let tran = callback(node)
				if (transitions) {
					transitions.push(tran)
				} else {
					transitions = [tran]
				}
				animations.set(stage, transitions)
			}
		})

		animations.forEach((transitions, stage) => {
			stage.animator.add(transitions)
		})

		return this
	}
}

export function from(node: IStage): ISelection {
	return Selection.from(node)
}
