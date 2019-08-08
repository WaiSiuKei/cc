import {IElement} from '../dom/def';

export interface IBaseText {
	value: string
	x: number
	y: number
	textAlign?: TextAlign
	textBaseline?: TextBaseLine,
	font?: string;
	fontFamily?: string | null;
	fontSize?: number | null;
	fontStyle?: string | null;
	fontVariant?: string | null;
	fontWeight?: string | null;
	lineHeight?: string | null;
}

export enum TextAlign {
	Left = 'left',
	Right = 'right',
	Center = 'center',
	// Start = 'start',
	// End = 'end'
}

export enum TextBaseLine {
	Top = 'top',
	// Hanging = 'hanging',
	Middle = 'middle',
	Alphabetic = 'alphabetic',
	// Ideographic = 'ideographic',
	Bottom = 'bottom'
}

export interface IText extends IElement, IBaseText {
}