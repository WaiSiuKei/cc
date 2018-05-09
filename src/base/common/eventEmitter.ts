/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import {onUnexpectedError} from './errors'
import {IDisposable} from './lifecycle';

export class EmitterEvent {

    public readonly type: string;
    public readonly data: any;

    constructor(eventType: string = null, data: any = null) {
        this.type = eventType;
        this.data = data;
    }
}

export interface ListenerCallback {
    (value: any): void;
}

export interface BulkListenerCallback {
    (value: EmitterEvent[]): void;
}

export interface IBaseEventEmitter {
    addBulkListener(listener: BulkListenerCallback): IDisposable;
}

export interface IEventEmitter extends IBaseEventEmitter, IDisposable {
    addListener(eventType: string, listener: ListenerCallback): IDisposable;
    addOneTimeListener(eventType: string, listener: ListenerCallback): IDisposable;
    removeListener(event: string, fn: ListenerCallback): void;
    removeListeners(event: string): void;
    emit(event: string, data): void;
}

export interface IListenersMap {
    [key: string]: ListenerCallback[];
}

export class EventEmitter implements IEventEmitter {

    protected _listeners: IListenersMap;
    protected _bulkListeners: ListenerCallback[];
    private _collectedEvents: EmitterEvent[];
    private _deferredCnt: number;
    private _allowedEventTypes: { [eventType: string]: boolean; };

    constructor(allowedEventTypes: string[] = null) {
        this._listeners = {};
        this._bulkListeners = [];
        this._collectedEvents = [];
        this._deferredCnt = 0;
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
        this._collectedEvents = [];
        this._deferredCnt = 0;
        this._allowedEventTypes = null;
    }

    public addListener(eventType: string, listener: ListenerCallback): IDisposable {
        if (eventType === '*') {
            throw new Error('Use addBulkListener(listener) to register your listener!');
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

                bound.removeListener(eventType, listener);

                // Prevent leakers from holding on to the event emitter
                bound = null;
                listener = null;
            }
        };
    }

    public addOneTimeListener(eventType: string, listener: ListenerCallback): IDisposable {
        const disposable = this.addListener(eventType, value => {
            disposable.dispose();
            listener(value);
        });

        return disposable;
    }

    public addBulkListener(listener: BulkListenerCallback): IDisposable {

        this._bulkListeners.push(listener);

        return {
            dispose: () => {
                this._removeBulkListener(listener);
            }
        };
    }

    public addEmitter(eventEmitter: IBaseEventEmitter): IDisposable {
        return eventEmitter.addBulkListener((events: EmitterEvent[]): void => {
            if (this._deferredCnt === 0) {
                this._emitEvents(events);
            } else {
                // Collect for later
                this._collectedEvents.push.apply(this._collectedEvents, events);
            }
        });
    }

    public removeListener(eventType: string, listener: ListenerCallback): void {
        if (this._listeners.hasOwnProperty(eventType)) {
            let listeners = this._listeners[eventType];
            for (let i = 0, len = listeners.length; i < len; i++) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }

    public removeListeners(eventType: string): void {
        if (this._listeners.hasOwnProperty(eventType)) {
            this._listeners[eventType].length = 0
            this._listeners[eventType] = []
        }
    }

    private _removeBulkListener(listener: BulkListenerCallback): void {
        for (let i = 0, len = this._bulkListeners.length; i < len; i++) {
            if (this._bulkListeners[i] === listener) {
                this._bulkListeners.splice(i, 1);
                break;
            }
        }
    }

    protected _emitToSpecificTypeListeners(eventType: string, data: any): void {
        if (this._listeners.hasOwnProperty(eventType)) {
            const listeners = this._listeners[eventType].slice(0);
            for (let i = 0, len = listeners.length; i < len; i++) {
                safeInvoke1Arg(listeners[i], data);
            }
        }
    }

    protected _emitToBulkListeners(events: EmitterEvent[]): void {
        const bulkListeners = this._bulkListeners.slice(0);
        for (let i = 0, len = bulkListeners.length; i < len; i++) {
            safeInvoke1Arg(bulkListeners[i], events);
        }
    }

    protected _emitEvents(events: EmitterEvent[]): void {
        if (this._bulkListeners.length > 0) {
            this._emitToBulkListeners(events);
        }
        for (let i = 0, len = events.length; i < len; i++) {
            const e = events[i];

            this._emitToSpecificTypeListeners(e.type, e.data);
        }
    }

    public emit(eventType: string, data: any = {}): void {
        if (this._allowedEventTypes && !this._allowedEventTypes.hasOwnProperty(eventType)) {
            throw new Error('Cannot emit this event type because it wasn\'t listed!');
        }
        // Early return if no listeners would get this
        if (!this._listeners.hasOwnProperty(eventType) && this._bulkListeners.length === 0) {
            return;
        }
        const emitterEvent = new EmitterEvent(eventType, data);

        if (this._deferredCnt === 0) {
            this._emitEvents([emitterEvent]);
        } else {
            // Collect for later
            this._collectedEvents.push(emitterEvent);
        }
    }

    public beginDeferredEmit(): void {
        this._deferredCnt = this._deferredCnt + 1;
    }

    public endDeferredEmit(): void {
        this._deferredCnt = this._deferredCnt - 1;

        if (this._deferredCnt === 0) {
            this._emitCollected();
        }
    }

    public deferredEmit<T>(callback: () => T): T {
        this.beginDeferredEmit();

        let result: T = safeInvokeNoArg<T>(callback);

        this.endDeferredEmit();

        return result;
    }

    private _emitCollected(): void {
        if (this._collectedEvents.length === 0) {
            return;
        }
        // Flush collected events
        const events = this._collectedEvents;
        this._collectedEvents = [];
        this._emitEvents(events);
    }
}

function safeInvokeNoArg<T>(func: Function): T {
    try {
        return func();
    } catch (e) {
        onUnexpectedError(e);
    }
    return undefined;
}

function safeInvoke1Arg(func: Function, arg1: any): any {
    try {
        return func(arg1);
    } catch (e) {
        onUnexpectedError(e);
    }
}
