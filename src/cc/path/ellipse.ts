import {Element} from "../dom/element";
import {IBaseEllipse, IEllipse} from "./def";
import {Matrix} from "../core/matrix";
import {Rectangle} from "../core/rectangle";
import {Vector} from "../core/vector";
import {PI2} from "../../base/common/numerical";
import {Line} from "../core/line";

export class Ellipse extends Element implements IEllipse {
	cx: number
	cy: number
	r1: number
	r2: number

	constructor(e: IBaseEllipse) {
		super(null)

		this.type = 'Ellipse'

		this.cx = e.cx
		this.cy = e.cy
		this.r1 = e.r1
		this.r2 = e.r2

	}

	get bounds() {
		const bounds = this.calculateBounds()
		if (Matrix.isIdentity(this.matrix)) return bounds
		let p0 = Vector.transform(Rectangle.topLeft(bounds), this.matrix)
		let p1 = Vector.transform(Rectangle.bottomRight(bounds), this.matrix)
		return Rectangle.boundingOf(p0, p1)
	}

	calculateBounds() {
		// https://math.stackexchange.com/questions/91132/how-to-get-the-limits-of-rotated-ellipse
		let d = (this.strokeWidth + this.hitRange) / 2
		// let phi = Matrix.decompose(this.matrix).rotation
		let phi = 0
		let ux = (this.r1 + d) * Math.cos(phi);
		let uy = (this.r1 + d) * Math.sin(phi);
		let vx = (this.r2 + d) * Math.cos(phi + Math.PI / 2);
		let vy = (this.r2 + d) * Math.sin(phi + Math.PI / 2);

		let bbox_halfwidth = Math.sqrt(ux * ux + vx * vx);
		let bbox_halfheight = Math.sqrt(uy * uy + vy * vy);

		return Rectangle.boundingOf({
			x: this.cx - bbox_halfwidth,
			y: this.cy - bbox_halfheight
		}, {
			x: this.cx + bbox_halfwidth,
			y: this.cy + bbox_halfheight
		})
	}

	contains(point) {
		let pt = Vector.transform(point, this.matrix)
		const a = this.r1
		const b = this.r2
		let half = (this.strokeWidth + this.hitRange) / 2

		const r = a
		const scaleY = a / b

		let x = pt.x - this.cx
		let y = pt.y - this.cy
		y *= scaleY

		let d = x * x + y * y
		return d < (r + half) * (r + half) && d > (r - half) * (r - half)
	}

	render(ctx) {
		super.render(ctx)
		ctx.save()
		let mx = this.matrix
		ctx.transform(mx.a, mx.b, mx.c, mx.d, mx.tx, mx.ty)
		ctx.beginPath()
		ctx.ellipse(this.cx, this.cy, this.r1, this.r2, 0, 0, PI2, true);
		ctx.closePath()
		ctx.stroke()
		ctx.restore()
	}
}
