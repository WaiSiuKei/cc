/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {CharCode} from "../../base/common/charCode";

function roundFloat(number: number, decimalPoints: number): number {
	const decimal = Math.pow(10, decimalPoints);
	return Math.round(number * decimal) / decimal;
}

export class RGBA {

	readonly r: number;

	readonly g: number;

	readonly b: number;

	readonly a: number;

	constructor(r: number, g: number, b: number, a: number = 1) {
		this.r = Math.min(255, Math.max(0, r)) | 0;
		this.g = Math.min(255, Math.max(0, g)) | 0;
		this.b = Math.min(255, Math.max(0, b)) | 0;
		this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
	}

	static equals(a: RGBA, b: RGBA): boolean {
		return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
	}
}

export class HSLA {
	/**
	 * Hue: integer in [0, 360]
	 */
	readonly h: number;

	/**
	 * Saturation: float in [0, 1]
	 */
	readonly s: number;

	/**
	 * Luminosity: float in [0, 1]
	 */
	readonly l: number;

	/**
	 * Alpha: float in [0, 1]
	 */
	readonly a: number;

	constructor(h: number, s: number, l: number, a: number) {
		this.h = Math.max(Math.min(360, h), 0) | 0;
		this.s = roundFloat(Math.max(Math.min(1, s), 0), 3);
		this.l = roundFloat(Math.max(Math.min(1, l), 0), 3);
		this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
	}

	static equals(a: HSLA, b: HSLA): boolean {
		return a.h === b.h && a.s === b.s && a.l === b.l && a.a === b.a;
	}

	/**
	 * Converts an RGB color value to HSL. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes r, g, and b are contained in the set [0, 255] and
	 * returns h in the set [0, 360], s, and l in the set [0, 1].
	 */
	static fromRGBA(rgba: RGBA): HSLA {
		const r = rgba.r / 255;
		const g = rgba.g / 255;
		const b = rgba.b / 255;
		const a = rgba.a;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = 0;
		let s = 0;
		const l = (min + max) / 2;
		const chroma = max - min;

		if (chroma > 0) {
			s = Math.min((l <= 0.5 ? chroma / (2 * l) : chroma / (2 - (2 * l))), 1);

			switch (max) {
				case r:
					h = (g - b) / chroma + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / chroma + 2;
					break;
				case b:
					h = (r - g) / chroma + 4;
					break;
			}

			h *= 60;
			h = Math.round(h);
		}
		return new HSLA(h, s, l, a);
	}

	private static _hue2rgb(p: number, q: number, t: number) {
		if (t < 0) {
			t += 1;
		}
		if (t > 1) {
			t -= 1;
		}
		if (t < 1 / 6) {
			return p + (q - p) * 6 * t;
		}
		if (t < 1 / 2) {
			return q;
		}
		if (t < 2 / 3) {
			return p + (q - p) * (2 / 3 - t) * 6;
		}
		return p;
	}

	/**
	 * Converts an HSL color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes h in the set [0, 360] s, and l are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 */
	static toRGBA(hsla: HSLA): RGBA {
		const h = hsla.h / 360;
		const {s, l, a} = hsla;
		let r: number, g: number, b: number;

		if (s === 0) {
			r = g = b = l; // achromatic
		} else {
			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = HSLA._hue2rgb(p, q, h + 1 / 3);
			g = HSLA._hue2rgb(p, q, h);
			b = HSLA._hue2rgb(p, q, h - 1 / 3);
		}

		return new RGBA(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a);
	}
}

export class HSVA {
	/**
	 * Hue: integer in [0, 360]
	 */
	readonly h: number;

	/**
	 * Saturation: float in [0, 1]
	 */
	readonly s: number;

	/**
	 * Value: float in [0, 1]
	 */
	readonly v: number;

	/**
	 * Alpha: float in [0, 1]
	 */
	readonly a: number;

	constructor(h: number, s: number, v: number, a: number) {
		this.h = Math.max(Math.min(360, h), 0) | 0;
		this.s = roundFloat(Math.max(Math.min(1, s), 0), 3);
		this.v = roundFloat(Math.max(Math.min(1, v), 0), 3);
		this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
	}

	static equals(a: HSVA, b: HSVA): boolean {
		return a.h === b.h && a.s === b.s && a.v === b.v && a.a === b.a;
	}

	// from http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
	static fromRGBA(rgba: RGBA): HSVA {
		const r = rgba.r / 255;
		const g = rgba.g / 255;
		const b = rgba.b / 255;
		const cmax = Math.max(r, g, b);
		const cmin = Math.min(r, g, b);
		const delta = cmax - cmin;
		const s = cmax === 0 ? 0 : (delta / cmax);
		let m: number;

		if (delta === 0) {
			m = 0;
		} else if (cmax === r) {
			m = ((((g - b) / delta) % 6) + 6) % 6;
		} else if (cmax === g) {
			m = ((b - r) / delta) + 2;
		} else {
			m = ((r - g) / delta) + 4;
		}

		return new HSVA(m * 60, s, cmax, rgba.a);
	}

	// from http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
	static toRGBA(hsva: HSVA): RGBA {
		const {h, s, v, a} = hsva;
		const c = v * s;
		const x = c * (1 - Math.abs((h / 60) % 2 - 1));
		const m = v - c;
		let [r, g, b] = [0, 0, 0];

		if (h < 60) {
			r = c;
			g = x;
		} else if (h < 120) {
			r = x;
			g = c;
		} else if (h < 180) {
			g = c;
			b = x;
		} else if (h < 240) {
			g = x;
			b = c;
		} else if (h < 300) {
			r = x;
			b = c;
		} else if (h < 360) {
			r = c;
			b = x;
		}

		r = Math.round((r + m) * 255);
		g = Math.round((g + m) * 255);
		b = Math.round((b + m) * 255);

		return new RGBA(r, g, b, a);
	}
}

export enum NamedColor {
	aliceblue = 0xf0f8ff,
	antiquewhite = 0xfaebd7,
	aqua = 0x00ffff,
	aquamarine = 0x7fffd4,
	azure = 0xf0ffff,
	beige = 0xf5f5dc,
	bisque = 0xffe4c4,
	black = 0x000000,
	blanchedalmond = 0xffebcd,
	blue = 0x0000ff,
	blueviolet = 0x8a2be2,
	brown = 0xa52a2a,
	burlywood = 0xdeb887,
	cadetblue = 0x5f9ea0,
	chartreuse = 0x7fff00,
	chocolate = 0xd2691e,
	coral = 0xff7f50,
	cornflowerblue = 0x6495ed,
	cornsilk = 0xfff8dc,
	crimson = 0xdc143c,
	cyan = 0x00ffff,
	darkblue = 0x00008b,
	darkcyan = 0x008b8b,
	darkgoldenrod = 0xb8860b,
	darkgray = 0xa9a9a9,
	darkgreen = 0x006400,
	darkgrey = 0xa9a9a9,
	darkkhaki = 0xbdb76b,
	darkmagenta = 0x8b008b,
	darkolivegreen = 0x556b2f,
	darkorange = 0xff8c00,
	darkorchid = 0x9932cc,
	darkred = 0x8b0000,
	darksalmon = 0xe9967a,
	darkseagreen = 0x8fbc8f,
	darkslateblue = 0x483d8b,
	darkslategray = 0x2f4f4f,
	darkslategrey = 0x2f4f4f,
	darkturquoise = 0x00ced1,
	darkviolet = 0x9400d3,
	deeppink = 0xff1493,
	deepskyblue = 0x00bfff,
	dimgray = 0x696969,
	dimgrey = 0x696969,
	dodgerblue = 0x1e90ff,
	firebrick = 0xb22222,
	floralwhite = 0xfffaf0,
	forestgreen = 0x228b22,
	fuchsia = 0xff00ff,
	gainsboro = 0xdcdcdc,
	ghostwhite = 0xf8f8ff,
	gold = 0xffd700,
	goldenrod = 0xdaa520,
	gray = 0x808080,
	green = 0x008000,
	greenyellow = 0xadff2f,
	grey = 0x808080,
	honeydew = 0xf0fff0,
	hotpink = 0xff69b4,
	indianred = 0xcd5c5c,
	indigo = 0x4b0082,
	ivory = 0xfffff0,
	khaki = 0xf0e68c,
	lavender = 0xe6e6fa,
	lavenderblush = 0xfff0f5,
	lawngreen = 0x7cfc00,
	lemonchiffon = 0xfffacd,
	lightblue = 0xadd8e6,
	lightcoral = 0xf08080,
	lightcyan = 0xe0ffff,
	lightgoldenrodyellow = 0xfafad2,
	lightgray = 0xd3d3d3,
	lightgreen = 0x90ee90,
	lightgrey = 0xd3d3d3,
	lightpink = 0xffb6c1,
	lightsalmon = 0xffa07a,
	lightseagreen = 0x20b2aa,
	lightskyblue = 0x87cefa,
	lightslategray = 0x778899,
	lightslategrey = 0x778899,
	lightsteelblue = 0xb0c4de,
	lightyellow = 0xffffe0,
	lime = 0x00ff00,
	limegreen = 0x32cd32,
	linen = 0xfaf0e6,
	magenta = 0xff00ff,
	maroon = 0x800000,
	mediumaquamarine = 0x66cdaa,
	mediumblue = 0x0000cd,
	mediumorchid = 0xba55d3,
	mediumpurple = 0x9370db,
	mediumseagreen = 0x3cb371,
	mediumslateblue = 0x7b68ee,
	mediumspringgreen = 0x00fa9a,
	mediumturquoise = 0x48d1cc,
	mediumvioletred = 0xc71585,
	midnightblue = 0x191970,
	mintcream = 0xf5fffa,
	mistyrose = 0xffe4e1,
	moccasin = 0xffe4b5,
	navajowhite = 0xffdead,
	navy = 0x000080,
	oldlace = 0xfdf5e6,
	olive = 0x808000,
	olivedrab = 0x6b8e23,
	orange = 0xffa500,
	orangered = 0xff4500,
	orchid = 0xda70d6,
	palegoldenrod = 0xeee8aa,
	palegreen = 0x98fb98,
	paleturquoise = 0xafeeee,
	palevioletred = 0xdb7093,
	papayawhip = 0xffefd5,
	peachpuff = 0xffdab9,
	peru = 0xcd853f,
	pink = 0xffc0cb,
	plum = 0xdda0dd,
	powderblue = 0xb0e0e6,
	purple = 0x800080,
	rebeccapurple = 0x663399,
	red = 0xff0000,
	rosybrown = 0xbc8f8f,
	royalblue = 0x4169e1,
	saddlebrown = 0x8b4513,
	salmon = 0xfa8072,
	sandybrown = 0xf4a460,
	seagreen = 0x2e8b57,
	seashell = 0xfff5ee,
	sienna = 0xa0522d,
	silver = 0xc0c0c0,
	skyblue = 0x87ceeb,
	slateblue = 0x6a5acd,
	slategray = 0x708090,
	slategrey = 0x708090,
	snow = 0xfffafa,
	springgreen = 0x00ff7f,
	steelblue = 0x4682b4,
	tan = 0xd2b48c,
	teal = 0x008080,
	thistle = 0xd8bfd8,
	tomato = 0xff6347,
	turquoise = 0x40e0d0,
	violet = 0xee82ee,
	wheat = 0xf5deb3,
	white = 0xffffff,
	whitesmoke = 0xf5f5f5,
	yellow = 0xffff00,
	yellowgreen = 0x9acd32
}

const reI = "\\s*([+-]?\\d+)\\s*"
const reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*"
const reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*"
const reHex3 = /^#([0-9a-f]{3})$/
const reHex6 = /^#([0-9a-f]{6})$/
const reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$")
const reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$")
const reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$")
const reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$")
const reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$")
const reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$")

export class Color {
	static fromHex(hex: string): Color {
		return Color.Format.CSS.parseHex(hex) || Color.red;
	}

	readonly rgba: RGBA;
	private _hsla: HSLA;
	get hsla(): HSLA {
		if (this._hsla) {
			return this._hsla;
		} else {
			return HSLA.fromRGBA(this.rgba);
		}
	}

	private _hsva: HSVA;
	get hsva(): HSVA {
		if (this._hsva) {
			return this._hsva;
		}
		return HSVA.fromRGBA(this.rgba);
	}

	constructor(arg: RGBA | HSLA | HSVA) {
		if (!arg) {
			throw new Error('Color needs a value');
		} else if (arg instanceof RGBA) {
			this.rgba = arg;
		} else if (arg instanceof HSLA) {
			this._hsla = arg;
			this.rgba = HSLA.toRGBA(arg);
		} else if (arg instanceof HSVA) {
			this._hsva = arg;
			this.rgba = HSVA.toRGBA(arg);
		} else {
			throw new Error('Invalid color ctor argument');
		}
	}

	equals(other: Color): boolean {
		return !!other && RGBA.equals(this.rgba, other.rgba) && HSLA.equals(this.hsla, other.hsla) && HSVA.equals(this.hsva, other.hsva);
	}

	/**
	 * http://www.w3.org/TR/WCAG20/#relativeluminancedef
	 * Returns the number in the set [0, 1]. O => Darkest Black. 1 => Lightest white.
	 */
	getRelativeLuminance(): number {
		const R = Color._relativeLuminanceForComponent(this.rgba.r);
		const G = Color._relativeLuminanceForComponent(this.rgba.g);
		const B = Color._relativeLuminanceForComponent(this.rgba.b);
		const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;

		return roundFloat(luminance, 4);
	}

	private static _relativeLuminanceForComponent(color: number): number {
		const c = color / 255;
		return (c <= 0.03928) ? c / 12.92 : Math.pow(((c + 0.055) / 1.055), 2.4);
	}

	/**
	 * http://www.w3.org/TR/WCAG20/#contrast-ratiodef
	 * Returns the contrast ration number in the set [1, 21].
	 */
	getContrastRatio(another: Color): number {
		const lum1 = this.getRelativeLuminance();
		const lum2 = another.getRelativeLuminance();
		return lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
	}

	/**
	 *    http://24ways.org/2010/calculating-color-contrast
	 *  Return 'true' if darker color otherwise 'false'
	 */
	isDarker(): boolean {
		const yiq = (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1000;
		return yiq < 128;
	}

	/**
	 *    http://24ways.org/2010/calculating-color-contrast
	 *  Return 'true' if lighter color otherwise 'false'
	 */
	isLighter(): boolean {
		const yiq = (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1000;
		return yiq >= 128;
	}

	isLighterThan(another: Color): boolean {
		const lum1 = this.getRelativeLuminance();
		const lum2 = another.getRelativeLuminance();
		return lum1 > lum2;
	}

	isDarkerThan(another: Color): boolean {
		const lum1 = this.getRelativeLuminance();
		const lum2 = another.getRelativeLuminance();
		return lum1 < lum2;
	}

	lighten(factor: number): Color {
		return new Color(new HSLA(this.hsla.h, this.hsla.s, this.hsla.l + this.hsla.l * factor, this.hsla.a));
	}

	darken(factor: number): Color {
		return new Color(new HSLA(this.hsla.h, this.hsla.s, this.hsla.l - this.hsla.l * factor, this.hsla.a));
	}

	transparent(factor: number): Color {
		const {r, g, b, a} = this.rgba;
		return new Color(new RGBA(r, g, b, a * factor));
	}

	isTransparent(): boolean {
		return this.rgba.a === 0;
	}

	isOpaque(): boolean {
		return this.rgba.a === 1;
	}

	opposite(): Color {
		return new Color(new RGBA(255 - this.rgba.r, 255 - this.rgba.g, 255 - this.rgba.b, this.rgba.a));
	}

	blend(c: Color): Color {
		const rgba = c.rgba;

		// Convert to 0..1 opacity
		const thisA = this.rgba.a;
		const colorA = rgba.a;

		let a = thisA + colorA * (1 - thisA);
		if (a < 1.0e-6) {
			return Color.transparent;
		}

		const r = this.rgba.r * thisA / a + rgba.r * colorA * (1 - thisA) / a;
		const g = this.rgba.g * thisA / a + rgba.g * colorA * (1 - thisA) / a;
		const b = this.rgba.b * thisA / a + rgba.b * colorA * (1 - thisA) / a;

		return new Color(new RGBA(r, g, b, a));
	}

	toString(): string {
		return Color.Format.CSS.format(this);
	}

	static getLighterColor(of: Color, relative: Color, factor?: number): Color {
		if (of.isLighterThan(relative)) {
			return of;
		}
		factor = factor ? factor : 0.5;
		const lum1 = of.getRelativeLuminance();
		const lum2 = relative.getRelativeLuminance();
		factor = factor * (lum2 - lum1) / lum2;
		return of.lighten(factor);
	}

	static getDarkerColor(of: Color, relative: Color, factor?: number): Color {
		if (of.isDarkerThan(relative)) {
			return of;
		}
		factor = factor ? factor : 0.5;
		const lum1 = of.getRelativeLuminance();
		const lum2 = relative.getRelativeLuminance();
		factor = factor * (lum1 - lum2) / lum1;
		return of.darken(factor);
	}

	static readonly white = new Color(new RGBA(255, 255, 255, 1));
	static readonly black = new Color(new RGBA(0, 0, 0, 1));
	static readonly red = new Color(new RGBA(255, 0, 0, 1));
	static readonly blue = new Color(new RGBA(0, 0, 255, 1));
	static readonly green = new Color(new RGBA(0, 255, 0, 1));
	static readonly cyan = new Color(new RGBA(0, 255, 255, 1));
	static readonly lightgrey = new Color(new RGBA(211, 211, 211, 1));
	static readonly transparent = new Color(new RGBA(0, 0, 0, 0));
}

function rgbn(n) {
	return new RGBA(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
	if (a <= 0) r = g = b = NaN;
	return new RGBA(r, g, b, a);
}

function hsla(h, s, l, a) {
	if (a <= 0) h = s = l = NaN;
	else if (l <= 0 || l >= 1) h = s = NaN;
	else if (s <= 0) h = NaN;
	return new HSLA(h, s, l, a);
}

export namespace Color {
	export namespace Format {
		export namespace CSS {

			export function formatRGB(color: Color): string {
				if (color.rgba.a === 1) {
					return `rgb(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b})`;
				}

				return Color.Format.CSS.formatRGBA(color);
			}

			export function formatRGBA(color: Color): string {
				return `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${+(color.rgba.a).toFixed(2)})`;
			}

			export function formatHSL(color: Color): string {
				if (color.hsla.a === 1) {
					return `hsl(${color.hsla.h}, ${(color.hsla.s * 100).toFixed(2)}%, ${(color.hsla.l * 100).toFixed(2)}%)`;
				}

				return Color.Format.CSS.formatHSLA(color);
			}

			export function formatHSLA(color: Color): string {
				return `hsla(${color.hsla.h}, ${(color.hsla.s * 100).toFixed(2)}%, ${(color.hsla.l * 100).toFixed(2)}%, ${color.hsla.a.toFixed(2)})`;
			}

			function _toTwoDigitHex(n: number): string {
				const r = n.toString(16);
				return r.length !== 2 ? '0' + r : r;
			}

			/**
			 * Formats the color as #RRGGBB
			 */
			export function formatHex(color: Color): string {
				return `#${_toTwoDigitHex(color.rgba.r)}${_toTwoDigitHex(color.rgba.g)}${_toTwoDigitHex(color.rgba.b)}`;
			}

			/**
			 * Formats the color as #RRGGBBAA
			 * If 'compact' is set, colors without transparancy will be printed as #RRGGBB
			 */
			export function formatHexA(color: Color, compact = false): string {
				if (compact && color.rgba.a === 1) {
					return Color.Format.CSS.formatHex(color);
				}

				return `#${_toTwoDigitHex(color.rgba.r)}${_toTwoDigitHex(color.rgba.g)}${_toTwoDigitHex(color.rgba.b)}${_toTwoDigitHex(Math.round(color.rgba.a * 255))}`;
			}

			/**
			 * The default format will use HEX if opaque and RGBA otherwise.
			 */
			export function format(color: Color): string | null {
				if (!color) {
					return null;
				}

				if (color.isOpaque()) {
					return Color.Format.CSS.formatHex(color);
				}

				return Color.Format.CSS.formatRGBA(color);
			}

			/**
			 * Converts an Hex color value to a Color.
			 * returns r, g, and b are contained in the set [0, 255]
			 * @param hex string (#RGB, #RGBA, #RRGGBB or #RRGGBBAA).
			 */
			export function parseHex(hex: string): Color | null {
				if (!hex) {
					// Invalid color
					return null;
				}

				const length = hex.length;

				if (length === 0) {
					// Invalid color
					return null;
				}

				if (hex.charCodeAt(0) !== CharCode.Hash) {
					// Does not begin with a #
					return null;
				}

				if (length === 7) {
					// #RRGGBB format
					const r = 16 * _parseHexDigit(hex.charCodeAt(1)) + _parseHexDigit(hex.charCodeAt(2));
					const g = 16 * _parseHexDigit(hex.charCodeAt(3)) + _parseHexDigit(hex.charCodeAt(4));
					const b = 16 * _parseHexDigit(hex.charCodeAt(5)) + _parseHexDigit(hex.charCodeAt(6));
					return new Color(new RGBA(r, g, b, 1));
				}

				if (length === 9) {
					// #RRGGBBAA format
					const r = 16 * _parseHexDigit(hex.charCodeAt(1)) + _parseHexDigit(hex.charCodeAt(2));
					const g = 16 * _parseHexDigit(hex.charCodeAt(3)) + _parseHexDigit(hex.charCodeAt(4));
					const b = 16 * _parseHexDigit(hex.charCodeAt(5)) + _parseHexDigit(hex.charCodeAt(6));
					const a = 16 * _parseHexDigit(hex.charCodeAt(7)) + _parseHexDigit(hex.charCodeAt(8));
					return new Color(new RGBA(r, g, b, a / 255));
				}

				if (length === 4) {
					// #RGB format
					const r = _parseHexDigit(hex.charCodeAt(1));
					const g = _parseHexDigit(hex.charCodeAt(2));
					const b = _parseHexDigit(hex.charCodeAt(3));
					return new Color(new RGBA(16 * r + r, 16 * g + g, 16 * b + b));
				}

				if (length === 5) {
					// #RGBA format
					const r = _parseHexDigit(hex.charCodeAt(1));
					const g = _parseHexDigit(hex.charCodeAt(2));
					const b = _parseHexDigit(hex.charCodeAt(3));
					const a = _parseHexDigit(hex.charCodeAt(4));
					return new Color(new RGBA(16 * r + r, 16 * g + g, 16 * b + b, (16 * a + a) / 255));
				}

				// Invalid color
				return null;
			}

			export function parse(fmt: string): Color | null {
				let m
				let format = (fmt + "").trim().toLowerCase();
				(m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new RGBA((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
					: (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
					: (m = reRgbInteger.exec(format)) ? new RGBA(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
						: (m = reRgbPercent.exec(format)) ? new RGBA(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
							: (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
								: (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
									: (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
										: (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
											: NamedColor.hasOwnProperty(format) ? rgbn(NamedColor[format])
												: format === "transparent" ? new RGBA(NaN, NaN, NaN, 0)
													: null;

				return m ? new Color(m) : null
			}

			function _parseHexDigit(charCode: CharCode): number {
				switch (charCode) {
					case CharCode.Digit0:
						return 0;
					case CharCode.Digit1:
						return 1;
					case CharCode.Digit2:
						return 2;
					case CharCode.Digit3:
						return 3;
					case CharCode.Digit4:
						return 4;
					case CharCode.Digit5:
						return 5;
					case CharCode.Digit6:
						return 6;
					case CharCode.Digit7:
						return 7;
					case CharCode.Digit8:
						return 8;
					case CharCode.Digit9:
						return 9;
					case CharCode.a:
						return 10;
					case CharCode.A:
						return 10;
					case CharCode.b:
						return 11;
					case CharCode.B:
						return 11;
					case CharCode.c:
						return 12;
					case CharCode.C:
						return 12;
					case CharCode.d:
						return 13;
					case CharCode.D:
						return 13;
					case CharCode.e:
						return 14;
					case CharCode.E:
						return 14;
					case CharCode.f:
						return 15;
					case CharCode.F:
						return 15;
				}
				return 0;
			}
		}
	}
}