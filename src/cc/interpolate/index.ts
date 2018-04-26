import {EaseFunction} from "../ease/def";
import {linear} from "../ease/linear";
import {ITimingFunction} from "./def";
import {Color, RGBA} from "../core/color";

export namespace interpolater {
	export const number = (easing: EaseFunction = linear) => (a: number, b: number): ITimingFunction<number> => {
		return a = +a, b -= a, function (t) {
			return a + b * easing(t);
		}
	}

	export const date = (easing: EaseFunction = linear) => (a: Date, b: Date): ITimingFunction<Date> => {
		let d = new Date;
		let aTime = +a
		let bTime = +b - aTime
		return function (t: number): Date {
			return d.setTime(aTime + bTime * t), d;
		}
	}

	export const color = (easing: EaseFunction = linear) => (start: Color, end: Color): ITimingFunction<Color> => {
		const color = number(easing)

		const interpolateR = color(start.rgba.r, end.rgba.r)
		const interpolateG = color(start.rgba.g, end.rgba.g)
		const interpolateB = color(start.rgba.b, end.rgba.b)
		const interpolateA = color(start.rgba.a, end.rgba.a)
		return function (t) {
			return new Color(new RGBA(interpolateR(t), interpolateG(t), interpolateB(t), interpolateA(t)))
		}
	}

	export const any = (easing: EaseFunction = linear) => (start: any, end: any): ITimingFunction<any> => {
		return (start instanceof Color ? color
			: start instanceof Date ? date
				: typeof start === 'number' ? number : noop)(easing)(start, end)
	}

	export const noop = (easing: EaseFunction = linear) => (start: any, end: any): ITimingFunction<any> => {
		return function (t) {
			return start
		}
	}
}