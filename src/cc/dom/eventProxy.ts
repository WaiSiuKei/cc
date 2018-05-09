import {IDragEvent, IEventProxy, IMouseEvent} from "./def";
import {dispose, IDisposable} from "../../base/common/lifecycle";
import {addDisposableListener, EventType} from "../../base/browser/event";
import {clientToLocal} from "../../base/browser/dom";
import {Emitter} from "../../base/common/events";
import {IBaseVector} from "../core/def";

function makeSyntheticEvent(e: MouseEvent, element, type): IMouseEvent {
	const {x, y} = clientToLocal(e, element)
	const buttons = e.buttons
	return {
		type,
		buttons,
		leftButton: buttons === 1,
		middleButton: buttons === 3,
		rightButton: buttons === 2,
		x,
		y,
		ctrlKey: e.ctrlKey,
		shiftKey: e.shiftKey,
		altKey: e.altKey,
		metaKey: e.metaKey,
		timestamp: Date.now()
	}
}

export class EventProxy implements IEventProxy, IDisposable {
	minDragDistance: number

	private toDispose: IDisposable[] = []
	private _onMouseEvent: Emitter<IMouseEvent>

	private firstDragPosition: IBaseVector;
	private prevDragPosition: IBaseVector;

	constructor(protected target: HTMLElement) {
		this.minDragDistance = 3

		this._onMouseEvent = new Emitter<IMouseEvent>()

		this.toDispose.push(this._onMouseEvent)
		this.registerListener()
	}

	public get onMouseEvent() {
		return this._onMouseEvent.event
	}

	private registerListener() {
		this.toDispose.push(addDisposableListener(this.target, EventType.MOUSE_DOWN, this.handleMouseDown.bind(this), true))
		this.toDispose.push(addDisposableListener(this.target, EventType.MOUSE_UP, this.handleMouseUp.bind(this), true))
		this.toDispose.push(addDisposableListener(this.target, EventType.MOUSE_MOVE, this.handleMouseMove.bind(this), true))
		this.toDispose.push(addDisposableListener(this.target, EventType.CLICK, this.handleMouseClick.bind(this), true))
	}

	private handleMouseDown(e: MouseEvent) {
		// e.preventDefault()
		// e.stopImmediatePropagation()
		this._onMouseEvent.fire(makeSyntheticEvent(e, this.target, EventType.MOUSE_DOWN))
	}

	private handleMouseClick(e: MouseEvent) {
		// e.preventDefault()
		// e.stopImmediatePropagation()
		this._onMouseEvent.fire(makeSyntheticEvent(e, this.target, EventType.CLICK))
	}

	private handleMouseUp(e: MouseEvent) {
		// e.preventDefault()
		// e.stopImmediatePropagation()
		this.firstDragPosition = null
		this.prevDragPosition = null
		this._onMouseEvent.fire(makeSyntheticEvent(e, this.target, EventType.MOUSE_UP))
	}

	private handleMouseMove(e: MouseEvent) {
		// e.preventDefault()
		// e.stopImmediatePropagation()
		let event = makeSyntheticEvent(e, this.target, EventType.MOUSE_MOVE)
		if (event.buttons) {
			if (!this.firstDragPosition) this.firstDragPosition = {x: event.x, y: event.y}
			if (!this.prevDragPosition) this.prevDragPosition = {x: event.x, y: event.y}
			let evt = event as IDragEvent
			evt.type = EventType.DRAG
			evt.firstX = this.firstDragPosition.x
			evt.firstY = this.firstDragPosition.y
			evt.previousX = this.prevDragPosition.x
			evt.previousY = this.prevDragPosition.y

			this._onMouseEvent.fire(event)

			this.prevDragPosition = {x: event.x, y: event.y}
		} else {
			this._onMouseEvent.fire(event)
		}
	}

	public dispose() {
		dispose(this.toDispose)
		this.toDispose = []
	}
}
