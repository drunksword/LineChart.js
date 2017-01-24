var LineChart={
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

  nodeList:undefined,//需要绘制的点列
  yGradient1:undefined,//左边y轴梯度值
  yGradient2:undefined,//右边y轴梯度值（仅需要一条y轴时，不传该值即可）

  init:function(paramMap){
    this.lineNames = paramMap.lineNames || this.lineNames
    this.lineColors = paramMap.lineColors || this.lineColors
    this.dotColor = paramMap.dotColor || this.dotColor
    this.showBgLines = paramMap.showBgLines || this.showBgLines
    this.fontX_axis = paramMap.fontX_axis || this.fontX_axis
    this.fontY_axis = paramMap.fontY_axis || this.fontY_axis
    this.fontLineName = paramMap.fontLineName || this.fontLineName
    this.bgLineColor = paramMap.bgLineColor || this.bgLineColor
    this.yPaddingTop = paramMap.yPaddingTop || this.yPaddingTop
    this.yPaddingBottom = paramMap.yPaddingBottom || this.yPaddingBottom
    this.unitLengthX = paramMap.unitLengthX || this.unitLengthX
    this.axisMargin = paramMap.axisMargin || this.axisMargin
    this.canvasH = paramMap.canvasH || this.canvasH

    this.nodeList = paramMap.nodeList
    this.yGradient1 = paramMap.yGradient1
    this.yGradient2 = paramMap.yGradient2
    this.yCount = typeof this.yGradient2 == 'undefined' ? 1 : 2

    this.canvas = document.getElementById(paramMap.canvasId) //获得dom
    this.context = this.canvas.getContext('2d') //canvas画布
    canvas.height = this.canvasH
    canvas.width = this.nodeList.length * this.unitLengthX + this.axisMargin * this.yCount
    this.minY1 = this.getExtremum().min1 //y轴梯度线的最值
    this.maxY1 = this.getExtremum().max1
    if(this.yCount == 2){
      this.minY2 = this.getExtremum().min2
      this.maxY2 = this.getExtremum().max2
    }
    this.pixelsPerBgLine = this.getYPixel().pixelsPerBgLine //每个梯度的像素数
    this.yBgLinesCount = this.getYPixel().yBgLinesCount //y轴梯度数目

    this.drawAxis()
    this.drawLines()
  },
  
  drawAxis:function(){
    this.context.lineWidth=2;
    this.context.strokeStyle="rgba(0,0,0,1)";
    //换坐标轴直线
    this.context.beginPath();
    this.context.moveTo(this.axisMargin,0)
    this.context.lineTo(this.axisMargin,this.canvas.height-this.axisMargin);
    this.context.lineTo(this.canvas.width-this.axisMargin*(this.yCount-1),this.canvas.height-this.axisMargin);
    if(this.yCount == 2){
      this.context.lineTo(this.canvas.width-this.axisMargin,0);
    }
    this.context.stroke();
    this.context.closePath();
    //画x轴下方描述
    this.context.beginPath();
    this.context.textAlign = "center"//x轴文字居中写
    this.context.font = this.fontX_axis;
    for(var i=0;i<this.nodeList.length;i++){
        var x_x = this.axisMargin+this.unitLengthX*(i+0.5);
        var x_y = this.canvas.height-this.axisMargin+20;
        this.context.fillText(this.nodeList[i].x,x_x,x_y,this.unitLengthX);
    }
    //画左y轴左方描述
    this.context.textAlign = "right";//y轴文字靠右写
    this.context.font = this.fontY_axis; 
    this.context.textBaseline = "middle";//文字的中心线的调整
    for(var i=0;i< this.yBgLinesCount;i++){
  	    this.context.fillStyle=this.lineColors[0];
        this.context.fillText(this.minY1 + i*this.yGradient1,this.axisMargin-10,
          (this.yBgLinesCount-1-i)*this.pixelsPerBgLine+this.yPaddingTop,this.unitLengthX);
    }
    //画右y轴右方描述
    if(this.yCount == 2){
      this.context.textAlign = "left";
      for(var i=0;i< this.yBgLinesCount;i++){
          this.context.fillStyle=this.lineColors[1];
          this.context.fillText(this.minY2 + i*this.yGradient2,this.canvas.width-this.axisMargin+10,
            (this.yBgLinesCount-1-i)*this.pixelsPerBgLine+this.yPaddingTop,this.unitLengthX);
      }
    }
    //绘制背景线
    if(this.showBgLines){
       var x = this.axisMargin;
       this.context.lineWidth=1;
       this.context.strokeStyle=this.bgLineColor;
       for( var i=0;i< this.yBgLinesCount;i++ ){
            var y = (this.yBgLinesCount-1-i)*this.pixelsPerBgLine+this.yPaddingTop;
            this.context.moveTo(x,y);
            this.context.lineTo(this.canvas.width-this.axisMargin*(this.yCount-1),y);
            this.context.stroke();
       }
    }
    this.context.closePath();
  },
  
  drawLines:function(){//绘制数据线和数据点
      for(var j=0;j<2;j++){
          //绘制数据线
          this.context.beginPath();
          this.context.lineWidth="2";
          this.context.strokeStyle=this.lineColors[j];
          for(var i=0;i< this.nodeList.length;i++){
            var x = this.axisMargin + this.unitLengthX*(i+0.5);
            var y = j==0 ? this.getCoordY1(this.nodeList[i].y1) : this.getCoordY2(this.nodeList[i].y2);
            this.context.lineTo(x,y);
          }
          this.context.stroke();
          this.context.closePath();
          //绘制数据线上的点
          this.context.beginPath();
          this.context.fillStyle=this.dotColor;
          for( var i=0;i< this.nodeList.length;i++ ){
             var x = this.axisMargin + this.unitLengthX*(i+0.5);
             var y = j==0 ? this.getCoordY1(this.nodeList[i].y1) : this.getCoordY2(this.nodeList[i].y2);
             this.context.moveTo(x,y);
             this.context.arc(x,y,3,0,Math.PI*2,true);//绘制数据线上的点
             this.context.fill();
          }
          this.context.closePath();
          //绘制折线名称
          this.drawLineName(j);
      }
  },
      
  getCoordY1:function(valueY){
      var y = (valueY-this.minY1)*this.pixelsPerBgLine/this.yGradient1;
      return this.canvas.height-this.axisMargin-this.yPaddingBottom-y;
  },//纵坐标Y(注意 纵坐标的算法是倒着的因为原点在最上面)
  getCoordY2:function(valueY){
      if(this.yCount == 1){
        return this.getCoordY1(valueY)
      }
      var y = (valueY-this.minY2)*this.pixelsPerBgLine/this.yGradient2;
      return this.canvas.height-this.axisMargin-this.yPaddingBottom-y;
  },//纵坐标Y(注意 纵坐标的算法是倒着的因为原点在最上面)
  getYPixel:function(){
      var yBgLinesCount = parseInt((this.maxY1-this.minY1)/this.yGradient1)+1;
      if(this.yCount == 2){
        var yBgLinesCount2 = parseInt((this.maxY2-this.minY2)/this.yGradient2)+1;
        if(yBgLinesCount < yBgLinesCount2){
          yBgLinesCount = yBgLinesCount2;
        }
      }
      return {pixelsPerBgLine:(this.canvas.height-this.axisMargin-this.yPaddingBottom-this.yPaddingTop)/(yBgLinesCount-1),yBgLinesCount:yBgLinesCount};
  },//yBgLinesCount:y轴梯度数目,pixelsPerBgLine:每个梯度的像素数
  getExtremum:function(){
	  var max1=parseFloat(this.nodeList[0].y1),min1=parseFloat(this.nodeList[0].y1),max2=parseFloat(this.nodeList[0].y2),min2=parseFloat(this.nodeList[0].y2);
	  for(var i=0;i<this.nodeList.length;i++){
		  if(parseFloat(this.nodeList[i].y1) > max1) {max1=parseFloat(this.nodeList[i].y1);}
		  if(parseFloat(this.nodeList[i].y1) < min1) {min1=parseFloat(this.nodeList[i].y1);}
		  if(parseFloat(this.nodeList[i].y2) > max2) {max2=parseFloat(this.nodeList[i].y2);}
		  if(parseFloat(this.nodeList[i].y2) < min2) {min2=parseFloat(this.nodeList[i].y2);}
	  }
    if(this.yCount == 1){
      max1 = max1 > max2 ? max1 : max2
      min1 = min1 < min2 ? min1 : min2
      return {max1:Math.ceil(max1/this.yGradient1)*this.yGradient1,min1:Math.floor(min1/this.yGradient1)*this.yGradient1};
    }else{
      return {max1:Math.ceil(max1/this.yGradient1)*this.yGradient1,min1:Math.floor(min1/this.yGradient1)*this.yGradient1,
        max2:Math.ceil(max2/this.yGradient2)*this.yGradient2,min2:Math.floor(min2/this.yGradient2)*this.yGradient2};
    }
  },//获得y轴梯度线的最值
      
  drawLineName:function(lineindex){
    var x = this.axisMargin+10;
    var y = 20*(lineindex) + 10;
    this.context.beginPath();
    this.context.textAlign = "left";
    this.context.strokeStyle = this.lineColors[lineindex];
    this.context.font = this.fontLineName;
    this.context.moveTo(x,y);
    this.context.lineTo(x+50,y);
    this.context.stroke();
    this.context.fillText(this.lineNames[lineindex],x+60,y,150);
    this.context.closePath();
  }   
}
