import * as cc from '../src'
import {TextAlign, TextBaseLine} from "../src/cc/typography/def";

window['cc'] = cc

let stage = new cc.Stage(document.body as any)

let layer = new cc.Layer()
stage.appendChildren(layer)
layer.bounds = stage.bounds

let top = new cc.path.Line({x1: 100, x2: 500, y1: 200, y2: 200})
let middle = new cc.path.Line({x1: 100, x2: 500, y1: 210, y2: 210})
let bottom = new cc.path.Line({x1: 100, x2: 500, y1: 222, y2: 222})
let vertical = new cc.path.Line({x1: 100, x2: 100, y1: 10, y2: 400})

middle.strokeColor = cc.Color.green
top.strokeColor = cc.Color.cyan
bottom.strokeColor = cc.Color.blue
vertical.strokeColor = cc.Color.red

layer.appendChildren([top, middle, bottom, vertical])

let leftTop = new cc.Text({
	value: 'agM',
	x: 100,
	y: 170,
	fontSize: '20px',
	textAlign: TextAlign.Left,
	textBaseline: TextBaseLine.Top
})
let centerTop = new cc.Text({
	value: 'agM',
	x: 100,
	y: 200,
	fontSize: '20px',
	textAlign: TextAlign.Center,
	textBaseline: TextBaseLine.Top
})
let rightTop = new cc.Text({
	value: 'agM',
	x: 100,
	y: 230,
	fontSize: '20px',
	textAlign: TextAlign.Right,
	textBaseline: TextBaseLine.Top
})
let leftMiddle = new cc.Text({
	value: 'agM',
	x: 150,
	y: 200,
	fontSize: '20px',
	textAlign: TextAlign.Left,
	textBaseline: TextBaseLine.Middle
})

let leftAfb = new cc.Text({
	value: 'agM',
	x: 200,
	y: 200,
	fontSize: '20px',
	textAlign: TextAlign.Left,
	textBaseline: TextBaseLine.Alphabetic
})

let leftBottom = new cc.Text({
	value: 'agM',
	x: 250,
	y: 200,
	fontSize: '20px',
	textAlign: TextAlign.Left,
	textBaseline: TextBaseLine.Bottom
})

let all = [].concat.apply([], [
	[leftTop, centerTop, rightTop],
	[leftMiddle, leftAfb, leftBottom],
]);

layer.appendChildren(all)
stage.update()

all.forEach(a => {
	layer.appendChildren(new cc.path.Rect(a.bounds))
})

stage.update()