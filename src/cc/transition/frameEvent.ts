import {IFrameEvent} from "./def";

export class FrameEvent implements IFrameEvent {
	previousTime: number;
	currentTime: number;
	private diff: number
	public elapsed: number

	constructor(last: number, now: number) {
		this.previousTime = last
		this.currentTime = now
		this.diff = now - last
		this.elapsed = 0
	}

	get remaining() {
		return Math.max(0, this.diff - this.elapsed)
	}
}