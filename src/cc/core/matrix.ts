import {IBaseMatrix, IBaseVector, IMatrix, IMatrixDecomposition} from "./def";
import {Vector} from "./vector";

export class Matrix implements IMatrix {
	private _a: number;
	private _b: number;
	private _c: number;
	private _d: number;
	private _tx: number;
	private _ty: number;

	constructor(mx: IBaseMatrix = Matrix.initial) {
		const {a, b, c, d, tx, ty} = mx
		this._a = a;
		this._b = b;
		this._c = c;
		this._d = d;
		this._tx = tx;
		this._ty = ty;
	}

	get a() {return this._a}
	get b() {return this._b}
	get c() {return this._c}
	get d() {return this._d}
	get tx() {return this._tx}
	get ty() {return this._ty}

	get translation() {return {x: this._tx, y: this._ty}}
	get scaling() {return this.decompose().scaling}
	get skewing() {return this.decompose().skewing}
	get rotation() {return this.decompose().rotation}

	get values() { return [this._a, this._b, this._c, this._d, this._tx, this._ty]}

	set a(val) {
		this._a = val;
	}
	set b(val) {
		this._b = val;
	}
	set c(val) {
		this._c = val;
	}
	set d(val) {
		this._d = val;
	}
	set tx(val) {
		this._tx = val;
	}
	set ty(val) {
		this._ty = val;
	}

	clone() {return new Matrix(this)}

	equals(mx: IBaseMatrix): boolean {
		return Matrix.equals(this, mx)
	}
	reset() {
		this._a = this._d = 1;
		this._b = this._c = this._tx = this._ty = 0;
		return this;
	}
	translate(point) {
		const {x, y} = point
		this._tx += x * this._a + y * this._c;
		this._ty += x * this._b + y * this._d;
		return this;
	}
	scale(scale, center) {
		if (center) this.translate(center);
		this._a *= scale.x;
		this._b *= scale.x;
		this._c *= scale.y;
		this._d *= scale.y;
		if (center) this.translate(center.negate());
		return this;
	}
	rotate(angle, center = {x: 1, y: 1}) {
		angle *= Math.PI / 180;

		const {x, y} = center
		const cos = Math.cos(angle)
		const sin = Math.sin(angle)
		const tx = x - x * cos + y * sin
		const ty = y - x * sin - y * cos
		const a = this._a
		const b = this._b
		const c = this._c
		const d = this._d
		this._a = cos * a + sin * c;
		this._b = cos * b + sin * d;
		this._c = -sin * a + cos * c;
		this._d = -sin * b + cos * d;
		this._tx += tx * a + ty * c;
		this._ty += tx * b + ty * d;
		return this;
	}
	shear(shear, center) {
		if (center) this.translate(center);
		let a = this._a,
			b = this._b;
		this._a += shear.y * this._c;
		this._b += shear.y * this._d;
		this._c += shear.x * a;
		this._d += shear.x * b;
		if (center) this.translate(center.negate());
		return this;
	}
	skew(skew, center) {
		const toRadians = Math.PI / 180
		const shear = {x: Math.tan(skew.x * toRadians), y: Math.tan(skew.y * toRadians)}
		return this.shear(shear, center);
	}
	append(mx) {
		let a1 = this._a,
			b1 = this._b,
			c1 = this._c,
			d1 = this._d,
			a2 = mx._a,
			b2 = mx._c,
			c2 = mx._b,
			d2 = mx._d,
			tx2 = mx._tx,
			ty2 = mx._ty;
		this._a = a2 * a1 + c2 * c1;
		this._c = b2 * a1 + d2 * c1;
		this._b = a2 * b1 + c2 * d1;
		this._d = b2 * b1 + d2 * d1;
		this._tx += tx2 * a1 + ty2 * c1;
		this._ty += tx2 * b1 + ty2 * d1;
		return this;
	}
	prepend(mx) {
		let a1 = this._a,
			b1 = this._b,
			c1 = this._c,
			d1 = this._d,
			tx1 = this._tx,
			ty1 = this._ty,
			a2 = mx._a,
			b2 = mx._c,
			c2 = mx._b,
			d2 = mx._d,
			tx2 = mx._tx,
			ty2 = mx._ty;
		this._a = a2 * a1 + b2 * b1;
		this._c = a2 * c1 + b2 * d1;
		this._b = c2 * a1 + d2 * b1;
		this._d = c2 * c1 + d2 * d1;
		this._tx = a2 * tx1 + b2 * ty1 + tx2;
		this._ty = c2 * tx1 + d2 * ty1 + ty2;
		return this;
	}
	invert() {
		let a = this._a,
			b = this._b,
			c = this._c,
			d = this._d,
			tx = this._tx,
			ty = this._ty,
			det = a * d - b * c,
			res = null;
		if (det && !isNaN(det) && isFinite(tx) && isFinite(ty)) {
			this._a = d / det;
			this._b = -b / det;
			this._c = -c / det;
			this._d = a / det;
			this._tx = (c * ty - d * tx) / det;
			this._ty = (b * tx - a * ty) / det;
			res = this;
		}
		return res;
	}
	appended(mx) {
		return this.clone().append(mx);
	}
	prepended(mx) {
		return this.clone().prepend(mx);
	}
	inverted() {
		return this.clone().invert();
	}
	isIdentity() {
		return this._a === 1 && this._b === 0 && this._c === 0 && this._d === 1
			&& this._tx === 0 && this._ty === 0;
	}
	isInvertible() {
		let det = this._a * this._d - this._c * this._b;
		return det && !isNaN(det) && isFinite(this._tx) && isFinite(this._ty);
	}
	isSingular() {
		return !this.isInvertible();
	}
	decompose(): IMatrixDecomposition {
		// http://dev.w3.org/csswg/css3-2d-transforms/#matrix-decomposition
		// http://www.maths-informatique-jeux.com/blog/frederic/?post/2013/12/01/Decomposition-of-2D-transform-matrices
		// https://github.com/wisec/DOMinator/blob/master/layout/style/nsStyleAnimation.cpp#L946
		var a = this._a,
			b = this._b,
			c = this._c,
			d = this._d,
			det = a * d - b * c,
			sqrt = Math.sqrt,
			atan2 = Math.atan2,
			degrees = 180 / Math.PI,
			rotate,
			scale,
			skew;
		if (a !== 0 || b !== 0) {
			var r = sqrt(a * a + b * b);
			rotate = Math.acos(a / r) * (b > 0 ? 1 : -1);
			scale = {x: r, y: det / r}
			skew = {x: atan2(a * c + b * d, r * r), y: 0}
		} else if (c !== 0 || d !== 0) {
			var s = sqrt(c * c + d * d);
			// rotate = Math.PI/2 - (d > 0 ? Math.acos(-c/s) : -Math.acos(c/s));
			rotate = Math.asin(c / s) * (d > 0 ? 1 : -1);
			scale = {x: det / s, y: s};
			skew = {x: 0, y: atan2(a * c + b * d, s * s)}
		} else { // a = b = c = d = 0
			rotate = 0;
			skew = scale = {x: 0, y: 0};
		}
		return {
			translation: this.translation,
			rotation: rotate * degrees,
			scaling: scale,
			skewing: {x: skew.x * degrees, y: skew.y * degrees}
		};
	}

	static initial: IBaseMatrix = {a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0}
	static translation(mx) {return {x: mx.tx, y: mx.ty}}
	static equals(mx1: IBaseMatrix, mx2: IBaseMatrix): boolean {
		return mx1 === mx2 || mx1.a === mx2.a && mx1.b === mx2.b
			&& mx1.c === mx2.c && mx1.d === mx2.d
			&& mx1.tx === mx2.tx && mx1.ty === mx2.ty;
	}
	static translate(mx: IBaseMatrix, point: IBaseVector): IBaseMatrix {
		const {x, y} = point
		let tx = mx.tx + x * mx.a + y * mx.c;
		let ty = mx.ty + x * mx.b + y * mx.d;
		return {a: mx.a, b: mx.b, c: mx.c, d: mx.d, tx, ty}
	}
	static scale(mx: IBaseMatrix, scale: IBaseVector, center?: IBaseVector): IBaseMatrix {
		let m = center ? Matrix.translate(mx, center) : {a: mx.a, b: mx.b, c: mx.c, d: mx.d, tx: mx.tx, ty: mx.ty}
		m.a *= scale.x;
		m.b *= scale.x;
		m.c *= scale.y;
		m.d *= scale.y;
		if (center) m = Matrix.translate(m, Vector.negate(center));
		return m
	}
	static rotate(mx: IBaseMatrix, angle: number, center: IBaseVector = {x: 1, y: 1}): IBaseMatrix {
		angle *= Math.PI / 180;

		const {x, y} = center
		const cos = Math.cos(angle)
		const sin = Math.sin(angle)
		const tx = x - x * cos + y * sin
		const ty = y - x * sin - y * cos
		const {a, b, c, d} = mx

		return {
			a: cos * a + sin * c,
			b: cos * b + sin * d,
			c: -sin * a + cos * c,
			d: -sin * b + cos * d,
			tx: mx.tx + tx * a + ty * c,
			ty: mx.ty + tx * b + ty * d
		}
	}
	static shear(mx: IBaseMatrix, shear: IBaseVector, center?: IBaseVector): IBaseMatrix {
		if (center) mx = Matrix.translate(mx, center);
		let {a, b, c, d} = mx
		a += shear.y * c;
		b += shear.y * d;
		c += shear.x * a;
		d += shear.x * b;
		let ret = {a, b, c, d, tx: mx.tx, ty: mx.ty}
		if (center) ret = Matrix.translate(mx, Vector.negate(center))
		return ret;
	}
	static skew(mx: IBaseMatrix, skew: IBaseVector, center?: IBaseVector) {
		const toRadians = Math.PI / 180
		const shear = {x: Math.tan(skew.x * toRadians), y: Math.tan(skew.y * toRadians)}
		return Matrix.shear(mx, shear, center)
	}
	static append(mx1: IBaseMatrix, mx2: IBaseMatrix): IBaseMatrix {
		const {a: a1, b: b1, c: c1, d: d1} = mx1
		const {a: a2, b: b2, c: c2, d: d2, tx: tx2, ty: ty2} = mx2

		return {
			a: a2 * a1 + c2 * c1,
			c: b2 * a1 + d2 * c1,
			b: a2 * b1 + c2 * d1,
			d: b2 * b1 + d2 * d1,
			tx: tx2 * a1 + ty2 * c1,
			ty: tx2 * b1 + ty2 * d1
		}
	}
	static prepend(mx1: IBaseMatrix, mx2: IBaseMatrix): IBaseMatrix {
		const {a: a1, b: b1, c: c1, d: d1, tx: tx1, ty: ty1} = mx1
		const {a: a2, b: b2, c: c2, d: d2, tx: tx2, ty: ty2} = mx2

		return {
			a: a2 * a1 + b2 * b1,
			c: a2 * c1 + b2 * d1,
			b: c2 * a1 + d2 * b1,
			d: c2 * c1 + d2 * d1,
			tx: a2 * tx1 + b2 * ty1 + tx2,
			ty: c2 * tx1 + d2 * ty1 + ty2
		}
	}
	static invert(mx: IBaseMatrix): IBaseMatrix {
		const {a, b, c, d, tx, ty} = mx
		let det = a * d - b * c
		let res = null
		if (det && !isNaN(det) && isFinite(tx) && isFinite(ty)) {
			return {
				a: d / det,
				b: -b / det,
				c: -c / det,
				d: a / det,
				tx: (c * ty - d * tx) / det,
				ty: (b * tx - a * ty) / det
			}
		}
		return res;
	}
	static isIdentity(mx: IBaseMatrix): boolean {
		return mx.a === 1 && mx.b === 0 && mx.c === 0 && mx.d === 1 && mx.tx === 0 && mx.ty === 0;
	}
	static isInvertible(mx: IBaseMatrix): boolean {
		let det = mx.a * mx.d - mx.c * mx.b;
		return det && !isNaN(det) && isFinite(mx.tx) && isFinite(mx.ty);
	}
	static isSingular(mx: IBaseMatrix): boolean {
		return !Matrix.isInvertible(mx)
	}
	static decompose(mx: IBaseMatrix): IMatrixDecomposition {
		// http://dev.w3.org/csswg/css3-2d-transforms/#matrix-decomposition
		// http://www.maths-informatique-jeux.com/blog/frederic/?post/2013/12/01/Decomposition-of-2D-transform-matrices
		// https://github.com/wisec/DOMinator/blob/master/layout/style/nsStyleAnimation.cpp#L946

		const {a, b, c, d} = mx
		let det = a * d - b * c,
			sqrt = Math.sqrt,
			atan2 = Math.atan2,
			degrees = 180 / Math.PI,
			rotate,
			scale,
			skew;
		if (a !== 0 || b !== 0) {
			var r = sqrt(a * a + b * b);
			rotate = Math.acos(a / r) * (b > 0 ? 1 : -1);
			scale = {x: r, y: det / r}
			skew = {x: atan2(a * c + b * d, r * r), y: 0}
		} else if (c !== 0 || d !== 0) {
			var s = sqrt(c * c + d * d);
			// rotate = Math.PI/2 - (d > 0 ? Math.acos(-c/s) : -Math.acos(c/s));
			rotate = Math.asin(c / s) * (d > 0 ? 1 : -1);
			scale = {x: det / s, y: s};
			skew = {x: 0, y: atan2(a * c + b * d, s * s)}
		} else { // a = b = c = d = 0
			rotate = 0;
			skew = scale = {x: 0, y: 0};
		}
		return {
			translation: Matrix.translation(mx),
			rotation: rotate * degrees,
			scaling: scale,
			skewing: {x: skew.x * degrees, y: skew.y * degrees}
		};
	}

	static inverseTransform(mx: IBaseMatrix, point: IBaseVector): IBaseVector {
		if (!Matrix.isInvertible(mx)) return null
		const {a, b, c, d, tx, ty} = mx
		let det = a * d - b * c
		let x = point.x - tx,
			y = point.y - ty;
		return {
			x: (x * d - y * c) / det,
			y: (y * a - x * b) / det,
		}
	}

	static toArray(mx: IBaseMatrix): [number, number, number, number, number, number] {
		return [mx.a, mx.b, mx.c, mx.d, mx.tx, mx.ty]
	}
}
