import {IRay} from "./def";
import {TwoPointDrawing} from "./drawing";
import {IStage} from "../dom/def";
import {Line} from "../core/line";
import {IBaseVector} from "../core/def";

export class Ray extends TwoPointDrawing implements IRay {
	static type = 'Ray'

	constructor(l) {
		super(l)

		this.type = Ray.type
	}

	_handleMouseLeave(e) {
		if (e.target === this || !this.hitTest({x: e.x, y: e.y})) {
			this.isHovered = false
		}
		return true
	}

	hitTest(point) {
		if (!this.isVisible) return null

		for (let i = 0; i < 2; i++) {
			let l = this.lollipops[i]
			if (l.contains(point)) return l
		}
		let stage = this.root as IStage

		let remotePoint = Line.remotePointOfRay(this.x1, this.y1, this.x2, this.y2, stage.bounds.width, stage.bounds.height)
		if (Line.contains(this.x1, this.y1, remotePoint.x, remotePoint.y, this.hitRange, point.x, point.y)) return this
		return null
	}

	render(ctx) {
		if (!this.isVisible) return
		if (this.opacity === 0) return

		ctx.lineWidth = this.strokeWidth
		ctx.strokeStyle = this.strokeColor.toString()
		ctx.beginPath()
		ctx.moveTo(this.x1, this.y1)
		let stage = this.root as IStage
		let remotePoint = Line.remotePointOfRay(this.x1, this.y1, this.x2, this.y2, stage.bounds.width, stage.bounds.height)

		ctx.lineTo(remotePoint.x, remotePoint.y)
		ctx.closePath()
		ctx.stroke()

		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			for (let i = 0; i < 2; i++) {
				this.lollipops[i].render(ctx)
			}
		}
	}
}
