import * as cc from '../src'
import {TextAlign, TextBaseLine} from '../src/cc/typography/def';

window['cc'] = cc

let stage = new cc.Stage(document.body as any)

let layer = new cc.Layer()
stage.appendChildren(layer)
layer.bounds = stage.bounds


const {width, height} = document.body.getBoundingClientRect();


let text = new cc.Text({
	value: 'Test',
	x: 0,
	y: 0,
	fontSize: 10,
	textAlign: TextAlign.Center,
	textBaseline: TextBaseLine.Bottom,
})

layer.appendChildren(text)

cc.from(stage)
	.selectAll(l => l === text)
	.transition(
		cc.transition()
			.tween({x: width / 2, y: height / 2, fontSize: 100}, 1000, cc.EaseType.ExponentialIn)
			.tween({x: 0, y: 0, fontSize: 10}, 1000, cc.EaseType.ExponentialOut)
	);

stage.animator.start();
