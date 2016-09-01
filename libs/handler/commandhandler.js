"use strict"
const Quote = require("../commands/quote")
const quote = new Quote();
const token = process.env.DISCORD_TOKEN;

class CommandHandler {
  constructor() {
    this.admin = ["DrSmugleaf"];
    this.muted = [];
  };
};

CommandHandler.prototype.getCommand = function(discord, msg) {
  var commandtext = msg.content.toLowerCase().split(" ");
  var helptext = `Palabras entre **<flechas>** son obligatorias
Palabras entre **[corchetes]** son opcionales

**!help / !ayuda**: Muestra la lista de comandos
**!josde**: wew
**!logoff**: Desactiva el bot
**!relog**: Reinicia el bot`

  switch(commandtext[0]) {
    case "!ayuda":
    case "!help":
      discord.sendMessage(msg, helptext);
      break;
    case "!josde":
      discord.sendMessage(msg, "wew");
      break;
    case "!logoff":
      if(this.admin.contains(msg.author.username)) {
        console.log("!logoff called by " + msg.author.username);
        discord.destroy();
      };
      break;
    case "!quote":
      quote.getQuote(discord, msg);
      break;
    case "+quote":
      quote.addQuote(discord, msg);
      break;
    case "-quote":
      quote.delQuote(discord, msg);
      break;
    case "!relog":
      if(this.admin.contains(msg.author.username)) {
        console.log("!relog called by " + msg.author.username);
        discord.logout();
        setTimeout(function() {
          discord.loginWithToken(token);
        }, 5000);
      };
      break;
    case "wew":
      if(msg.author.username == "Josde") {
        discord.sendMessage(msg, "wew");
      };
      break;
    default:
      discord.sendMessage(msg, "Ese comando no existe");
      break;
  };
};

module.exports = CommandHandler;
