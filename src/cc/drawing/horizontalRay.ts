import {OnePointDrawing} from "./drawing";
import {IHorizontalLine, IHorizontalRay, IOnePointDrawing} from "./def";
import {IStage} from "../dom/def";
import {Line} from "../core/line";

export class HorizontalRay extends OnePointDrawing implements IHorizontalRay {
	static type = 'HorizontalRay'
	constructor(l: IOnePointDrawing) {
		super(l)

		this.type = HorizontalRay.type
	}

	hitTest(point) {
		if (!this.isVisible) return null
		if (this.lollipop.contains(point)) return this.lollipop
		if (point.x - this.x > this.strokeWidth + this.hitRange) return null
		let stage = this.root as IStage
		return Line.contains(this.x, this.y, stage.bounds.width, this.y, this.strokeWidth + this.hitRange, point.x, point.y) ? this : null
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

		ctx.moveTo(this.x, this.y)
		ctx.lineTo(stage.bounds.width, this.y)

		ctx.closePath()
		ctx.stroke()
		ctx.restore()
		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			this.lollipop.render(ctx)
		}
	}
}