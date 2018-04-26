export interface EaseFunction {
	(tick: number): number
}

export enum EaseType {
	BackIn = 'backIn',
	BackOut = 'backOut',
	BackInOut = 'backInOut',

	BounceIn = 'bounceIn',
	BounceOut = 'bounceOut',
	BounceInOut = 'bounceInOut',

	CircularIn = 'circularIn',
	CircularOut = 'circularOut',
	CircularInOut = 'circularInOut',

	ElasticIn = 'elasticIn',
	ElasticOut = 'elasticOut',
	ElasticInOut = 'elasticInOut',

	ExponentialIn = 'exponentialIn',
	ExponentialOut = 'exponentialOut',
	ExponentialInOut = 'exponentialInOut',

	Linear = 'linear',

	QuadraticIn = 'quadraticIn',
	QuadraticOut = 'quadraticOut',
	QuadraticInOut = 'quadraticInOut',

	CubicIn = 'cubicIn',
	CubicOut = 'cubicOut',
	CubicInOut = 'cubicInOut',

	QuarticIn = 'quarticIn',
	QuarticOut = 'quarticOut',
	QuarticInOut = 'quarticInOut',

	QuinticIn = 'quinticIn',
	QuinticOut = 'quinticOut',
	QuinticInOut = 'quinticInOut',

	SinusoidalIn = 'sinusoidalIn',
	SinusoidalOut = 'sinusoidalOut',
	SinusoidalInOut = 'sinusoidalInOut',
}