var commandList = function(){
  var commands = {
    "102":"吃(102)",
    "103":"碰(103)",
    "1040":"明杠(1040)",
    "1041":"暗杠(1041)",
    "105":"听(105)",
    "106":"吃听(106)",
    "107":"碰听(107)",
    "206":"胡(206)",
    "207":"过(207)"
  }
  this.getTipName = function(commandId){
    return commands[commandId];
  }
}

module.exports = new commandList();
