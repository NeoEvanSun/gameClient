var WebSocket = require('faye-websocket');

//for(var i=0;i<2000;i++){
  var ws = new WebSocket.Client('ws://45.78.9.171:8080/ws');
  //var ws = new WebSocket.Client('ws://127.0.0.1:8080/ws');

  ws.on('open', function(event) {
    console.log('open');
    //创建房间
   //ws.send('{"content":{"password":"123456","tranditional":true,"playRounds":4,"playRuleIds":[-1]},"userId":"100","commandType":900}');

    var groupId = '614422';
    //加入房间
   //ws.send('{"userId":400,"commandType":901,"content":{"groupId":'+groupId+',"roomType":3,"password":"123456"}}');

    //抓牌
   //ws.send('{"userId":400,"commandType":100,"content":{"groupId":'+groupId+'}}');

    //打牌
   //ws.send('{"userId":300,"commandType":101,"content":{"groupId":'+groupId+',"operateCards":[2]}}');

    //吃牌
    // ws.send('{"userId":300,"commandType":102,"content":{"groupId":'+groupId+',"operateCards":[3,4]}}');

    //碰
    // ws.send('{"userId":400,"commandType":103,"content":{"groupId":'+groupId+',"operateCards":[0,0]}}');
  });

  ws.on('message', function(event) {
    console.log('message', event.data);
  });
  ws.on('close', function(event) {
    console.log('close', event.code, event.reason);
  });
//}




function createGroup(userId){
  ws.send('{"content":{"password":"123456","tranditional":true,"playRounds":4,"playRuleIds":[-1]},"userId":"'+userId+'","commandType":900}');
}

function joinGroup(userId,groupId){
  ws.send('{"userId":'+userId+',"commandType":901,"content":{"groupId":'+groupId+',"roomType":3,"password":"123456"}}');
}

function showCards(cardVm){
	var cards = cardVm.mycardVm;
	console.log(cards);
}

ws.on('open', function(event) {
  console.log('open');
});

ws.on('message', function(event) {
  console.log('message', event.data);
  var jsonData = JSON.parse(event.data);

  if(jsonData.data.commandType == "902"){
		  //开局
		if(jsonData.ret){
			console.log("开局成功");
			showCards(jsonData.data.mycardVm);
		}else{
			console.log("开局失败");
		}
  }else if(jsonData.data.commandType == "900"){
		// 创建
		if(jsonData.ret){
			console.log("创建成功，并加入");
			groupId = jsonData.data.groupId;
			joinGroup(userId,groupId);
		}else{
			console.log("创建失败，并加入");
		}
  }
});
ws.on('close', function(event) {
  console.log('close', event.code, event.reason);
});

console.log("game connected");
