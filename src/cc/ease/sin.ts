// 正弦曲线的缓动（sin(t)）
export function sinusoidalIn(t: number): number {
	return 1 - Math.cos(t * Math.PI / 2);
}

export function sinusoidalOut(t: number): number {
	return Math.sin(t * Math.PI / 2);
}

export function sinusoidalInOut(t: number): number {
	return -0.5 * (Math.cos(Math.PI * t) - 1);
}