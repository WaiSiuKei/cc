import {IBase, IBaseMatrix, IBaseRectangle, IBaseSize, IBaseVector, IMatrix, ISize, IVector} from "../core/def";
import {Event} from "../../base/common/events";
import {Color} from "../core/color";
import {IAnimator} from "../transition/def";
import {INodeEventEmitter} from "../dispatch/def";

export interface IEventTarget extends INodeEventEmitter {

}

export interface NodeMatcher {
  (node: INode): boolean
}

export interface INode extends IEventTarget {
  children: INode[]
  parent: INode
  root: INode
  type?: string
  id?: string
  name?: string
  data?: any;

  isParentOf(node: INode): boolean
  isChildOf(node: INode): boolean
  isDescendantOf(node: INode): boolean
  isAncestorOf(node: INode): boolean

  prependChildren(child: INode | INode[]): void
  appendChildren(child: INode | INode[]): void
  insertChildren(index: number, child: INode | INode[]): void

  removeChildren(): void
  removeChildren(start): void
  removeChildren(start, end): void
  reverseChildren(): void

  insertAbove(node: INode): void
  insertBelow(node: INode): void
  replaceWith(node: INode): void

  sendToBack(): void
  bringToFront(): void
  addTo(owner: INode): void
  remove(): void

  hitTest(point: IBaseVector): INode
  hitTestAll(point: IBaseVector): INode[]
  select(match: NodeMatcher): INode
  selectAll(match: NodeMatcher): INode[]
}

export interface IContainer {
  bounds: IBaseRectangle
  contains(point: IBaseVector): boolean
  contains(rect: IBaseRectangle): boolean
  contains(cont: IContainer): boolean
  isInside(rect: IBaseRectangle): boolean
  intersects(item: IContainer): boolean
}

export interface IStage extends INode, IContainer {
  container: HTMLDivElement
  animator: IAnimator
  update(): void;
}

export interface IStageInitOption {
  // event?: IEventConfig
}

export interface ILayer extends INode, IContainer {
  canvasElement: HTMLCanvasElement
  canvasContext: CanvasRenderingContext2D
  visible: boolean
  reactive: boolean

  refresh(): void;
}

export enum StrokeCap {
  Butt = 0,
  Round = 1,
  Square = 2,
}

export enum StrokeJoin {
  Miter = 0,
  round = 1,
  Bevel = 2,
}

export enum FillRule {
  nonzero = 0,
  evenodd = 1,
}

export interface IShape {
  isVisible: boolean
  reactive: boolean
  opacity: number
  isLocked: boolean
  // Stroke
  strokeColor: Color | string
  strokeWidth: number
  strokeCap: StrokeCap
  strokeJoin: StrokeJoin
  dashOffset: number
  strokeScaling: boolean
  dashArray: number[]
  miterLimit: number
  // Fill
  fillColor: Color | string
  fillRule: FillRule
  // Shadow
  // shadowColor: Color
  // shadowBlur: number
  // shadowOffset: IBaseVector
  // Props
  isHovered: boolean
  isSelected: boolean

  hitRange: number
  // Position and Bounding Boxes
  // position: IBaseVector
  // pivot: IBaseVector
  bounds: IBaseRectangle
  // strokeBounds: IBaseRectangle
  matrix: IBaseMatrix // relative to parent
  // stageMatrix: IBaseMatrix
  // layerMatrix: IBaseMatrix
  // Transform
  translate(delta: IBaseVector): void
  // rotate(angle: number, center: IBaseVector): void
  // scale(scale: IBaseVector, center: IBaseVector): void
  // shear(shear: IBaseVector, center: IBaseVector): void
  // skew(skew: IBaseVector, center: IBaseVector): void
  // transform(matrix: IBaseMatrix): void
  // globalToLocal(point: IBaseVector): IBaseVector
  // localToGlobal(point: IBaseVector): IBaseVector
  // parentToLocal(point: IBaseVector): IBaseVector
  // localToParent(point: IBaseVector): IBaseVector

  render(ctx: CanvasRenderingContext2D): void;
}

export type ShapeObject = IGroup | IElement

export interface IGroup extends INode, IContainer, IShape {
  // clipMask: IElement
}

export interface IElement extends INode, IShape {
  hitTest(point: IBaseVector): INode
  hitTestAll(point: IBaseVector): INode[]
  select(match: NodeMatcher): INode
  selectAll(match: NodeMatcher): INode[]
  contains(point: IBaseVector): boolean
}

export interface IPath {

}

export interface IMouseEvent {
  type: string;
  buttons: number;
  leftButton: boolean;
  middleButton: boolean;
  rightButton: boolean;
  target?: INode;
  //  detail: number;
  x: number,
  y: number,
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  timestamp: number;
}

export interface IDragEvent extends IMouseEvent {
  firstX: number,
  firstY: number,
  previousX?: number,
  previousY?: number,
}

export interface IEventProxy {
  minDragDistance: number

  onMouseEvent: Event<IMouseEvent>
  // onKeyEvent: Event<IKeyEvent>
}

export interface IEventHandler {
  dispatch(event: IMouseEvent): void;
}
