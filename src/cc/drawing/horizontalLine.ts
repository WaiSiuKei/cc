import {OnePointDrawing} from "./drawing";
import {IHorizontalLine, IOnePointDrawing} from "./def";
import {IStage} from "../dom/def";

export class HorizontalLine extends OnePointDrawing implements IHorizontalLine {
	static type = 'HorizontalLine'
	constructor(l: IOnePointDrawing) {
		super(l)

		this.type = HorizontalLine.type
	}

	hitTest(point) {
		if (!this.isVisible) return null
		if (this.lollipop.contains(point)) return this.lollipop
		if (Math.abs(point.y - this.y) <= this.strokeWidth + this.hitRange) return this
		return null
	}

	render(ctx) {
		if (!this.isVisible) return
		if (this.opacity === 0) return
		ctx.save()

		ctx.lineWidth = this.strokeWidth
		ctx.strokeStyle = this.strokeColor.toString()
		let mx = this.matrix
		ctx.transform(mx.a, mx.b, mx.c, mx.d, mx.tx, mx.ty)
		ctx.beginPath()

		let stage = this.root as IStage

		ctx.moveTo(0, this.y)
		ctx.lineTo(stage.bounds.width, this.y)

		ctx.closePath()
		ctx.stroke()
		ctx.restore()
		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			this.lollipop.render(ctx)
		}
	}
}