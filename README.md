# CC

A canvas library.

## Demo

[Demo](https://waisiukei.github.io/cc)

## Development

```shell
$ git clone git@github.com:waisiukei/cc.git
$ yarn
$ npm run serve
```

## 基本概念
cc创建了类似 DOM 的对象模型。绘图元素可以嵌套成类 DOM 🌲结构；绘图元素可以监听 MouseEvent 。

- Stage：Canvas容器，可以使用多层Canvas结构
- Layer： Canvas元素的封装，使用多层Canvas结构时，添加Layer到同一个Stage
- Element： 添加到canvas上的元素，可以自定义hittest检测
- Group: 元素分组容器，可以自定义hittest检测

## 事件
绘图元素支持鼠标事件，提供事件冒泡
支持的事件：
- mousedown
- mouseup
- mousemove
- click
- mouseover
- mouseout
- dragstart
- drag
- dragend

## 碰撞检测
用户需要自行实现碰撞检测方法

## 选择器
类似 d3.selection ，区别是，使用函数而不是选择器字符串去匹配元素

## 动画
提供如下API
- `tween` 插值动画
- `set` 立即改变
- `delay` 等待