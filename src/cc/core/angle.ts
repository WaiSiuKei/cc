export class Angle {
	static quadrant(angle: number): number {
		let ang = angle % 360
		return ang < 180
			? ang > 90 ? 2 : 1
			: ang > 270 ? 4 : 3
	}

	static toRadian(angle: number): number {
		return angle * Math.PI / 180
	}

	static fromRadian(radian: number): number {
		return radian * 180 / Math.PI
	}
}