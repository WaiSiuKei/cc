/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as platform from './platform';
import {Disposable} from "./lifecycle";

export class TimeoutTimer extends Disposable {
    private _token: platform.TimeoutToken;

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
            platform.clearTimeout(this._token);
            this._token = -1;
        }
    }

    cancelAndSet(runner: () => void, timeout: number): void {
        this.cancel();
        this._token = platform.setTimeout(() => {
            this._token = -1;
            runner();
        }, timeout);
    }

    setIfNotSet(runner: () => void, timeout: number): void {
        if (this._token !== -1) {
            // timer is already set
            return;
        }
        this._token = platform.setTimeout(() => {
            this._token = -1;
            runner();
        }, timeout);
    }
}
