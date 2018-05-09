import {IMouseEvent, INode} from "./def";
import {EventProxy} from "./eventProxy";
import {dispose, IDisposable} from "../../base/common/lifecycle";
import {EventType} from "../../base/browser/event";

export class EventHandler implements IDisposable {
	proxy: EventProxy

	private toDispose: IDisposable[] = []

	private currentTarget: INode; //node
	private currentDragTarget: INode;//
	private previousEventType: string;

	constructor(private target: HTMLElement, private rootNode: INode) {
		this.proxy = new EventProxy(target)

		this.proxy.onMouseEvent(this.handleEvent.bind(this))
		this.toDispose.push(this.proxy)
	}

	dispatch(event: IMouseEvent) { // dispatch event manully
		this.handleEvent(event)
	}

	private handleEvent(event: IMouseEvent) {
		if (this.previousEventType === EventType.DRAG || this.previousEventType == EventType.DRAG_START && event.type === EventType.DRAG) {
			if (event.type !== EventType.MOUSE_MOVE) {
				event.target = this.currentDragTarget
				event.type = EventType.DRAG_END
				// this.propagationEvent(this.currentTarget, event)
			} else {
				event.target = this.currentDragTarget
				// this.propagationEvent(this.currentTarget, event) // drag
			}
		} else {
			let target = this.rootNode.hitTest({x: event.x, y: event.y})
			if (target) {
				if (event.type === EventType.MOUSE_MOVE) {
					if (!this.currentTarget) {
						event.target = target
						event.type = EventType.MOUSE_OVER
						this.propagationEvent(target, event)
						this.currentTarget = target
					} else if (target !== this.currentTarget) {
						if (this.currentTarget.isAncestorOf(target)) {
							event.target = target
							event.type = EventType.MOUSE_OUT
							this.propagationEvent(this.currentTarget, event)
							this.currentTarget = target
							event.type = EventType.MOUSE_OVER
							this.propagationEvent(target, event)
						} else {
							event.target = this.currentTarget
							event.type = EventType.MOUSE_OUT
							this.propagationEvent(this.currentTarget, event)
							this.currentTarget = target
							event.target = target
							event.type = EventType.MOUSE_OVER
							this.propagationEvent(target, event)
						}
					}
				} else {
					event.target = target
					this.propagationEvent(target, event) // click
				}
			} else {
				let prevTarget = this.currentTarget
				if (prevTarget && this.previousEventType === EventType.MOUSE_MOVE) {
					event.target = prevTarget
					event.type = EventType.MOUSE_OUT
					this.propagationEvent(this.currentTarget, event)
				} else if (event.type !== EventType.MOUSE_MOVE) {
					event.target = this.rootNode
					this.propagationEvent(this.rootNode, event) // click
				}
			}
		}

		this.previousEventType = event.type
		if (event.type === EventType.MOUSE_OUT) {
			this.currentTarget = null // 放后点，emit完mouseleave就set为null的话，event.target也会变成null🤷‍
		} else if (event.type === EventType.DRAG_END) {
			this.currentDragTarget = null
		}
	}

	propagationEvent(target: INode, event: IMouseEvent) {
		let stop = Boolean(target.emit(event.type, event))
		let parent = target.parent
		let p
		while (parent && !stop) {
			p = parent
			stop = Boolean(parent.emit(event.type, event))
			parent = parent.parent
		}
		if (p !== this.rootNode) this.rootNode.emit(event.type, event)
	}

	dispose() {
		this.toDispose = dispose(this.toDispose)
	}
}
