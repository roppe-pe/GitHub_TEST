//roppe個人用PG
//main.jsを利用

//roppe'sキャラ
phina.define('RoppeChara', {
  superClass : 'CharaBase',
  init : function(x, y, no){
    this.superInit({
      x : x,
      y : y,
      no : no,
      name : 'roppe',
      color : '#ff0',
    });
  },
  
  move : function(){
    if(this.mp > this.maxMp/2){
      this.moveRandom();
    }
  },
  
  moveRandom : function(){
    var moveX = CMN.func.randInt(
       - PRM.CHARA_STATUS.speed, 
         PRM.CHARA_STATUS.speed
         );
    var moveY = CMN.func.randInt(
       - PRM.CHARA_STATUS.speed, 
         PRM.CHARA_STATUS.speed
         );
    this.moveCharaBy(moveX, moveY, this.mp);
  },
  
  shot : function(){
    
  },
  
});

//testキャラ
phina.define('Roppe2Chara', {
  superClass : 'CharaBase',
  init : function(x, y, no){
    this.superInit({
      x : x,
      y : y,
      no : no,
      name : 'roppe',
      color : '#00f',
    });
    
  },
  
  move : function(){
    if(this.mp > this.maxMp/2){
      this.moveRandom();
    }
  },
  
  moveRandom : function(){
    var moveX = CMN.func.randInt(
       - PRM.CHARA_STATUS.speed, 
         PRM.CHARA_STATUS.speed
         );
    var moveY = CMN.func.randInt(
       - PRM.CHARA_STATUS.speed, 
         PRM.CHARA_STATUS.speed
         );
    this.moveCharaBy(moveX, moveY, this.mp);
  },
  
  shot : function(){
    
  },
  
});

