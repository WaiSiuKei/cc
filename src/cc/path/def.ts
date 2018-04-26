import {IBaseRectangle, IBaseVector} from "../core/def";
import {IElement} from "../dom/def";

export interface IPathSegment extends IElement {
	renderAsPath(ctx: CanvasRenderingContext2D): void
}

export interface IPath extends IElement {
	segment: IPathSegment[]
}

export interface IBaseArc {
	cx: number
	cy: number
	radius: number
	startAngle: number
	endAngle: number
	anticlockwise: boolean
}

export interface IArc extends IBaseArc, IElement, IPathSegment {
}

export interface IBaseCircle {
	cx: number
	cy: number
	radius: number
}

export interface ICircle extends IBaseCircle, IElement {
}

export interface IBaseEllipse {
	cx: number
	cy: number
	r1: number, // major
	r2: number, // minor
}

export interface IEllipse extends IBaseEllipse, IElement {
}

export interface IBaseLineShape {
	x1: number
	y1: number
	x2: number
	y2: number
}

export interface ILine extends IBaseLineShape, IElement, IPathSegment {

}

export interface IPolyline extends IElement, IPathSegment {
	points: IBaseVector[]
}

export interface IRect extends IBaseRectangle, IElement {
}

export interface IBaseCubicCurve {
	x1: number
	y1: number
	x2: number
	y2: number
	cpx1: number
	cpy1: number
	cpx2: number
	cpy2: number
}

export interface ICubicCurve extends IBaseCubicCurve, IElement, IPathSegment {
}

export interface IBaseQuadraticCurve {
	x1: number
	y1: number
	x2: number
	y2: number
	cpx: number
	cpy: number
}

export interface IQuadraticCurve extends IBaseQuadraticCurve, IElement, IPathSegment {
}

export interface IBaseTriangle {
	x1: number
	y1: number
	x2: number
	y2: number
	x3: number
	y3: number
}

export interface ITriangle extends IBaseTriangle, IElement {
}