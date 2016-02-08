/*
 * runstant lite
 */

// 'use strict'

var CMN = function(){};
var CFG = function(){};
var PRM = function(){};

//共通定数
CMN = {
  //メインシーン開始時からの経過フレーム数
  age : 0,
  //キャラ配列
  
  //弾配列
  
  //アイテム配列？
  
  
};

//ゲーム設定定数
CFG = {
  SCREEN_WIDTH : 800,
  SCREEN_HEIGHT : 600,
  STATUS_FIELD_WIDTH : CFG.SCREEN_WIDTH,
  STATUS_FIELD_HEIGHT : 100,
  STATUS_FIELD : {
    LEFT : 0,
    RIGHT : CFG.STATUS_FIELD_WIDTH,
    TOP : 0,
    BOTTOM :CFG.STATUS_FIELD_HEIGHT,
  },
  BATTLE_FIELD_WIDTH : CFG.SCREEN_WIDTH,
  BATTLE_FIELD_HEIGHT : CFG.SCREEN_HEIGHT - CFG.STATUS_FIELD_HEIGHT,
  BATTLE_FIELD : {
    LEFT : 0,
    RIGHT : CFG.BATTLE_FIELD_WIDTH,
    TOP : 0,
    BOTTOM :CFG.SCREEN_HEIGHT,
  },
  //音量
  
  //プレイヤー人数
  
  //アイテム使用可否フラグ？
  
  
};

//ステータスなどのゲームバランスに関わるパラメータ
PRM = {
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
  //ゲーム終了時間
  
  
};




phina.globalize();

//----------ゲーム開始処理----------

//GameAppのコンストラクタに連想配列形式でパラメータを与える
phina.main(function() {
  var app = GameApp({
    //最初に読み込むシーンにTitleSceneを指定
    startLabel : 'title',
    width : CFG.SCREEN_WIDTH,
    height : CFG.SCREEN_HEIGHT,
  });
  
  //FPS表示
  app.enableStats();
  
  // ↓？
  // document.body.appendChild(app.domElement);
  app.run();
});


//----------シーン----------

//タイトルシーン



//メインシーン
phina.define('MainScene', {
  superClass: 'CanvasScene',
  
  init: function() {
    this.superInit({
      width : CFG.SCREEN_WIDTH,
      height : CFG.SCREEN_HEIGHT,
    });
    this.backgroundColor = '#ccc';
    var label = Label('Hello, runstant!').addChildTo(this);
    label.x = this.gridX.center();
    label.y = this.gridY.center();
    label.fill = 'black';
    
    
    //経過時間初期化
    CMN.age = 0;
    
    this.myUnit = RoppeChara(200, 200).addChildTo(this);
    
    this.bar1 = new Bar(this.gridX.center()-200, this.gridY.center(), 150, 20, '#F52','#222', 100, 100).addChildTo(this);
this.bar1.setValue(60);
  },
  
  update : function(app){
    CMN.age++;
    console.log(CMN.age);
    this.myUnit.update();
  },
});



//エンドシーン






//----------画面構成要素----------

//ステータス領域
// #作成中 grid使うか？
phina.define('CharaStatus', {
  superClass : 'RectangleShape',
  init : function(){
    this.superInit({
      
    });
  },
  
  
});








//---その他必要なもの---

//キャラをaddするレイヤー
//弾をaddするレイヤー

//時間制限タイマー（タイマー表示とタイムアップ）
//ゲーム終了画面（残りHPと順位表示）

//色生成関数（弾の種類ごとに明度違いの同色を使いたい）
