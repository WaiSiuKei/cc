import {ILayer, INode, IStage, IStageInitOption, IContainer} from './def';
import {Node} from './node'
import {dispose, IDisposable} from '../../base/common/lifecycle';
import {getContentHeight, getContentWidth} from '../../base/browser/dom';
import {IBaseRectangle, IBaseSize, IBaseVector, ISize, IVector} from '../core/def';
import {Rectangle} from '../core/rectangle';
import {EventHandler} from './eventHandler';
import {Animator} from '../transition/animator';

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
          this._refreshZIndexOfLayers()
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
export class Stage extends Node implements IStage, IDisposable {
  protected toDispose: IDisposable[] = []
  bounds: IBaseRectangle
  private eventHandler: EventHandler
  public animator: Animator

  constructor(public container: HTMLDivElement, option: IStageInitOption = {}) {
    super()
    this.bounds = {width: getContentWidth(container), height: getContentHeight(container), x: 0, y: 0}

    // this.container.style.position = 'relative'
    this.container.setAttribute('role', 'presentation')

    this.eventHandler = new EventHandler(container, this)
    this.animator = new Animator(this)
    this.toDispose.push(this.eventHandler)
  }

  protected _appendChild(child: ILayer): void {
    super._appendChild(child)

    this.container.appendChild(child.canvasElement)
  }

  protected _refreshZIndexOfLayers(): void {
    let len = this.children.length
    for (let i = len - 1; i >= 0; i--) {
      let child = this.children[i] as ILayer
      child.canvasElement.style.zIndex = (len - i).toString()
    }
  }

  insertAbove(node: INode): void {throw new Error()}

  insertBelow(node: INode): void {throw new Error()}

  replaceWith(node: INode): void {throw new Error()}

  sendToBack(): void {throw new Error()}

  bringToFront(): void {throw new Error()}

  addTo(owner: INode): void {throw new Error()}

  remove(): void {throw new Error()}

  isAbove(item): boolean {throw new Error()}

  isBelow(item): boolean {throw new Error()}

  hitTest(point: IBaseVector): INode {
    if (!this.children.length) return null
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
    if (!this.children.length) return []
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

  contains(rect: IBaseRectangle): boolean
  contains(cont: IContainer): boolean
  contains(arg): boolean {
    return Rectangle.contains(this.bounds, arg)
  }

  isInside(rect: IBaseRectangle): boolean {
    return Rectangle.contains(rect, this.bounds)
  }

  intersects(item: IContainer): boolean {
    return Rectangle.intersects(this.bounds, item.bounds)
  }

  dispose() {
    this.toDispose = dispose(this.toDispose)
  }

  update() {
    for (let i = 0, len = this.children.length; i < len; i++) {
      let child = this.children[i] as ILayer
      child.refresh()
    }
  }
}
