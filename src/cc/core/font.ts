import {absoluteFontSize, fontStyle, fontVariant, fontWeight, IFont, relativeFontSize} from './def';

export class Font implements IFont {
	_font: string
	_family?: string
	// _size?: absoluteFontSize | relativeFontSize | number | string
	_size?: number
	_style?: fontStyle
	_variant?: fontVariant
	_weight?: fontWeight
	_height?: 'normal' | number | string
	merics: TextMetric

	constructor(font: string)
	constructor(font: IFont)
	constructor(arg: any) {
		if (typeof arg === 'string') {
			this._font = arg
			this._disassembleFont()
		} else {
			let font: IFont = arg
			this._family = font.family || 'sans-serif'
			this._size = font.size
			this._style = font.style
			this._variant = font.variant
			this._weight = font.weight
			this._height = font.height
			this._assembleFont()
		}
	}

	get font() {
		return this._font
	}

	set font(val) {
		this._font = val
		this._disassembleFont()
		this.merics = getTextMetrics(this._font, this._height)
	}

	get family() {
		return this._family
	}

	set family(val) {
		this._family = val
		this._assembleFont()
	}

	get size() {
		return this._size
	}

	set size(val) {
		this._size = val
		this._assembleFont()
	}

	get variant() {
		return this._variant
	}

	set variant(val) {
		this._variant = val
		this._assembleFont()
	}

	get weight() {
		return this._weight
	}

	set weight(val) {
		this._weight = val
		this._assembleFont()
	}

	get height() {
		return this._height
	}

	set height(val) {
		this._height = val
		this._assembleFont()
	}

	private _assembleFont() {
		this._font = `${this._style || ''} ${this._variant || ''} ${this._weight || ''} ${this._size + 'px'} ${this._height ? '/' : ''} ${this._height || ''} ${this._family}`
		this.merics = getTextMetrics(this._font, this._height)
	}

	private _disassembleFont() {
		let font = cssFontParser(this._font)
		this._family = font['font-family'].join(', ') || ''
		// this._size = font['font-size'] || '100%'
		this._style = font['font-style'] || 'normal'
		this._variant = font['font-variant'] || 'normal'
		this._weight = font['font-weight'] || 'normal'
		this._height = font['line-height'] || 'normal'
	}
}

/**
 * @enum {number}
 */
var states = {
	VARIATION: 1,
	LINE_HEIGHT: 2,
	FONT_FAMILY: 3,
	BEFORE_FONT_FAMILY: 4
};

/**
 * Attempt to parse a string as an identifier. Return
 * a normalized identifier, or null when the string
 * contains an invalid identifier.
 *
 * @param {string} str
 * @return {string|null}
 */
function parseIdentifier(str) {
	var identifiers = str.replace(/^\s+|\s+$/, '').replace(/\s+/g, ' ').split(' ');

	for (var i = 0; i < identifiers.length; i += 1) {
		if (/^(-?\d|--)/.test(identifiers[i]) ||
			!/^([_a-zA-Z0-9-]|[^\0-\237]|(\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f]))+$/.test(identifiers[i])) {
			return null;
		}
	}
	return identifiers.join(' ');
}

/**
 * @param {string} input
 * @return {Object|null}
 */
export interface CSSFont {
	'font-family'?: string[],
	'font-size'?: string,
	'font-style'?: fontStyle
	'font-variant'?: fontVariant
	'font-weight'?: fontWeight
	'line-height'?: string
}

function cssFontParser(input): CSSFont {
	let state = states.VARIATION,
		buffer = '',
		result = {
			'font-family': []
		};

	for (let c, i = 0; c = input.charAt(i); i += 1) {
		if (state === states.BEFORE_FONT_FAMILY && (c === '"' || c === '\'')) {
			let index = i + 1;

			// consume the entire string
			do {
				index = input.indexOf(c, index) + 1;
				if (!index) {
					// If a string is not closed by a ' or " return null.
					return null;
				}
			} while (input.charAt(index - 2) === '\\');

			result['font-family'].push(input.slice(i, index));

			i = index - 1;
			state = states.FONT_FAMILY;
			buffer = '';
		} else if (state === states.FONT_FAMILY && c === ',') {
			state = states.BEFORE_FONT_FAMILY;
			buffer = '';
		} else if (state === states.BEFORE_FONT_FAMILY && c === ',') {
			var identifier = parseIdentifier(buffer);

			if (identifier) {
				result['font-family'].push(identifier);
			}
			buffer = '';
		} else if (state === states.VARIATION && (c === ' ' || c === '/')) {
			if (/^((xx|x)-large|(xx|s)-small|small|large|medium)$/.test(buffer) ||
				/^(larg|small)er$/.test(buffer) ||
				/^(\+|-)?([0-9]*\.)?[0-9]+(em|ex|ch|rem|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc|%)$/.test(buffer)) {
				state = c === '/' ? states.LINE_HEIGHT : states.BEFORE_FONT_FAMILY;
				result['font-size'] = buffer;
			} else if (/^(italic|oblique)$/.test(buffer)) {
				result['font-style'] = buffer;
			} else if (/^small-caps$/.test(buffer)) {
				result['font-variant'] = buffer;
			} else if (/^(bold(er)?|lighter|[1-9]00)$/.test(buffer)) {
				result['font-weight'] = buffer;
			} else if (/^((ultra|extra|semi)-)?(condensed|expanded)$/.test(buffer)) {
				result['font-stretch'] = buffer;
			}
			buffer = '';
		} else if (state === states.LINE_HEIGHT && c === ' ') {
			if (/^(\+|-)?([0-9]*\.)?[0-9]+(em|ex|ch|rem|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc|%)?$/.test(buffer)) {
				result['line-height'] = buffer;
			}
			state = states.BEFORE_FONT_FAMILY;
			buffer = '';
		} else {
			buffer += c;
		}
	}

	// This is for the case where a string was specified followed by
	// an identifier, but without a separating comma.
	if (state === states.FONT_FAMILY && !/^\s*$/.test(buffer)) {
		return null;
	}

	if (state === states.BEFORE_FONT_FAMILY) {
		let identifier = parseIdentifier(buffer);

		if (identifier) {
			result['font-family'].push(identifier);
		}
	}

	if (result['font-size'] && result['font-family'].length) {
		return result;
	} else {
		return null;
	}
}

export interface TextMetric {
	height: number
	ascent: number
	descent: number
}

function getTextMetrics(font: string, lineHeight: string | number): TextMetric {
	let text = document.createElement('span');
	text.innerText = 'Hg';
	text.style.fontFamily = font;
	text.style.fontSize = parseInt(font) + 'px';
	text.style.lineHeight = lineHeight + '';

	let block = document.createElement('div');
	block.style.display = 'inline-block';
	block.style.width = '1px';
	block.style.height = '1px';

	let div = document.createElement('div');
	div.appendChild(text);
	div.appendChild(block);

	document.body.appendChild(div);

	let result: TextMetric = Object.create(null);
	try {
		block.style.verticalAlign = 'baseline';
		result.ascent = block.offsetTop - text.offsetTop;

		block.style.verticalAlign = 'bottom';
		result.height = block.offsetTop - text.offsetTop;

		result.descent = result.height - result.ascent;
	} finally {
		document.body.removeChild(div)
	}

	return result;
}
