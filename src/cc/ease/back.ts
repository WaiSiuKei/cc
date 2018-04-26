// 在某一动画开始沿指示的路径进行动画处理前稍稍收回该动画的移动
export function backIn(k: number): number {
	var s = 1.70158;
	return k * k * ((s + 1) * k - s);
}

export function backOut(k: number): number {
	var s = 1.70158;
	return --k * k * ((s + 1) * k + s) + 1;
}

export function backInOut(k: number): number {
	var s = 1.70158 * 1.525;
	if ((k *= 2) < 1) {
		return 0.5 * (k * k * ((s + 1) * k - s));
	}
	return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
}
