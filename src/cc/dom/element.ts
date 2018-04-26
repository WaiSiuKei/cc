import {IElement, IGroup, ILayer, INode} from "./def";
import {Shape} from "./shape";
import {IBaseVector} from "../core/def";
import {Rectangle} from "../core/rectangle";

export class Element extends Shape implements IElement {
	constructor(parent: IGroup | ILayer = null) {
		super(parent)
	}

	hitTest(point: IBaseVector): IElement {
		if (!this.reactive) return null
		if (!this.isVisible) return null
		if (this.opacity === 0 && !this.reactive) return null
		if (!this.contains(point)) return null
		return this
	}

	hitTestAll(point: IBaseVector): IElement[] {
		let res = this.hitTest(point)
		return res ? [res] : []
	}

	contains(point: IBaseVector): boolean {
		return Rectangle.contains(this.bounds, point)
	}
}
