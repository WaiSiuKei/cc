import {IBaseDataSource, IDAGNode, IDataPoint, IDataProvider, IDirectDataSource, IInDirectDataSource} from "./def";
import {DirectDataSource} from "./directDataSource";
import {InDirectDataSource} from "./inDirectDataSource";

function topologicalSort(nodes: { [id: string]: IDAGNode }) {
	let sorted = [];

	let visited = {};

	function visit(node: IDAGNode, ancestorsIn: IDAGNode[] = []) {
		let id = node.id

		if (visited[id]) return;

		let ancestors = Array.isArray(ancestorsIn) ? ancestorsIn : [];

		ancestors.push(node);
		visited[id] = true;

		node.dependents.forEach(function (n) {
			const afterID = n.id
			// if already in ancestors, a closed chain exists.
			if (ancestors.indexOf(n) >= 0) {
				throw new Error('Circular chain found: ' + id + ' must be before ' + afterID + ' due to a direct order specification, but ' + afterID + ' must be before ' + id + ' based on other specifications.');
			}

			// recursive call
			visit(n, ancestors.slice());
		});

		sorted.unshift(node);
	}

	Object.keys(nodes).forEach(key => visit(nodes[key]));

	return sorted;
}

export class DataProvider implements IDataProvider {
	views: { [name: string]: IInDirectDataSource }
	sources: { [name: string]: IDirectDataSource }
	nodes: { [id: string]: IBaseDataSource }

	private list: Array<IDAGNode>

	constructor() {
		this.views = {}
		this.sources = {}
		this.nodes = {}
	}

	private sort() {
		try {
			this.list = topologicalSort(this.nodes)
		} catch (e) {
			console.error(e)
		}
	}

	link(dependency: IBaseDataSource, dependent: IBaseDataSource) {
		if (!dependency.dependents.includes(dependent)) dependency.dependents.push(dependent)
		if (!dependent.dependencies.includes(dependency)) dependent.dependencies.push(dependency)
		if (!this.nodes[dependency.id]) this.nodes[dependency.id] = dependency
		if (!this.nodes[dependent.id]) this.nodes[dependent.id] = dependent

		if (!this.views[dependent.id]) this.views[dependent.id] = dependent as IInDirectDataSource
		if (dependency instanceof DirectDataSource) {

		} else {
			if (!this.views[dependency.id]) this.views[dependency.id] = dependency as IInDirectDataSource
		}
	}

	remove(node: IBaseDataSource) {
		node.dependencies.forEach(n => {
			let idx = n.dependents.indexOf(node);
			if (idx > -1) n.dependents.splice(idx, 1);
		});

		node.dependents.forEach(n => {
			let idx = n.dependencies.indexOf(node);
			if (idx > -1) n.dependencies.splice(idx, 1);
		});

		if (this.nodes[node.id]) delete this.nodes[node.id];
		if (this.sources[node.id]) delete this.nodes[node.id];
		if (this.views[node.id]) delete this.nodes[node.id];
	}

	update(name: string, pt: IDataPoint | IDataPoint[]) ;
	update(ds: IDirectDataSource, pt: IDataPoint | IDataPoint[]);
	update(arg1: any, arg2: any) {
		let ds;
		if (typeof arg1 === 'string') {
			ds = this.sources[arg1]
		} else {
			ds = arg1
		}

		ds.update(arg2)

		this.refresh()
	}

	refresh() {
		this.sort()
		this.list.forEach(ds => {
			if (ds instanceof InDirectDataSource) ds.refresh()
		})
	}
}