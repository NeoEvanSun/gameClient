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

  if(userCardVm.outGangCards && userCardVm.outGangCards.length >0){
    for(var i =0;i<userCardVm.outGangCards.length;i++){
      seqsString += staticCardNames[userCardVm.outGangCards[i][0]];
      seqsString += staticCardNames[userCardVm.outGangCards[i][1]];
      seqsString += staticCardNames[userCardVm.outGangCards[i][2]];
      if(userCardVm.outGangCards[i][3]){
        seqsString += staticCardNames[userCardVm.outGangCards[i][3]];
      }
      seqsString += "-"
    }
  }

  if(userCardVm.inGangCards && userCardVm.inGangCards.length >0){
    for(var i =0;i<userCardVm.inGangCards.length;i++){
      seqsString += staticCardNames[userCardVm.inGangCards[i][0]];
      seqsString += staticCardNames[userCardVm.inGangCards[i][1]];
      seqsString += staticCardNames[userCardVm.inGangCards[i][2]];
      if(userCardVm.inGangCards[i][3]){
        seqsString += staticCardNames[userCardVm.inGangCards[i][3]];
      }
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

  var tinged = userCardVm.tinged;
  var zhuang = userCardVm.zhuang;
  var auto = userCardVm.auto;

  this.showStatus = function(){
    var str = "当前玩家【"+userCardVm.userId+"】坐位:"+postionName+"风 ";
    str += " 牌数 x"+cardsNum;
    if(zhuang){
      str += " 庄家 ";
    }
    if(auto){
      str += " 托管中 ";
    }

    if(tinged){
      str += " 已上听 ";
    }

    console.log(str);
    console.log("静态牌:"+seqsString);
    console.log(cardsStatus);
  }
}

module.exports = PlayerInfo;
