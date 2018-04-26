import {IBaseLine, IBaseVector, ILine} from "./def";
import {Vector} from "./vector";
import {EPSILON, isZero} from "../../base/common/numerical";

export class Line implements ILine {
	private _px: number;
	private _py: number;
	private _vx: number;
	private _vy: number;

	constructor(p: IBaseVector, v: IBaseVector) {
		this._px = p.x;
		this._py = p.y;
		this._vx = v.x;
		this._vy = v.y;
	}

	get px() {return this._px}
	get py() {return this._py}
	get vx() {return this._vx}
	get vy() {return this._vy}
	get point() {return {x: this._px, y: this._py}}
	get vector() {return {x: this._vx, y: this._vy}}
	get length() {return Vector.euclideanMetric(this.vector)}

	intersect(line, isInfinite = false) {return Line.intersect(this, line, isInfinite);}

	getSide(point, isInfinite = false) {return Line.getSide(this, point, isInfinite);}

	distanceTo(point) {return Line.distanceBetween(this, point)}

	signedDistanceTo(point) {return Line.signedDistanceBetween(this, point);}

	isCollinear(line) {
		return Vector.isCollinear({x: this._vx, y: this._vy}, {x: line._vx, y: line._vy});
	}

	isOrthogonal(line) {
		return Vector.isOrthogonal({x: this._vx, y: this._vy}, {x: line._vx, y: line._vy});
	}

	toTwoPoint(): IBaseVector[] {
		return [this.point, {x: this._vx - this._px, y: this._vy - this._py}]
	}

	static fromTwoPoint(p1: IBaseVector, p2: IBaseVector): IBaseLine {
		return {
			px: p1.x,
			py: p1.y,
			vx: p2.x - p1.x,
			vy: p2.y - p1.y
		}
	}

	static intersect(l1: IBaseLine, l2: IBaseLine, isInfinite): IBaseVector {
		// Convert 2nd points to vectors if they are not specified as such.
		const {px: p1x, py: p1y, vx: v1x, vy: v1y} = l1
		const {px: p2x, py: p2y, vx: v2x, vy: v2y} = l2
		var cross = v1x * v2y - v1y * v2x;
		// Avoid divisions by 0, and errors when getting too close to 0
		if (!isZero(cross)) {
			var dx = p1x - p2x,
				dy = p1y - p2y,
				u1 = (v2x * dy - v2y * dx) / cross,
				u2 = (v1x * dy - v1y * dx) / cross,
				// Check the ranges of the u parameters if the line is not
				// allowed to extend beyond the definition points, but
				// compare with EPSILON tolerance over the [0, 1] bounds.
				epsilon = /*#=*/EPSILON,
				uMin = -epsilon,
				uMax = 1 + epsilon;
			if (isInfinite
				|| uMin < u1 && u1 < uMax && uMin < u2 && u2 < uMax)
			{
				if (!isInfinite) {
					// Address the tolerance at the bounds by clipping to
					// the actual range.
					u1 = u1 <= 0 ? 0 : u1 >= 1 ? 1 : u1;
				}
				return ({
						x: p1x + u1 * v1x,
						y: p1y + u1 * v1y
					}
				);
			}
		}
		return null
	}

	static getSide(line: ILine, v: IBaseVector, isInfinite = false): number {
		const {px, py, vx, vy} = line
		const {x, y} = v
		var v2x = x - px,
			v2y = y - py,
			// ccw = v2.cross(v1);
			ccw = v2x * vy - v2y * vx;
		if (!isInfinite && isZero(ccw)) {
			// If the point is on the infinite line, check if it's on the
			// finite line too: Project v2 onto v1 and determine ccw based
			// on which side of the finite line the point lies. Calculate
			// the 'u' value of the point on the line, and use it for ccw:
			// u = v2.dot(v1) / v1.dot(v1)
			ccw = (v2x * vx + v2x * vx) / (vx * vx + vy * vy);
			// If the 'u' value is within the line range, set ccw to 0,
			// otherwise its already correct sign is all we need.
			if (ccw >= 0 && ccw <= 1)
				ccw = 0;
		}
		return ccw < 0 ? -1 : ccw > 0 ? 1 : 0;
	}

	static signedDistanceBetween(line: IBaseLine, v: IBaseVector): number {
		const {px, py, vx, vy} = line
		const {x, y} = v
		// Based on the error analysis by @iconexperience outlined in #799
		return vx === 0 ? vy > 0 ? x - px : px - x
			: vy === 0 ? vx < 0 ? y - py : py - y
				: ((x - px) * vy - (y - py) * vx) / Math.sqrt(vx * vx + vy * vy);
	}

	static distanceBetween(line: IBaseLine, v: IBaseVector): number {
		return Math.abs(Line.signedDistanceBetween(line, v));
	}

	static contains(x0, y0, x1, y1, lineWidth, x, y): boolean {
		if (lineWidth === 0) {
			return false;
		}
		var _l = lineWidth;
		var _a = 0;
		var _b = x0;
		// Quick reject
		if (
			(y > y0 + _l && y > y1 + _l)
			|| (y < y0 - _l && y < y1 - _l)
			|| (x > x0 + _l && x > x1 + _l)
			|| (x < x0 - _l && x < x1 - _l)
		)
		{
			return false;
		}

		if (x0 !== x1) {
			_a = (y0 - y1) / (x0 - x1);
			_b = (x0 * y1 - x1 * y0) / (x0 - x1);
		}
		else {
			return Math.abs(x - x0) <= _l / 2;
		}
		var tmp = _a * x - y + _b;
		var _s = tmp * tmp / (_a * _a + 1);
		return _s <= _l / 2 * _l / 2;
	}

	static remotePointOfRay(x1, y1, x2, y2, width, height): IBaseVector {
		let dx = x2 - x1
		let dy = y2 - y1

		if (dx === 0) {
			if (dy === 0) return {x: x2, y: y2}
			return {x: x1, y: dy > 0 ? height : 0}
		}

		if (dy === 0) return {x: dx > 0 ? width : 0, y: y1}

		if (dx > 0) {
			if (dy > 0) { // quadrant 4
				let x = (height - y2) * dx / dy + x2
				if (x <= width) {
					return {x, y: height}
				} else {
					return {x: width, y: (width - x2) * dy / dx + y2}
				}
			} else { // quadrant 1
				let x = -y2 * dx / dy + x2
				if (x <= width) {
					return {x, y: 0}
				} else {
					return {x: width, y: (width - x2) * dy / dx + y2}
				}
			}
		} else {
			if (dy > 0) { // quadrant 3
				let x = (height - y2) * dx / dy + x2
				if (x >= 0) {
					return {x, y: height}
				} else {
					return {x: 0, y: -x2 * dy / dx + y2}
				}
			} else { // quadrant 2
				let x = -y2 * dx / dy + x2
				if (x >= 0) {
					return {x, y: 0}
				} else {
					return {x: 0, y: -x2 * dy / dx + y2}
				}
			}
		}
	}

	static verticalOffsetOfParallelLine(x1, y1, x2, y2, x3, y3): number {
		if (x1 - x2 === 0) return y3 - (y2 - y1) / 2
		if (x2 === x3 && y2 === y3) return 0
		if (y2 === y1) return y3 - y2
		return y3 - (x3 - x1) * (y2 - y1) / (x2 - x1) - y1
	}
}
