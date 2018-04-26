import {ILine} from "../path/def";
import {Line} from "../path/line";
import {ThreePointDrawing} from "./drawing";
import {IThreePointDrawing} from "./def";
import {IStage} from "../dom/def";
import {Line as BaseLine} from "../core/line";

export class FibonacciSpeedResistanceFan extends ThreePointDrawing {
	static type = 'FibonacciSpeedResistanceFan'
	static ratios = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]

	horizontalLines: ILine[]
	verticalLines: ILine[]
	leftFanLines: ILine[]
	rightFanlines: ILine[]

	constructor(l: IThreePointDrawing) {
		super(l)
		this.type = FibonacciSpeedResistanceFan.type

		this.horizontalLines = []
		this.verticalLines = []
		this.leftFanLines = []
		this.rightFanlines = []

		for (let i = 0, len = FibonacciSpeedResistanceFan.ratios.length; i < len; i++) {
			this.horizontalLines.push(new Line(l))
			this.verticalLines.push(new Line(l))
			this.leftFanLines.push(new Line(l))
			this.rightFanlines.push(new Line(l))
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
		const {_x1, _y1, _x2, _y2} = this

		let stage = this.root as IStage
		if (!stage) return

		const {width, height} = stage.bounds

		let dx = _x2 - _x1
		let dy = _y2 - _y1
		for (let i = 0, len = FibonacciSpeedResistanceFan.ratios.length; i < len; i++) {
			let ratio = FibonacciSpeedResistanceFan.ratios[i]
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

			let remotePoint1 = BaseLine.remotePointOfRay(_x1, _y1, x, _y2, width, height)
			let remotePoint2 = BaseLine.remotePointOfRay(_x1, _y1, _x2, y, width, height)

			let l = this.leftFanLines[i]
			l.x1 = _x1
			l.y1 = _y1
			l.x2 = remotePoint1.x
			l.y2 = remotePoint1.y

			let r = this.rightFanlines[i]
			r.x1 = _x1
			r.y1 = _y1
			r.x2 = remotePoint2.x
			r.y2 = remotePoint2.y
		}
	}

	hitTest(point) {
		if (!this.isVisible) return null

		for (let i = 0; i < 2; i++) {
			let l = this.lollipops[i]
			if (l.contains(point)) return l
		}

		for (let i = 0, len = FibonacciSpeedResistanceFan.ratios.length; i < len; i++) {
			if (this.horizontalLines[i].contains(point)) return this
			if (this.verticalLines[i].contains(point)) return this
			if (this.leftFanLines[i].contains(point)) return this
			if (this.rightFanlines[i].contains(point)) return this
		}
		return null
	}

	render(ctx) {
		if (!this.isVisible) return
		if (this.opacity === 0) return
		for (let i = 0, len = FibonacciSpeedResistanceFan.ratios.length; i < len; i++) {
			this.horizontalLines[i].render(ctx)
			this.verticalLines[i].render(ctx)
			this.leftFanLines[i].render(ctx)
			this.rightFanlines[i].render(ctx)
		}
		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			for (let i = 0; i < 2; i++) {
				this.lollipops[i].render(ctx)
			}
		}
	}
}