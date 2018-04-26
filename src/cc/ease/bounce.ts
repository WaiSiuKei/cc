// 创建弹跳效果
export function bounceIn(t: number): number {
	return 1 - bounceOut(1 - t);
}

export function bounceOut(t: number): number {
	if (t < 1 / 2.75) {
		return (7.5625 * t * t);
	} else if (t < 2 / 2.75) {
		return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
	} else if (t < 2.5 / 2.75) {
		return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
	} else {
		return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
	}
}

export function bounceInOut(t: number): number {
	if (t < 0.5) return bounceIn(t * 2) * .5;
	return bounceOut(t * 2 - 1) * 0.5 + 0.5;
}