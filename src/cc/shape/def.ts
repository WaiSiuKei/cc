export interface IArc {
    centroid(...args): void

    innerRadius(): number
    innerRadius(radius: number): IArc

    outerRadius(): number
    outerRadius(radius: number): IArc

    cornerRadius(): number
    cornerRadius(radius: number): IArc

    startAngle(): number
    startAngle(angle: number): IArc

    endAngle(): number
    endAngle(angle: number): IArc

    padAngle(): number
    padAngle(angle: number): IArc

    padRadius(): number
    padRadius(radius: number): IArc
}

export interface IPie {
    value(): any
    value(value: any): IPie

    sort(): null | Function
    sort(compare: null | Function): IPie

    sortValues(): Function
    sortValues(compare: Function): IPie

    startAngle(): number
    startAngle(angle: number): IPie

    endAngle(): number
    endAngle(angle: number): IPie

    padAngle(): number
    padAngle(angle: number): IPie
}

export interface ILine {
    x(): Function
    x(x: number | Function): Function

    y(): Function
    y(x: number | Function): Function

    defined(): Function
    defined(def: boolean | Function): ILine

    curve(): Function
    curve(func: Function): ILine
}

export interface IArea {
    x(): Function
    x(x: number | Function): IArea

    x0(): Function
    x0(x: number | Function): IArea

    x1(): Function
    x1(x: number | Function): IArea

    y(): Function
    y(y: number | Function): IArea

    y0(): Function
    y0(y: number | Function): IArea

    y1(): Function
    y1(y: number | Function): IArea

    defined(): Function
    defined(def: boolean | Function): IArea

    curve(): Function
    curve(func: Function): IArea

    lineX0(): Function
    lineY0(): Function

    lineX1(): Function
    lineY1(): Function
}