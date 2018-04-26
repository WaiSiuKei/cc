var container = document.body;

var stage = new cc.Stage(container);
var layer = new cc.Layer();
stage.appendChildren(layer);
layer.bounds = stage.bounds;

for (var i = 0; i < 200; i++) {
  var val = i * 4;
  layer.appendChildren(new cc.path.Circle({ cx: val, cy: val, radius: 2 }));
}

cc.from(stage)
  .selectAll(l => l instanceof cc.path.Circle)
  .property('strokeColor', cc.Color.red)
  .transition(cc.transition()
    .tween({ radius: 200, strokeColor: cc.Color.blue }, 1000, cc.EaseType.BounceIn)
    .tween({ radius: 1, strokeColor: cc.Color.red }, 1000)
  );

stage.animator.start();