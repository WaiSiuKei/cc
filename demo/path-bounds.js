let stage = new cc.Stage(document.body)

let layer = new cc.Layer()
stage.appendChildren(layer)
layer.bounds = stage.bounds

let line = new cc.path.Line({x1: 200, y1: 320, x2: 250, y2: 450})
let lineBounds = new cc.path.Rect(line.bounds)
lineBounds.strokeColor = cc.Color.blue
layer.appendChildren(line)
layer.appendChildren(lineBounds)

let arc = new cc.path.Arc({cx: 500, cy: 300, startAngle: 0, endAngle: 120, radius: 100, anticlockwise: false})
let arcBounds = new cc.path.Rect(arc.bounds)
arcBounds.strokeColor = cc.Color.blue
layer.appendChildren(arc)
layer.appendChildren(arcBounds)

let circle = new cc.path.Circle({cx: 500, cy: 500, radius: 50})
let circleBounds = new cc.path.Rect(circle.bounds)
circleBounds.strokeColor = cc.Color.blue
layer.appendChildren(circle)
layer.appendChildren(circleBounds)

let cubic = new cc.path.CubicCurve({x1: 60, y1: 420, cpx1: 230, cpy1: 430, cpx2: 150, cpy2: 460, x2: 60, y2: 520})
let cubicBounds = new cc.path.Rect(cubic.bounds)
cubicBounds.strokeColor = cc.Color.blue
layer.appendChildren(cubic)
layer.appendChildren(cubicBounds)

let ellipse = new cc.path.Ellipse({cx: 320, cy: 380, r1: 50, r2: 20})
let ellipseBounds = new cc.path.Rect(ellipse.bounds)
ellipseBounds.strokeColor = cc.Color.blue
layer.appendChildren(ellipse)
layer.appendChildren(ellipseBounds)

let quadraticCurve = new cc.path.QuadraticCurve({x1: 40, y1: 320, cpx: 230, cpy: 330, x2: 50, y2: 400})
let quadCurveBounds = new cc.path.Rect(quadraticCurve.bounds)
quadCurveBounds.strokeColor = cc.Color.blue
layer.appendChildren(quadraticCurve)
layer.appendChildren(quadCurveBounds)

let triangle = new cc.path.Triangle({x1: 600, y1: 10, x2: 620, y2: 120, x3: 750, y3: 130})
let triangleBounds = new cc.path.Rect(triangle.bounds)
triangleBounds.strokeColor = cc.Color.blue
layer.appendChildren(triangle)
layer.appendChildren(triangleBounds)

let polyline = new cc.path.Polyline({x: 0, y: 0}, {x: 20, y: 20}, {x: 30, y: 15}, {x: 40, y: 25}, {x: 50, y: 18})
let polylineBounds = new cc.path.Rect(polyline.bounds)
polylineBounds.strokeColor = cc.Color.blue
layer.appendChildren(polyline)
layer.appendChildren(polylineBounds)

let path = new cc.path.Path(
	new cc.path.Line({x1: 200, y1: 0, x2: 300, y2: 130}),
	new cc.path.CubicCurve({x1: 300, y1: 130, cpx1: 500, cpy1: 230, cpx2: 500, cpy2: 280, x2: 400, y2: 300}),
	new cc.path.QuadraticCurve({x1: 400, y1: 300, cpx: 300, cpy: 250, x2: 300, y2: 200}),
	new cc.path.Polyline({x: 300, y: 200}, {x: 250, y: 250}, {x: 200, y: 280}, {x: 150, y: 200}, {x: 100, y: 180})
)
let pathBounds = new cc.path.Rect(path.bounds)
pathBounds.strokeColor = cc.Color.blue
layer.appendChildren(path)
layer.appendChildren(pathBounds)
