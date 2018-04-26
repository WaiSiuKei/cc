import {IEllipse, ILine} from "../path/def";
import {Line} from "../path/line";
import {TwoPointDrawing} from "./drawing";
import {ITrendLine, ITwoPointDrawing} from "./def";
import {Vector} from "../core/vector";
import {Ellipse} from "../path/ellipse";

export class FibonacciCircles extends TwoPointDrawing implements ITrendLine {
	static type = 'FibonacciCircles'
	static ratios = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]

	circles: IEllipse[]

	constructor(l: ITwoPointDrawing) {
		super(l)
		this.type = FibonacciCircles.type

		this.circles = []
		const {x1, y1, x2, y2} = l
		let origin = Vector.midPoint({x: x1, y: y1}, {x: x2, y: y2})
		for (let i = 0, len = FibonacciCircles.ratios.length; i < len; i++) {
			this.circles.push(new Ellipse({cx: origin.x, cy: origin.y, r1: 0, r2: 0}))
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

		let dx = Math.abs(_x2 - _x1) / 2
		let dy = Math.abs(_y2 - _y1) / 2
		let {x, y} = Vector.midPoint({x: _x1, y: _y1}, {x: _x2, y: _y2})
		for (let i = 0, len = FibonacciCircles.ratios.length; i < len; i++) {
			let ratio = FibonacciCircles.ratios[i]

			let r1 = dx * ratio
			let r2 = dy * ratio

			let e = this.circles[i]
			e.cx = x
			e.cy = y
			e.r1 = r1
			e.r2 = r2
		}
	}

	hitTest(point) {
		if (!this.isVisible) return null

		for (let i = 0; i < 2; i++) {
			let l = this.lollipops[i]
			if (l.contains(point)) return l
		}

		for (let i = 0, len = this.circles.length; i < len; i++) {
			if (this.circles[i].contains(point)) return this
		}
		return null
	}

	render(ctx) {
		if (!this.isVisible) return
		if (this.opacity === 0) return
		for (let i = 0, len = this.circles.length; i < len; i++) {
			this.circles[i].render(ctx)
		}
		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			for (let i = 0; i < 2; i++) {
				this.lollipops[i].render(ctx)
			}
		}
	}
}
