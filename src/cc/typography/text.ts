import {Element} from "../dom/element";
import {IBaseText, IText, TextAlign, TextBaseLine} from "./def";
import {Rectangle} from "../core/rectangle";

export class Text extends Element implements IText {
	value: string
	x: number
	y: number
	font: string
	textAlign: TextAlign
	textBaseline: TextBaseLine

	_width: number
	_height: number

	constructor(t: IBaseText) {
		super(null)

		this.type = 'Text'

		this.value = t.value
		this.x = t.x
		this.y = t.y
		this.font = t.font
		this.textAlign = t.textAlign || TextAlign.Left
		this.textBaseline = t.textBaseline || TextBaseLine.Bottom
	}

	// get bounds() {
	// if (Matrix.isIdentity(this.matrix)) return Rectangle.boundingOf({x: this.x1, y: this.y1}, {x: this.x2, y: this.y2})
	// else {
	// 	let p0 = Vector.transform({x: this.x1, y: this.y1}, this.matrix)
	// 	let p1 = Vector.transform({x: this.x2, y: this.y2}, this.matrix)
	// 	return Rectangle.boundingOf(p0, p1)
	// }
	// }

	contains(point): boolean {
		if (this.textBaseline === TextBaseLine.Middle) {
			let halfWidth = this._width / 2
			return Rectangle.contains({x: this.x - halfWidth, y: this.y, width: this._width, height: this._height}, point)
		}
		return false
		// return BaseLine.contains(this.x1, this.y1, this.x2, this.y2, this.strokeWidth + this.hitRange, point.x, point.y)
	}

	render(ctx: CanvasRenderingContext2D) {
		super.render(ctx)
		if (!this.isVisible) return
		if (this.opacity === 0) return
		ctx.save()

		let mx = this.matrix
		ctx.transform(mx.a, mx.b, mx.c, mx.d, mx.tx, mx.ty)

		ctx.font = this.font
		ctx.textAlign = this.textAlign
		ctx.textBaseline = this.textBaseline
		if (this.fillColor) ctx.fillStyle = this.fillColor.toString()

		this._height = ctx.measureText('M').width;
		this._width = ctx.measureText(this.value).width
		ctx.fillText(this.value, this.x, this.y);

		ctx.restore()
	}
}