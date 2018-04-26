import {IDisposable} from "../../base/common/lifecycle";

export interface NodeListenerCallback {
	(value: any): boolean | void;
}

export interface INodeListenersMap {
	[key: string]: NodeListenerCallback[];
}

export interface INodeEventEmitter extends IDisposable {
	on(eventType: string, listener: NodeListenerCallback): IDisposable;
	once(eventType: string, listener: NodeListenerCallback): IDisposable;
	off(event: string, fn: NodeListenerCallback): void;
	off(event: string): void;
	emit(event: string, data): boolean;
}