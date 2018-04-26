let stage = new cc.Stage(document.body)
window['stage'] = stage
let layer = new cc.Layer()
stage.appendChildren(layer)
layer.bounds = stage.bounds

let line

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

function startDrawLine(e) {
	const { x, y } = e

	line = new cc.VerticalLine({ x, y })
	line.isDrawing = false

	window['line'] = line

	layer.appendChildren(line)
}

stage.on('click', highlightOrStartDrawLine)

stage.on('*', e => {
	if (e.type !== 'mousemove')
		stage.update()
})