import {ThreePointDrawing} from "./drawing";
import {IThreePointDrawing} from "./def";
import {ILine} from "../path/def";
import {Line} from "../path/line";

export class TrendBasedFibonacciExtension extends ThreePointDrawing {
	static type = 'TrendBasedFibonacciExtension'
	static ratios = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]

	trendLine: ILine
	fibLines: ILine[]

	constructor(l: IThreePointDrawing) {
		super(l)

		this.type = TrendBasedFibonacciExtension.type

		this.trendLine = new Line(l)
		this.fibLines = []
		const {x2, y2} = l
		for (let i = 0, len = TrendBasedFibonacciExtension.ratios.length; i < len; i++) {
			this.fibLines.push(new Line({x1: x2, y1: y2, x2, y2}))
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

		this.trendLine.x1 = _x1
		this.trendLine.y1 = _y1
		this.trendLine.x2 = _x2
		this.trendLine.y2 = _y2

		const dy = _y2 - _y1
		for (let i = 0, len = TrendBasedFibonacciExtension.ratios.length; i < len; i++) {
			let ratio = TrendBasedFibonacciExtension.ratios[i]

			let y = _y3 + dy * ratio

			let h = this.fibLines[i]
			h.x1 = _x2
			h.y1 = y
			h.x2 = _x3
			h.y2 = y
		}
	}

	hitTest(point) {
		if (!this.isVisible) return null

		for (let i = 0; i < 3; i++) {
			let l = this.lollipops[i]
			if (l.contains(point)) return l
		}
		if (this.trendLine.contains(point)) return this
		for (let i = 0, len = this.fibLines.length; i < len; i++) {
			if (this.fibLines[i].contains(point)) return this
		}
		return null
	}

	render(ctx) {
		if (!this.isVisible) return
		if (this.opacity === 0) return

		this.trendLine.render(ctx)

		for (let i = 0, len = this.fibLines.length; i < len; i++) {
			this.fibLines[i].render(ctx)
		}

		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			for (let i = 0; i < 3; i++) {
				this.lollipops[i].render(ctx)
			}
		}
	}
}