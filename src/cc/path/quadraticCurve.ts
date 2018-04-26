import {IBaseQuadraticCurve, IQuadraticCurve} from "./def";
import {Element} from "../dom/element";
import {cubicAt, quadraticAt, quadraticExtremum, quadraticProjectPoint, solveQuadratic} from "../../base/common/bezier";
import {Rectangle} from "../core/rectangle";
import {Matrix} from "../core/matrix";
import {Vector} from "../core/vector";

export class QuadraticCurve extends Element implements IQuadraticCurve {
	x1: number
	y1: number
	x2: number
	y2: number
	cpx: number
	cpy: number

	constructor(q: IBaseQuadraticCurve) {
		super(null)

		this.type = 'QuadraticCurve'

		this.x1 = q.x1
		this.y1 = q.y1
		this.x2 = q.x2
		this.y2 = q.y2
		this.cpx = q.cpx
		this.cpy = q.cpy
	}

	get bounds() {
		const bounds = this.calculateBounds()
		if (Matrix.isIdentity(this.matrix)) return bounds
		let p0 = Vector.transform(Rectangle.topLeft(bounds), this.matrix)
		let p1 = Vector.transform(Rectangle.bottomRight(bounds), this.matrix)
		return Rectangle.boundingOf(p0, p1)
	}

	contains(point) {
		const _l = (this.strokeWidth + this.hitRange) / 2
		// Quick reject
		const {x, y} = point
		if (
			(y > this.y1 + _l && y > this.y2 + _l && y > this.cpy + _l)
			|| (y < this.y1 - _l && y < this.y2 - _l && y < this.cpy - _l)
			|| (x > this.x1 + _l && x > this.x2 + _l && x > this.cpx + _l)
			|| (x < this.x1 - _l && x < this.x2 - _l && x < this.cpx - _l)
		)
		{
			return false;
		}

		const d = quadraticProjectPoint(this.x1, this.y1, this.cpx, this.cpy, this.x2, this.y2, x, y);
		return d <= _l;
	}

	calculateBounds() {

		let xExtrema = quadraticExtremum(this.x1, this.cpx, this.x2)

		let xs = [this.x1, this.x2]

		xs.push(quadraticAt(this.x1, this.cpx, this.x2, xExtrema))

		let ys = [this.y1, this.y2]
		let yExtrema = quadraticExtremum(this.y1, this.cpy, this.y2)
		ys.push(quadraticAt(this.y1, this.cpy, this.y2, yExtrema))

		return Rectangle.boundingOf({
			x: Math.min.apply(null, xs),
			y: Math.min.apply(null, ys)
		}, {
			x: Math.max.apply(null, xs),
			y: Math.max.apply(null, ys)
		})
	}

	render(ctx) {
		super.render(ctx)
		ctx.save()
		let mx = this.matrix
		ctx.transform(mx.a, mx.b, mx.c, mx.d, mx.tx, mx.ty)
		ctx.beginPath()
		this.renderAsPath(ctx)
		ctx.stroke()
		ctx.restore()
	}

	renderAsPath(ctx) {
		ctx.moveTo(this.x1, this.y1)
		ctx.quadraticCurveTo(this.cpx, this.cpy, this.x2, this.y2)
	}
}
