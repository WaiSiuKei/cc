import {ILollipop} from "./def";
import {Circle} from "../path/circle";
import {Color} from "../core/color";
import {dispose, IDisposable} from "../../base/common/lifecycle";
import {EventType} from "../../base/browser/event";
import {Vector} from "../core/vector";

export class Lollipop extends Circle implements ILollipop, IDisposable {
	_isHovered: boolean = false
	_isSelected: boolean = false
	toDispose: IDisposable[] = []
	constructor(cx: number, cy: number) {
		super({cx, cy, radius: 6})
		this.fillColor = Color.white
		this.strokeColor = Color.lightgrey
		this.strokeWidth = 1

		this.toDispose.push(this.on(EventType.MOUSE_OUT, this._handleMouseLeave.bind(this)))
		this.toDispose.push(this.on(EventType.MOUSE_OVER, this._handleMouseEnter.bind(this)))
	}

	_handleMouseLeave(e) {
		this.isHovered = false
	}

	_handleMouseEnter(e) {
		this.isHovered = true
	}

	dispose() {
		dispose(this.toDispose)
		this.toDispose.length = 0
	}

	get isHovered() {
		return this._isHovered
	}

	set isHovered(val: boolean) {
		this._isHovered = val
		this.strokeWidth = val && this._isSelected ? 3 : val || this._isSelected ? 2 : 1
		this.isVisible = val || this._isSelected
	}

	get isSelected() {
		return this._isSelected
	}

	set isSelected(val) {
		this._isSelected = val
		this.strokeWidth = this._isHovered && this._isSelected ? 3 : this._isHovered || this._isSelected ? 2 : 1
		this.isVisible = this._isHovered || this._isSelected
	}

	contains(point) {
		if (!this.isVisible) return false
		let d = Vector.euclideanMetric(Vector.subtract(this.center, point))
		let stroke = this.strokeWidth + this.hitRange
		let range = stroke / 2
		if (this.fillColor && this.fillColor.rgba.a > 0) return d <= range + this.radius
		return d < range + this.radius && d > this.radius - range
	}
}
