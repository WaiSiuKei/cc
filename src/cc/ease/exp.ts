// 指数曲线的缓动（2^t）
export function exponentialIn(k: number): number {
	return k === 0 ? 0 : Math.pow(1024, k - 1);
}

export function exponentialOut(k: number): number {
	return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
}

export function exponentialInOut(k: number): number {
	if (k === 0) {
		return 0;
	}
	if (k === 1) {
		return 1;
	}
	if ((k *= 2) < 1) {
		return 0.5 * Math.pow(1024, k - 1);
	}
	return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
}
