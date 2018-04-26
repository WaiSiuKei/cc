import {ILine} from "../path/def";
import {Line} from "../path/line";
import {TwoPointDrawing} from "./drawing";
import {ITwoPointDrawing} from "./def";
import {IStage} from "../dom/def";

export class FibonacciTimeZone extends TwoPointDrawing {
	static type = 'FibonacciTimeZone'
	static ratios = [0, 1, 2, 3, 5, 8, 13, 21]

	lines: ILine[]

	constructor(l: ITwoPointDrawing) {
		super(l)
		this.type = FibonacciTimeZone.type

		this.lines = []
		for (let i = 0, len = FibonacciTimeZone.ratios.length; i < len; i++) {
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

		let dx = _x2 - _x1
		const {height} = stage.bounds
		for (let i = 0, len = FibonacciTimeZone.ratios.length; i < len; i++) {
			let ratio = FibonacciTimeZone.ratios[i]

			let x = _x1 + ratio * dx
			let h = this.lines[i]
			h.x1 = x
			h.y1 = 0
			h.x2 = x
			h.y2 = height
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
