"use strict"
const Color = require("../commands/color")
const color = new Color()
const Coult = require("../commands/coult")
const coult = new Coult()
const Magic8Ball = require("../commands/magic8ball")
const magic8ball = new Magic8Ball()
const Quote = require("../commands/quote")
const quote = new Quote()
const Seifer = require("../commands/seifer")
const seifer = new Seifer()
const token = process.env.DISCORD_TOKEN
const winston = require("winston")

class CommandHandler {
  constructor() {
    this.admin = ["DrSmugleaf"]
    this.muted = []
    this.english = ["Coult909"]
    this.helptext = []
    this.helptext.spanish = `Palabras entre **<flechas>** son obligatorias
Palabras entre **[corchetes]** son opcionales

**!help / !ayuda**: Muestra la lista de comandos
**!ciudadanos**
**!coult**
**!diavolo / !seifer / !seif**
**!erika / !franrosave**
**!josde**
**!logoff**: Desactiva el bot
**!logoffvoice**: Saca el bot del canal de voz
**!magic8ball / !8 / !8ball / !magic8 [pregunta] [-ENGLISH]**: Respuesta de la Bola 8 Mágica
**!podemos**
**!quote [número]**: Selecciona un quote al azar o por número
**+quote <texto>**: Añade un quote
**-quote <número>**: Elimina un quote`
    this.helptext.english = `Words between **<arrows>** are required
Words between **[brackets]** are optional

**!help / !ayuda**: Show the list of commands
**!ciudadanos**
**!coult**
**!diavolo / !seifer / !seif**
**!erika / !franrosave**
**!josde**
**!logoff**: Shutdown the bot
**!logoffvoice**: Remove the bot from voice channels
**!magic8ball / !8 / !8ball / !magic8 [question] [-ENGLISH]**: An answer from the Magic 8 Ball
**!podemos**
**!quote [number]**: Select a quote at random or by number
**+quote <text>**: Add a quote
**-quote <number>**: Remove a quote`
  }
}

CommandHandler.prototype.getCommand = function(msg) {
  let commandtext = msg.content.toLowerCase().split(" ")
  let language = msg.content.includes("-ENGLISH") ? "english" : this.english.contains(msg.author.username) ? "english" : "spanish"

  switch(commandtext[0]) {
    case "!color":
    case "!colour":
      color.change(msg)
      break
    case "!coult":
      coult.trapCard(msg)
      break
    case "!erika":
    case "!franrosave":
      msg.channel.sendMessage("I am dropping the bomb :bomb:")
        .then(sentmsg => setTimeout(function() {
          sentmsg.edit("I am dropping the bomb :boom:")
        }, 1500))
        .catch(winston.log)
      break
    case "!ayuda":
    case "!help":
      msg.channel.sendMessage(this.helptext[language])
      break
    case "!josde":
      msg.channel.sendMessage("wew")
      break
    case "!logoff":
      if(this.admin.contains(msg.author.username)) {
        msg.client.destroy()
      }
      break
    case "!logoffvoice":
      if(this.admin.contains(msg.author.username)) {
        if(msg.member.voiceChannel) {
          msg.member.voiceChannel.leave()
        }
      }
      break
    case "!magic8ball":
    case "!8":
    case "!8ball":
    case "!magic8":
      magic8ball.answer(msg, language)
      break
    case "!podemos":
    case "!ciudadanos":
      msg.reply("Ese partido no existe")
      break
    case "!quote":
      quote.getQuote(msg)
      break
    case "+quote":
      quote.addQuote(msg)
      break
    case "-quote":
      quote.delQuote(msg)
      break
    case "!seifer":
    case "!seif":
    case "!diavolo":
      seifer.pepe(msg)
      break
    default:
      msg.reply("Ese comando no existe")
      break
  }
}

module.exports = CommandHandler
