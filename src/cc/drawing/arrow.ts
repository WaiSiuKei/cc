import {TrendLine} from "./trendLine";
import {IArrow, ITwoPointDrawing} from "./def";
import {Vector} from "../core/vector";
import {Angle} from "../core/angle";

export class Arrow extends TrendLine implements IArrow {
	static type = 'Arrow'

	constructor(l: ITwoPointDrawing) {
		super(l)
		this.type = Arrow.type
	}

	render(ctx: CanvasRenderingContext2D) {
		if (!this.isVisible) return
		if (this.opacity === 0) return
		this.line.render(ctx)

		let vec = Vector.subtract({x: this.x2, y: this.y2}, {x: this.x1, y: this.y1})
		if (Vector.euclideanMetric(vec) > 10) {
			let angle = Math.PI - Vector.radian(vec)

			let delta = Angle.toRadian(30)
			let angle1 = angle + delta
			let angle2 = angle - delta

			ctx.moveTo(this.x2, this.y2)
			ctx.lineTo(this.x2 + Math.cos(angle1) * 10, this.y2 - Math.sin(angle1) * 10)
			ctx.moveTo(this.x2, this.y2)
			ctx.lineTo(this.x2 + Math.cos(angle2) * 10, this.y2 - Math.sin(angle2) * 10)
			ctx.stroke()
		}

		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			for (let i = 0; i < 2; i++) {
				this.lollipops[i].render(ctx)
			}
		}
	}
}