import {ILine} from "../path/def";
import {Line} from "../path/line";
import {TwoPointDrawing} from "./drawing";
import {ITrendLine, ITwoPointDrawing} from "./def";
import {IStage} from "../dom/def";
import {Line as BaseLine} from "../core/line";

export class GannFan extends TwoPointDrawing implements ITrendLine {
	static type = 'GannFan'
	static ratios = [1 / 8, 1 / 4, 1 / 3, 1 / 2, 1, 2, 3, 4, 8]

	lines: ILine[]

	constructor(l: ITwoPointDrawing) {
		super(l)
		this.type = GannFan.type

		this.lines = []
		for (let i = 0, len = GannFan.ratios.length; i < len; i++) {
			this.lines.push(new Line(l))
		}
		this._recalculateLines()
	}

	set x1(val) {
		this._x1 = val
		if (this.lollipops && this.lollipops[0]) this.lollipops[0].cx = val
		this._recalculateLines()
	}

	set y1(val) {
		this._y1 = val
		if (this.lollipops && this.lollipops[0]) this.lollipops[0].cy = val
		this._recalculateLines()
	}

	set x2(val) {
		this._x2 = val
		if (this.lollipops && this.lollipops[1]) this.lollipops[1].cx = val
		this._recalculateLines()
	}

	set y2(val) {
		this._y2 = val
		if (this.lollipops && this.lollipops[1]) this.lollipops[1].cy = val
		this._recalculateLines()
	}

	_recalculateLines() {
		const {_x1, _y1, _x2, _y2} = this

		let stage = this.root as IStage
		if (!stage) return

		const {width, height} = stage.bounds
		let dy = _y2 - _y1
		for (let i = 0, len = GannFan.ratios.length; i < len; i++) {

			let ratio = GannFan.ratios[i]

			let y = _y1 + dy * ratio
			let remotePoint = BaseLine.remotePointOfRay(_x1, _y1, _x2, y, width, height)

			let h = this.lines[i]
			h.x1 = _x1
			h.y1 = _y1
			h.x2 = remotePoint.x
			h.y2 = remotePoint.y
		}
	}

	hitTest(point) {
		if (!this.isVisible) return null

		for (let i = 0; i < 2; i++) {
			let l = this.lollipops[i]
			if (l.contains(point)) return l
		}

		for (let i = 0, len = this.lines.length; i < len; i++) {
			if (this.lines[i].contains(point)) return this
		}
		return null
	}

	render(ctx) {
		if (!this.isVisible) return
		if (this.opacity === 0) return
		for (let i = 0, len = this.lines.length; i < len; i++) {
			this.lines[i].render(ctx)
		}
		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			for (let i = 0; i < 2; i++) {
				this.lollipops[i].render(ctx)
			}
		}
	}
}
