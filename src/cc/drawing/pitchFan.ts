import {ThreePointDrawing} from "./drawing";
import {IThreePointDrawing} from "./def";
import {Line as BaseLine} from "../core/line";
import {ILine} from "../path/def";
import {IStage} from "../dom/def";
import {Vector} from "../core/vector";
import {Line} from "../path/line";

export class PitchFan extends ThreePointDrawing {
	static type = 'PitchFan'

	line0: ILine

	line1: ILine
	line2: ILine
	line3: ILine
	line4: ILine
	line5: ILine

	constructor(l: IThreePointDrawing) {
		super(l)

		this.type = PitchFan.type

		this.line0 = new Line(l)
		this.line1 = new Line(l)
		this.line2 = new Line(l)
		this.line3 = new Line(l)
		this.line4 = new Line(l)
		this.line5 = new Line(l)
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

		this.line0.x1 = _x2
		this.line0.y1 = _y2
		this.line0.x2 = _x3
		this.line0.y2 = _y3

		let pt3 = Vector.midPoint({x: _x2, y: _y2}, {x: _x3, y: _y3})
		let pt2 = Vector.midPoint({x: _x2, y: _y2}, pt3)
		let pt4 = Vector.midPoint({x: _x3, y: _y3}, pt3)
		let pt1 = {x: _x2, y: _y2}
		let pt5 = {x: _x3, y: _y3}

		let stage = this.root as IStage
		if (!stage) return

		const {width, height} = stage.bounds
		let remotePoint1 = BaseLine.remotePointOfRay(_x1, _y1, pt1.x, pt1.y, width, height)
		let remotePoint2 = BaseLine.remotePointOfRay(_x1, _y1, pt2.x, pt2.y, width, height)
		let remotePoint3 = BaseLine.remotePointOfRay(_x1, _y1, pt3.x, pt3.y, width, height)
		let remotePoint4 = BaseLine.remotePointOfRay(_x1, _y1, pt4.x, pt4.y, width, height)
		let remotePoint5 = BaseLine.remotePointOfRay(_x1, _y1, pt5.x, pt5.y, width, height)

		this.line1.x1 = _x1
		this.line1.y1 = _y1
		this.line1.x2 = remotePoint1.x
		this.line1.y2 = remotePoint1.y

		this.line2.x1 = _x1
		this.line2.y1 = _y1
		this.line2.x2 = remotePoint2.x
		this.line2.y2 = remotePoint2.y

		this.line3.x1 = _x1
		this.line3.y1 = _y1
		this.line3.x2 = remotePoint3.x
		this.line3.y2 = remotePoint3.y

		this.line4.x1 = _x1
		this.line4.y1 = _y1
		this.line4.x2 = remotePoint4.x
		this.line4.y2 = remotePoint4.y

		this.line5.x1 = _x1
		this.line5.y1 = _y1
		this.line5.x2 = remotePoint5.x
		this.line5.y2 = remotePoint5.y
	}

	hitTest(point) {
		if (!this.isVisible) return null

		for (let i = 0; i < 3; i++) {
			let l = this.lollipops[i]
			if (l.contains(point)) return l
		}
		if (this.line0.contains(point)) return this
		if (this.line1.contains(point)) return this
		if (this.line2.contains(point)) return this
		if (this.line3.contains(point)) return this
		if (this.line4.contains(point)) return this
		if (this.line5.contains(point)) return this
		return null
	}

	render(ctx) {
		if (!this.isVisible) return
		if (this.opacity === 0) return

		this.line1.render(ctx)
		this.line2.render(ctx)

		this.line4.render(ctx)
		this.line5.render(ctx)

		this.line0.render(ctx)
		this.line3.render(ctx)

		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			for (let i = 0; i < 3; i++) {
				this.lollipops[i].render(ctx)
			}
		}
	}
}