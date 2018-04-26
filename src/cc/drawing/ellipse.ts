import {ThreePointDrawing} from "./drawing";
import {IThreePointDrawing} from "./def";
import {IEllipse, ILine} from "../path/def";
import {Vector} from "../core/vector";
import {Line} from "../core/line";
import {Ellipse as BaseEllipse} from "../path/ellipse"
import {Matrix} from "../core/matrix";

export class Ellipse extends ThreePointDrawing {
	static type = 'Ellipse'

	ellipse: IEllipse

	constructor(l: IThreePointDrawing) {
		super(l)

		this.type = Ellipse.type

		let midPoint = Vector.midPoint({x: l.x1, y: l.y1}, {x: l.x2, y: l.y2})
		let r2 = Line.distanceBetween(Line.fromTwoPoint({x: l.x1, y: l.y1}, {x: l.x2, y: l.y2}), {x: l.x3, y: l.y3})
		let angle = Vector.angle({x: l.x2 - l.x1, y: l.y2 - l.y1})
		let r1 = Vector.distanceBetween(midPoint, {x: l.x1, y: l.y1})
		this.ellipse = new BaseEllipse({cx: midPoint.x, cy: midPoint.y, r1, r2})
		// this.ellipse.matrix = Matrix.rotate(this.ellipse.matrix, angle)
	}

	set x1(val) {
		this._x1 = val
		if (this.lollipops && this.lollipops[0]) this.lollipops[0].cx = val
		this._recalculateLine()
	}

	set y1(val) {
		this._y1 = val
		if (this.lollipops && this.lollipops[0]) this.lollipops[0].cy = val
		this._recalculateLine()
	}

	set x2(val) {
		this._x2 = val
		if (this.lollipops && this.lollipops[1]) this.lollipops[1].cx = val
		this._recalculateLine()
	}

	set y2(val) {
		this._y2 = val
		if (this.lollipops && this.lollipops[1]) this.lollipops[1].cy = val
		this._recalculateLine()
	}

	set x3(val) {
		this._x3 = val
		if (this.lollipops && this.lollipops[2]) this.lollipops[2].cx = val
		this._recalculateLine()
	}

	set y3(val) {
		this._y3 = val
		if (this.lollipops && this.lollipops[2]) this.lollipops[2].cy = val
		this._recalculateLine()
	}

	_recalculateLine() {
		const {_x1, _y1, _x2, _y2, _x3, _y3} = this
		let midPoint = Vector.midPoint({x: _x1, y: _y1}, {x: _x2, y: _y2})
		let r2 = Line.distanceBetween(Line.fromTwoPoint({x: _x1, y: _y1}, {x: _x2, y: _y2}), {x: _x3, y: _y3})
		let angle = Vector.radian({x: _x2 - _x1, y: _y2 - _y1})
		let r1 = Vector.distanceBetween(midPoint, {x: _x1, y: _y1})
		this.ellipse.cx = midPoint.x
		this.ellipse.cy = midPoint.y
		this.ellipse.r1 = r1
		this.ellipse.r2 = r2
		this.ellipse.matrix = Matrix.rotate(Matrix.initial, angle)
		// let mx = Matrix.rotate(this.ellipse.matrix, angle)
		// console.log(mx)
	}

	hitTest(point) {
		if (!this.isVisible) return null

		for (let i = 0; i < 3; i++) {
			let l = this.lollipops[i]
			if (l.contains(point)) return l
		}
		if (this.ellipse.contains(point)) return this
		return null
	}

	render(ctx) {
		if (!this.isVisible) return
		if (this.opacity === 0) return

		this.ellipse.render(ctx)

		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			for (let i = 0; i < 3; i++) {
				this.lollipops[i].render(ctx)
			}
		}
	}
}