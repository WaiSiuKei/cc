import {IDynamicTween, IEmptyTween, IFrameEvent, IStaticTween} from './def';
import * as ease from '../ease'
import {IShape} from '../dom/def';
import {EaseType} from '../ease/def';
import {IInterpolationFuncitonGenerator, ITimingFunction} from '../interpolate/def';
import {interpolater} from '../interpolate/index';

export interface IKeyFrame<T> {
	start: T,
	end: T,
	interploate: ITimingFunction<T>
}

export class DynamicTween implements IDynamicTween {
	private _keyFrame: { [key: string]: IKeyFrame<any> } = {}
	private _propsToSet: { [key: string]: any } = {}
	private _duration: number = 100
	private _interploater: IInterpolationFuncitonGenerator<any>

	private _startAt: number = 0
	private _pauseAt: number = 0
	private _pausedCount: number = 0

	private _history: number[]

	constructor(public target: IShape) {
	}

	elapsed(time: number): number {
		let last = this._history[this._history.length - 1]
		let first = this._history[0]
		let lastAccessAt = time === last ? first : last
		return Math.min(time - lastAccessAt, this._duration)
	}

	tween<T>(props: { [key: string]: T }, duration: number, interploater?: IInterpolationFuncitonGenerator<T>): this
	tween(props: { [key: string]: any }, duration: number, ease?: EaseType): this
	tween(props: { [key: string]: any }, duration: number, timingFunction?: any): this {
		this._propsToSet = props
		this._duration = duration
		this._interploater = typeof timingFunction === 'function' ? timingFunction : interpolater.any(ease[timingFunction || EaseType.Linear])
		return this
	}

	getFrame(event: IFrameEvent): boolean {
		this._history.push(event.currentTime)
		let len = this._history.length
		if (len > 2) this._history.splice(0, len - 2)

		let tick = (event.currentTime - this._startAt) / this._duration
		if (tick < 1) {
			Object.keys(this._keyFrame).forEach(key => this.target[key] = this._keyFrame[key].interploate(tick))
			return true
		} else if (tick >= 1) {
			Object.keys(this._keyFrame).forEach(key => this.target[key] = this._keyFrame[key].end)
			return false
		} else {
			return false
		}
	}

	start(timeStamp: number) {
		this._startAt = timeStamp
		this._history = [timeStamp]

		Object.keys(this._propsToSet).forEach((key: string) => {
			let start = this.target[key]
			let end = this._propsToSet[key]
			this._keyFrame[key] = {
				start,
				end,
				interploate: this._interploater(start, end)
			}
		})
	}

	stop(timeStamp: number) {
		this.reset()
	}

	pause(timeStamp: number) {
		this._pauseAt = timeStamp
	}

	resume(timeStamp) {
		this._pausedCount += timeStamp - this._pauseAt
		this._pauseAt = 0
	}

	reset() {
		this._startAt = 0
		this._pausedCount = 0
	}
}

export class StaticTween implements IStaticTween {
	private _propsToSet: {
		[key: string]: any
	} = {}

	constructor(public target: IShape) {
	}

	elapsed(time: number) {
		return 0
	}

	set(props: { [key: string]: any }): this
	set(key: string, value: any): this
	set(arg1?: any, arg2?: any): this {
		if (typeof arg1 === 'object') {
			Object.keys(arg1).forEach(key => {
				this._propsToSet[key] = arg1[key]

			})
		} else {
			this._propsToSet[arg1] = arg2
		}
		return this
	}

	getFrame(timeStamp): boolean {
		return false
	}

	start(timeStamp) {
		Object.keys(this._propsToSet).forEach(key => this.target[key] = this._propsToSet[key])
	}

	stop(timeStamp) {
	}

	pause(timeStamp) {
	}

	resume(timeStamp) {
	}

	reset() {
	}
}

export class EmptyTween implements IEmptyTween {
	private _duration: number
	private _startAt: number = 0
	private _pauseAt: number = 0
	private _pausedCount: number = 0
	public target: IShape
	private _history: number[]

	elapsed(time: number): number {
		let last = this._history[this._history.length - 1]
		let first = this._history[0]
		let lastAccessAt = time === last ? first : last
		return Math.min(time - lastAccessAt, this._duration)
	}

	wait(count: number): this {
		this._duration = count
		return this
	}

	getFrame(event: IFrameEvent): boolean {
		this._history.push(event.currentTime)
		let len = this._history.length
		if (len > 2) this._history.splice(0, len - 2)
		let tick = event.currentTime - this._startAt
		return tick < this._duration
	}

	start(timeStamp: number) {
		this._startAt = timeStamp
		this._history = [timeStamp]
	}

	stop(timeStamp) {
		this.reset()
	}

	pause(timeStamp) {
		this._pauseAt = timeStamp
	}

	resume(timeStamp) {
		this._pausedCount += timeStamp - this._pauseAt
		this._pauseAt = 0
		let count = this._duration - this._pausedCount
		if (count > 0) {
			this._duration = count
		}
	}

	reset() {
		this._startAt = 0
		this._pausedCount = 0
	}
}