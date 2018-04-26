import {clamp, EPSILON, isZero, MACHINE_EPSILON} from "./numerical";
import {Vector} from "../../cc/core/vector";

var abs = Math.abs
var mathSqrt = Math.sqrt;

// 临时变量
var _v0 = {x: 0, y: 0}
var _v1 = {x: 0, y: 0}
var _v2 = {x: 0, y: 0}

/**
 * 计算三次贝塞尔值
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} p3
 * @param  {number} t
 * @return {number}
 */
export function cubicAt(p0, p1, p2, p3, t) {
    var onet = 1 - t;
    return onet * onet * (onet * p0 + 3 * t * p1) + t * t * (t * p3 + 3 * onet * p2);
}

/**
 * 计算三次贝塞尔方程极限值的位置
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} p3
 * @param  {Array.<number>} extrema
 * @return {number} 有效数目
 */
export function cubicExtrema(p0, p1, p2, p3) {
    var b = 6 * p2 - 12 * p1 + 6 * p0;
    var a = 9 * p1 + 3 * p3 - 3 * p0 - 9 * p2;
    var c = 3 * p1 - 3 * p0;

    let extrema = []
    if (isZero(a)) {
        if (!isZero(b)) {
            var t1 = -c / b;
            if (t1 >= 0 && t1 <= 1) extrema.push(t1)
        }
    }
    else {
        var disc = b * b - 4 * a * c;
        if (isZero(disc)) extrema.push(-b / (2 * a))
        else if (disc > 0) {
            var discSqrt = mathSqrt(disc);
            var t1 = (-b + discSqrt) / (2 * a);
            var t2 = (-b - discSqrt) / (2 * a);
            if (t1 >= 0 && t1 <= 1) extrema.push(t1)
            if (t2 >= 0 && t2 <= 1) extrema.push(t2)
        }
    }
    return extrema
}

/**
 * 投射点到三次贝塞尔曲线上，返回投射距离。
 * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x3
 * @param {number} y3
 * @param {number} x
 * @param {number} y
 * @param {Array.<number>} [out] 投射点
 * @return {number}
 */
export function cubicProjectPoint(x0, y0, x1, y1, x2, y2, x3, y3, x, y) {
    // http://pomax.github.io/bezierinfo/#projections
    var t;
    var interval = 0.005;
    var d = Infinity;
    var prev;
    var next;
    var d1;
    var d2;

    _v0 = {x, y}

    // 先粗略估计一下可能的最小距离的 t 值
    // PENDING
    for (var _t = 0; _t < 1; _t += 0.05) {
        _v1 = {
            x: cubicAt(x0, x1, x2, x3, _t),
            y: cubicAt(y0, y1, y2, y3, _t)
        }
        d1 = Vector.distanceBetween(_v0, _v1, true);
        if (d1 < d) {
            t = _t;
            d = d1;
        }
    }
    d = Infinity;

    // At most 32 iteration
    for (var i = 0; i < 32; i++) {
        if (interval < EPSILON) {
            break;
        }
        prev = t - interval;
        next = t + interval;
        // t - interval
        _v1 = {
            x: cubicAt(x0, x1, x2, x3, prev),
            y: cubicAt(y0, y1, y2, y3, prev)
        }

        d1 = Vector.distanceBetween(_v1, _v0, true);

        if (prev >= 0 && d1 < d) {
            t = prev;
            d = d1;
        }
        else {
            // t + interval
            _v2 = {
                x: cubicAt(x0, x1, x2, x3, next),
                y: cubicAt(y0, y1, y2, y3, next)
            }
            d2 = Vector.distanceBetween(_v2, _v0, true);

            if (next <= 1 && d2 < d) {
                t = next;
                d = d2;
            }
            else {
                interval *= 0.5;
            }
        }
    }

    return mathSqrt(d);
}

/**
 * 计算二次方贝塞尔值
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} t
 * @return {number}
 */
export function quadraticAt(p0, p1, p2, t) {
    var onet = 1 - t;
    return onet * (onet * p0 + 2 * t * p1) + t * t * p2;
}

/**
 * 计算二次方贝塞尔导数值
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} t
 * @return {number}
 */
function quadraticDerivativeAt(p0, p1, p2, t) {
    return 2 * ((1 - t) * (p1 - p0) + t * (p2 - p1));
}

/**
 * 计算二次方贝塞尔方程根
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} t
 * @param  {Array.<number>} roots
 * @return {number} 有效根数目
 */
function quadraticRootAt(p0, p1, p2, val, roots) {
    var a = p0 - 2 * p1 + p2;
    var b = 2 * (p1 - p0);
    var c = p0 - val;

    var n = 0;
    if (isZero(a)) {
        if (!isZero(b)) {
            var t1 = -c / b;
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
        }
    }
    else {
        var disc = b * b - 4 * a * c;
        if (isZero(disc)) {
            var t1 = -b / (2 * a);
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
        }
        else if (disc > 0) {
            var discSqrt = mathSqrt(disc);
            var t1 = (-b + discSqrt) / (2 * a);
            var t2 = (-b - discSqrt) / (2 * a);
            if (t1 >= 0 && t1 <= 1) {
                roots[n++] = t1;
            }
            if (t2 >= 0 && t2 <= 1) {
                roots[n++] = t2;
            }
        }
    }
    return n;
}

/**
 * 计算二次贝塞尔方程极限值
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @return {number}
 */
export function quadraticExtremum(p0, p1, p2) {
    var divider = p0 + p2 - 2 * p1;
    if (divider === 0) {
        // p1 is center of p0 and p2
        return 0.5;
    }
    else {
        return (p0 - p1) / divider;
    }
}

/**
 * 细分二次贝塞尔曲线
 * @memberOf module:zrender/core/curve
 * @param  {number} p0
 * @param  {number} p1
 * @param  {number} p2
 * @param  {number} t
 * @param  {Array.<number>} out
 */
function quadraticSubdivide(p0, p1, p2, t, out) {
    var p01 = (p1 - p0) * t + p0;
    var p12 = (p2 - p1) * t + p1;
    var p012 = (p12 - p01) * t + p01;

    // Seg0
    out[0] = p0;
    out[1] = p01;
    out[2] = p012;

    // Seg1
    out[3] = p012;
    out[4] = p12;
    out[5] = p2;
}

/**
 * 投射点到二次贝塞尔曲线上，返回投射距离。
 * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} x
 * @param {number} y
 * @param {Array.<number>} out 投射点
 * @return {number}
 */
export function quadraticProjectPoint(x0, y0, x1, y1, x2, y2, x, y) {
    // http://pomax.github.io/bezierinfo/#projections
    var t;
    var interval = 0.005;
    var d = Infinity;

    _v0[0] = x;
    _v0[1] = y;

    // 先粗略估计一下可能的最小距离的 t 值
    // PENDING
    for (var _t = 0; _t < 1; _t += 0.05) {
        _v1[0] = quadraticAt(x0, x1, x2, _t);
        _v1[1] = quadraticAt(y0, y1, y2, _t);
        var d1 = Vector.distanceBetween(_v0, _v1, true);
        if (d1 < d) {
            t = _t;
            d = d1;
        }
    }
    d = Infinity;

    // At most 32 iteration
    for (var i = 0; i < 32; i++) {
        if (interval < EPSILON) {
            break;
        }
        var prev = t - interval;
        var next = t + interval;
        // t - interval
        _v1[0] = quadraticAt(x0, x1, x2, prev);
        _v1[1] = quadraticAt(y0, y1, y2, prev);

        var d1 = Vector.distanceBetween(_v1, _v0, true);

        if (prev >= 0 && d1 < d) {
            t = prev;
            d = d1;
        }
        else {
            // t + interval
            _v2[0] = quadraticAt(x0, x1, x2, next);
            _v2[1] = quadraticAt(y0, y1, y2, next);
            var d2 = Vector.distanceBetween(_v2, _v0, true);
            if (next <= 1 && d2 < d) {
                t = next;
                d = d2;
            }
            else {
                interval *= 0.5;
            }
        }
    }

    return mathSqrt(d);
}


function getDiscriminant(a, b, c) {
	// d = b^2 - a * c  computed accurately enough by a tricky scheme.
	// Ported from @hkrish's polysolve.c
	function split(v) {
		var x = v * 134217729,
			y = v - x,
			hi = y + x, // Don't optimize y away!
			lo = v - hi;
		return [hi, lo];
	}

	var D = b * b - a * c,
		E = b * b + a * c;
	if (abs(D) * 3 < E) {
		var ad = split(a),
			bd = split(b),
			cd = split(c),
			p = b * b,
			dp = (bd[0] * bd[0] - p + 2 * bd[0] * bd[1]) + bd[1] * bd[1],
			q = a * c,
			dq = (ad[0] * cd[0] - q + ad[0] * cd[1] + ad[1] * cd[0])
				+ ad[1] * cd[1];
		D = (p - q) + (dp - dq); // Don’t omit parentheses!
	}
	return D;
}


const log2 = Math.log2 || function(x) {
	return Math.log(x) * Math.LOG2E;
}
function getNormalizationFactor(...args) {
	// Normalize coefficients à la Jenkins & Traub's RPOLY.
	// Normalization is done by scaling coefficients with a power of 2, so
	// that all the bits in the mantissa remain unchanged.
	// Use the infinity norm (max(sum(abs(a)…)) to determine the appropriate
	// scale factor. See @hkrish in #1087#issuecomment-231526156
	var norm = Math.max.apply(Math, arguments);
	return norm && (norm < 1e-8 || norm > 1e8)
		? Math.pow(2, -Math.round(Math.log2(norm)))
		: 0;
}

export function solveQuadratic(a, b, c, roots, min, max): number {
	var x1, x2 = Infinity;
	if (abs(a) < EPSILON) {
		// This could just be a linear equation
		if (abs(b) < EPSILON)
			return abs(c) < EPSILON ? -1 : 0;
		x1 = -c / b;
	} else {
		// a, b, c are expected to be the coefficients of the equation:
		// Ax² - 2Bx + C == 0, so we take b = -b/2:
		b *= -0.5;
		var D = getDiscriminant(a, b, c);
		// If the discriminant is very small, we can try to normalize
		// the coefficients, so that we may get better accuracy.
		if (D && abs(D) < MACHINE_EPSILON) {
			var f = getNormalizationFactor(abs(a), abs(b), abs(c));
			if (f) {
				a *= f;
				b *= f;
				c *= f;
				D = getDiscriminant(a, b, c);
			}
		}
		if (D >= -MACHINE_EPSILON) { // No real roots if D < 0
			var Q = D < 0 ? 0 : Math.sqrt(D),
				R = b + (b < 0 ? -Q : Q);
			// Try to minimize floating point noise.
			if (R === 0) {
				x1 = c / a;
				x2 = -x1;
			} else {
				x1 = R / a;
				x2 = c / R;
			}
		}
	}
	var count = 0,
		boundless = min == null,
		minB = min - EPSILON,
		maxB = max + EPSILON;
	// We need to include EPSILON in the comparisons with min / max,
	// as some solutions are ever so lightly out of bounds.
	if (isFinite(x1) && (boundless || x1 > minB && x1 < maxB))
		roots[count++] = boundless ? x1 : clamp(x1, min, max);
	if (x2 !== x1
		&& isFinite(x2) && (boundless || x2 > minB && x2 < maxB))
		roots[count++] = boundless ? x2 : clamp(x2, min, max);
	return count;
}