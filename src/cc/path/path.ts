import {Element} from "../dom/element";
import {IPath, IPathSegment} from "./def";
import {Rectangle} from "../core/rectangle";
import {Matrix} from "../core/matrix";
import {Vector} from "../core/vector";

export class Path extends Element implements IPath {
	children: IPathSegment[]

	constructor(...args: IPathSegment[]) {
		super(null)

		this.type = 'Path'

		this.children = args
	}

	get segment() { // alias
		return this.children
	}

	get bounds() {
		const bounds = Rectangle.unite(...this.children.map(s => s.bounds))
		if (Matrix.isIdentity(this.matrix)) return bounds
		let p0 = Vector.transform(Rectangle.topLeft(bounds), this.matrix)
		let p1 = Vector.transform(Rectangle.bottomRight(bounds), this.matrix)
		return Rectangle.boundingOf(p0, p1)
	}

	contains(point) {
		if (!this.children.length) return false
		for (let i = 0, len = this.children.length; i < len; i++) {
			if (this.children[i].contains[point]) return true
		}
		return false
	}

	render(ctx) {
		super.render(ctx)
		if (!this.children.length) return
		ctx.save()
		let mx = this.matrix
		ctx.transform(mx.a, mx.b, mx.c, mx.d, mx.tx, mx.ty)
		ctx.beginPath()
		for (let i = 0, len = this.children.length; i < len; i++) {
			this.children[i].renderAsPath(ctx)
		}
		ctx.stroke()
		ctx.restore()
	}
}
