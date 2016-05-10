var commandList = function(){
  var commands = {
    "102":"吃(102)",
    "103":"碰(103)",
    "104":"杠(104)",
    "105":"听(105)",
    "106":"胡(106)",
    "107":"过(107)"
  }
  this.getTipName = function(commandId){
    return commands[commandId];
  }
}

module.exports = new commandList();
