import {IContainer, IElement, IGroup, ILayer, ShapeObject} from './def';
import {Shape} from './shape';
import {IBase, IBaseRectangle, IBaseVector} from '../core/def';
import {Rectangle} from '../core/rectangle';

export class Group extends Shape implements IGroup {
  public children: ShapeObject[]
  constructor(parent: ILayer | IGroup = null) {
    super(parent)
  }

  /*
    prependChildren(child: ShapeObject | ShapeObject[]): void {
        super.prependChildren(child)
        this._updateBounds()
    }

    appendChildren(child: ShapeObject | ShapeObject[]): void {
        super.appendChildren(child)
        this._updateBounds()
    }

    insertChildren(index: number, child: ShapeObject | ShapeObject[]): void {
        super.insertChildren(index, child)
        this._updateBounds()
    }

    removeChildren()
    removeChildren(start)
    removeChildren(start?: number, end?: number) {
        super.removeChildren(start, end)
        this._updateBounds()
    }

    _updateBounds() {
        let len = this.children.length
        if (len > 0) {
            this.bounds = Rectangle.unite(...this.children.map((c) => c.bounds))
        }
    }
    */

  hitTest(point: IBaseVector): IGroup {
    if (!this.isVisible) return null
    if (this.opacity === 0 && !this.reactive) return null
    // if (!this.contains(point)) return null
    if (!this.children.length) return null
    let i = 0
    let child
    while (child = this.children[i] as ShapeObject) {
      if (child.hitTest(point)) return this
      i++
    }
    return null
  }

  hitTestAll(point: IBaseVector): IGroup[] {
    let res = this.hitTest(point)
    return res ? [res] : []
  }

  contains(point: IBaseVector): boolean
  contains(rect: IBaseRectangle): boolean
  contains(cont: IContainer): boolean
  contains(arg: any): boolean {
    return Rectangle.contains(this.bounds, arg.bounds || arg)
  }

  isInside(rect: IBaseRectangle): boolean {
    return Rectangle.contains(rect, this.bounds)
  }

  intersects(item: IContainer): boolean {
    return Rectangle.intersects(this.bounds, item.bounds)
  }

  render(ctx) {
    let len = this.children.length
    if (!len) return
    for (let i = len - 1; i >= 0; i--) {
      this.children[i].render(ctx)
    }
  }
}
