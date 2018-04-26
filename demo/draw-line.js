let stage = new cc.Stage(document.body)
window['stage'] = stage
let layer = new cc.Layer()
stage.appendChildren(layer)
layer.bounds = stage.bounds

let line

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
		let lines = cc.from(stage)
			.selectAll(l => l.strokeColor === cc.Color.cyan)

		if (lines.size()) {
			lines.forEach(l => {
				l.strokeWidth = 1
				l.strokeColor = cc.Color.black
			})
		}
		target.strokeWidth = 8
		target.strokeColor = cc.Color.cyan
		stage.update()
	} else {
		let lines = cc.from(stage)
			.selectAll(l => l.strokeColor === cc.Color.cyan)

		if (lines.size()) {
			lines.forEach(l => {
				l.strokeWidth = 1
				l.strokeColor = cc.Color.black
			})
			stage.update()
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
	window.removeEventListener('mousemove', onMouseMove, true)
	window.removeEventListener('click', onMouseUp, true)

	stage.on('click', highlightOrStartDrawLine)
}

function startDrawLine(e) {
	const { x, y } = e

	line = new cc.path.Line({ x1: x, y1: y, x2: x, y2: y })

	layer.appendChildren(line)
	stage.off('click', highlightOrStartDrawLine)
	window.addEventListener('mousemove', onMouseMove, true)
	window.addEventListener('click', onMouseUp, true)
	window.addEventListener('blur', function () {
		onMouseUp(null)
	}, true)
}

stage.on('click', highlightOrStartDrawLine)
