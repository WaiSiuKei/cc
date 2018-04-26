let stage = new cc.Stage(document.body)
let layer = new cc.Layer()
stage.appendChildren(layer)
layer.bounds = stage.bounds

for (let i = 0; i < 10; i++) {
	let val = i * 50
	let c = new cc.path.Circle({cx: val, cy: val, radius: 20})
	c.strokeWidth = 4
	c.fillColor = cc.Color.white
	c.on('mouseover', function () {
		c.strokeWidth = 8
		c.strokeColor = cc.Color.cyan
		stage.update()
	})
	c.on('mouseout', () => {
		c.strokeWidth = 4
		c.strokeColor = cc.Color.black
		c.radius = 20
		stage.update()
	})
	layer.appendChildren(c)
}



