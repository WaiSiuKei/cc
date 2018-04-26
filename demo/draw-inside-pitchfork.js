let stage = new cc.Stage(document.body)
window['stage'] = stage
let layer = new cc.Layer()
stage.appendChildren(layer)
layer.bounds = stage.bounds
let line

function onMouseMoveP2(e) {
	e.preventDefault()
	e.stopImmediatePropagation()
	const { x, y } = e
	line.x2 = x
	line.y2 = y
	line.x3 = x
	line.y3 = y
	stage.update()
}

function onMouseMoveP3(e) {
	e.preventDefault()
	e.stopImmediatePropagation()
	const { x, y } = e
	line.x3 = x
	line.y3 = y
	stage.update()
}

function highlightOrStartDrawLine(e) {
	const { target } = e
	if (target !== stage) {
		let lines = cc.from(stage)
			.selectAll(l => l.isSelected === true)

		if (lines.size()) lines.forEach(l => l.isSelected = false)
		target.isSelected = true
	} else {
		let lines = cc.from(stage)
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

	let lines = cc.from(stage)
		.selectAll(l => l.isDrawing === true)

	if (lines.size()) {
		lines.forEach(l => l.isDrawing = false)
	}
	window.removeEventListener('mousemove', onMouseMoveP3, true)
	window.removeEventListener('click', onMouseUp, true)

	stage.on('click', highlightOrStartDrawLine)
}

function handleP3(e) {
	if (e) {
		e.preventDefault()
		e.stopImmediatePropagation()
	}

	window.removeEventListener('mousemove', onMouseMoveP2, true)
	window.addEventListener('mousemove', onMouseMoveP3, true)
	window.removeEventListener('click', handleP3, true)
	window.addEventListener('click', onMouseUp, true)
}

function startDrawLine(e) {
	const { x, y } = e

	line = new cc.InsidePitchFork({ x1: x, y1: y, x2: x, y2: y, x3: x, y3: y })
	line.isDrawing = true

	window['line'] = line

	layer.appendChildren(line)
	stage.off('click', highlightOrStartDrawLine)
	window.addEventListener('mousemove', onMouseMoveP2, true)
	window.addEventListener('click', handleP3, true)
	window.addEventListener('blur', function () {onMouseUp(null)}, true)
}

stage.on('click', highlightOrStartDrawLine)

stage.on('*', e => {
	if (e.type !== 'mousemove')
		stage.update()
})