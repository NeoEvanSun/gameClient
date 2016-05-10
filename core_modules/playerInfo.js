var staticCardNames = require("./staticCardNames");
var PlayerInfo = function(userCardVm){
  var playerCardStatus = userCardVm;
  var postionName = "";
  switch (userCardVm.position) {
    case 0:postionName = "东";break;
    case 1:postionName = "南";break;
    case 2:postionName = "西";break;
    case 3:postionName = "北";break;
    default:
  }
  var seqsString = "";
  if(userCardVm.eatSequences && userCardVm.eatSequences.length >0 ){
    for(var i =0;i<userCardVm.eatSequences.length;i++){
      seqsString += staticCardNames[userCardVm.eatSequences[i][0]];
      seqsString += staticCardNames[userCardVm.eatSequences[i][1]];
      seqsString += staticCardNames[userCardVm.eatSequences[i][2]];
      seqsString += "-"
    }
  }
  if(userCardVm.pengSequences && userCardVm.pengSequences.length >0 ){
    for(var i =0;i<userCardVm.pengSequences.length;i++){
      seqsString += staticCardNames[userCardVm.pengSequences[i][0]];
      seqsString += staticCardNames[userCardVm.pengSequences[i][1]];
      seqsString += staticCardNames[userCardVm.pengSequences[i][2]];
      seqsString += "-"
    }
  }
  if(seqsString!=""){
    seqsString.substring(0,seqsString.length-1);
  }

  var cards = userCardVm.cards;
  var cardsStatus = "[";
  var cardsNum = 0;
  for(var i = 0;i<cards.length;i++){
    if(cards[i]>0){
      cardsNum += cards[i];
      for(var j =0;j<cards[i];j++){
        cardsStatus+=" "+staticCardNames[i]+"("+i+") ";
      }
    }
  }
  cardsStatus += "]";

  this.showStatus = function(){
    console.log("当前玩家坐位:"+postionName+",牌数 x"+cardsNum);
    console.log("静态牌:"+seqsString);
    console.log(cardsStatus);
  }
}

module.exports = PlayerInfo;
