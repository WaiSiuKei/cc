/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import {IBaseVector} from "../../cc/core/def";

export function getComputedStyle(el: HTMLElement): CSSStyleDeclaration {
	return document.defaultView.getComputedStyle(el, null);
}

// Adapted from WinJS
// Converts a CSS positioning string for the specified element to pixels.
const convertToPixels: (element: HTMLElement, value: string) => number = (function () {
	return function (element: HTMLElement, value: string): number {
		return parseFloat(value) || 0;
	};
})();

function getDimension(element: HTMLElement, cssPropertyName: string, jsPropertyName: string): number {
	let computedStyle: CSSStyleDeclaration = getComputedStyle(element);
	let value = '0';
	if (computedStyle) {
		if (computedStyle.getPropertyValue) {
			value = computedStyle.getPropertyValue(cssPropertyName);
		} else {
			// IE8
			value = (<any>computedStyle).getAttribute(jsPropertyName);
		}
	}
	return convertToPixels(element, value);
}

const sizeUtils = {

	getBorderLeftWidth: function (element: HTMLElement): number {
		return getDimension(element, 'border-left-width', 'borderLeftWidth');
	},
	getBorderTopWidth: function (element: HTMLElement): number {
		return getDimension(element, 'border-top-width', 'borderTopWidth');
	},
	getBorderRightWidth: function (element: HTMLElement): number {
		return getDimension(element, 'border-right-width', 'borderRightWidth');
	},
	getBorderBottomWidth: function (element: HTMLElement): number {
		return getDimension(element, 'border-bottom-width', 'borderBottomWidth');
	},

	getPaddingLeft: function (element: HTMLElement): number {
		return getDimension(element, 'padding-left', 'paddingLeft');
	},
	getPaddingTop: function (element: HTMLElement): number {
		return getDimension(element, 'padding-top', 'paddingTop');
	},
	getPaddingRight: function (element: HTMLElement): number {
		return getDimension(element, 'padding-right', 'paddingRight');
	},
	getPaddingBottom: function (element: HTMLElement): number {
		return getDimension(element, 'padding-bottom', 'paddingBottom');
	},

	getMarginLeft: function (element: HTMLElement): number {
		return getDimension(element, 'margin-left', 'marginLeft');
	},
	getMarginTop: function (element: HTMLElement): number {
		return getDimension(element, 'margin-top', 'marginTop');
	},
	getMarginRight: function (element: HTMLElement): number {
		return getDimension(element, 'margin-right', 'marginRight');
	},
	getMarginBottom: function (element: HTMLElement): number {
		return getDimension(element, 'margin-bottom', 'marginBottom');
	},
	__commaSentinel: false
};

// ----------------------------------------------------------------------------------------
// Position & Dimension

export function getTopLeftOffset(element: HTMLElement): { left: number; top: number; } {
	// Adapted from WinJS.Utilities.getPosition
	// and added borders to the mix

	let offsetParent = element.offsetParent, top = element.offsetTop, left = element.offsetLeft;

	while ((element = <HTMLElement>element.parentNode) !== null && element !== document.body && element !== document.documentElement) {
		top -= element.scrollTop;
		let c = getComputedStyle(element);
		if (c) {
			left -= c.direction !== 'rtl' ? element.scrollLeft : -element.scrollLeft;
		}

		if (element === offsetParent) {
			left += sizeUtils.getBorderLeftWidth(element);
			top += sizeUtils.getBorderTopWidth(element);
			top += element.offsetTop;
			left += element.offsetLeft;
			offsetParent = element.offsetParent;
		}
	}

	return {
		left: left,
		top: top
	};
}

export interface IStandardWindow {
	scrollX: number;
	scrollY: number;
}

export const StandardWindow: IStandardWindow = new class {
	get scrollX(): number {
		if (typeof window.scrollX === 'number') {
			// modern browsers
			return window.scrollX;
		} else {
			return document.body.scrollLeft + document.documentElement.scrollLeft;
		}
	}

	get scrollY(): number {
		if (typeof window.scrollY === 'number') {
			// modern browsers
			return window.scrollY;
		} else {
			return document.body.scrollTop + document.documentElement.scrollTop;
		}
	}
};

// Adapted from WinJS
// Gets the width of the content of the specified element. The content width does not include borders or padding.
export function getContentWidth(element: HTMLElement): number {
	let border = sizeUtils.getBorderLeftWidth(element) + sizeUtils.getBorderRightWidth(element);
	let padding = sizeUtils.getPaddingLeft(element) + sizeUtils.getPaddingRight(element);
	return element.offsetWidth - border - padding;
}

// Adapted from WinJS
// Gets the width of the element, including margins.
export function getTotalWidth(element: HTMLElement): number {
	let margin = sizeUtils.getMarginLeft(element) + sizeUtils.getMarginRight(element);
	return element.offsetWidth + margin;
}

// Adapted from WinJS
// Gets the height of the content of the specified element. The content height does not include borders or padding.
export function getContentHeight(element: HTMLElement): number {
	let border = sizeUtils.getBorderTopWidth(element) + sizeUtils.getBorderBottomWidth(element);
	let padding = sizeUtils.getPaddingTop(element) + sizeUtils.getPaddingBottom(element);
	return element.offsetHeight - border - padding;
}

// Adapted from WinJS
// Gets the height of the element, including its margins.
export function getTotalHeight(element: HTMLElement): number {
	let margin = sizeUtils.getMarginTop(element) + sizeUtils.getMarginBottom(element);
	return element.offsetHeight + margin;
}

// ----------------------------------------------------------------------------------------

export function clientToLocal(e: MouseEvent, ele: Element): IBaseVector {
	const rect = ele.getBoundingClientRect()

	return {
		x: e.clientX - rect.left - ele.clientLeft,
		y: e.clientY - rect.top - ele.clientTop,
	}
}

