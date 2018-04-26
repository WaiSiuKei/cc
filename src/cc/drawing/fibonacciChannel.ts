import {ILine} from "../path/def";
import {Line} from "../path/line";
import {ThreePointDrawing} from "./drawing";
import {IThreePointDrawing} from "./def";

export class FibonacciChannel extends ThreePointDrawing {
	static type = 'FibonacciChannel'
	static ratios = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]

	lines: ILine[]

	constructor(l: IThreePointDrawing) {
		super(l)
		this.type = FibonacciChannel.type

		this.lines = []

		for (let i = 0, len = FibonacciChannel.ratios.length; i < len; i++) {
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

	set x3(val) {
		this._x3 = val
		if (this.lollipops && this.lollipops[2]) this.lollipops[2].cx = val
		this._recalculateLines()
	}

	set y3(val) {
		this._y3 = val
		if (this.lollipops && this.lollipops[2]) this.lollipops[2].cy = val
		this._recalculateLines()
	}

	_recalculateLines() {
		const {_x1, _y1, _x2, _y2, _x3, _y3} = this

		let v = {x: _x3 - _x1, y: _y3 - _y1}
		for (let i = 0, len = FibonacciChannel.ratios.length; i < len; i++) {
			let ratio = FibonacciChannel.ratios[i]
			let x = v.x * ratio
			let y = v.y * ratio

			let l = this.lines[i]
			l.x1 = _x1 + x
			l.y1 = _y1 + y
			l.x2 = _x2 + x
			l.y2 = _y2 + y
		}
	}

	hitTest(point) {
		if (!this.isVisible) return null

		for (let i = 0; i < 3; i++) {
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
			for (let i = 0; i < 3; i++) {
				this.lollipops[i].render(ctx)
			}
		}
	}
}