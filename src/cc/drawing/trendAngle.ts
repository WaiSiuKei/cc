import {IArc, ILine} from "../path/def";
import {Line} from "../path/line";
import {TwoPointDrawing} from "./drawing";
import {ITrendAngle, ITwoPointDrawing} from "./def";
import {Arc} from "../path/arc";
import {Vector} from "../core/vector";
import {IText, TextAlign, TextBaseLine} from "../typography/def";
import {Text} from '../typography/text'

export class TrendAngle extends TwoPointDrawing implements ITrendAngle {
	line: ILine
	horizontalLine: ILine
	arc: IArc
	label: Text
	static ArcSize = 50

	constructor(l: ITwoPointDrawing) {
		super(l)
		this.type = 'TrendAngle'

		this.line = new Line(l)
		this.horizontalLine = new Line({x1: l.x1, y1: l.y1, x2: l.x1 + TrendAngle.ArcSize, y2: l.y1})

		let angle = Vector.angle(Vector.subtract({x: l.x2, y: l.y2}, {x: l.x1, y: l.y1}))

		this.arc = new Arc({
			cx: l.x1,
			cy: l.y1,
			radius: TrendAngle.ArcSize,
			startAngle: 0,
			endAngle: angle,
			anticlockwise: angle < 0
		})
		this.label = new Text({
			x: this.horizontalLine.x2,
			y: this.horizontalLine.y2,
			value: `${-angle}°`,
			font: 'bold 13px Arial',
			textAlign: TextAlign.Left,
			textBaseline: TextBaseLine.Middle
		})

	}

	_handleMouseLeave(e) {
		if (e.target === this || !this.line.contains({x: e.x, y: e.y})) {
			this.isHovered = false
		}
		return true
	}

	get x1() {
		return this.line.x1
	}

	set x1(val) {
		let delta = val - this.line.x1
		this.x2 += +delta
		this.line.x1 = val
		this.horizontalLine.x1 = val
		this.horizontalLine.x2 = val + TrendAngle.ArcSize
		this.arc.cx = val

		let angle = Vector.angle(Vector.subtract({x: this.x2, y: this.y2}, {x: val, y: this.y1}))
		this.arc.endAngle = angle
		this.arc.anticlockwise = angle < 0
		this.label.value = `${-angle}°`
		this.label.x = val + TrendAngle.ArcSize

		if (this.lollipops && this.lollipops[0]) this.lollipops[0].cx = val
	}

	get y1() {
		return this.line.y1
	}

	set y1(val) {
		let delta = val - this.line.y1
		this.y2 += delta
		this.line.y1 = val
		this.horizontalLine.y1 = val
		this.horizontalLine.y2 = val
		this.arc.cy = val

		let angle = Vector.angle(Vector.subtract({x: this.x2, y: this.y2}, {x: this.x1, y: val}))
		this.arc.endAngle = angle
		this.arc.anticlockwise = angle < 0
		this.label.value = `${-angle}°`
		this.label.y = val
		if (this.lollipops && this.lollipops[0]) this.lollipops[0].cy = val
	}

	get x2() {
		return this.line.x2
	}

	set x2(val) {
		this.line.x2 = val

		let angle = Vector.angle(Vector.subtract({x: val, y: this.y2}, {x: this.x1, y: this.y1}))
		this.arc.endAngle = angle
		this.arc.anticlockwise = angle < 0
		this.label.value = `${-angle}°`
		if (this.lollipops && this.lollipops[1]) this.lollipops[1].cx = val
	}

	get y2() {
		return this.line.y2
	}

	set y2(val) {
		this.line.y2 = val

		let angle = Vector.angle(Vector.subtract({x: this.x2, y: val}, {x: this.x1, y: this.y1}))
		this.arc.endAngle = angle
		this.arc.anticlockwise = angle < 0
		this.label.value = `${-angle}°`
		if (this.lollipops && this.lollipops[1]) this.lollipops[1].cy = val
	}

	hitTest(point) {
		if (!this.isVisible) return null

		for (let i = 0; i < 2; i++) {
			let l = this.lollipops[i]
			if (l.contains(point)) return l
		}
		// TODO: text hit test
		// if (this.label.contains(point)) return this
		if (this.line.contains(point)) return this
		return null
	}

	render(ctx) {
		if (!this.isVisible) return
		if (this.opacity === 0) return
		this.line.render(ctx)
		ctx.setLineDash([1, 2])
		this.horizontalLine.render(ctx)
		ctx.setLineDash([1, 1])
		this.arc.render(ctx)
		ctx.setLineDash([])
		this.label.render(ctx)
		if (!this.isDrawing && (this._isHovered || this._isSelected)) {
			for (let i = 0; i < 2; i++) {
				this.lollipops[i].render(ctx)
			}
		}
	}
}
