import {INode} from "../dom/def";

export interface ISelection {
	select(match: Function): ISelection;
	selectAll(match: Function): ISelection;
	forEach(func: Function): ISelection;
	filter(cond: Function): ISelection;
	merge(selection: ISelection): ISelection
	// order(): ISelection
	// sort(comparer: Function): ISelection

	on(eventType: string, callback: Function): ISelection;
	once(eventType: string, callback: Function): ISelection;
	off(eventType: string, callback: Function): ISelection;

	data(data: any, key: string | number): ISelection
	data(): any
	datum(data: Function): ISelection
	datum(): any
	enter(): ISelection
	exit(): ISelection

	call(func: Function, ...args): ISelection
	nodes(): INode[];
	node(): INode;
	size(): number;

	property(name: string): any
	property(name: string, value: any): ISelection

	remove(): void;

	transition(tweens: Function): ISelection
}
