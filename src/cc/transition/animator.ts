import {IAnimator, ITransition} from "./def";
import {IStage} from "../dom/def";
import {timer} from "./timer";
import {FrameEvent} from "./frameEvent";

export class Animator implements IAnimator {
	private transitions: ITransition[] = []
	private waitingFrame: number

	constructor(private stage: IStage) {

	}

	add(trans: ITransition | ITransition[]) {
		if (Array.isArray(trans)) this.transitions = this.transitions.concat(trans)
		else this.transitions.push(trans)
	}

	start() {
		if (!this.transitions.length) {
			if (this.waitingFrame) {
				cancelAnimationFrame(this.waitingFrame)
				this.waitingFrame = 0
			}
			this.waitingFrame = requestAnimationFrame(() => {
				this.stage.update()
				this.waitingFrame = 0
			})
			return
		}

		this.run()
	}

	run() {
		let last = timer.now()

		for (let i = 0, len = this.transitions.length; i < len; i++) {
			let trans = this.transitions[i]
			trans.start(last)
		}

		const animate = () => {
			let now = timer.now()
			if (this.transitions.length) {
				let nextFrame = false
				for (let i = 0, len = this.transitions.length; i < len; i++) {
					let frame = this.transitions[i].getFrame(new FrameEvent(last, now))
					nextFrame = nextFrame || frame
				}
				this.stage.update()
				if (nextFrame) requestAnimationFrame(animate)
				else {
					this.transitions.length = 0
				}
			}
			last = now
		}

		animate()
	}
}