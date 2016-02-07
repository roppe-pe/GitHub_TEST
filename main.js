/*
 * runstant lite
 */

// 'use strict'

var CMN = function(){};


//定数
CMN = {
  SCREEN_WIDTH : 800,
  SCREEN_HEIGHT : 600,
  CHARA_STATUS : {
    size : 50,
    hp : 100,
    sp : 100,
    mp : 100,
    speed : 5,
  },
  BULLET_STATUS : {
    size : 10,
    damage : 5,
    speed : 5,
  },
  //メインシーン開始時からの経過フレーム数
  age : 0,
};

phina.globalize();

//----------シーン----------

//メインシーン
phina.define('MainScene', {
  superClass: 'CanvasScene',
  
  init: function() {
    this.superInit({
      width : CMN.SCREEN_WIDTH,
      height : CMN.SCREEN_HEIGHT,
    });
    this.backgroundColor = '#ccc';
    var label = Label('Hello, runstant!').addChildTo(this);
    label.x = this.gridX.center();
    label.y = this.gridY.center();
    label.fill = 'black';
    
    CMN.age = 0;
    
    this.myUnit = RoppeChara(200, 200).addChildTo(this);
    this.myUnit.setPosition(200, 200);
    
    var myUnit = CharaBase(0, 0, 'roppe', '#f55').addChildTo(this);

  },
  
  update : function(app){
    CMN.age++;
    console.log(CMN.age);
    this.myUnit.update();
  }
});



//----------継承元クラス----------

//キャラ基底クラス
phina.define('CharaBase', {
  superClass : 'RectangleShape',
  init : function(options){
    options = (options || {}).$safe({
      x : 0,
      y : 0,
      name : 'NoName',
      color : '#000',
    });
    this.superInit({
      width : CMN.CHARA_STATUS.size,
      height : CMN.CHARA_STATUS.size,
      strokeWidth : 0,
      fill : options.color,
    });
    
    this.name = options.name;
    this.label = Label(this.name).addChildTo(this);
    this.x = options.x;
    this.y = options.y;
    
    //自機能力
    this.maxHp = 100; //MAXヒットポイント
    this.maxSp = 100; //MAXショットポイント
    this.maxMp = 100; //MAXムーブポイント
    this.hp = this.maxHp; //現在ヒットポイント
    this.sp = this.maxSp; //現在ショットポイント
    this.mp = this.maxMp; //現在ムーブポイント
    
    this.deathFlag = false;
    this.update();
  },
  
  update : function(){
    
    this.status();
    this.move();
    this.shot();
    this.hitChara();
    this.control();
    
  },
  
  
  status : function(){
    //HP系
    if(this.maxHp <= this.hp){
      this.hp = this.maxHp;
    }
    if(this.hp <= 0){
      //死亡
      this.death();
    }
    
    //SP系
    if(this.maxSp <= this.sp){
      this.sp = this.maxSp;
    }
    if(this.maxSp > this.sp){
      this.sp++;
    }
    
    
    //MP系
    if(this.maxMp <= this.mp){
      this.mp = this.maxMp;
    }
    if(this.maxMp > this.mp){
      this.mp++;
    }
  },
  
  //死亡処理
  death : function(){
    if(this.deathFlag === true){
      this.remove();
    }
  },
  
  control : function(){
    //壁衝突による座標修正
    var left = this.width / 2;
    var right = CMN.SCREEN_WIDTH - this.height / 2;
    var top = this.height / 2;
    var bottom = CMN.SCREEN_HEIGHT - this.width / 2;
    
    if(this.x < left){this.x = left;}
    if(this.x > right){this.x = right;}
    if(this.y < top){this.y = top;}
    if(this.y > bottom){this.y = bottom;}
    
  },
  
  //敵衝突による座標修正
  hitChara : function(){
    
  },
  
  //*各自継承して実装*
  move : function(){
    //this.moveCharaBy(x, y)で状況に応じて移動するだけ
    //各種移動タイプは直接move()内に記述せず継承先キャラクラスのプロトタイプとして用意し、this.hogeMOVEとして記述する
    
  },
  
  //*各自継承して実装*
  shot : function(){
    //Bulletクラスを継承した各種弾を状況に応じて生成するだけ
    
  },
  
});


//キャラ移動関数
//@継承先キャラクラスmove()内でthis.moveCharaBy()で使う
CharaBase.prototype.moveCharaBy = function(x, y, currentMp){
    //速度制限
    if(x < - CMN.CHARA_STATUS.speed){
      x = - CMN.CHARA_STATUS.speed;
    }
    if(x > CMN.CHARA_STATUS.speed){
      x = CMN.CHARA_STATUS.speed;
    }
    if(y < - CMN.CHARA_STATUS.speed){
      y = - CMN.CHARA_STATUS.speed;
    }
    if(y > CMN.CHARA_STATUS.speed){
      y = CMN.CHARA_STATUS.speed;
    }
    
    if(currentMp <= 0){
      this.x += 0;
      this.y += 0;
    }else{
      this.x += x;
      this.y += y; 
      this.mp -= 1;
    }
    
};

//弾クラス
phina.define('Bullet', {
  superClass : 'RectangleShape',
  init : function(x, y, color){
    this.superInit({
      width : CMN.BULLET_STATUS.size,
      height : CMN.BULLET_STATUS.size,
      fill : color,
    });
    
    this.x = x;
    this.y = y;
    
    //弾能力
    this.damage = CMN.BULLET_STATUS.damage;
  
  },
  
  update : function(){
    
    this.move();
    this.control();
    this.hitChara();
  },
  
  control : function(){
  //壁外に出たら弾削除
  var left = - this.width / 2;
  var right = CMN.SCREEN_WIDTH + this.height / 2;
  var top = - this.height / 2;
  var bottom = CMN.SCREEN_HEIGHT + this.width / 2;
  
  if(this.x < left){this.remove();}
  if(this.x > right){this.remove();}
  if(this.y < top){this.remove();}
  if(this.y > bottom){this.remove();}
  
  
  },
  
  //敵キャラとの当たり判定
  hitChara : function(){
    
  },
  
  //*継承して各自実装*
  move : function(){
    
  },
  
});

//弾移動関数
//@継承先弾クラスのmove()内でthis.moveBulletBy()で使う
//#角速度とかつければ、ホーミング性能に限界ができてよい？
Bullet.prototype.moveBulletBy = function(x, y){
    //速度制限
  if(x < - CMN.BULLET_STATUS.speed){
    x = - CMN.BULLET_STATUS.speed;
  }
  if(x > CMN.BULLET_STATUS.speed){
    x = CMN.BULLET_STATUS.speed;
  }
  if(y < - CMN.BULLET_STATUS.speed){
    y = - CMN.BULLET_STATUS.speed;
  }
  if(y > CMN.BULLET_STATUS.speed){
    y = CMN.BULLET_STATUS.speed;
  }
  
  this.x += x;
  this.y += y;
};


//----------共通関数----------
CMN.func = {
  //ランダム整数を返す(min <= x <= max)
  randInt : function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  
  
};

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


//----------ゲーム開始処理----------

//GameAppのコンストラクタに連想配列形式でパラメータを与える
phina.main(function() {
  var app = GameApp({
    //最初に読み込むシーンにTitleSceneを指定
    startLabel : 'title',
    width : CMN.SCREEN_WIDTH,
    height : CMN.SCREEN_HEIGHT,
  });
  
  //FPS表示
  app.enableStats();
  
  // ↓？
  // document.body.appendChild(app.domElement);
  app.run();
});


//---その他必要なもの---

//キャラをaddするレイヤー
//弾をaddするレイヤー

//ステータスバー表示（キャラにつけるHP,SP,MP）

//時間制限タイマー（タイマー表示とタイムアップ）
//ゲーム終了画面（残りHPと順位表示）

//色生成関数（弾の種類ごとに明度違いの同色を使いたい）
