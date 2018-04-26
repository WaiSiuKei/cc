let stage = new cc.Stage(document.body)

let layer = new cc.Layer()
stage.appendChildren(layer)
layer.bounds = stage.bounds

let group1 = new cc.Group()

let line1 = new cc.path.Line({ x1: 200, y1: 0, x2: 250, y2: 100 })

let cubic = new cc.path.CubicCurve({ x1: 60, y1: 20, x2: 230, y2: 30, cpx1: 150, cpy1: 60, cpx2: 60, cpy2: 120 })
group1.appendChildren(line1)
group1.appendChildren(cubic)

let group0fGroup = new cc.Group()
group0fGroup.appendChildren(group1)
layer.appendChildren(group0fGroup)

let group2 = new cc.Group()
let line3 = new cc.path.Line({ x1: 100, y1: 0, x2: 240, y2: 150 })
let circle = new cc.path.Circle({ cx: 100, cy: 100, radius: 50 })
group2.appendChildren(line3)
group2.appendChildren(circle)
layer.appendChildren(group2)

let group1Bounds = new cc.path.Rect(group0fGroup.bounds)
group1Bounds.strokeColor = cc.Color.blue

let group2Bounds = new cc.path.Rect(group2.bounds)
group2Bounds.strokeColor = cc.Color.blue
layer.appendChildren(group2Bounds)
layer.appendChildren(group1Bounds)