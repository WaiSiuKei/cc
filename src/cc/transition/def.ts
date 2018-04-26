import {IShape} from "../dom/def";
import {EaseType} from "../ease/def";
import {IInterpolationFuncitonGenerator} from "../interpolate/def";

export interface IFrameEvent {
	previousTime: number;
	currentTime: number;
	remaining: number
	elapsed: number
}

export interface ITransition {
	add(tween: ITween): this
	add(tween: ITween[]): this
	// loop(count: number): ITransition;
	// remove(tween: ITween | ITween[]): ITransition;
	start(timeStamp: number): void;
	// stop(timeStamp: number): void;
	// pause(timeStamp: number): void;
	// resume(timeStamp: number): void;
	getFrame(evt: IFrameEvent): boolean
}

export interface ITween {
	start(timeStamp: number): void;
	// stop(timeStamp: number): void;
	// pause(timeStamp: number): void;
	// resume(timeStamp: number): void;
	getFrame(evt: IFrameEvent): boolean
	elapsed(now: number): number
}

export interface IDynamicTweenInit<T> {
	props: {
		[key: string]: T
	},
	duration: number,
	ease: IInterpolationFuncitonGenerator<T>
}

export interface IDynamicTween extends ITween {
	tween<T>(props: { [key: string]: T }, duration: number, interploater: IInterpolationFuncitonGenerator<T>): this
	tween(props: { [key: string]: any }, duration: number, ease: EaseType): this
}

export interface IStaticTween extends ITween {
	set(key: string, value: any): this
	set(props: { [key: string]: any }): this
}

export interface IEmptyTween extends ITween {
	wait(count: number): this
}

export interface IAnimator {
	add(trans: ITransition | ITransition[]): void
	start(): void;
}

export interface ITweens {
	tweens: ITween[]
	nextTweens: ITweens
	start(timeStamp: number): void
	stop(timeStamp: number): void
	pause(timeStamp: number): void
	resume(timeStamp: number): void
	getFrame(evt: IFrameEvent): boolean
	elapsed(now: number): number
}

export interface Itransition {
	(d: IShape): ITransition;
	delay(count: number): this
	tween<T>(props: { [key: string]: T }, duration: number, interploater?: IInterpolationFuncitonGenerator<T>): this
	tween(props: { [key: string]: any }, duration: number, ease?: EaseType): this
	set(key: string, value: any): this
	set(props: { [key: string]: any }): this
}