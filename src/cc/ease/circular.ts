// 圆形曲线的缓动（sqrt(1-t^2)）
export function circularIn(k: number): number {
	return 1 - Math.sqrt(1 - k * k);
}

export function circularOut(k: number): number {
	return Math.sqrt(1 - (--k * k));
}

export function circularInOut(k: number): number {
	if ((k *= 2) < 1) {
		return -0.5 * (Math.sqrt(1 - k * k) - 1);
	}
	return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
}