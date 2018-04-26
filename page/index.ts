import * as cc from '../src'

window['cc'] = cc

let stage = new cc.Stage(document.body as any)

let layer = new cc.Layer()
stage.appendChildren(layer)
layer.bounds = stage.bounds

let quadraticCurve = new cc.path.QuadraticCurve({x1: 40, y1: 320, cpx: 230, cpy: 330, x2: 50, y2: 400})
let quadCurveBounds = new cc.path.Rect(quadraticCurve.bounds)
quadCurveBounds.strokeColor = cc.Color.blue
layer.appendChildren(quadraticCurve)
layer.appendChildren(quadCurveBounds)
