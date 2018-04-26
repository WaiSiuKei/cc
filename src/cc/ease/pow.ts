function powIn(pow: number): (number) => number {
	return function (t: number): number {
		return Math.pow(t, pow);
	};
}

function powOut(pow: number): (number) => number {
	return function (t: number): number {
		return 1 - Math.pow(1 - t, pow);
	};
}

function powInOut(pow: number): (number) => number {
	return function (t: number): number {
		if ((t *= 2) < 1) return 0.5 * Math.pow(t, pow);
		return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
	};
}

export const quadraticIn: (number) => number = powIn(2);

export const quadraticOut: (number) => number = powOut(2);

export const quadraticInOut: (number) => number = powInOut(2);

// 三次方的缓动（t^3)
export const cubicIn: (number) => number = powIn(3);

export const cubicOut: (number) => number = powOut(3);

export const cubicInOut: (number) => number = powInOut(3);

// 四次方的缓动（t^4）
export const quarticIn: (number) => number = powIn(4);

export const quarticOut: (number) => number = powOut(4);

export const quarticInOut: (number) => number = powInOut(4);

// 五次方的缓动（t^5）
export const quinticIn: (number) => number = powIn(5);

export const quinticOut: (number) => number = powOut(5);

export const quinticInOut: (number) => number = powInOut(5);
