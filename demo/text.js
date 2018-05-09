var container = document.body;

var stage = new cc.Stage(container);
var layer = new cc.Layer();
stage.appendChildren(layer);
layer.bounds = stage.bounds;


let topLine = new cc.path.Line({ x1: 100, x2: 500, y1: 200, y2: 200 })
let middle = new cc.path.Line({ x1: 100, x2: 500, y1: 210, y2: 210 })
let bottom = new cc.path.Line({ x1: 100, x2: 500, y1: 222, y2: 222 })
let vertical = new cc.path.Line({ x1: 100, x2: 100, y1: 10, y2: 400 })

middle.strokeColor = cc.Color.green
topLine.strokeColor = cc.Color.cyan
bottom.strokeColor = cc.Color.blue
vertical.strokeColor = cc.Color.red

layer.appendChildren([topLine, middle, bottom, vertical])

let leftTop = new cc.Text({
  value: 'agM',
  x: 100,
  y: 170,
  fontSize: '20px',
  textAlign: 'left',
  textBaseline: 'top',
})
let centerTop = new cc.Text({
  value: 'agM',
  x: 100,
  y: 200,
  fontSize: '20px',
  textAlign: 'center',
  textBaseline: 'top'
})
let rightTop = new cc.Text({
  value: 'agM',
  x: 100,
  y: 230,
  fontSize: '20px',
  textAlign: 'right',
  textBaseline: 'top'
})
let leftMiddle = new cc.Text({
  value: 'agM',
  x: 150,
  y: 200,
  fontSize: '20px',
  textAlign: 'left',
  textBaseline: 'middle'
})

let leftAfb = new cc.Text({
  value: 'agM',
  x: 200,
  y: 200,
  fontSize: '20px',
  textAlign: 'left',
  textBaseline: 'alphabetic'
})

let leftBottom = new cc.Text({
  value: 'agM',
  x: 250,
  y: 200,
  fontSize: '20px',
  textAlign: 'left',
  textBaseline: 'bottom'
})

let all = [].concat.apply([], [
  [leftTop, centerTop, rightTop],
  [leftMiddle, leftAfb, leftBottom],
]);

layer.appendChildren(all)

all.forEach(a => {
  layer.appendChildren(new cc.path.Rect(a.bounds))
})
