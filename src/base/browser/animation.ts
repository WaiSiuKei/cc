import {IDisposable} from "../common/lifecycle";
import {onUnexpectedError} from "../common/errors";

const _animationFrame = (function () {
	let emulatedRequestAnimationFrame = (callback: (time: number) => void): number => {
		return setTimeout(() => callback(new Date().getTime()), 0);
	};
	let nativeRequestAnimationFrame: (callback: (time: number) => void) => number =
		self.requestAnimationFrame
		|| (<any>self).msRequestAnimationFrame
		|| (<any>self).webkitRequestAnimationFrame
		|| (<any>self).mozRequestAnimationFrame
		|| (<any>self).oRequestAnimationFrame;

	let emulatedCancelAnimationFrame = (id: number) => { };
	let nativeCancelAnimationFrame: (id: number) => void =
		self.cancelAnimationFrame || (<any>self).cancelRequestAnimationFrame
		|| (<any>self).msCancelAnimationFrame || (<any>self).msCancelRequestAnimationFrame
		|| (<any>self).webkitCancelAnimationFrame || (<any>self).webkitCancelRequestAnimationFrame
		|| (<any>self).mozCancelAnimationFrame || (<any>self).mozCancelRequestAnimationFrame
		|| (<any>self).oCancelAnimationFrame || (<any>self).oCancelRequestAnimationFrame;

	let isNative = !!nativeRequestAnimationFrame;
	let request = nativeRequestAnimationFrame || emulatedRequestAnimationFrame;
	let cancel = nativeCancelAnimationFrame || emulatedCancelAnimationFrame;

	return {
		isNative: isNative,
		request: (callback: (time: number) => void): number => {
			return request(callback);
		},
		cancel: (id: number) => {
			return cancel(id);
		}
	};
})();

/**
 * Schedule a callback to be run at the next animation frame.
 * This allows multiple parties to register callbacks that should run at the next animation frame.
 * If currently in an animation frame, `runner` will be executed immediately.
 * @return token that can be used to cancel the scheduled runner (only if `runner` was not executed immediately).
 */
export let runAtThisOrScheduleAtNextAnimationFrame: (runner: () => void, priority?: number) => IDisposable;
/**
 * Schedule a callback to be run at the next animation frame.
 * This allows multiple parties to register callbacks that should run at the next animation frame.
 * If currently in an animation frame, `runner` will be executed at the next animation frame.
 * @return token that can be used to cancel the scheduled runner.
 */
export let scheduleAtNextAnimationFrame: (runner: () => void, priority?: number) => IDisposable;

class AnimationFrameQueueItem implements IDisposable {

	private _runner: () => void;
	public priority: number;
	private _canceled: boolean;

	constructor(runner: () => void, priority: number) {
		this._runner = runner;
		this.priority = priority;
		this._canceled = false;
	}

	public dispose(): void {
		this._canceled = true;
	}

	public execute(): void {
		if (this._canceled) {
			return;
		}

		try {
			this._runner();
		} catch (e) {
			onUnexpectedError(e);
		}
	}

	// Sort by priority (largest to lowest)
	public static sort(a: AnimationFrameQueueItem, b: AnimationFrameQueueItem): number {
		return b.priority - a.priority;
	}
}

(function () {
	/**
	 * The runners scheduled at the next animation frame
	 */
	let NEXT_QUEUE: AnimationFrameQueueItem[] = [];
	/**
	 * The runners scheduled at the current animation frame
	 */
	let CURRENT_QUEUE: AnimationFrameQueueItem[] = null;
	/**
	 * A flag to keep track if the native requestAnimationFrame was already called
	 */
	let animFrameRequested = false;
	/**
	 * A flag to indicate if currently handling a native requestAnimationFrame callback
	 */
	let inAnimationFrameRunner = false;

	let animationFrameRunner = () => {
		animFrameRequested = false;

		CURRENT_QUEUE = NEXT_QUEUE;
		NEXT_QUEUE = [];

		inAnimationFrameRunner = true;
		while (CURRENT_QUEUE.length > 0) {
			CURRENT_QUEUE.sort(AnimationFrameQueueItem.sort);
			let top = CURRENT_QUEUE.shift();
			top.execute();
		}
		inAnimationFrameRunner = false;
	};

	scheduleAtNextAnimationFrame = (runner: () => void, priority: number = 0) => {
		let item = new AnimationFrameQueueItem(runner, priority);
		NEXT_QUEUE.push(item);

		if (!animFrameRequested) {
			animFrameRequested = true;
			_animationFrame.request(animationFrameRunner);
		}

		return item;
	};

	runAtThisOrScheduleAtNextAnimationFrame = (runner: () => void, priority?: number) => {
		if (inAnimationFrameRunner) {
			let item = new AnimationFrameQueueItem(runner, priority);
			CURRENT_QUEUE.push(item);
			return item;
		} else {
			return scheduleAtNextAnimationFrame(runner, priority);
		}
	};
})();
