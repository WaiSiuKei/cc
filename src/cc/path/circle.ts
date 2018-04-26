import {Element} from "../dom/element";
import {IBaseCircle, ICircle} from "./def";
import {Vector} from "../core/vector";
import {PI2} from "../../base/common/numerical";
import {Matrix} from "../core/matrix";
import {Rectangle} from "../core/rectangle";

export class Circle extends Element implements ICircle {
	cx: number
	cy: number
	radius: number

	constructor(circle: IBaseCircle) {
		super(null)

		this.type = 'Circle'

		this.cx = circle.cx
		this.cy = circle.cy
		this.radius = circle.radius
	}

	get bounds() {
		let bounds = {
			x: this.cx - this.radius,
			y: this.cy - this.radius,
			width: this.radius * 2,
			height: this.radius * 2
		}
		if (Matrix.isIdentity(this.matrix)) return bounds
		let p0 = Vector.transform(Rectangle.topLeft(bounds), this.matrix)
		let p1 = Vector.transform(Rectangle.bottomRight(bounds), this.matrix)
		return Rectangle.boundingOf(p0, p1)
	}

	get center() {
		return {
			x: this.cx,
			y: this.cy
		}
	}

	contains(pt) {
		if (!this.isVisible) return false
		if (!this.opacity) return false
		let point = Vector.transform(pt, this.matrix)
		let d = Vector.euclideanMetric(Vector.subtract(this.center, point))
		let stroke = this.strokeWidth + this.hitRange
		let range = stroke / 2
		if (this.fillColor && this.fillColor.rgba.a > 0) return d <= range + this.radius
		return d < range + this.radius && d > this.radius - range
	}

	render(ctx) {
		if (!this.isVisible) return
		if (!this.opacity) return
		ctx.save()
		let mx = this.matrix
		ctx.transform(mx.a, mx.b, mx.c, mx.d, mx.tx, mx.ty)
		ctx.lineWidth = this.strokeWidth
		ctx.strokeStyle = this.strokeColor.toString()
		ctx.beginPath()
		ctx.ellipse(this.cx, this.cy, this.radius, this.radius, 0, 0, PI2)
		ctx.closePath()
		if (this.fillColor) {
			ctx.fillStyle = this.fillColor.toString()
			ctx.fill()
		}
		ctx.stroke()
		ctx.restore()
	}
}
