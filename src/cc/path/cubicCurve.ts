import {IBaseCubicCurve, ICubicCurve} from "./def";
import {Element} from "../dom/element";
import {IBaseVector} from "../core/def";
import {cubicAt, cubicExtrema, cubicProjectPoint} from "../../base/common/bezier";
import {Rectangle} from "../core/rectangle";
import {Matrix} from "../core/matrix";
import {Vector} from "../core/vector";

export class CubicCurve extends Element implements ICubicCurve {
	x1: number
	y1: number
	x2: number
	y2: number
	cpx1: number
	cpy1: number
	cpx2: number
	cpy2: number

	constructor(c: IBaseCubicCurve) {
		super(null)

		this.type = 'CubicCurve'

		this.x1 = c.x1
		this.y1 = c.y1
		this.x2 = c.x2
		this.y2 = c.y2
		this.cpx1 = c.cpx1
		this.cpy1 = c.cpy1
		this.cpx2 = c.cpx2
		this.cpy2 = c.cpy2
	}

	get bounds() {
		const bounds = this.calculateBounds()
		if (Matrix.isIdentity(this.matrix)) return bounds
		let p0 = Vector.transform(Rectangle.topLeft(bounds), this.matrix)
		let p1 = Vector.transform(Rectangle.bottomRight(bounds), this.matrix)
		return Rectangle.boundingOf(p0, p1)
	}

	contains(point: IBaseVector): boolean {
		const _l = (this.strokeWidth + this.hitRange) / 2
		// Quick reject
		const {x, y} = point
		if (
			(y > this.y1 + _l && y > this.y2 + _l && y > this.cpy1 + _l && y > this.cpy2 + _l)
			|| (y < this.y1 - _l && y < this.y2 - _l && y < this.cpy1 - _l && y < this.cpy2 - _l)
			|| (x > this.x1 + _l && x > this.x2 + _l && x > this.cpx1 + _l && x > this.cpx2 + _l)
			|| (x < this.x1 - _l && x < this.x2 - _l && x < this.cpx1 - _l && x < this.cpx2 - _l)
		)
		{
			return false;
		}

		const d = cubicProjectPoint(this.x1, this.y1, this.cpx1, this.cpx2, this.cpx2, this.cpy2, this.x2, this.y2, x, y);
		return d <= _l;
	}

	calculateBounds() {
		// FIXME: stroke
		let xExtrema = cubicExtrema(this.x1, this.cpx1, this.cpx2, this.x2);

		let xs = new Array(xExtrema.length)

		for (let i = 0, n = xExtrema.length; i < n; i++) xs[i] = cubicAt(this.x1, this.cpx1, this.cpx2, this.x2, xExtrema[i])

		let yExtrema = cubicExtrema(this.y1, this.cpy1, this.cpy2, this.y2)
		let ys = new Array(yExtrema.length)

		for (let i = 0, n = yExtrema.length; i < n; i++) ys[i] = cubicAt(this.y1, this.cpy1, this.cpy2, this.y2, yExtrema[i])

		return Rectangle.boundingOf(
			{
				x: Math.min.call(null, this.x1, this.x2, ...xs),
				y: Math.min.call(null, this.y1, this.y2, ...ys)
			}, {
				x: Math.max.call(null, this.x1, this.x2, ...xs),
				y: Math.max.call(null, this.y1, this.y2, ...ys)
			})
	}

	render(ctx) {
		super.render(ctx)
		ctx.save()
		let mx = this.matrix
		ctx.transform(mx.a, mx.b, mx.c, mx.d, mx.tx, mx.ty)
		this.renderAsPath(ctx)
		ctx.closePath()
		ctx.stroke()
		ctx.restore()
	}

	renderAsPath(ctx) {
		ctx.moveTo(this.x1, this.y1)
		ctx.bezierCurveTo(this.cpx1, this.cpy1, this.cpx2, this.cpy2, this.x2, this.y2)
	}
}
