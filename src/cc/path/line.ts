import {Element} from "../dom/element";
import {IBaseLineShape, ILine} from "./def";
import {Rectangle} from "../core/rectangle";
import {Matrix} from "../core/matrix";
import {Vector} from "../core/vector";
import {Line as BaseLine} from '../core/line'

export class Line extends Element implements ILine {
	x1: number
	y1: number
	x2: number
	y2: number

	constructor(l: IBaseLineShape) {
		super(null)

		this.type = 'Line'

		this.x1 = l.x1
		this.y1 = l.y1
		this.x2 = l.x2
		this.y2 = l.y2
	}

	get bounds() {
		if (Matrix.isIdentity(this.matrix)) return Rectangle.boundingOf({x: this.x1, y: this.y1}, {x: this.x2, y: this.y2})
		else {
			let p0 = Vector.transform({x: this.x1, y: this.y1}, this.matrix)
			let p1 = Vector.transform({x: this.x2, y: this.y2}, this.matrix)
			return Rectangle.boundingOf(p0, p1)
		}
	}

	contains(point): boolean {
		return BaseLine.contains(this.x1, this.y1, this.x2, this.y2, this.strokeWidth + this.hitRange, point.x, point.y)
	}

	render(ctx) {
		super.render(ctx)
		if (!this.isVisible) return
		if (this.opacity === 0) return
		ctx.save()

		ctx.lineWidth = this.strokeWidth
		ctx.strokeStyle = this.strokeColor.toString()
		let mx = this.matrix
		ctx.transform(mx.a, mx.b, mx.c, mx.d, mx.tx, mx.ty)
		ctx.beginPath()

		this.renderAsPath(ctx)

		ctx.closePath()
		ctx.stroke()
		ctx.restore()
	}

	renderAsPath(ctx) {
		ctx.moveTo(this.x1, this.y1)
		ctx.lineTo(this.x2, this.y2)
	}
}
