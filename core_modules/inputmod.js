var readline = require("readline");
var staticCardNames = require("./staticCardNames");
var commandDefind = require('./commandDefind');
var inputmod = function (wsObject){
  var rl = readline.createInterface({
  	input:process.stdin,
  	output:process.stdout
  });

  var wsObject = wsObject;
  var groupId = "0000";

  this.askAction = function (){
    var _this = this;
  	rl.question("玩家["+wsObject.getUserId()+"],请问你想执行什么操作? (1.创建房间 2.加入房间 3.断线续连 4.输入用户ID):",function(cmd){
  		if(cmd == 1){
  			//创建
  			wsObject.createGroup();
  			_this.askAction();
  		}else if(cmd == 2){
  			//加入房间
  			_this.joinGroup();
  		}else if(cmd == 3){
        _this.connectAgain();
      }else if(cmd == 4){
        _this.changeUserId();
      }
  	});
  }

  this.connectAgain = function(){
    var _this = this;
    rl.question("重新续连请输入上一次的用户ID及房间号用'-'号分隔:",function(cmd){
      if(/\d+\-\d+/.test(cmd)){
        var params = cmd.split("-");
        wsObject.setUserId(params[0]);
        wsObject.xulian();
        groupId = params[1];
      }else{
        console.log("请按提示输入正确格式");
        _this.connectAgain();
      }
    })
  }

  this.changeUserId = function(){
    var _this = this;
    rl.question("请输入Userid:",function(cmd){
      wsObject.setUserId(cmd.trim());
      console.log("玩家ID已被设为:"+wsObject.getUserId());
      _this.askAction();
    })
  }

  this.joinGroup = function(){
      var _this = this;
  		rl.question("想加入房间？请输入房间号:",function(cmd){
  			if(/\d+/.test(cmd)){
  				console.log(cmd);
  				wsObject.join(cmd);
          groupId = cmd;
  			}else{
  				console.log("请输入正确的房间号");
  				_this.joinGroup();
  			}
  		});
  }

  this.enterDapai = function(cards){
    var _this = this;
    rl.question("请输入要打哪一张牌的index:",function(cmd){
       if(/\d+/.test(cmd)){
         if(cards[cmd]>0){
           console.log("打出一张-【"+staticCardNames[cmd]+"】");
           wsObject.dapai(groupId,cmd);
         }else{
           console.log("你没有这张牌");
           _this.enterDapai(cards);
         }
       }else{
         console.log("请输入数字");
         _this.enterDapai(cards);
       }
    })
  }

  this.effect = function(commandTypeTips){
    var _this = this;
    var askInfo = "请选择操作 ";
    var commandList = [];
    for(var commandId in commandTypeTips){
       commandList.push(commandId);
       askInfo += commandDefind.getTipName(commandId);
       askInfo += " ";
    }
    askInfo += ":";
    rl.question(askInfo,function(cmd){
      if(commandList.indexOf(cmd)!=-1){
        _this.sendEffectOrders(commandTypeTips[cmd],commandTypeTips);
      }else{
        console.log("指令错误，请输入正确指令");
        _this.effect(commandTypeTips);
      }
    });
  }

  this.zhuaPai = function (){
    wsObject.zhua(groupId);
  }

  //影响的指令在此发送
  this.sendEffectOrders = function (commandObject,commandTypeTips){
    var _this = this;
    if(commandObject && commandObject.effects && commandObject.effects.length>0){
      if(commandObject.commandTypeCode == 105 || commandObject.commandTypeCode ==206){
        wsObject.doEffect(groupId,commandObject.commandTypeCode);
      }else if(commandObject.commandTypeCode == 106 || commandObject.commandTypeCode == 107) {
        _this.executeChiPengTing(commandObject, commandTypeTips)
      }else{
        var questionStr = "选择用哪组牌进行操作(";
        for(var i =0;i<commandObject.effects.length;i++){
          questionStr += (i+1)+".";
          questionStr += staticCardNames[commandObject.effects[i][0]];
          questionStr += staticCardNames[commandObject.effects[i][1]];
          if(commandObject.effects[i][2]){
            questionStr += staticCardNames[commandObject.effects[i][2]];
          }
          questionStr += " ";
        }
        questionStr+=",0.返回上步操作)";
        rl.question(questionStr,function(cmd){
          if(/\d+/.test(cmd)){
            if(cmd == 0){
              _this.effect(commandTypeTips);
            }else{
              wsObject.doEffect(groupId,commandObject.commandTypeCode,commandObject.effects[parseInt(cmd)-1]);
            }
          }else{
            console.log("请输入正确指令");
            _this.sendEffectOrders(commandObject,commandTypeTips);
          }
        });
      }

    }else if(commandObject.commandTypeCode == 207){
        console.log("选择过操作");
        wsObject.doEffect(groupId,commandObject.commandTypeCode);
    }else{
      console.log("没有完整的可发送的指令对象");
      _this.effect(commandTypeTips);
    }
  }

  //处理吃碰听
  this.executeChiPengTing = function (commandObject,commandTypeTips){
    var _this = this;
    var questionStr = "选择用哪组牌进行吃碰听操作(\n";

    for(var i =0;i<commandObject.effects.length;i++){
      var effect = commandObject.effects[i];
      var costCardIndexes = effect.costCardIndexes;
      var leftCardIndex = effect.leftCardIndex;
      var huCardIndexes = effect.huCardIndexes;
      questionStr += (i+1)+". 用【";
      questionStr += staticCardNames[costCardIndexes[0]];
      questionStr += "-";
      questionStr += staticCardNames[costCardIndexes[1]];
      questionStr += "】";
      questionStr += "打【";
      questionStr += staticCardNames[leftCardIndex];
      questionStr += "】";
      questionStr += "胡 ->"
      for(var j = 0 ;j<huCardIndexes.length;j++){
        var huCardIndex = huCardIndexes[j];
        questionStr += staticCardNames[huCardIndex];
      }
      questionStr += "\n";
    }
    questionStr+=",0.返回上步操作)";
    rl.question(questionStr,function(cmd){
      if(/\d+/.test(cmd)){
        if(cmd == 0){
          //_this.sendEffectOrders(commandObject,commandTypeTips);
          _this.effect(commandTypeTips);
        }else{
          wsObject.chiPengTing(groupId,commandObject.effects[parseInt(cmd) - 1]);
        }
      }else{
        console.log("请输入正确指令");
        _this.executeChiPengTing(commandObject,commandTypeTips);
      }
    });
  }

  //听打牌使用如下
  this.tingDaPai = function (operateCards){
    var _this = this;
    var questionStr = "进入听打阶段,请选择一张牌打出";
    var cmdList = [];
    for(var i = 0 ;i<operateCards.length;i++){
      var selectCard = operateCards[i];
      questionStr += (i+1)+".";
      questionStr += "【"+staticCardNames[parseInt(selectCard)]+"】 ";
      cmdList.push(parseInt(i+1));
    }

    rl.question(questionStr,function(cmd){
      if(/\d+/.test(cmd) && cmdList.indexOf(parseInt(cmd)!=-1)){
        console.log("打出一张-【"+staticCardNames[operateCards[parseInt(cmd)-1]]+"】");
        wsObject.tingDaPai(groupId,operateCards[parseInt(cmd)-1]);
      }else{
        console.log("请输入正确的指令");
        _this.tingDaPai(operateCards);
      }
    })

  }

  //胡牌后可以选择的操作
  this.afterHuAction = function (){
    var _this = this;
    var questionStr = "请选择操作(1.准备下一局游戏,2.退出):";
    rl.question(questionStr,function(cmd){
      switch (cmd) {
        case "1": wsObject.ready(groupId); break;
        case "2": wsObject.quit(groupId);break;
        default: console.log("请输入正确的指令");_this.afterHuAction();
      }
    })
  }
}

module.exports = inputmod;
