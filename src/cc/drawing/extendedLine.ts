import {TwoPointDrawing} from "./drawing";
import {IStage} from "../dom/def";
import {Line} from "../core/line";
import {IExtendedLine} from "./def";

export class ExtendedLine extends TwoPointDrawing implements IExtendedLine {
	static type = 'ExtendedLine'

	constructor(l) {
		super(l)

		this.type = ExtendedLine.type
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

		let remotePoint1 = Line.remotePointOfRay(this.x1, this.y1, this.x2, this.y2, stage.bounds.width, stage.bounds.height)
		let remotePoint2 = Line.remotePointOfRay(this.x2, this.y2, this.x1, this.y1, stage.bounds.width, stage.bounds.height)
		if (Line.contains(remotePoint1.x, remotePoint1.y, remotePoint2.x, remotePoint2.y, this.hitRange, point.x, point.y)) return this
		return null
	}

	render(ctx) {
		if (!this.isVisible) return
		if (this.opacity === 0) return

		ctx.lineWidth = this.strokeWidth
		ctx.strokeStyle = this.strokeColor.toString()
		ctx.beginPath()

		let stage = this.root as IStage
		let remotePoint1 = Line.remotePointOfRay(this.x1, this.y1, this.x2, this.y2, stage.bounds.width, stage.bounds.height)
		let remotePoint2 = Line.remotePointOfRay(this.x2, this.y2, this.x1, this.y1, stage.bounds.width, stage.bounds.height)

		ctx.moveTo(remotePoint1.x, remotePoint1.y)
		ctx.lineTo(remotePoint2.x, remotePoint2.y)
		ctx.closePath()
		ctx.stroke()

		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			for (let i = 0; i < 2; i++) {
				this.lollipops[i].render(ctx)
			}
		}
	}
}