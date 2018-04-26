import {INode, NodeMatcher} from "./def";
import {IVector} from "../core/def";
import {NodeEventEmitter} from "../dispatch/eventEmitter";

export class Node extends NodeEventEmitter implements INode {
	public children: INode[]
	public parent: INode
	public previousSibling: INode
	public nextSibling: INode

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
	get index() {
		if (!this.parent) return -1
		return this.parent.children.indexOf(this)
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
	isSiblingOf(node: INode): boolean {
		return this.parent === node.parent
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
		let len = this.children.length
		if (len === 0) {
			child.previousSibling = null
			child.nextSibling = null
		} else {
			let lastOne = this.children[len - 1]
			lastOne.nextSibling = child
			child.nextSibling = null
			child.previousSibling = lastOne
		}
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
		let len = this.children.length
		if (len === 0) {
			child.previousSibling = null
			child.nextSibling = null
		} else {
			let firstOne = this.children[0]
			firstOne.previousSibling = child
			child.nextSibling = firstOne
			child.previousSibling = null
		}
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
		let len = this.children.length
		if (len === 0) {
			child.previousSibling = null
			child.nextSibling = null
		} else {
			if (index > len) index = len
			let prevOne = index === 0 ? null : this.children[index]
			let nextOne = index === len ? null : this.children[index]
			if (nextOne) nextOne.previousSibling = child
			child.nextSibling = nextOne
			child.previousSibling = prevOne
			if (prevOne) prevOne.nextSibling = child
		}
		this.children.unshift(child)

		child.parent = this
	}

	removeChildren()
	removeChildren(start)
	removeChildren(start, end)
	removeChildren(...args) {
		if (!this.children.length) return
		let start = args[0] || 0
		let end = args[1] || this.children.length
		let prevOne = start === 0 ? null : this.children[start]
		let nextOne = end === this.children.length ? null : this.children[end]
		for (let i = start; i < end; i++) {
			let child = this.children[i]
			child.parent = null
			child.nextSibling = null
			child.previousSibling = null
			child = null
		}
		this.children.splice(start, end - start)
		prevOne.nextSibling = nextOne
		nextOne.previousSibling = prevOne
	}

	reverseChildren() {
		let len = this.children.length
		if (!len) return
		this.children = this.children.reverse()
		this.children[0].previousSibling = null
		for (let i = 0; i < len; i++) {
			let child = this.children[i]
			let nextOne = i === len - 1 ? null : this.children[i + 1]
			child.nextSibling = nextOne
			if (nextOne) nextOne.previousSibling = child
		}
	}

	insertAbove(node: INode): void {
		if (!this.parent) throw new Error()
		this.parent.insertChildren(this.index, node)
	}

	insertBelow(node: INode): void {
		if (!this.parent) throw new Error()
		this.parent.insertChildren(this.index + 1, node)
	}

	replaceWith(node: INode): void {
		if (!this.parent) throw new Error()
		let index = this.index
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
		let len = node.children.length
		if (len !== 0) {
			let lastOne = node.children[len - 1]
			lastOne.nextSibling = this
			this.previousSibling = lastOne
		} else {
			this.previousSibling = null

		}
		this.nextSibling = null
		node.children.push(this)
	}

	remove(): void {
		if (!this.parent) {
			return
		} else {
			let index = this.index
			this.parent.removeChildren(index, index + 1)
		}
	}

	isAbove(item: INode): boolean {
		if (this.parent === item.parent) return this.index > item.index
		// TODO
		return false
	}

	isBelow(item: INode): boolean {
		if (this.parent === item.parent) return this.index < item.index
		// TODO
		return false
	}

	select(matcher: NodeMatcher): INode {
		if (matcher(this)) return this
		if (!this.children.length) return null
		let child = this.children[0]
		while (child) {
			let match = child.select(matcher)
			if (match) return match
			child = child.nextSibling
		}
		return null
	}

	selectAll(matcher: NodeMatcher): INode[] {
		let matches = []
		if (matcher(this)) matches.push(this)
		let child = this.children[0]
		while (child) {
			let childMatches = child.selectAll(matcher)
			if (childMatches.length) matches = matches.concat(childMatches)
			child = child.nextSibling
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
  }
}
