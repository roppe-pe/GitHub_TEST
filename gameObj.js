//ゲーム上のオブジェクトに関するPG



//----------継承元クラス----------

//キャラ基底クラス
phina.define('CharaBase', {
  superClass : 'RectangleShape',
  init : function(options){
    options = (options || {}).$safe({
      x : 0,
      y : 0,
      no : 9999,
      name : 'NoName',
      color : '#222',
    });
    this.superInit({
      width : PRM.CHARA_STATUS.size,
      height : PRM.CHARA_STATUS.size,
      strokeWidth : 0,
      fill : options.color,
    });
    
    this.no = options.no;
    this.name = options.name;
    this.color = options.color;
    // this.label = Label(this.name).addChildTo(this);
    //test
    this.label = Label(this.no).addChildTo(this);
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
    // キャラ生成からの経過時間
    this.age = 0;
    this.update();
  },
  
  update : function(){
    this.age++;
    //キャラ側でCMN.charaAry[0].xなどを参照した時にエラーになるのを防ぐため１フレ待つ
    if(this.age > 1){
      this.status();
      this.death();
      this.move();
      this.shot();
      this.hitChara();
      this.control();
    }
  },
  
  
  status : function(){
    //HP系
    if(this.maxHp <= this.hp){
      this.hp = this.maxHp;
    }
    if(this.hp <= 0){
      //死亡
      this.deathFlag = true;
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
    var right = CFG.SCREEN_WIDTH - this.width / 2;
    var top = CFG.STATUS_FIELD_HEIGHT + this.height / 2;
    var bottom = CFG.SCREEN_HEIGHT - this.height / 2;
    
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
    if(x < - PRM.CHARA_STATUS.speed){
      x = - PRM.CHARA_STATUS.speed;
    }
    if(x > PRM.CHARA_STATUS.speed){
      x = PRM.CHARA_STATUS.speed;
    }
    if(y < - PRM.CHARA_STATUS.speed){
      y = - PRM.CHARA_STATUS.speed;
    }
    if(y > PRM.CHARA_STATUS.speed){
      y = PRM.CHARA_STATUS.speed;
    }
    
    if(currentMp <= 0){
      this.x += 0;
      this.y += 0;
    }else{
      this.x += x;
      this.y += y; 
      // #移動量ベクトルで動的に減らすように変更する
      this.mp -= 1;
    }
    
};



//弾クラス
phina.define('Bullet', {
  superClass : 'RectangleShape',
  init : function(x, y, color){
    this.superInit({
      width : PRM.BULLET_STATUS.size,
      height : PRM.BULLET_STATUS.size,
      fill : color,
    });
    
    this.x = x;
    this.y = y;
    
    //弾能力
    this.damage = PRM.BULLET_STATUS.damage;
  
  },
  
  update : function(){
    
    this.move();
    this.control();
    this.hitChara();
  },
  
  control : function(){
  //壁外に出たら弾削除
  var left =  - this.width / 2;
  var right = CFG.SCREEN_WIDTH + this.height / 2;
  var top = CFG.STATUS_FIELD_HEIGHT - this.height / 2;
  var bottom = CFG.SCREEN_HEIGHT + this.width / 2;
  
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
  if(x < - PRM.BULLET_STATUS.speed){
    x = - PRM.BULLET_STATUS.speed;
  }
  if(x > PRM.BULLET_STATUS.speed){
    x = PRM.BULLET_STATUS.speed;
  }
  if(y < - PRM.BULLET_STATUS.speed){
    y = - PRM.BULLET_STATUS.speed;
  }
  if(y > PRM.BULLET_STATUS.speed){
    y = PRM.BULLET_STATUS.speed;
  }
  
  this.x += x;
  this.y += y;
};


