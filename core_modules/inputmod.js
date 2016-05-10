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
  	rl.question("玩家["+wsObject.getUserId()+"],请问你想执行什么操作? (1.创建房间 2.加入房间):",function(cmd){
  		if(cmd == 1){
  			//创建
  			wsObject.createGroup();
  			_this.askAction();
  		}else if(cmd == 2){
  			//加入房间
  			_this.joinGroup();
  		}
  	});
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
    }else if(commandObject.commandTypeCode == 107){
        console.log("选择过操作");
        wsObject.doEffect(groupId,commandObject.commandTypeCode);
    }else{
      console.log("没有完整的可发送的指令对象");
      _this.effect(commandTypeTips);
    }
  }

}

module.exports = inputmod;
