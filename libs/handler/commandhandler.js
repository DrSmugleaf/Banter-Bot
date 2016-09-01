"use strict"
const Coult = require("../commands/coult");
const coult = new Coult();
const Magic8Ball = require("../commands/magic8ball");
const magic8ball = new Magic8Ball();
const Quote = require("../commands/quote");
const quote = new Quote();
const token = process.env.DISCORD_TOKEN;

class CommandHandler {
  constructor() {
    this.admin = ["DrSmugleaf"];
    this.muted = [];
    this.english = ["Coult909"];
  };
};

CommandHandler.prototype.getCommand = function(discord, msg) {
  var commandtext = msg.content.toLowerCase().split(" ");
  var helptext = `Palabras entre **<flechas>** son obligatorias
Palabras entre **[corchetes]** son opcionales

**!help / !ayuda**: Muestra la lista de comandos
**!josde**: wew
**!logoff**: Desactiva el bot
**!logoffvoice**: Saca el bot del canal de voz
**!magic8ball / !8 / !8ball / !magic8 [pregunta] [-ENGLISH]**: Respuesta de la Bola 8 Mágica
**!quote [número]**: Selecciona un quote al azar o por número
**+quote <texto>**: Añade un quote
**-quote [número]**: Elimina un quote
**!relog**: Reinicia el bot`
  var language = msg.content.includes("-ENGLISH") ? "english" : this.english.contains(msg.author.username) ? "english" : "spanish";

  switch(commandtext[0]) {
    case "!test":
      coult.trapCard(discord, msg);
      break;
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
    case "!logoffvoice":
      if(this.admin.contains(msg.author.username)) {
        console.log("!logoffvoice called by " + msg.author.username);
        if(discord.voiceConnection) {
          discord.voiceConnection.stopPlaying();
          discord.leaveVoiceChannel(discord.user.voiceChannel);
        };
      };
      break;
    case "!magic8ball":
    case "!8":
    case "!8ball":
    case "!magic8":
      magic8ball.answer(discord, msg, language);
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
    default:
      discord.sendMessage(msg, "Ese comando no existe");
      break;
  };
};

module.exports = CommandHandler;
