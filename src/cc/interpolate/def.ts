export interface ITimingFunction<T> {
	(tick: number): T
}

export interface IInterpolationFuncitonGenerator<T> {
	(a: T, b: T): ITimingFunction<T>
}
