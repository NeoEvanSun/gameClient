var WebSocket = require('faye-websocket');
var PlayerInfo = require('./core_modules/playerInfo');
var InputMod = require('./core_modules/inputmod');
var socket = require('./core_modules/socket');
var staticCardNames = require("./core_modules/staticCardNames");

var wsObject = new socket(execute);
var kr = new InputMod(wsObject);
kr.askAction();

function execute (dataString,userId){
  if(dataString){
    console.log(dataString);
    var jsonData = formatData(dataString);
    if(jsonData && jsonData.ret){
      executeOrder(jsonData.data,userId);
    }else{
      console.log("系统返回结果异常，返回报文:\n"+dataString);
    }
  }
}

function executeOrder (data,userId){
  if(data && data.commandType){
    var commandType = data.commandType;
    switch(commandType){
      case 900 : order900(data,userId);break;
      case 901 : order901(data,userId);break;
      case 902 : order902(data,userId);break;
      case 930 : order930(data,userId);break;
      case 100 : order100(data,userId);break;
      case 101 : order101(data,userId);break;
      case 102 : orderChiPeng(data,userId);break;
      case 103 : orderChiPeng(data,userId);break;
      case 1040 : order104(data,userId);break;
      case 1041 : order104(data,userId);break;
      case 105 : orderTingDa(data,userId);break;
      case 106 : orderTingDa(data,userId);break;
      case 107 : orderTingDa(data,userId);break;
      case 108 : orderTingDaResult(data,userId);break;
      case 206 : order206(data,userId);break;
      case 207 : order207(data,userId);break;
      case 930 : order930(data,userId);break;
      case 950 : order950(data,userId);break;
      case 910 : order910(data,userId);break;
      default : console.log("未定义指令结果:"+JSON.stringify(data));
    }
  }else{
    console.log("指令存在问题，或commandType不存在:"+JSON.stringify(data));
  }
}

//创建结果
function order900(data,userId){
  console.log("创建成功，房间ID:"+data.groupId);

}
//加入结果
function order901(data,userId){
  console.log("加入成功"+JSON.stringify(data));
  var otherPlayerCardVms = data.otherPlayerCardVms;
  console.log("\n--------------------\n");
  console.log("玩家"+userId+",加入");
  for(var playerUserId in otherPlayerCardVms){
    console.log("玩家"+playerUserId+",加入");
  }
  if(data.userId == userId){
    kr.setGroupId(data.groupId);
  }
}
//开局
function order902(data,userId){
  console.log("开局成功"+JSON.stringify(data));
  kr.setGroupId(data.groupId);
  //如果有提示性操作的话
  if(!data.allNoneTips && data.commandTypeTips){
    if(data.commandTypeTips.length ==0){
      console.log("其他玩家有操作");
      seeSelf(data);
    }else{
      var innerflag = false;
      for(var pro in data.commandTypeTips){
        innerflag = true;
      }
      if(innerflag){
        effectExecute(data.commandTypeTips,userId);
      }else{
        seeSelf(data);
        console.log("其他人有动作");
      }
    }
  }else if(userId == data.nextUserId){
    //如果自己是下一个打牌的人
    console.log(userId == data.nextUserId);
    kr.zhuaPai();
  }else{
    seeSelf(data);
    console.log("请等待其他玩家打牌");
  }
}
//打牌的响应
function order101(data,userId){
  console.log("玩家"+data.userId+"打出一张【"+staticCardNames[data.operateCards[0]]+"】");
  console.log("打牌响应报文:"+JSON.stringify(data));
  //如果有提示性操作的话
  if(!data.allNoneTips && data.commandTypeTips){
    if(data.commandTypeTips.length ==0){
      console.log("其他玩家有操作");
      seeSelf(data);
    }else{
      var innerflag = false;
      for(var pro in data.commandTypeTips){
        innerflag = true;
      }
      if(innerflag){
          effectExecute(data.commandTypeTips,userId);
      }else{
          seeSelf(data);
          console.log("其他人有动作");
      }
    }
  }else if(userId == data.nextUserId){
    //如果自己是下一个打牌的人
    kr.zhuaPai();
  }else{
    seeSelf(data);
    console.log("请等待其他玩家打牌");
  }
}
//抓牌响应，进入打牌状态
function order100(data,userId){
  console.log("摸牌响应报文:"+JSON.stringify(data));
  if(data.nextUserId == userId){
    console.log("摸到一张 "+staticCardNames[data.operateCards[0]]);
    var userCardVm = data.mycardVm;
    if(userCardVm){
      var playerInfo = new PlayerInfo(userCardVm);
      playerInfo.showStatus();
      var innerflag = false;
      for(var pro in data.commandTypeTips){
        innerflag = true;
      }
      if(innerflag){
          effectExecute(data.commandTypeTips,userId);
      }else{
          kr.enterDapai(userCardVm.cards);
      }
    }
  }else{
    seeSelf(data);
    console.log("玩家"+data.userId+"正在思考");
  }
}

//如果有影响的话，会执行该影响的操作
function effectExecute(commandTypeTips,userId){
  if(commandTypeTips){
    kr.effect(commandTypeTips);
  }
}

function orderChiPeng(data,userId){
  console.log("吃碰牌响应报文:"+JSON.stringify(data));
  if(data.nextUserId == userId){
    var userCardVm = data.mycardVm;
    if(userCardVm){
      var playerInfo = new PlayerInfo(userCardVm);
      playerInfo.showStatus();
      kr.enterDapai(userCardVm.cards);
    }
  }else{
    console.log("玩家"+data.userId+"正在思考");
  }
}

function order104(data,userId){
  if(data.nextUserId == userId){
    kr.zhuaPai();
  }else{
    console.log("请等待杠牌玩家打牌");
  }
}

function orderUndefind(data,userId){
  console.log("未细化指令集:"+JSON.stringify(data))
  if(data.nextUserId == userId){
      kr.zhuaPai();
  }else{
      console.log("请等待其他玩家打牌");
  }
}

function order930(data,userId){
  console.log("续连指令集:"+JSON.stringify(data))
  if(data.nextUserId == userId){
      kr.zhuaPai();
  }else{
      console.log("请等待其他玩家打牌");
  }
}

function order207(data,userId){
  console.log("过牌指令集:"+JSON.stringify(data));
  if(data.nextUserId == userId){
    var userCardVm = data.mycardVm;
    if(data.currentCommandType == 100 && userCardVm){
        kr.enterDapai(userCardVm.cards);
    }else{
        kr.zhuaPai();
    }
  }else{
      console.log("请等待其他玩家打牌");
  }
}

function formatData (dataString){
  var result = null;
  try{
    result = JSON.parse(dataString);
  }catch(e){
    console.log("error:"+JSON.stringify(e));
  }
  return result;
}

function seeSelf (data){
  var userCardVm = data.mycardVm;
  if(userCardVm){
    var playerInfo = new PlayerInfo(userCardVm);
    playerInfo.showStatus();
  }
}

function orderTingDa(data,userId){
  console.log("听打指令:"+JSON.stringify(data));
  if(data.operateCards){
    kr.tingDaPai(data.operateCards);
  }else{
   console.log("返回值错误");
  }
}

function orderTingDaResult(data,userId){
  console.log("听打指令返回值:"+JSON.stringify(data));
  seeSelf(data);
  console.log("玩家"+data.userId+"正在思考");
}

//重连响应处理
function order930(data,userId){
  console.log("续连指令返回值:"+JSON.stringify(data));
  seeSelf(data);
  if(!data.allNoneTips && data.commandTypeTips){
    var innerflag = false;
    for(var pro in data.commandTypeTips){
      innerflag = true;
    }
    if(innerflag){
      effectExecute(data.commandTypeTips,userId);
    }else{
      console.log("到玩家"+data.nextUserId+"玩了");
    }
  }else if(data.nextUserId == userId){
    if(data.currentUserId == userId && data.currentCommandType == 100){
        var userCardVm = data.mycardVm;
        kr.enterDapai(userCardVm.cards);
    }else{
        kr.zhuaPai();
    }
  }else{
    console.log("到玩家"+data.nextUserId+"玩了");
  }

}

function order206(data,userId){
  console.log("胡牌指令返回值:"+JSON.stringify(data));
  kr.afterHuAction();
}

function order950(data,userId){
  console.log("准备指令返回值:"+JSON.stringify(data));
  if(data.groupId){
    kr.setGroupId(data.groupId);
  }else{
    console.log("准备结果集返回异常");
  }
}
function order910(data,userId){
  console.log("退出指令返回值:"+JSON.stringify(data));
  console.log("玩家"+data.userId+"退出");
}
function order915(data,userId){

}
