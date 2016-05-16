var WebSocket = require('faye-websocket');
var socket = function(execute){
  var ws = new WebSocket.Client('ws://127.0.0.1:8080/ws');
  var userId = parseInt(Math.random()*10000)+"";
  ws.on("open",function(event){
  });
  ws.on("message",function(event){
    execute(event.data,userId);
  });
  ws.on('close', function(event) {
    console.log('连接关闭', event.code, event.reason);
  });
  //获取长连接
  // this.getWebSocket = function(){
  //   return ws;
  // }
  //获取用户ID
  this.getUserId = function(){
    return userId;
  }
  //创建组
  this.createGroup = function(){
    ws.send('{"content":{"password":"123456","tranditional":true,"playRounds":4,"playRuleIds":[-1]},"userId":"'+userId+'","commandType":900}');
  }
  //加入
  this.join = function (groupId){
    ws.send('{"userId":'+userId+',"commandType":901,"content":{"groupId":'+groupId+',"roomType":3,"password":"123456"}}');
  }
  //打牌
  this.dapai = function (groupId,cardIndex){
    ws.send('{"userId":'+userId+',"commandType":101,"content":{"groupId":'+groupId+',"operateCards":['+cardIndex+']}}');
  }
  //抓牌
  this.zhua = function(groupId){
    ws.send('{"userId":'+userId+',"commandType":100,"content":{"groupId":'+groupId+'}}');
  }
  //吃碰杠听胡过
  this.doEffect = function (groupId,commandType,cardsArray){
    var requestStr = '{'
    requestStr += '"userId":'+userId+',';
    requestStr += '"commandType":'+commandType+',';
    requestStr += '"content":{"groupId":'+groupId+",";
    if(cardsArray && cardsArray.length>0){
      requestStr += '"operateCards":['+cardsArray.toString()+"],";
    }
    requestStr = requestStr.substring(0,requestStr.length-1);
    requestStr += "}"
    requestStr += "}"
    console.log("发送影响请求报文为:"+requestStr);
    ws.send(requestStr);
  }
  this.chiPengTing = function (groupId,effect){
    var _this = this;
    var commandTypeCode = 106;
    if(effect.costCardIndexes[0] == effect.costCardIndexes[1]){
      commandTypeCode = 107;
    }
    _this.doEffect(groupId,commandTypeCode,effect.costCardIndexes);
  }
  this.xulian = function (){
    var requestStr = '{"userId":'+userId+',"commandType":930}';
    console.log("发送续连请求报文为:"+requestStr);
    ws.send(requestStr);
  }
  this.setUserId = function(arg){
    userId = arg;
  }
  this.tingDaPai = function (groupId,cardIndex){
    ws.send('{"userId":'+userId+',"commandType":108,"content":{"groupId":'+groupId+',"operateCards":['+cardIndex+']}}');
  }
}

module.exports = socket;
