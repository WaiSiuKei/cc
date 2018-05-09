import {IContainer, INode, IStage, ShapeObject} from './def';
import {Node} from './node'
import {IBaseRectangle, IBaseVector} from '../core/def';
import {Rectangle} from '../core/rectangle';
import {dispose, IDisposable} from '../../base/common/lifecycle';

function proxyChildrenEffect(constructor: any): any {
  let childrenMutationKey = [
    'prependChildren',
    'appendChildren',
    'insertChildren',
    'removeChildren',
    'reverseChildren',
  ]

  for (let i = 0; i < childrenMutationKey.length; i++) {
    let key = childrenMutationKey[i]
    let fn = constructor.prototype[key]

    let definingProperty = false;
    Object.defineProperty(constructor.prototype, key, {
      configurable: true,
      get() {
        if (definingProperty || this === constructor.prototype || this.hasOwnProperty(key) || typeof fn !== 'function') return fn;
        let boundFn = fn.bind(this)
        let proxyFn = (...args) => {
          boundFn(...args)
          this.refresh()
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

@proxyChildrenEffect
export class Layer extends Node implements IContainer, IDisposable {
  public canvasElement: HTMLCanvasElement
  public canvasContext: CanvasRenderingContext2D
  public visible: boolean
  public reactive: boolean
  private _bounds: IBaseRectangle
  protected ratio: number

  private waitingFrame: number

  protected toDispose: IDisposable[]

  constructor(stage: IStage = null) {
    super(stage)
    this.canvasElement = document.createElement('canvas')
    this.canvasElement.style.position = 'absolute'
    this.canvasContext = this.canvasElement.getContext('2d')

    const devicePixelRatio = window.devicePixelRatio || 1
    const backingStoreRatio = (<any>this.canvasContext).webkitBackingStorePixelRatio ||
      (<any>this.canvasContext).mozBackingStorePixelRatio ||
      (<any>this.canvasContext).msBackingStorePixelRatio ||
      (<any>this.canvasContext).oBackingStorePixelRatio ||
      (<any>this.canvasContext).backingStorePixelRatio || 1

    this.ratio = devicePixelRatio / backingStoreRatio;

    if (stage) {
      this.parent.appendChildren(this)
      this.bounds = stage.bounds// TODO: support other layout
    }

    this.visible = true
    this.reactive = true
  }

  get bounds() {
    return this._bounds
  }

  set bounds(val: IBaseRectangle) {
    this._bounds = val
    this.canvasElement.style.top = val.x.toString()
    this.canvasElement.style.left = val.y.toString()
    this.canvasElement.style.width = `${val.width}px`
    this.canvasElement.style.height = `${val.height}px`

    this.canvasElement.width = val.width * this.ratio
    this.canvasElement.height = val.height * this.ratio
    this.canvasContext.scale(this.ratio, this.ratio);
  }

  hitTest(point: IBaseVector): INode {
    if (!this.visible) return null
    if (!this.reactive) return null
    if (!this.contains(point)) return null
    let i = 0
    let child
    while (child = this.children[i]) {
      let res = child.hitTest(point)
      if (res) return res
      i++
    }
    return null
  }

  hitTestAll(point: IBaseVector): INode[] {
    if (!this.visible) return []
    if (!this.reactive) return []
    if (!this.contains(point)) return []
    let matches = []
    let i = 0
    let child
    while (child = this.children[i]) {
      let childMatches = child.hitTestAll(point)
      if (childMatches.length) matches = matches.concat(childMatches)
      i++
    }
    return matches
  }

  contains(point: IBaseVector): boolean
  contains(rect: IBaseRectangle): boolean
  contains(cont: IContainer): boolean
  contains(arg: any): boolean {
    return Rectangle.contains(this._bounds, arg.bounds || arg)
  }

  isInside(rect: IBaseRectangle): boolean {
    return Rectangle.contains(rect, this._bounds)
  }

  intersects(item: IContainer): boolean {
    return Rectangle.intersects(this._bounds, item.bounds)
  }

  protected render() {
    this.canvasContext.clearRect(0, 0, this.bounds.width, this.bounds.height)
    for (let i = 0, len = this.children.length; i < len; i++) {
      let child = this.children[i] as ShapeObject
      child.render(this.canvasContext)
    }
  }

  public refresh() {
    this.render()
  }

  dispose() {
    dispose(this.toDispose)
    this.toDispose = []
  }
}
