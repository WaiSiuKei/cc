import {IArc, IBaseArc} from "./def";
import {Element} from "../dom/element";
import {IBaseRectangle, IBaseVector} from "../core/def";
import {Vector} from "../core/vector";
import {EPSILON} from "../../base/common/numerical";
import {Rectangle} from "../core/rectangle";
import {Matrix} from "../core/matrix";
import {Angle} from "../core/angle";

function unmatchQuadrant(paris: Array<number>, q1: number, q2: number) {
	return paris.indexOf(q1) < paris.indexOf(q2)
}

export class Arc extends Element implements IArc {
	cx: number
	cy: number
	radius: number
	startAngle: number
	endAngle: number
	anticlockwise: boolean

	constructor(arc: IBaseArc) {
		super(null)

		this.type = 'Arc'

		this.cx = arc.cx
		this.cy = arc.cy
		this.radius = arc.radius
		this.anticlockwise = arc.anticlockwise
		this.startAngle = (arc.startAngle % 360 + 360) % 360
		this.endAngle = (arc.endAngle % 360 + 360) % 360
	}

	get bounds() {
		let bounds = this.calculateBoundingBox()
		if (Matrix.isIdentity(this.matrix)) return bounds
		else {
			let p0 = Vector.transform(Rectangle.topLeft(bounds), this.matrix)
			let p1 = Vector.transform(Rectangle.bottomRight(bounds), this.matrix)
			return Rectangle.boundingOf(p0, p1) // TODO: ratation case
		}
	}

	get center() {
		return {
			x: this.cx,
			y: this.cy
		}
	}

	get startRadian() {
		return Angle.toRadian(this.startAngle)
	}

	get endRadian() {
		return Angle.toRadian(this.endAngle)
	}

	static calculateCenter(v1: IBaseVector, v2: IBaseVector, radius: number, anticlockwise = true): IBaseVector {
		// https://math.stackexchange.com/questions/27535/how-to-find-center-of-an-arc-given-start-point-end-point-radius-and-arc-direc
		let d = Vector.distanceBetween(v1, v2)

		if (d === 0) return v1

		let unitVector = {
			y: (v2.x - v1.x) / d,
			x: (v1.y - v2.y) / d
		}

		let h = Math.sqrt(radius * radius - (d * d) / 4)

		let theta = anticlockwise ? 1 : -1

		return Vector.add(Vector.midPoint(v1, v2), Vector.multiply(unitVector, theta * h))
	}

	contains(point: IBaseVector): boolean {
		let range = this.hitRange + this.strokeWidth

		let distance = Vector.euclideanMetric(Vector.subtract(this.center, point))

		if ((distance - range > this.radius) || (distance + range < this.radius)) return false

		if (Math.abs(this.startAngle - this.endAngle) < EPSILON) return true // circle

		// let radian = Vector.angle(Vector.subtract({x: this.cx, y: this.cy}, point))
		let angle = Vector.angle(Vector.subtract(point, {x: this.cx, y: this.cy}))

		if (this.anticlockwise) {
			if (this.startAngle < this.endAngle) {
				return (angle <= this.startAngle && angle >= -180) || (angle <= 180 && angle >= this.endAngle)
			}
			return this.startAngle >= angle && angle >= this.endAngle
		} else {
			if (this.startAngle > this.endAngle) {
				return (angle >= this.startAngle && angle <= 180) || (angle <= this.endAngle && angle >= -180)
			}
			return this.endAngle >= angle && angle >= this.startAngle
		}
	}

	calculateBoundingBox(): IBaseRectangle {

		let angleDiff = this.endAngle - this.startAngle

		let diff = Math.abs(angleDiff)

		let stroke = this.hitRange + this.strokeWidth

		if (diff % 360 < EPSILON) {
			let width = this.radius * 2 + stroke
			return {
				x: this.cx - this.radius - stroke,
				y: this.cy - this.radius - stroke,
				width,
				height: width
			}
		}

		let quadrant1 = Angle.quadrant(this.startAngle)
		let quadrant2 = Angle.quadrant(this.endAngle)

		let points = [
			{x: Math.cos(this.startRadian) * this.radius, y: Math.sin(this.startRadian)},
			{x: Math.cos(this.endRadian) * this.radius, y: Math.sin(this.endRadian) * this.radius}
		]

		if (quadrant1 !== quadrant2) {
			if (!this.anticlockwise) {
				// anticlockwise
				if (unmatchQuadrant([4, 3, 2, 1], quadrant1, quadrant2)) points.push({x: this.radius, y: 0})
				if (unmatchQuadrant([3, 2, 1, 4], quadrant1, quadrant2)) points.push({x: 0, y: -this.radius})
				if (unmatchQuadrant([2, 1, 4, 3], quadrant1, quadrant2)) points.push({x: -this.radius, y: 0})
				if (unmatchQuadrant([1, 4, 3, 2], quadrant1, quadrant2)) points.push({x: 0, y: this.radius})
			} else {
				// anticlockwise
				if (unmatchQuadrant([1, 2, 3, 4], quadrant1, quadrant2)) points.push({x: this.radius, y: 0})
				if (unmatchQuadrant([4, 1, 2, 3], quadrant1, quadrant2)) points.push({x: 0, y: -this.radius})
				if (unmatchQuadrant([3, 4, 1, 2], quadrant1, quadrant2)) points.push({x: -this.radius, y: 0})
				if (unmatchQuadrant([2, 3, 4, 1], quadrant1, quadrant2)) points.push({x: 0, y: this.radius})
			}
		}

		let rect = Rectangle.boundingOf(...points)
		return {
			x: rect.x - stroke + this.center.x,
			y: rect.y - stroke + this.center.y,
			width: rect.width + stroke,
			height: rect.height + stroke,
		}
	}

	render(ctx) {
		super.render(ctx)
		ctx.save()
		let mx = this.matrix
		ctx.transform(mx.a, mx.b, mx.c, mx.d, mx.tx, mx.ty)
		ctx.beginPath()
		ctx.arc(this.center.x, this.center.y, this.radius, this.startRadian, this.endRadian, this.anticlockwise)
		ctx.strokeStyle = this.strokeColor.toString()
		// ctx.closePath()
		ctx.stroke()
		ctx.restore()
	}

	renderAsPath(ctx) {
		ctx.arc(this.center.x, this.center.y, this.radius, this.startRadian, this.endRadian, this.anticlockwise)
	}
}
