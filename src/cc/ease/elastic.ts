// 创建类似于弹簧在停止前来回振荡的动画
export function elasticIn(k: number): number {
	var s;
	var a = 0.1;
	var p = 0.4;
	if (k === 0) {
		return 0;
	}
	if (k === 1) {
		return 1;
	}
	if (!a || a < 1) {
		a = 1;
		s = p / 4;
	}
	else {
		s = p * Math.asin(1 / a) / (2 * Math.PI);
	}
	return -(a * Math.pow(2, 10 * (k -= 1)) *
		Math.sin((k - s) * (2 * Math.PI) / p));
}

export function elasticOut(k: number): number {
	var s;
	var a = 0.1;
	var p = 0.4;
	if (k === 0) {
		return 0;
	}
	if (k === 1) {
		return 1;
	}
	if (!a || a < 1) {
		a = 1;
		s = p / 4;
	}
	else {
		s = p * Math.asin(1 / a) / (2 * Math.PI);
	}
	return (a * Math.pow(2, -10 * k) *
		Math.sin((k - s) * (2 * Math.PI) / p) + 1);
}

export function elasticInOut(k: number): number {
	var s;
	var a = 0.1;
	var p = 0.4;
	if (k === 0) {
		return 0;
	}
	if (k === 1) {
		return 1;
	}
	if (!a || a < 1) {
		a = 1;
		s = p / 4;
	}
	else {
		s = p * Math.asin(1 / a) / (2 * Math.PI);
	}
	if ((k *= 2) < 1) {
		return -0.5 * (a * Math.pow(2, 10 * (k -= 1))
			* Math.sin((k - s) * (2 * Math.PI) / p));
	}
	return a * Math.pow(2, -10 * (k -= 1))
		* Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;

}