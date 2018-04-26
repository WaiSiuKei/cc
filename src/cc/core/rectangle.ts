import {IBaseRectangle, IBaseSize, IBaseVector, IRectangle} from "./def";
import {Vector} from "./vector";

export class Rectangle implements IRectangle {
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;

    constructor(rect: IBaseRectangle) {
        this._x = rect.x
        this._y = rect.y
        this._width = rect.width
        this._height = rect.height
    }

    get x() {return this._x}
    get y() {return this._y}
    get width() {return this._width}
    get height() {return this._height}
    get point() { return {x: this._x, y: this._y}}
    get size() { return {width: this._width, height: this._height}}
    get top() {return Rectangle.top(this)}
    get right() {return Rectangle.right(this)}
    get bottom() { return Rectangle.bottom(this)}
    get left() { return Rectangle.left(this)}
    get center() { return Rectangle.center(this)}
    get topLeft() { return Rectangle.topLeft(this)}
    get topRight() { return Rectangle.topRight(this)}
    get bottomLeft() { return Rectangle.bottomLeft(this)}
    get bottomRight() { return Rectangle.bottomRight(this)}
    get leftCenter() { return Rectangle.leftCenter(this)}
    get rightCenter() { return Rectangle.rightCenter(this)}
    get topCenter() { return Rectangle.topCenter(this)}
    get bottomCenter() { return Rectangle.bottomCenter(this)}
    get area() { return Rectangle.area(this)}

    clone() {return new Rectangle(this)}
    equals(rect: IBaseRectangle): boolean {return Rectangle.equals(this, rect)}
    contains(v: IBaseVector)
    contains(r: IBaseRectangle)
    contains(arg) {
        return Rectangle.contains(this, arg)
    }
    intersects(rect: IBaseRectangle, eplison) {return Rectangle.intersects(this, rect, eplison)}

    intersect(rect: IBaseRectangle): IRectangle {return new Rectangle(Rectangle.intersect(this, rect))}
    unite(rect: IBaseRectangle): IRectangle {return new Rectangle(Rectangle.unite(this, rect))}
    include(point: IBaseVector): IRectangle {return new Rectangle(Rectangle.include(this, point))}
    expand(size: IBaseSize): IRectangle { return new Rectangle(Rectangle.expand(this, size))}
    scale(size: IBaseSize): IRectangle { return new Rectangle(Rectangle.scale(this, size))}

    static top(rect: IBaseRectangle): number {return rect.y}
    static right(rect: IBaseRectangle): number {return rect.x + rect.width}
    static bottom(rect: IBaseRectangle): number {return rect.y + rect.height}
    static left(rect: IBaseRectangle): number {return rect.x}
    static center(rect: IBaseRectangle): IBaseVector {return {x: rect.x + rect.width / 2, y: rect.y + rect.height / 2}}
    static topLeft(rect: IBaseRectangle): IBaseVector {return {y: rect.y, x: rect.x}}
    static topRight(rect: IBaseRectangle): IBaseVector {return {x: rect.x + rect.width, y: rect.y}}
    static bottomLeft(rect: IBaseRectangle): IBaseVector {return {x: rect.x, y: rect.y + rect.height}}
    static bottomRight(rect: IBaseRectangle): IBaseVector {return {x: rect.x + rect.width, y: rect.y + rect.height}}
    static leftCenter(rect: IBaseRectangle): IBaseVector {return {x: rect.x, y: rect.y + rect.height / 2}}
    static rightCenter(rect: IBaseRectangle): IBaseVector {return {x: rect.x + rect.width, y: rect.y + rect.height / 2}}
    static topCenter(rect: IBaseRectangle): IBaseVector {return {x: rect.x + rect.width / 2, y: rect.y}}
    static bottomCenter(rect: IBaseRectangle): IBaseVector {return {x: rect.x + rect.width / 2, y: rect.y + rect.height}}
    static area(rect: IBaseRectangle): number {return rect.width * rect.height}

    static equals(rt1: IBaseRectangle, rt2: IBaseRectangle): boolean {
        return rt1 === rt2 || (rt1.x === rt2.x && rt1.y === rt2.y && rt1.width === rt2.width && rt1.height === rt2.height);
    }
    static contains(rect: IBaseRectangle, v: IBaseVector): boolean
    static contains(rect: IBaseRectangle, r: IBaseRectangle): boolean
    static contains(rect: IBaseRectangle, arg): boolean {
        const {x, y, width = 0, height = 0} = arg
        return x >= rect.x && y >= rect.y
            && x + width <= rect.x + rect.width
            && y + height <= rect.y + rect.height;
    }
    static intersects(rect1: IBaseRectangle, rect2: IBaseRectangle, epsilon = 0): boolean {
        return rect2.x + rect2.width > rect1.x - epsilon
            && rect2.y + rect2.height > rect1.y - epsilon
            && rect2.x < rect1.x + rect1.width + epsilon
            && rect2.y < rect1.y + rect1.height + epsilon;
    }

    static intersect(rect1: IBaseRectangle, rect2: IBaseRectangle): IBaseRectangle {
        let x1 = Math.max(rect1.x, rect2.x),
            y1 = Math.max(rect1.y, rect2.y),
            x2 = Math.min(rect1.x + rect1.width, rect2.x + rect2.width),
            y2 = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);

        return {x: x1, y: y1, width: x2 - x1, height: y2 - y1}
    }
    static unite(...rects: IBaseRectangle[]): IBaseRectangle {
        let points = []
        rects.forEach(rect => {
            points.push(Rectangle.topLeft(rect))
            points.push(Rectangle.bottomRight(rect))
        })
        return Rectangle.boundingOf(...points)
    }
    static include(rect: IBaseRectangle, point: IBaseVector): IBaseRectangle {
        let x1 = Math.min(rect.x, point.x),
            y1 = Math.min(rect.y, point.y),
            x2 = Math.max(rect.x + rect.width, point.x),
            y2 = Math.max(rect.y + rect.height, point.y);
        return {x: x1, y: y1, width: x2 - x1, height: y2 - y1}
    }
    static expand(rect: IBaseRectangle, size: IBaseSize): IBaseRectangle {
        const {width: hor, height: ver} = size
        return {x: rect.x - hor / 2, y: rect.y - ver / 2, width: rect.width + hor, height: rect.height + ver}
    }
    static scale(rect: IBaseRectangle, size: IBaseSize): IBaseRectangle {
        const {width: hor, height: ver} = size
        return Rectangle.expand(rect, {width: rect.width * hor - rect.width, height: rect.height * ver - rect.height})
    }

    static boundingOf(...args: IBaseVector[]): IBaseRectangle {
        let min = Vector.min(...args)
        let max = Vector.max(...args)
        return {
            x: min.x,
            y: min.y,
            width: max.x - min.x,
            height: max.y - min.y
        }
    }
}