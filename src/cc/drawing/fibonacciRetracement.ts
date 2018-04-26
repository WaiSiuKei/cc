import {ILine} from "../path/def";
import {Line} from "../path/line";
import {TwoPointDrawing} from "./drawing";
import {ITrendLine, ITwoPointDrawing} from "./def";

export class FibonacciRetracement extends TwoPointDrawing implements ITrendLine {
	static type = 'FibonacciRetracement'
	static ratios = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]

	lines: ILine[]

	constructor(l: ITwoPointDrawing) {
		super(l)
		this.type = FibonacciRetracement.type

		this.lines = []
		for (let i = 0, len = FibonacciRetracement.ratios.length; i < len; i++) {
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

		let dy = _y2 - _y1
		for (let i = 0, len = FibonacciRetracement.ratios.length; i < len; i++) {
			let ratio = FibonacciRetracement.ratios[i]

			let y = _y1 + dy * ratio

			let h = this.lines[i]
			h.x1 = _x1
			h.y1 = y
			h.x2 = _x2
			h.y2 = y
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
