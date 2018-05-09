import {ThreePointDrawing} from "./drawing";
import {IThreePointDrawing} from "./def";
import {ILine} from "../path/def";
import {Line} from "../path/line";
import {Line as BaseLine} from "../core/line";
import {IDisposable} from "../../base/common/lifecycle";
import {addDisposableListener, EventType} from "../../base/browser/event";
import {IStage} from "../dom/def";

export class ParallelChannel extends ThreePointDrawing {
	static type = 'ParallelChannel'

	line: ILine
	__x3: number
	thirdDispose: IDisposable

	constructor(l: IThreePointDrawing) {
		super(l)

		this.type = ParallelChannel.type
		this.line = new Line(l)
	}

	_handleStartDragControlPoint(e) {
		super._handleStartDragControlPoint(e)
		if (this.draggingPoint === this.thirdLollipop) {
			this.thirdDispose = addDisposableListener(window, EventType.MOUSE_UP, this._handleEndDragControlPoint.bind(this), true)
		}
		return true
	}

	_handleDragControlPoint(e) {
		e.preventDefault()
		e.stopPropagation()
		const {x, y} = e
		if (this.draggingPoint === this.firstLollipop) {
			this.x1 = x
			this.y1 = y
		} else if (this.draggingPoint === this.secondLollipop) {
			this.x2 = x
			this.y2 = y
		} else {
			this.x3 = x
			this.y3 = y
		}

		this._refineThirdLollipop()

		let stage = this.root as IStage
		stage.update()
	}

	_handleEndDragControlPoint(e) {
		super._handleEndDragControlPoint(e)
		if (this.thirdDispose) {
			this.thirdDispose.dispose()
			this.thirdDispose = null
		}
		return true
	}

	get offset() {
		const {_x1, _y1, _x2, _y2, __x3, _y3} = this
		if (_x1 - _x2 === 0) return _y3 - (_y2 - _y1) / 2
		if (_x2 === __x3 && _y2 === _y3) return 0
		if (_y2 === _y1) return _y3 - _y2
		return _y3 - (__x3 - _x1) * (_y2 - _y1) / (_x2 - _x1) - _y1
	}

	_refineThirdLollipop() {
		let max = Math.max(this._x1, this._x2)
		let min = Math.min(this._x1, this._x2)
		if (this.__x3 > max) {
			this.x3 = max
		} else if (this.__x3 < min) {
			this.x3 = min
		}
	}

	set x3(val) {
		let max = Math.max(this._x1, this._x2)
		let min = Math.min(this._x1, this._x2)
		if (val > max) val = max
		if (val < min) val = min
		this._x3 = val
	}

	get _x3() {
		return this.__x3
	}

	set _x3(val) {
		this.__x3 = val
		if (this.lollipops && this.lollipops[2]) this.lollipops[2].cx = val
	}

	hitTest(point) {
		if (!this.isVisible) return null

		for (let i = 0; i < 3; i++) {
			let l = this.lollipops[i]
			if (l.contains(point)) return l
		}
		if (BaseLine.contains(this.x1, this.y1, this.x2, this.y2, this.strokeWidth + this.hitRange, point.x, point.y)) return this
		let {offset} = this
		if (BaseLine.contains(this.x1, this.y1 + offset, this.x2, this.y2 + offset, this.strokeWidth + this.hitRange, point.x, point.y)) return this
		return null
	}

	render(ctx) {
		if (!this.isVisible) return
		if (this.opacity === 0) return
		ctx.save()

		ctx.lineWidth = this.strokeWidth
		ctx.strokeStyle = this.strokeColor.toString()
		let mx = this.matrix
		ctx.transform(mx.a, mx.b, mx.c, mx.d, mx.tx, mx.ty)
		ctx.beginPath()

		ctx.moveTo(this.x1, this.y1)
		ctx.lineTo(this.x2, this.y2)

		ctx.moveTo(this.x1, this.y1 + this.offset)
		ctx.lineTo(this.x2, this.y2 + this.offset)

		ctx.closePath()
		ctx.stroke()

		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			for (let i = 0; i < 3; i++) {
				this.lollipops[i].render(ctx)
			}
		}
	}
}