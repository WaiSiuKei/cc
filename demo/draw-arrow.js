var stage = new cc.Stage(document.body)
window['stage'] = stage
var layer = new cc.Layer()
stage.appendChildren(layer)
layer.bounds = stage.bounds

var line

function onMouseMove(e) {
  e.preventDefault()
  e.stopImmediatePropagation()
  const { x, y } = e
  line.x2 = x
  line.y2 = y
  stage.update()
}

function highlightOrStartDrawLine(e) {
  const { target } = e
  if (target !== stage) {
    var lines = cc.from(stage)
      .selectAll(l => l.isSelected === true)

    if (lines.size()) lines.forEach(l => l.isSelected = false)
    target.isSelected = true
  } else {
    var lines = cc.from(stage)
      .selectAll(l => l.isSelected === true)

    if (lines.size()) {
      lines.forEach(l => l.isSelected = false)
    } else {
      startDrawLine(e)
    }

  }
}

function onMouseUp(e) {
  if (e) {
    e.preventDefault()
    e.stopImmediatePropagation()
  }

  var lines = cc.from(stage)
    .selectAll(l => l.isDrawing === true)

  if (lines.size()) {
    lines.forEach(l => l.isDrawing = false)
  }
  window.removeEventListener('mousemove', onMouseMove, true)
  window.removeEventListener('click', onMouseUp, true)

  stage.on('click', highlightOrStartDrawLine)
}

function startDrawLine(e) {
  const { x, y } = e

  line = new cc.Arrow({ x1: x, y1: y, x2: x, y2: y })
  line.isDrawing = true

  window['line'] = line

  layer.appendChildren(line)
  stage.off('click', highlightOrStartDrawLine)
  window.addEventListener('mousemove', onMouseMove, true)
  window.addEventListener('click', onMouseUp, true)
  window.addEventListener('blur', function () {onMouseUp(null)}, true)
}

stage.on('click', highlightOrStartDrawLine)

stage.on('*', e => {
  if (e.type !== 'mousemove')
    stage.update()
})