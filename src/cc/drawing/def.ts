import {IElement} from "../dom/def";
import {ICircle} from "../path/def";

export interface IToolShape {
	isDrawing: boolean
	// lollipops: ILollipop[]
}

export interface IOnePointDrawing {
	x: number
	y: number
}

export interface ITwoPointDrawing {
	x1: number
	y1: number
	x2: number
	y2: number
}

export interface ITwoPointDrawing {
	x1: number
	y1: number
	x2: number
	y2: number
}

export interface IThreePointDrawing {
	x1: number
	y1: number
	x2: number
	y2: number
	x3: number
	y3: number
}

export interface IFourPointDrawing {
	x1: number
	y1: number
	x2: number
	y2: number
	x3: number
	y3: number
	x4: number
	y4: number
}

export interface ILollipop extends ICircle {}

export interface ITrendLine extends ITwoPointDrawing, IElement, IToolShape {}

export interface ITrendAngle extends ITwoPointDrawing, IElement, IToolShape {}

export interface IHorizontalLine extends IOnePointDrawing, IElement, IToolShape {}

export interface IHorizontalRay extends IOnePointDrawing, IElement, IToolShape {}

export interface IVerticalLine extends IOnePointDrawing, IElement, IToolShape {}

export interface IArrow extends ITrendLine {}

export interface IRay extends ITrendLine {}

export interface IExtendedLine extends ITrendLine {}

export interface IParallelChannel {

}

export interface IFlatTopBottom {

}

