import {FillRule, INode, IShape, StrokeCap, StrokeJoin} from "./def";
import {Node} from './node'
import {Color} from "../core/color";
import {IBaseMatrix, IBaseRectangle, IBaseVector, IMatrix} from "../core/def";
import {generateUuid} from "../../base/common/uuid";
import {Matrix} from "../core/matrix";

import {Layer} from "./layer";

function proxySiblingEffect(constructor: any): any {
  let siblingMutationKey = [
    'insertAbove',
    'insertBelow',
    'replaceWith',
    'sendToBack',
    'bringToFront',
    'addTo',
    'remove',
  ]

  for (let i = 0; i < siblingMutationKey.length; i++) {
    let key = siblingMutationKey[i]
    let fn = constructor.prototype[key]

    let definingProperty = false;
    Object.defineProperty(constructor.prototype, key, {
      configurable: true,
      get() {
        if (definingProperty || this === constructor.prototype || this.hasOwnProperty(key) || typeof fn !== 'function') return fn;
        let boundFn = fn.bind(this)
        let proxyFn = (...args) => {
          boundFn(...args)
          let parent = this.parent as INode
          while (parent) {
            if (parent instanceof Layer) {
              (<Layer>parent).refresh()
              break
            }
            parent = parent.parent
          }
        }
        definingProperty = true;
        Object.defineProperty(this, key, {
          configurable: true,
          get() {
            return proxyFn;
          },
        });
        definingProperty = false;
        return proxyFn;
      }
    });
  }

  return constructor;
}

@proxySiblingEffect
export class Shape extends Node implements IShape {
  isVisible: boolean = true
  reactive: boolean = true
  opacity: number = 1
  isLocked: boolean = false
  id: string

  // Stroke
  strokeColor: Color = Color.black
  strokeWidth: number = 0.5
  strokeCap: StrokeCap = StrokeCap.Butt
  strokeJoin: StrokeJoin = StrokeJoin.Miter
  dashOffset: number = 0
  strokeScaling: boolean = false
  dashArray: number[] = []
  miterLimit: number = 0
  // Fill
  fillColor: Color
  fillRule: FillRule = FillRule.evenodd
  // Shadow
  // shadowColor: Color = Color.lightgrey
  // shadowBlur: number = 0
  // shadowOffset: IBaseVector = null
  // Props
  isHovered: boolean = false
  isSelected: boolean = false
  hitRange: number = 6 // px
  // Position and Bounding Boxes
  bounds: IBaseRectangle
  matrix: IBaseMatrix
  // stageMatrix: IBaseMatrix
  // layerMatrix: IBaseMatrix

  constructor(parent) {
    super(parent)

    this.id = generateUuid()
    this.matrix = new Matrix()
  }

  translate(delta: IBaseVector): void {
    this.matrix = Matrix.translate(this.matrix, delta)
  }

  rotate(angle: number, center: IBaseVector): void {
    this.matrix = Matrix.rotate(this.matrix, angle, center)
  }

  scale(scale: IBaseVector, center: IBaseVector): void {
    this.matrix = Matrix.scale(this.matrix, scale, center)
  }
  shear(shear: IBaseVector, center: IBaseVector): void {
    this.matrix = Matrix.shear(this.matrix, shear, center)
  }
  skew(skew: IBaseVector, center: IBaseVector): void {
    this.matrix = Matrix.skew(this.matrix, skew, center)
  }

  render(ctx): void {

  }
}
