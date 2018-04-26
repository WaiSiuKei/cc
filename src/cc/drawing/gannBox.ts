import {ILine} from "../path/def";
import {Line} from "../path/line";
import {TwoPointDrawing} from "./drawing";
import {ITrendLine, ITwoPointDrawing} from "./def";

export class GannBox extends TwoPointDrawing implements ITrendLine {
	static type = "GannBox"
	static ratios = [0, 0.25, 0.382, 0.5, 0.618, 0.75, 1]

	horizontalLines: ILine[]
	verticalLines: ILine[]

	constructor(l: ITwoPointDrawing) {
		super(l)
		this.type = GannBox.type

		this.horizontalLines = []
		this.verticalLines = []

		for (let i = 0, len = GannBox.ratios.length; i < len; i++) {
			this.horizontalLines.push(new Line(l))
			this.verticalLines.push(new Line(l))
		}
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

		for (let i = 0, len = GannBox.ratios.length; i < len; i++) {
			let dx = _x2 - _x1
			let dy = _y2 - _y1
			let ratio = GannBox.ratios[i]
			let x = _x1 + dx * ratio
			let y = _y1 + dy * ratio

			let h = this.horizontalLines[i]
			h.x1 = _x1
			h.y1 = y
			h.x2 = _x2
			h.y2 = y

			let v = this.verticalLines[i]
			v.x1 = x
			v.y1 = _y1
			v.x2 = x
			v.y2 = _y2
		}
	}

	hitTest(point) {
		if (!this.isVisible) return null

		for (let i = 0; i < 2; i++) {
			let l = this.lollipops[i]
			if (l.contains(point)) return l
		}

		for (let i = 0, len = GannBox.ratios.length; i < len; i++) {
			if (this.horizontalLines[i].contains(point)) return this
			if (this.verticalLines[i].contains(point)) return this
		}
		return null
	}

	render(ctx) {
		if (!this.isVisible) return
		if (this.opacity === 0) return
		for (let i = 0, len = this.horizontalLines.length; i < len; i++) {
			this.horizontalLines[i].render(ctx)
		}
		for (let i = 0, len = this.verticalLines.length; i < len; i++) {
			this.verticalLines[i].render(ctx)
		}
		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			for (let i = 0; i < 2; i++) {
				this.lollipops[i].render(ctx)
			}
		}
	}
}