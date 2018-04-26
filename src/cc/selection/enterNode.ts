import { Node} from "../dom/node";
import {INode} from "../dom/def";

export class EnterNode extends Node {
	constructor(parent: INode, data: any) {
		super()
		this.parent = parent
		this.data = data
	}
}