"use strict"
const fs = require("fs");

class CommandHandler {
  constructor() {};
};

CommandHandler.prototype.getCommand = function(msg, discord) {
  var commandtext = msg.content.toLowerCase().split(" ");
  var helptext = `Palabras entre **<flechas>** son obligatorias
Palabras entre **[corchetes]** son opcionales

**!help / !ayuda**: Muestra la lista de comandos
**!josde**: wew`

  switch(commandtext[0]) {
    case "!ayuda":
    case "!help":
      discord.sendMessage(msg, helptext);
      break;
    case "!josde":
      discord.sendMessage(msg, "wew");
      break;
    case "wew":
      if(msg.author.username == "Josde") {
        discord.sendMessage(msg, "wew");
      };
      break;
    case "default":
      discord.sendMessage(msg, "Ese comando no existe");
      break;
  };
};

module.exports = CommandHandler;
