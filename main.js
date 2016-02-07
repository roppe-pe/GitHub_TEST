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
