import {Element} from "../dom/element";
import {IPolyline} from "./def";
import {IBaseVector} from "../core/def";
import {Rectangle} from "../core/rectangle";
import {Matrix} from "../core/matrix";
import {Vector} from "../core/vector";
import {Line} from "../core/line";

export class Polyline extends Element implements IPolyline {
	points: IBaseVector[]

	constructor(...args: IBaseVector[]) {
		super(null)

		this.type = 'Ployline'

		this.points = args
	}

	get bounds() {
		const bounds = Rectangle.boundingOf(...this.points)
		if (Matrix.isIdentity(this.matrix)) return bounds
		let p0 = Vector.transform(Rectangle.topLeft(bounds), this.matrix)
		let p1 = Vector.transform(Rectangle.bottomRight(bounds), this.matrix)
		return Rectangle.boundingOf(p0, p1)
	}

	contains(point) {
		if (this.points.length < 2) return false

		const {x, y} = point
		let d = this.strokeWidth + this.hitRange
		for (let i = 1, len = this.points.length; i < len; i++) {
			let {x: x1, y: y1} = this.points[i - 1]
			let {x: x2, y: y2} = this.points[i]
			if (Line.contains(x1, y1, x2, y2, d, x, y)) return true
		}

		return false
	}

	render(ctx) {
		super.render(ctx)
		ctx.save()
		let mx = this.matrix
		ctx.transform(mx.a, mx.b, mx.c, mx.d, mx.tx, mx.ty)
		ctx.beginPath()
		this.renderAsPath(ctx)
		ctx.strokeStyle = this.strokeColor.toString()
		ctx.stroke()
		ctx.restore()
	}

	renderAsPath(ctx) {
		if (this.points.length < 2) return
		ctx.moveTo(this.points[0].x, this.points[0].y)
		for (let i = 0, len = this.points.length; i < len; i++) {
			let p = this.points[i]
			ctx.lineTo(p.x, p.y)
		}
	}
}
