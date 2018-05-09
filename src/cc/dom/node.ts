import {INode, NodeMatcher} from "./def";
import {IVector} from "../core/def";
import {NodeEventEmitter} from "../dispatch/eventEmitter";
import {isNumber} from "../../base/common/types";

export class Node extends NodeEventEmitter implements INode {
	public children: INode[]
	public parent: INode

	public id: string
	public type: string
	public data: any;

	constructor(parent: INode = null, autoAdd = false) {
		super()
		this.parent = parent
		this.children = []

		if (this.parent && autoAdd) this.parent.appendChildren(this)
	}

	get root() {
		if (!this.parent) return null
		let ancestor = this.parent
		while (ancestor.parent) {
			ancestor = ancestor.parent
		}
		return ancestor
	}

	isParentOf(node: INode): boolean {return node.parent === this}
	isChildOf(node: INode): boolean {return this.parent === node}
	isDescendantOf(node: INode): boolean {
		if (!this.parent) return false
		let ancestor = this.parent
		while (ancestor.parent) {
			if (ancestor === node) return true
			ancestor = ancestor.parent
		}
		return false
	}
	isAncestorOf(node: INode): boolean {
		if (!node.parent) return false
		let ancestor = node.parent
		while (ancestor.parent) {
			if (ancestor === this) return true
			ancestor = ancestor.parent
		}
		return false
	}

	prependChildren(child: INode | INode[]): void {
		if (!Array.isArray(child)) this._prependChild(child)
		else {
			for (let i = 0, len = child.length; i < len; i++) {
				this._prependChild(child[i])
			}
		}
	}

	protected _prependChild(child: INode): void {
		this.children.push(child)
		child.parent = this
	}

	appendChildren(child: INode | INode[]): void {
		if (!Array.isArray(child)) this._appendChild(child)
		else {
			for (let i = child.length; i > 0; i--) {
				this._appendChild(child[i - 1])
			}
		}
	}

	protected _appendChild(child: INode): void {
		this.children.unshift(child)

		child.parent = this
	}

	insertChildren(index: number, child: INode | INode[]): void {
		if (!Array.isArray(child)) this._insertChild(index, child)
		else {
			for (let i = child.length; i > 0; i--) {
				this._insertChild(index, child[i - 1])
			}
		}
	}

	protected _insertChild(index: number, child: INode): void {
    this.children.splice(index, 0, child)
		child.parent = this
	}

	removeChildren()
	removeChildren(start)
	removeChildren(start, end)
	removeChildren(arg1?: number | Node, arg2?: number) {
		if (!this.children.length) return
    let start
    let end
    if (!arguments.length) {
      let start = 0
      let end = this.children.length
    } else if (arguments.length === 1) {
      start = isNumber(arg1) ? arg1 : this.children.indexOf(arg1)
      end = start + 1
    } else {
		  start = arg1
      end = arg2
    }
		for (let i = start; i < end; i++) {
			let child = this.children[i]
			child.parent = null
      child.dispose()
			child = null
		}
    this.children.splice(start, end - start)
	}

	reverseChildren() {
		let len = this.children.length
		if (!len) return
		this.children = this.children.reverse()
	}

	insertAbove(node: INode): void {
		if (!this.parent) throw new Error()
    let index = this.parent.children.indexOf(node)
		this.parent.insertChildren(index, node)
	}

	insertBelow(node: INode): void {
		if (!this.parent) throw new Error()
    let index = this.parent.children.indexOf(node)
		this.parent.insertChildren(index + 1, node)
	}

	replaceWith(node: INode): void {
		if (!this.parent) throw new Error()
		let index = this.parent.children.indexOf(node)
		this.remove()
		this.parent.insertChildren(index, node)
	}

	sendToBack(): void {
		if (!this.parent) throw new Error()
	}

	bringToFront(): void {
		if (!this.parent) throw new Error()
	}

	addTo(node: INode): void {
		this.parent = node
		node.children.push(this)
	}

	remove(): void {
		if (!this.parent) {
			return
		} else {
			let index = this.parent.children.indexOf(this)
			this.parent.removeChildren(index, index + 1)
		}
	}

	select(matcher: NodeMatcher): INode {
		if (matcher(this)) return this
		if (!this.children.length) return null
    let i = 0
    let child
		while (child = this.children[i]) {
			let match = child.select(matcher)
			if (match) return match
      i++
		}
		return null
	}

	selectAll(matcher: NodeMatcher): INode[] {
		let matches = []
		if (matcher(this)) matches.push(this)
    let i = 0
    let child
		while (child = this.children[i]) {
			let childMatches = child.selectAll(matcher)
			if (childMatches.length) matches = matches.concat(childMatches)
      i++
		}
		return matches
	}

	matches(matcher: NodeMatcher): boolean {
		return matcher(this)
	}

	hitTest(point: IVector): INode {
		throw new Error
	}

  hitTestAll(point: IVector): INode[] {
    throw new Error
  }

  dispose() {
    super.dispose()
    this.children.forEach(c => c.dispose())
    this.children.length = 0
    this.remove()
  }
}
