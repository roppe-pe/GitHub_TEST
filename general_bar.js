//--------------------------------------------
// ■ 汎用バー
//--------------------------------------------
// ◆ methods
//  new Bar(x, y, width, height, color, backgroundColor, nowValue, maxValue)
//    int x      : 描画先X座標（左上）
//    int y      : 描画先Y座標（左上）
//    int width  : バーの幅
//    int height : バーの高さ
//    color color           : バーの色
//    color backgroundColor : バーの背景色
//    numeric nowValue : 現在値
//    numeric maxValue : 最大値
//
//  setValue(value):
//    バーの現在値をセットする
//    numeric value:現在値にセットする値
//--------------------------------------------
// ◆ public params (他のメンバの変更は非推奨)
//    int x      : 描画先X座標（左上）
//    int y      : 描画先Y座標（左上）
//--------------------------------------------
// ◇ 使用例
// this.bar1 = new Bar(this.gridX.center()-200, this.gridY.center(), 450, 10, '#F52','#222', 100, 100).addChildTo(this);
// this.bar1.setValue(60);
//--------------------------------------------
phina.define('Bar', {
  superClass: 'RectangleShape',
  
  //初期化
  init: function(x, y, width, height, color, backgroundColor, nowValue, maxValue) {
    this.superInit({
      width : width,
      height : height,
      fill : backgroundColor,
      strokeWidth: 2,
    });
    
    this.x = x + width / 2;  //X座標（左上）
    this.y = y + height / 2; //Y座標（左上）
    this._x = this.x; //元のX座標
    this._y = this.y; //元のY座標
    
    this.nowValue = nowValue; //バーの現在値
    this.maxValue = maxValue; //バーの最大値
    this.prvValue = nowValue; //nowValueの前回の値
    
    this.PADDING = 4; //定数：内側の長方形(現在値バー)の余白
    
    //前の値からの差を表示するバーの描画
    this.dummyRectangleShape = RectangleShape({
      width  : 0,
      height : this.height - this.PADDING,
      fill : '#A00',
      stroke: null,
      }).addChildTo(this);
    this.dummyAnimeCount = 0;
    this.dummyRectangleShape.alpha = 0.0;
    
    //現在値のバーの描画
    this.nowValueRectangleShape = RectangleShape({
      width  : this.width - this.PADDING,
      height : this.height - this.PADDING,
      fill : color,
      stroke: backgroundColor,
      strokeWidth: 0,
      }).addChildTo(this);
    
    //（テスト）値チェック
    // TODO : 本番時 要消去
    this.testLabel = Label("" + this.nowValue + " / " + this.maxValue).addChildTo(this);
    this.testLabel.fill = '#FFF';
    
  },

  update: function(app){
    var rate = this.nowValue / this.maxValue;
    this.nowValueRectangleShape.width = rate * (this.width - this.PADDING);
    this.nowValueRectangleShape.x = (this.nowValueRectangleShape.width - this.width) / 2 + 2; //(最後の+2は調整値です...)
    
    //dummyのアニメ
    if(this.dummyAnimeCount > 0){
     
      if(this.dummyAnimeCount >= 45){
        var rateDummy = this.prvValue / this.maxValue;
        this.dummyRectangleShape.width = rateDummy * (this.width - this.PADDING);
        this.dummyRectangleShape.alpha = 1.0;
        
        /*  //HPダメージ用シェイク
        if(this.dummyAnimeCount % 2 == 0){
          this.x -= Math.random() * this.height/2 - this.height/4;
          this.y -= Math.random() * this.height/2 - this.height/4;
        }else{
          this.x = this._x;
          this.y = this._y;
        }
        */
      }else{
        this.x = this._x;
        this.y = this._y;
        var width1 = this.dummyRectangleShape.width;
        var width2 = this.nowValueRectangleShape.width;
        this.dummyRectangleShape.alpha -= 1.0/45.0;
        this.dummyRectangleShape.width -= (width1-width2)/8.0;
      }
      this.dummyRectangleShape.x = (this.dummyRectangleShape.width-this.width) / 2 + 2;
      this.dummyAnimeCount--;
    }
    

  },
  
  //値をセットするときはこの関数を使うこと！
  setValue: function(value){
    if(this.prvValue > value){
      //減算表現開始
      //前回値を覚えておく
      this.prvValue = this.nowValue;
      this.dummyAnimeCount = 60;
    }
    
    value = this.checkMaxMin(value);  //valueは0~maxValueの範囲内にする 
    this.nowValue = value;
    

    //（テスト）値チェック
    // TODO : 本番時 要消去
    this.testLabel.text = "" + this.nowValue + " / " + this.maxValue;
  },
  
  checkMaxMin: function(value){
    if(value > this.maxValue){
      value = this.maxValue;
    }else if(value < 0){
      value = 0;
    }
    return value;
  },
  
});
//--------------------------------------------
// □ 汎用バー ここまで
//--------------------------------------------