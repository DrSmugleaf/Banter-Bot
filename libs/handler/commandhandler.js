"use strict"
const Discord = require("discord.js");
const discord = new Discord.Client();
const token = process.env.DISCORD_TOKEN;

class CommandHandler {
  constructor() {};
};

CommandHandler.prototype.getCommand = function(msg) {
  var commandtext = msg.content.toLowerCase().split(" ");
  var helptext = `Palabras entre **<flechas>** son obligatorias
Palabras entre **[corchetes]** son opcionales

**!help / !ayuda**: Muestra la lista de comandos
**!josde**: wew`

  switch(commandtext[0]) {
    case "!ayuda":
    case "!help":
      return helptext;
      break;
    case "!josde":
      return "wew";
      break;
    case "wew":
      if(msg.author.username == "Josde") {
        return "wew";
      };
      break;
    case "default":
      return "Ese comando no existe";
      break;
  };
};

module.exports = CommandHandler;
