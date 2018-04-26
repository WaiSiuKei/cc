let stage = new cc.Stage(document.body)

let layer = new cc.Layer()
stage.appendChildren(layer)
layer.bounds = stage.bounds

let line2 = new cc.path.Line({ x1: 0, y1: 0, x2: 100, y2: 100 })
let line3 = new cc.path.Line({ x1: 0, y1: 0, x2: 100, y2: 100 })
let line4 = new cc.path.Line({ x1: 0, y1: 0, x2: 100, y2: 100 })

let mx = cc.Matrix.initial

line2.matrix = cc.Matrix.translate(mx, { x: 160, y: 20 })
line3.matrix = cc.Matrix.rotate(mx, 45, { x: 50, y: 50 })
line4.matrix = cc.Matrix.scale(mx, { x: 2, y: 2 }, { x: 50, y: 50 })

layer.appendChildren(line2)
layer.appendChildren(line3)
layer.appendChildren(line4)

let rect1 = new cc.path.Rect({ x: 0, y: 0, width: 100, height: 100 })
let rect2 = new cc.path.Rect({ x: 0, y: 0, width: 100, height: 100 })

mx = cc.Matrix.initial

rect2.matrix = cc.Matrix.translate(mx, { x: 60, y: 80 })

layer.appendChildren(rect1)
layer.appendChildren(rect2)
