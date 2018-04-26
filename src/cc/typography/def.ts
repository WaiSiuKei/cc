import {IElement} from "../dom/def";

export interface IBaseText {
	value: string
	x: number
	y: number
	font: string
	textAlign: TextAlign
	textBaseline: TextBaseLine
}

export interface Font {
	size: number
	family: string
	weight: number | 'blod' | 'normal'
}

export enum TextAlign {
	Left = 'left',
	Right = 'right',
	Center = 'center',
	Start = 'start',
	End = 'end'
}

export enum TextBaseLine {
	Top = 'top',
	Hanging = 'hanging',
	Middle = 'middle',
	Alphabetic = 'alphabetic',
	Ideographic = 'ideographic',
	Bottom = 'bottom'
}

export interface IText extends IElement, IBaseText {}