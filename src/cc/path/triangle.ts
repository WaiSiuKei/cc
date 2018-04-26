import {Element} from "../dom/element";
import {IBaseTriangle, ITriangle} from "./def";
import {Rectangle} from "../core/rectangle";
import {Matrix} from "../core/matrix";
import {Vector} from "../core/vector";
import {Line} from "../core/line";

// https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle
// barycentric coordinates
// http://jsfiddle.net/PerroAZUL/zdaY8/

function pointInTriangle(x, y, x0, y0, x1, y1, x2, y2) {
	var A = 1 / 2 * (-y1 * x2 + y0 * (-x1 + x2) + x0 * (y1 - y2) + x1 * y2);
	var sign = A < 0 ? -1 : 1;
	var s = (y0 * x2 - x0 * y2 + (y2 - y0) * x + (x0 - x2) * y) * sign;
	var t = (x0 * y1 - y0 * x1 + (y0 - y1) * x + (x1 - x0) * y) * sign;

	return s > 0 && t > 0 && (s + t) < 2 * A * sign;
}

export class Triangle extends Element implements ITriangle {
	x1: number
	y1: number
	x2: number
	y2: number
	x3: number
	y3: number

	constructor(t: IBaseTriangle) {
		super(null)

		this.type = 'Triangle'

		this.x1 = t.x1
		this.y1 = t.y1
		this.x2 = t.x2
		this.y2 = t.y2
		this.x3 = t.x3
		this.y3 = t.y3
	}

	get bounds() {
		if (Matrix.isIdentity(this.matrix)) return Rectangle.boundingOf(this.p1, this.p2, this.p3)
		else {
			let p1 = Vector.transform(this.p1, this.matrix)
			let p2 = Vector.transform(this.p2, this.matrix)
			let p3 = Vector.transform(this.p3, this.matrix)
			return Rectangle.boundingOf(p1, p2, p3)
		}
	}

	get p1() {return {x: this.x1, y: this.y1}}
	get p2() {return {x: this.x2, y: this.y2}}
	get p3() {return {x: this.x3, y: this.y3}}

	contains(point) {
		// 排除法
		const {x, y} = point
		let range = this.strokeWidth + this.hitRange
		if (!Line.contains(this.x1, this.y1, this.x2, this.y2, range, x, y)
			|| !Line.contains(this.x1, this.y1, this.x3, this.y3, range, x, y)
			|| !Line.contains(this.x2, this.y2, this.x3, this.y3, range, x, y))
		{
			if (this.fillColor && this.fillColor.rgba.a === 0) return false
		}

		return pointInTriangle(x, y, this.x1, this.y1, this.x2, this.y2, this.x3, this.y3)
	}

	render(ctx) {
		super.render(ctx)
		ctx.save()
		let mx = this.matrix
		ctx.transform(mx.a, mx.b, mx.c, mx.d, mx.tx, mx.ty)
		ctx.beginPath()
		ctx.moveTo(this.x1, this.y1)
		ctx.lineTo(this.x2, this.y2)
		ctx.lineTo(this.x3, this.y3)
		ctx.closePath()
		ctx.strokeStyle = this.strokeColor.toString()
		ctx.stroke()
		ctx.restore()
	}
}
