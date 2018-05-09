import {ILollipop, ITwoPointDrawing} from "./def";
import {IBaseVector} from "../core/def";
import {Lollipop} from "./lollipop";
import {ILine} from "../path/def";
import {addDisposableListener, EventType} from "../../base/browser/event";
import {IStage} from "../dom/def";
import {Line} from "../path/line";
import {TwoPointDrawing} from "./drawing";
import {Matrix} from "../core/matrix";

export class Brush extends TwoPointDrawing {
	static type = 'Brush'
	lines: ILine[]

	// for drag
	startX: number
	startY: number

	constructor(l: ITwoPointDrawing) {
		super(l)
		this.type = Brush.type

		this.lines = []
		// this.lines.push(new Line(l))
	}

	_handleStartDragControlPoint(e) {
		this.startX = e.x
		this.startY = e.y
		e.target.opacity = 0
		this.globalMouseDisposable = addDisposableListener(window, EventType.MOUSE_MOVE, this._handleDragControlPoint, true)
		return true
	}

	_handleDragControlPoint(e) {
		e.preventDefault()
		e.stopPropagation()
		const {x, y} = e
		let dx = x - this.startX
		let dy = y - this.startY
		this.startX = x
		this.startY = y
		this.translate({x: dx, y: dy})
		// this.lollipops.forEach(l => {
		// 	l.cx = l.cx + dx
		// 	l.cy = l.cy + dy
		// })
		// this.lines.forEach(l => {
		// 	l.x1 = l.x1 + dx
		// 	l.y1 = l.y1 + dy
		// 	l.x2 = l.x2 + dx
		// 	l.y2 = l.y2 + dy
		// })

		let stage = this.root as IStage
		stage.update()
	}

	push(pt: IBaseVector) {
		const {x, y} = pt
		this.lines.push(new Line({x1: this._x2, y1: this._y2, x2: x, y2: y}))
		this.x2 = x
		this.y2 = y
	}

	hitTest(pt) {
		if (!this.isVisible) return null
		let point = Matrix.inverseTransform(this.matrix, pt)
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
		ctx.save()
		let mx = this.matrix
		ctx.transform(mx.a, mx.b, mx.c, mx.d, mx.tx, mx.ty)
		for (let i = 0, len = this.lines.length; i < len; i++) {
			this.lines[i].render(ctx)
		}

		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			for (let i = 0; i < 2; i++) {
				this.lollipops[i].render(ctx)
			}
		}
		ctx.restore()
	}
}
