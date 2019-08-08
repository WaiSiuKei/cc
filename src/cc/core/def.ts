export interface IStringifyable {
	toString(): string;
}

export interface ISerializable {
	exportJSON(options?: any): string
	importJSON(json: Object | string): void
}

export interface IBase {
}

export interface IBaseMatrix {
	a: number;
	b: number;
	c: number;
	d: number;
	tx: number;
	ty: number;
}

export interface IMatrixDecomposition {
	translation: IBaseVector;
	rotation: number;
	scaling: IBaseVector;
	skewing: IBaseVector;
}

export interface IMatrix extends IBase, IBaseMatrix, IMatrixDecomposition {
	values: number[];

	clone(): IMatrix;
	equals(mat: IMatrix): boolean;
	reset(): void;

	translate(vec: IBaseVector): IMatrix;
	scale(factor: IBaseVector, center: IBaseVector): IMatrix;
	rotate(angle: number, center: IBaseVector): IMatrix;
	shear(factor: IBaseVector, center: IBaseVector): IMatrix;
	skew(factor: IBaseVector, center: IBaseVector): IMatrix;

	append(mx: IBaseMatrix): IMatrix;
	prepend(mx: IBaseMatrix): IMatrix;
	invert(): IMatrix;

	appended(mx: IBaseMatrix): IMatrix;
	prepended(mx: IBaseMatrix): IMatrix;
	inverted(): IMatrix;

	isIdentity(): boolean;
	isInvertible(): boolean;
	isSingular(): boolean;
	decompose(): IMatrixDecomposition;
}

export interface IBaseVector {
	x: number;
	y: number;
}

export interface IPolarCoordVector {
	width: number;
	angle: number;
}

export interface IVector extends IBaseVector, IBase {
	length: number;
	angle: number;
	radian: number;
	quadrant: number;

	equals(vt: IBaseVector): boolean;
	clone(): IBaseVector;
	toString(): string;

	directedAngleTo(another: IBaseVector): number;
	distanceTo(another: IBaseVector, squared: boolean): number;
	normalize(len: number): IBaseVector;
	rotate(angle: number, center: IBaseVector): IBaseVector;
	transform(mx: IMatrix): IBaseVector;
	add(another: IBaseVector): IBaseVector;
	subtract(another: IBaseVector): IBaseVector;
	multiply(another: IBaseVector): IBaseVector;
	divide(another: IBaseVector): IBaseVector;
	modulo(another: IBaseVector): IBaseVector;
	negate(): IBaseVector
	dot(vt: IBaseVector): number;
	cross(vt: IBaseVector): number;
	project(vt: IBaseVector): IBaseVector;
	round(): IBaseVector;
	ceil(): IBaseVector;
	floor(): IBaseVector;
	abs(): IBaseVector;

	isClose(another: IBaseVector, tolerance?: number): boolean;
	isCollinear(another: IBaseVector): boolean;
	isOrthogonal(another: IBaseVector): boolean;
	isZero(): boolean;
	isNaN(): boolean;
	isInQuadrant(quad: number): boolean;
}

export interface IBaseLine {
	px: number;
	py: number;
	vx: number;
	vy: number;
}

export interface ILine extends IBaseLine {
	length: number;
	point: IBaseVector;
	vector: IBaseVector;

	intersect(l: ILine, isInfinite): IBaseVector;
	getSide(point, isInfinite): number;
	distanceTo(pt: IBaseVector): number;
	signedDistanceTo(pt: IBaseVector): number;
	isCollinear(l: ILine): boolean;
	isOrthogonal(l: ILine): boolean;
	toTwoPoint(): IBaseVector[];
}

export interface IBaseSize {
	width: number;
	height: number;
}

export interface ISize extends IBaseSize, IBase {
	clone(): ISize;
	equals(size: IBaseSize): boolean;
	isZero(): boolean;
	isNaN(): boolean;
}

export interface IBaseRectangle {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface IRectangle extends IBase, IBaseRectangle {
	point: IBaseVector;
	size: IBaseSize;

	top: number;
	right: number;
	bottom: number;
	left: number;

	center: IBaseVector;
	topLeft: IBaseVector;
	topRight: IBaseVector;
	bottomLeft: IBaseVector;
	bottomRight: IBaseVector;
	leftCenter: IBaseVector;
	topCenter: IBaseVector;
	rightCenter: IBaseVector;
	bottomCenter: IBaseVector;
	area: number;

	clone(): IRectangle;
	equals(rect: IRectangle): boolean;

	contains(point: IBaseVector): boolean
	contains(rect: IRectangle): boolean;
	intersects(rect: IRectangle, epsilon: number): boolean;

	intersect(rect: IRectangle): IRectangle;
	unite(rect: IRectangle): IRectangle;
	include(point: IVector): IRectangle;
	expand(amount: IBaseSize): IRectangle;
	scale(amount: IBaseSize): IRectangle;
}

export type absoluteFontSize = 'xx-small' | 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | 'xx-large'
export type relativeFontSize = 'larger' | 'smaller'
export type fontStyle = 'normal' | 'italic' | 'oblique'
export type fontVariant = 'normal' | 'small-caps'
export type fontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold' | 'bolder' | 'lighter'

export interface IFont {
	family?: string | null
	// size?: absoluteFontSize | relativeFontSize | number | string | null// <absolute-size> | <relative-size> | <length> | <percentage>
	size?: number
	style?: fontStyle | null
	variant?: fontVariant | null
	weight?: fontWeight | null
	height?: 'normal' | number | string | null // normal | <number> | <length> | <percentage>
}