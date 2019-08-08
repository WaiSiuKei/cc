import {Element} from '../dom/element';
import {IBaseText, IText, TextAlign, TextBaseLine} from './def';
import {Rectangle} from '../core/rectangle';
import {Font} from '../core/font';
import {fontStyle, fontVariant, fontWeight, IBaseRectangle} from '../core/def';
import {Matrix} from '../core/matrix';
import {Vector} from '../core/vector';

export class Text extends Element {
	value: string
	x: number
	y: number
	font: Font
	textAlign: TextAlign
	textBaseline: TextBaseLine

	_bounds: IBaseRectangle
	_width: number

	constructor(t: IBaseText) {
		super(null)

		this.type = 'Text'

		this.value = t.value
		this.x = t.x
		this.y = t.y
		this.font = new Font({
			// font: t.font,
			family: t.fontFamily,
			size: t.fontSize,
			style: t.fontStyle as fontStyle,
			variant: t.fontVariant as fontVariant,
			weight: t.fontWeight as fontWeight,
			height: t.lineHeight
		})
		this.textAlign = t.textAlign || TextAlign.Left
		this.textBaseline = t.textBaseline || TextBaseLine.Top
	}

	get bounds() {
		if (this._bounds) return this._bounds
		let bounds = this.calculateBoundingBox()
		if (Matrix.isIdentity(this.matrix)) {
			this._bounds = bounds
		} else {
			let p0 = Vector.transform(Rectangle.topLeft(bounds), this.matrix)
			let p1 = Vector.transform(Rectangle.bottomRight(bounds), this.matrix)
			this._bounds = Rectangle.boundingOf(p0, p1) // TODO: ratation case
		}
		return this._bounds
	}

	get fontSize() {
		return this.font.size
	}

	set fontSize(val) {
		console.log('set', val)
		this.font.size = val
	}

	calculateBoundingBox(): IBaseRectangle {
		let {height, descent, ascent} = this.font.merics
		let rect = {x: this.x, y: this.y, width: this._width, height: height}
		switch (this.textBaseline) {
			case TextBaseLine.Middle: {
				rect.y += (ascent - height / 2)
			}
			case TextBaseLine.Alphabetic: {
				rect.y += descent
			}
			case TextBaseLine.Bottom: {
				rect.y -= height
			}
		}

		switch (this.textAlign) {
			case TextAlign.Center: {
				rect.x += (this._width / 2)
			}
			case TextAlign.Right: {
				rect.x -= this._width
			}
		}
		return rect
	}

	contains(point): boolean {
		return Rectangle.contains(this.bounds, point)
	}

	render(ctx: CanvasRenderingContext2D) {
		if (!this.isVisible) return
		if (this.opacity === 0) return
		if (!this.value) {
			this._width = 0
			return
		}
		ctx.save()

		let mx = this.matrix
		ctx.transform(mx.a, mx.b, mx.c, mx.d, mx.tx, mx.ty)

		ctx.font = this.font.font
		ctx.textAlign = this.textAlign
		ctx.textBaseline = this.textBaseline
		if (this.fillColor) ctx.fillStyle = this.fillColor.toString()
		this._width = ctx.measureText(this.value).width
		ctx.fillText(this.value, this.x, this.y);
		ctx.restore()
	}
}