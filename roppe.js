//roppe個人用PG
//main.jsを利用

//roppe'sキャラ
phina.define('RoppeChara', {
  superClass : 'CharaBase',
  init : function(x, y){
    this.superInit({
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
       - CMN.CHARA_STATUS.speed, 
         CMN.CHARA_STATUS.speed
         );
    var moveY = CMN.func.randInt(
       - CMN.CHARA_STATUS.speed, 
         CMN.CHARA_STATUS.speed
         );
    this.moveCharaBy(moveX, moveY, this.mp);
  },
  
  shot : function(){
    
  },
  
})



