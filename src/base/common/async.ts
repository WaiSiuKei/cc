/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import {Disposable} from "./lifecycle";

export class TimeoutTimer extends Disposable {
    private _token: number;

    constructor() {
        super();
        this._token = -1;
    }

    dispose(): void {
        this.cancel();
        super.dispose();
    }

    cancel(): void {
        if (this._token !== -1) {
            clearTimeout(this._token);
            this._token = -1;
        }
    }

    cancelAndSet(runner: () => void, timeout: number): void {
        this.cancel();
        this._token = setTimeout(() => {
            this._token = -1;
            runner();
        }, timeout);
    }

    setIfNotSet(runner: () => void, timeout: number): void {
        if (this._token !== -1) {
            // timer is already set
            return;
        }
        this._token = setTimeout(() => {
            this._token = -1;
            runner();
        }, timeout);
    }
}
