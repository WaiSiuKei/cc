import {ILine} from "../path/def";
import {Line} from "../path/line";
import {TwoPointDrawing} from "./drawing";
import {ITrendLine, ITwoPointDrawing} from "./def";

export class TrendLine extends TwoPointDrawing implements ITrendLine {
	line: ILine

	constructor(l: ITwoPointDrawing) {
		super(l)
		this.type = 'TrendLine'

		this.line = new Line(l)
	}

	_handleMouseLeave(e) {
		if (e.target === this || !this.line.hitTest({x: e.x, y: e.y})) {
			this.isHovered = false
		}
		return true
	}

	get x1() {
		return this.line.x1
	}

	set x1(val) {
		this.line.x1 = val
		if (this.lollipops && this.lollipops[0]) this.lollipops[0].cx = val
	}

	get y1() {
		return this.line.y1
	}

	set y1(val) {
		this.line.y1 = val
		if (this.lollipops && this.lollipops[0]) this.lollipops[0].cy = val
	}

	get x2() {
		return this.line.x2
	}

	set x2(val) {
		this.line.x2 = val
		if (this.lollipops && this.lollipops[1]) this.lollipops[1].cx = val
	}

	get y2() {
		return this.line.y2
	}

	set y2(val) {
		this.line.y2 = val
		if (this.lollipops && this.lollipops[1]) this.lollipops[1].cy = val
	}

	hitTest(point) {
		if (!this.isVisible) return null

		for (let i = 0; i < 2; i++) {
			let l = this.lollipops[i]
			if (l.contains(point)) return l
		}
		if (this.line.contains(point)) return this
		return null
	}

	render(ctx) {
		if (!this.isVisible) return
		if (this.opacity === 0) return
		this.line.render(ctx)
		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			for (let i = 0; i < 2; i++) {
				this.lollipops[i].render(ctx)
			}
		}
	}
}
