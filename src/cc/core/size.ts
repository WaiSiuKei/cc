import {IBaseSize, ISize} from "./def";
import {isZero} from "../../base/common/numerical";

export class Size implements ISize {
    private _width: number;
    private _height: number;

    constructor(size: IBaseSize) {
        this._width = size.width
        this._height = size.height
    }

    get width() {return this._width}
    get height() {return this._height}

    equals(size: IBaseSize): boolean {return Size.equals(this, size)}
    clone() {return new Size({width: this._width, height: this._height})}

    isZero() {return Size.isZero(this)}
    isNaN() {return Size.isNaN(this)}

    round() {return new Size(Size.round(this))}
    ceil() { return new Size(Size.ceil(this))}
    floor() { return new Size(Size.floor(this))}
    abs() { return new Size(Size.abs(this))}

    static equals(s1: IBaseSize, size: IBaseSize): boolean {
        return s1 === size || (s1.width === size.width && s1.height === size.height)
    }

    static isZero(size: IBaseSize): boolean {
        return isZero(size.width) && isZero(size.height);
    }

    static isNaN(size: IBaseSize): boolean {
        return isNaN(size.width) || isNaN(size.height);
    }

    static round(size: IBaseSize): IBaseSize {
        return {width: Math.round(size.width), height: Math.round(size.height)}
    }
    static ceil(size: IBaseSize): IBaseSize {
        return {width: Math.ceil(size.width), height: Math.ceil(size.height)}
    }
    static floor(size: IBaseSize): IBaseSize {
        return {width: Math.floor(size.width), height: Math.floor(size.height)}
    }
    static abs(size: IBaseSize): IBaseSize {
        return {width: Math.abs(size.width), height: Math.abs(size.height)}
    }
}