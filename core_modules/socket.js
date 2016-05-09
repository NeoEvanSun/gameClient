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
}

module.exports = socket;
