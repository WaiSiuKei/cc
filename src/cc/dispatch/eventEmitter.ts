import {INodeEventEmitter, INodeListenersMap, NodeListenerCallback} from "./def";
import {EmitterEvent} from "../../base/common/eventEmitter";
import {IDisposable} from "../../base/common/lifecycle";

export class NodeEventEmitter implements INodeEventEmitter {

	protected _listeners: INodeListenersMap;
	protected _bulkListeners: NodeListenerCallback[];
	private _allowedEventTypes: { [eventType: string]: boolean; };

	constructor(allowedEventTypes: string[] = null) {
		this._listeners = {};
		this._bulkListeners = [];
		if (allowedEventTypes) {
			this._allowedEventTypes = {};
			for (let i = 0; i < allowedEventTypes.length; i++) {
				this._allowedEventTypes[allowedEventTypes[i]] = true;
			}
		} else {
			this._allowedEventTypes = null;
		}
	}

	public dispose(): void {
		this._listeners = {};
		this._bulkListeners = [];
		this._allowedEventTypes = null;
	}

	public on(eventType: string, listener: NodeListenerCallback): IDisposable {
		if (eventType === '*') {
			return this._addBulkListener(listener)
		}

		if (this._allowedEventTypes && !this._allowedEventTypes.hasOwnProperty(eventType)) {
			throw new Error('This object will never emit this event type!');
		}

		if (this._listeners.hasOwnProperty(eventType)) {
			this._listeners[eventType].push(listener);
		} else {
			this._listeners[eventType] = [listener];
		}

		let bound = this;
		return {
			dispose: () => {
				if (!bound) {
					// Already called
					return;
				}

				bound.off(eventType, listener);

				// Prevent leakers from holding on to the event emitter
				bound = null;
				listener = null;
			}
		};
	}

	public once(eventType: string, listener: NodeListenerCallback): IDisposable {
		const disposable = this.on(eventType, value => {
			disposable.dispose();
			return listener(value);
		});

		return disposable;
	}

	_addBulkListener(listener: NodeListenerCallback): IDisposable {

		this._bulkListeners.push(listener);

		return {
			dispose: () => {
				this._removeBulkListener(listener);
			}
		};
	}

	public off(event: string): void;
	public off(event: string, fn: NodeListenerCallback): void
	public off(event: string, fn?: NodeListenerCallback): void {
		if (fn) {
			this._removeListener(event, fn)
		} else {
			this._removeListeners(event)
		}
	}

	_removeListener(event: string, fn: NodeListenerCallback): void {
		if (this._listeners.hasOwnProperty(event)) {
			let listeners = this._listeners[event];
			for (let i = 0, len = listeners.length; i < len; i++) {
				if (listeners[i] === fn) {
					listeners.splice(i, 1);
					break;
				}
			}
		}
	}

	_removeListeners(event: string): void {
		if (this._listeners.hasOwnProperty(event)) {
			this._listeners[event].length = 0
			this._listeners[event] = []
		}
	}

	private _removeBulkListener(listener: NodeListenerCallback): void {
		for (let i = 0, len = this._bulkListeners.length; i < len; i++) {
			if (this._bulkListeners[i] === listener) {
				this._bulkListeners.splice(i, 1);
				break;
			}
		}
	}

	protected _emitToSpecificTypeListeners(eventType: string, data: any): boolean {
		let stop = false
		if (this._listeners.hasOwnProperty(eventType)) {
			const listeners = this._listeners[eventType].slice(0);
			for (let i = 0, len = listeners.length; i < len; i++) {
				stop = listeners[i](data) || stop
			}
		}

		return stop
	}

	protected _emitToBulkListeners(event: EmitterEvent): boolean {
		let stop = false
		const bulkListeners = this._bulkListeners.slice(0);
		for (let i = 0, len = bulkListeners.length; i < len; i++) {
			stop = bulkListeners[i](event) || stop
		}

		return stop
	}

	protected _emitEvents(event: EmitterEvent): boolean {
		let stop = false

		stop = this._emitToSpecificTypeListeners(event.type, event.data) || stop

		if (this._bulkListeners.length > 0) {
			stop = this._emitToBulkListeners(event) || stop
		}
		return stop
	}

	public emit(eventType: string, data: any = {}): boolean {
		if (this._allowedEventTypes && !this._allowedEventTypes.hasOwnProperty(eventType)) {
			throw new Error('Cannot emit this event type because it wasn\'t listed!');
		}
		// Early return if no listeners would get this
		if (!this._listeners.hasOwnProperty(eventType) && this._bulkListeners.length === 0) {
			return false;
		}

		return this._emitEvents(new EmitterEvent(eventType, data));
	}
}
