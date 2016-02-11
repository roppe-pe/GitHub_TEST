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
  //キャラ配列[キャラ番号]
  charaAry : [],
  //弾配列[キャラ番号][弾番号]
  bulletAry : []
  //アイテム配列？
  
  
};

//ゲーム設定定数
CFG = {
  SCREEN_WIDTH : 800,
  SCREEN_HEIGHT : 600,
  STATUS_FIELD_WIDTH : 800,
  STATUS_FIELD_HEIGHT : 150,
  
  //ゲーム終了時間(秒)
  TIME_LIMIT : 3,
  //音量
  
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
phina.define('TitleScene', {
  superClass : 'phina.game.TitleScene',
  init : function(){
    this.superInit({
      title : 'RoboCon',
      backgroundColor : '#666',
      width : CFG.SCREEN_WIDTH,
      height : CFG.SCREEN_HEIGHT,
    });
  },
});


//メインシーン
phina.define('MainScene', {
  superClass: 'CanvasScene',
  
  init: function() {
    this.superInit({
      width : CFG.SCREEN_WIDTH,
      height : CFG.SCREEN_HEIGHT,
    });
    this.backgroundColor = '#ccc';
    
    //経過時間初期化
    CMN.age = 0;
    
    this.timeLabel = phina.display.Label({
      text : '',
      fill : 'black',
      alpha : 0.5,
      fontSize : 30,
    }).setPosition(CFG.SCREEN_WIDTH - 200, CFG.STATUS_FIELD_HEIGHT + 50).addChildTo(this);
    
    this.createChara();
    this.createStatusField();
    
  },
  
  update : function(app){
    CMN.age++;
    this.timeLabel.text = 'Time Limit : ' + Math.floor(CMN.age / 30);
    //test
    CMN.charaAry[0].hp--;
    CMN.charaAry[1].hp--;
    // for(var i = 0; i < 3; i++){
    //   CMN.charaAry[i].update();
    // }
    
    this.gameEnd(app);
    
  },
  
  gameEnd : function(app){
    var gameEndFlag = false;
    var liveCount = 3;
    
    for(var i = 0; i < 3; i++){
      if(CMN.charaAry[i].deathFlag === true){
        liveCount--;
      }
    }
    //生き残りが1人以下
    if(liveCount <= 1){
      gameEndFlag = true;
    }
    //タイムアップ
    if(Math.floor(CMN.age / 30) > CFG.TIME_LIMIT){
      gameEndFlag = true;
    }
    
    if(gameEndFlag === true){
      // #各キャラの残りHPを引数にする
      // app.replaceScene(EndScene(CMN.charaAry));
      this.exit({
        score : CMN.charaAry[0].hp,
        message : '順位',
      });
      
    }
    
  },
  
  createChara : function(){
    //キャラNoのシャッフル
    for(var i = 0; i < 3; i++){
      var charaNo = [0, 1, 2];
      var r = CMN.func.randInt(0, 2);
      var temp = charaNo[i];
      charaNo[i] = charaNo[r];
      charaNo[r] = temp;
    }
    //ランダム位置にキャラ生成
    CMN.charaAry[charaNo[0]] = RoppeChara(
      CMN.func.randInt(
        PRM.CHARA_STATUS.size / 2, 
        CFG.SCREEN_WIDTH - PRM.CHARA_STATUS.size / 2
      ),
      CMN.func.randInt(
        CFG.STATUS_FIELD_HEIGHT + PRM.CHARA_STATUS.size / 2, 
        CFG.SCREEN_HEIGHT - PRM.CHARA_STATUS.size / 2
      ), 
      charaNo[0] 
    ).addChildTo(this);
    
    CMN.charaAry[charaNo[1]] = Roppe2Chara(
      CMN.func.randInt(
        PRM.CHARA_STATUS.size / 2, 
        CFG.SCREEN_WIDTH - PRM.CHARA_STATUS.size / 2
      ),
      CMN.func.randInt(
        CFG.STATUS_FIELD_HEIGHT + PRM.CHARA_STATUS.size / 2, 
        CFG.SCREEN_HEIGHT - PRM.CHARA_STATUS.size / 2
      ), 
      charaNo[1] 
    ).addChildTo(this);
    
    CMN.charaAry[charaNo[2]] = RoppeChara(
      CMN.func.randInt(
        PRM.CHARA_STATUS.size / 2, 
        CFG.SCREEN_WIDTH - PRM.CHARA_STATUS.size / 2
      ),
      CMN.func.randInt(
        CFG.STATUS_FIELD_HEIGHT + PRM.CHARA_STATUS.size / 2, 
        CFG.SCREEN_HEIGHT - PRM.CHARA_STATUS.size / 2
      ), 
      charaNo[2] 
    ).addChildTo(this);
    
  },
  
  createStatusField : function(){
    var statusField = [];
    for(var i = 0; i < 3; i++){
      statusField[i] = CharaStatus(i * CFG.STATUS_FIELD_WIDTH / 3, 0, CFG.STATUS_FIELD_WIDTH / 3, CFG.STATUS_FIELD_HEIGHT, CMN.charaAry[i]).addChildTo(this);
    }
    
    
  },
  
});



//エンドシーン
// phina.define('EndScene', {
//   superClass : 'phina.game.ResultScene',
//   // #各キャラの残りHPを引数に
//   init : function(charaAry){
//     this.superInit({
//       title : '順位',
//       backgroundColor : '#973',
//       width : CFG.SCREEN_WIDTH,
//       height : CFG.SCREEN_HEIGHT,
//     });
    
//     var label = Label(charaAry[0].hp).addChildTo(this);
//     label.x = this.gridX.center();
//     label.y = this.gridY.center();
//     label.fill = 'black';
    
//   },
  
//   onnextscene : function(e){
//     e.target.app.replaceScene(TitleScene());
//   },
  
// });





//----------画面構成要素----------

//ステータス領域
// #作成中 grid使うか？
phina.define('CharaStatus', {
  superClass : 'RectangleShape',
  init : function(x, y, width, height, charaAry){
    this.superInit({
      width : width,
      height : height,
      fill : '#aaa'
    });
    
    this.x = x + this.width / 2;
    this.y = y + this.height / 2;
    this.charaAry = charaAry;
    this.nameLabel = phina.display.Label({
      text : this.charaAry.name,
      fill : this.charaAry.color,
      fontSize : 30,
    }).setPosition(0, -this.height/2 + 30/2).addChildTo(this);
    
    var barWidth = this.width;
    var barHeight = 30;
    
    this.hpBar = new Bar(-this.width/2, -this.height/2 + 30, barWidth, barHeight, '#F52','#222', this.charaAry.hp, this.charaAry.maxHp).addChildTo(this);
    this.spBar = new Bar(-this.width/2, -this.height/2 + 70, barWidth, barHeight, '#2F5','#222', this.charaAry.sp, this.charaAry.maxSp).addChildTo(this);
    this.mpBar = new Bar(-this.width/2, -this.height/2 + 110, barWidth, barHeight, '#52F','#222', this.charaAry.mp, this.charaAry.maxMp).addChildTo(this);
    
  },
  
  update : function(){
    this.hpBar.setValue(this.charaAry.hp);
    this.spBar.setValue(this.charaAry.sp);
    this.mpBar.setValue(this.charaAry.mp);
  },
  
});








//---その他必要なもの---

//キャラをaddするレイヤー
//弾をaddするレイヤー
//ステータス、タイマーなどをAddするレイヤー

//時間制限タイマー（タイマー表示とタイムアップ）
//ゲーム終了画面（残りHPと順位表示）

//色生成関数（弾の種類ごとに明度違いの同色を使いたい）
