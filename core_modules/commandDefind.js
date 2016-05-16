var commandList = function(){
  var commands = {
    "102":"吃(102)",
    "103":"碰(103)",
    "104":"杠(104)",
    "105":"听(105)",
    "106":"吃听(106)",
    "107":"碰听(107)",
    "206":"胡(206)",
    "207":"过(207)",

  }
  this.getTipName = function(commandId){
    return commands[commandId];
  }
}

module.exports = new commandList();
