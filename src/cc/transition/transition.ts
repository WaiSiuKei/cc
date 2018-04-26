import {IFrameEvent, ITransition, Itransition, ITween, ITweens} from "./def";
import {IShape} from "../dom/def";
import {DynamicTween, EmptyTween, StaticTween} from "./tween";

export class Tweens implements ITweens {
	public tweens: ITween[] = []
	public nextTweens: ITweens = null
	public startAt: number

	constructor(tween: ITween | ITween[]) {
		this.tweens = Array.isArray(tween) ? tween : [tween]
	}

	elapsed(now: number): number {
		return Math.max.apply(null, this.tweens.map(t => t.elapsed(now)))
	}

	start(timeStamp: number): void {
		this.startAt = timeStamp
		for (let i = 0, len = this.tweens.length; i < len; i++) {
			this.tweens[i].start(timeStamp)
		}
	}

	stop(timeStamp: number): void {
		for (let i = 0, len = this.tweens.length; i < len; i++) {
			this.tweens[i].start(timeStamp)
		}
	}

	pause(timeStamp: number): void {
		for (let i = 0, len = this.tweens.length; i < len; i++) {
			this.tweens[i].start(timeStamp)
		}
	}

	resume(timeStamp: number): void {
		for (let i = 0, len = this.tweens.length; i < len; i++) {
			this.tweens[i].start(timeStamp)
		}
	}

	getFrame(evt: IFrameEvent): boolean {
		let hasNext = false
		for (let i = 0, len = this.tweens.length; i < len; i++) {
			hasNext = this.tweens[i].getFrame(evt) || hasNext
		}
		return hasNext
	}
}

export class Transition implements ITransition {
	private tweens: ITweens

	add(tween: ITween | ITween[]): this {
		let tweens = new Tweens(tween)
		if (!this.tweens) this.tweens = tweens
		else {
			let tw = this.tweens
			while (tw.nextTweens) {
				tw = tw.nextTweens
			}
			tw.nextTweens = tweens
		}
		return this
	}

	start(timeStamp: number): void {
		if (this.tweens) {
			this.tweens.start(timeStamp)
		}
	}

	stop(timeStamp: number): void {
		if (this.tweens) this.tweens.stop(timeStamp)
	}

	pause(timeStamp: number): void {
		if (this.tweens) this.tweens.pause(timeStamp)
	}

	resume(timeStamp: number): void {
		if (this.tweens) this.tweens.resume(timeStamp)
	}

	getFrame(evt: IFrameEvent) {
		if (!this.tweens) return false
		let nextFrame = this.tweens.getFrame(evt)
		if (nextFrame) return true // current tween is no finished
		else {
			let elapsed = this.tweens.elapsed(evt.currentTime)
			evt.elapsed = elapsed
			this.tweens = this.tweens.nextTweens  // current tween is finished, handle next tween
			if (!this.tweens) return false // no next tween, fin
			this.tweens.start(evt.previousTime + elapsed) // start next tween
			if (!evt.remaining) { // current tween is finished but no time left
				return true // handle tween in next frame
			} else {
				return this.getFrame(evt)
			}
		}
	}
}

export const transition = ((): Itransition => {
		let callbacks: Array<(IShape) => ITween> = []

		const trans: any = function (target: IShape): ITransition {
			let tran = new Transition()
			for (let i = 0, len = callbacks.length; i < len; i++) tran.add(callbacks[i](target))
			return tran
		}

		trans.delay = function (count: number): Itransition {
			callbacks.push(() => (new EmptyTween()).wait(count))
			return trans
		}

		trans.tween = function (props, duration, ease?): Itransition {
			callbacks.push((target: IShape) => (new DynamicTween(target)).tween(props, duration, ease))
			return trans
		}

		trans.set = function (arg1?: any, arg2?: any): Itransition {
			callbacks.push(target => (new StaticTween(target)).set(arg1, arg2))
			return trans
		}

		return trans;
	}
);
