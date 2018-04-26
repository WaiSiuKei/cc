import {Element} from "../dom/element";
import {IRect} from "./def";
import {IBaseRectangle} from "../core/def";
import {Rectangle} from "../core/rectangle";
import {Matrix} from "../core/matrix";
import {Vector} from "../core/vector";

export class Rect extends Element implements IRect {
	x: number
	y: number
	width: number
	height: number

	constructor(r: IBaseRectangle) {
		super(null)

		this.type = 'Rect'

		this.x = r.x
		this.y = r.y
		this.width = r.width
		this.height = r.height
	}

	get bounds() {
		const bounds = {x: this.x, y: this.y, width: this.width, height: this.height}
		if (Matrix.isIdentity(this.matrix)) return bounds
		else {
			let p0 = Vector.transform(Rectangle.topLeft(bounds), this.matrix)
			let p1 = Vector.transform(Rectangle.bottomRight(bounds), this.matrix)
			return Rectangle.boundingOf(p0, p1)
		}
	}

	contains(point) {
		let range = this.strokeWidth + this.hitRange
		let d = range / 2

		let bounds = this.bounds

		if (!this.fillColor || this.fillColor.rgba.a == 0) {
			if (Rectangle.contains({x: bounds.x - d, y: bounds.y - d, width: bounds.width - range, height: bounds.height - range}, point)) return false
		}

		return Rectangle.contains(bounds, point)
	}

	render(ctx) {
		super.render(ctx)
		ctx.save()
		let mx = this.matrix
		ctx.transform(mx.a, mx.b, mx.c, mx.d, mx.tx, mx.ty)
		ctx.strokeStyle = this.strokeColor.toString()

		ctx.strokeRect(this.x, this.y, this.width, this.height)
		ctx.restore()
	}
}
