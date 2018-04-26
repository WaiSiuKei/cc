let stage = new cc.Stage(document.body)

let layer = new cc.Layer()
stage.appendChildren(layer)
layer.bounds = stage.bounds

let mx = cc.Matrix.initial

let line2 = new cc.path.Line({ x1: 10, y1: 10, x2: 100, y2: 100 })
let line3 = new cc.path.Line({ x1: 10, y1: 10, x2: 100, y2: 100 })
let line4 = new cc.path.Line({ x1: 10, y1: 10, x2: 100, y2: 100 })

line2.matrix = cc.Matrix.translate(mx, { x: 60, y: 80 })
line3.matrix = cc.Matrix.rotate(mx, 90, { x: 50, y: 50 })
line4.matrix = cc.Matrix.scale(mx, { x: 0.5, y: 0.8 }, { x: 50, y: 50 })

layer.appendChildren(line2)
layer.appendChildren(line3)
layer.appendChildren(line4)

let line2Bounds = new cc.path.Rect(line2.bounds)
let line3Bounds = new cc.path.Rect(line3.bounds)
let line4Bounds = new cc.path.Rect(line4.bounds)
line2Bounds.strokeColor = cc.Color.blue
line3Bounds.strokeColor = cc.Color.blue
line4Bounds.strokeColor = cc.Color.blue
layer.appendChildren(line2Bounds)
layer.appendChildren(line3Bounds)
layer.appendChildren(line4Bounds)

let rect2 = new cc.path.Rect({ x: 10, y: 10, width: 50, height: 100 })
let rect3 = new cc.path.Rect({ x: 10, y: 10, width: 50, height: 100 })
let rect4 = new cc.path.Rect({ x: 10, y: 10, width: 50, height: 100 })

rect2.matrix = cc.Matrix.translate(mx, { x: 60, y: 80 })
rect3.matrix = cc.Matrix.rotate(mx, 90, { x: 60, y: 50 })
rect4.matrix = cc.Matrix.scale(mx, { x: 0.5, y: 0.8 }, { x: 50, y: 50 })
layer.appendChildren(rect2)
layer.appendChildren(rect3)
layer.appendChildren(rect4)

let rect2Bounds = new cc.path.Rect(rect2.bounds)
let rect3Bounds = new cc.path.Rect(rect3.bounds)
let rect4Bounds = new cc.path.Rect(rect4.bounds)
rect2Bounds.strokeColor = cc.Color.blue
rect3Bounds.strokeColor = cc.Color.blue
rect4Bounds.strokeColor = cc.Color.blue
layer.appendChildren(rect2Bounds)
layer.appendChildren(rect3Bounds)
layer.appendChildren(rect4Bounds)

let tri2 = new cc.path.Triangle({ x1: 100, y1: 10, x2: 20, y2: 120, x3: 200, y3: 130 })
let tri3 = new cc.path.Triangle({ x1: 100, y1: 10, x2: 20, y2: 120, x3: 200, y3: 130 })
let tri4 = new cc.path.Triangle({ x1: 100, y1: 10, x2: 20, y2: 120, x3: 200, y3: 130 })

tri2.matrix = cc.Matrix.translate(mx, { x: 60, y: 80 })
tri3.matrix = cc.Matrix.rotate(mx, 90, { x: 100, y: 80 })
tri4.matrix = cc.Matrix.scale(mx, { x: 0.5, y: 0.8 }, { x: 50, y: 50 })
layer.appendChildren(tri2)
layer.appendChildren(tri3)
layer.appendChildren(tri4)

let tri2Bounds = new cc.path.Rect(tri2.bounds)
let tri3Bounds = new cc.path.Rect(tri3.bounds)
let tri4Bounds = new cc.path.Rect(tri4.bounds)
tri2Bounds.strokeColor = cc.Color.blue
tri3Bounds.strokeColor = cc.Color.blue
tri4Bounds.strokeColor = cc.Color.blue
layer.appendChildren(tri2Bounds)
layer.appendChildren(tri3Bounds)
layer.appendChildren(tri4Bounds)

let circle2 = new cc.path.Circle({ cx: 100, cy: 100, radius: 50 })
let circle3 = new cc.path.Circle({ cx: 100, cy: 100, radius: 50 })
let circle4 = new cc.path.Circle({ cx: 100, cy: 100, radius: 50 })

circle2.matrix = cc.Matrix.translate(mx, { x: 60, y: 80 })
circle3.matrix = cc.Matrix.rotate(mx, 90, { x: 100, y: 80 })
circle4.matrix = cc.Matrix.scale(mx, { x: 0.5, y: 0.8 }, { x: 50, y: 50 })
layer.appendChildren(circle2)
layer.appendChildren(circle3)
layer.appendChildren(circle4)

let cir2bounds = new cc.path.Rect(circle2.bounds)
let cir3bounds = new cc.path.Rect(circle3.bounds)
let cir4bounds = new cc.path.Rect(circle4.bounds)
cir2bounds.strokeColor = cc.Color.blue
cir3bounds.strokeColor = cc.Color.blue
cir4bounds.strokeColor = cc.Color.blue
layer.appendChildren(cir2bounds)
layer.appendChildren(cir3bounds)
layer.appendChildren(cir4bounds)

let cubic2 = new cc.path.CubicCurve({ x1: 60, y1: 20, cpx1: 230, cpy1: 30, cpx2: 150, cpy2: 60, x2: 60, y2: 120 })
let cubic4 = new cc.path.CubicCurve({ x1: 60, y1: 20, cpx1: 230, cpy1: 30, cpx2: 150, cpy2: 60, x2: 60, y2: 120 })

cubic2.matrix = cc.Matrix.translate(mx, { x: 60, y: 80 })
cubic4.matrix = cc.Matrix.scale(mx, { x: 0.5, y: 0.8 }, { x: 50, y: 50 })

layer.appendChildren(cubic2)
layer.appendChildren(cubic4)

let cubic2bounds = new cc.path.Rect(cubic2.bounds)
let cubic4bounds = new cc.path.Rect(cubic4.bounds)
cubic2bounds.strokeColor = cc.Color.blue
cubic4bounds.strokeColor = cc.Color.blue
layer.appendChildren(cubic2bounds)
layer.appendChildren(cubic4bounds)

let path = new cc.path.Path(
	new cc.path.Line({ x1: 200, y1: 0, x2: 300, y2: 130 }),
	new cc.path.CubicCurve({ x1: 300, y1: 130, cpx1: 500, cpy1: 230, cpx2: 500, cpy2: 280, x2: 400, y2: 300 }),
	new cc.path.QuadraticCurve({ x1: 400, y1: 300, cpx: 300, cpy: 250, x2: 300, y2: 200 }),
	new cc.path.Polyline({ x: 300, y: 200 }, { x: 250, y: 250 }, { x: 200, y: 280 }, { x: 150, y: 200 }, { x: 100, y: 180 })
)

path.matrix = cc.Matrix.translate(mx, { x: 60, y: 80 })
layer.appendChildren(path)

let pathBounds = new cc.path.Rect(path.bounds)
pathBounds.strokeColor = cc.Color.blue
layer.appendChildren(pathBounds)