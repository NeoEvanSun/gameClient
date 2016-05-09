var readline = require("readline");
var staticCardNames = require("./staticCardNames");
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
           console.log("打出一张-"+staticCardNames[cmd]);
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

}

module.exports = inputmod;
