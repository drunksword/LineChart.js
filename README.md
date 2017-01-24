# LineChart.js
使用html5的canvas api绘制折线图显示数据走势，支持在同一坐标系内绘制两条折线

#效果示例
![image](https://github.com/soggotheslitherer/LineChart.js/blob/master/imgs/eg1.PNG)
![image](https://github.com/soggotheslitherer/LineChart.js/raw/master/imgs/eg2.PNG)

#使用方法
```html
<canvas id="canvas"> </canvas>
...
<script>
LineChart.init({
    canvasId: 'canvas', //要操作的canvas的id
    nodeList: multiData, //点列
    yGradient1: 50, //左边y轴的梯度值
    // yGradient2: 5, //右边y轴梯度值，不传该值表示使用一个y轴，如上面图2
    unitLengthX: 80 //x轴的坐标间距
})
</script>
```
下面的参数可以控制折线图样式，不传时使用默认值
```html
lineNames:['line1', 'line2'],//数据线名称数组
lineColors:["red","#003300"],//数据线颜色数组
dotColor:"#333", //点的颜色;
showBgLines:true,//是否展示背景的梯度线
fontX_axis:'normal 15px Arial',//x轴字体
fontY_axis:'normal 18px Arial',//y轴字体
fontLineName:'normal 15px Arial',//坐标线描述文字字体
bgLineColor:"#e8e8e8",//背景线颜色
yPaddingTop:45,//最顶梯度的留白高度
yPaddingBottom:20,//最底梯度的留白高度
unitLengthX:50,//x轴单位长度
axisMargin:60,//坐标轴距画布边缘的距离
canvasH:400,//canvas高度
```
###index.html中已经给出了样例数据，可以直接运行

#总结
使用原生js实现了绘制折线图功能，代码简单易懂。但是功能非常有限，使用时可能要自己修改和扩展，比如需要在一个坐标系中画3条以上折线，或者只画一条折线等等。作为自己练手的代码，如果能对你有任何帮助，give me a star^_^
