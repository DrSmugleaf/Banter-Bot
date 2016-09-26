//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const constants = require("../util/constants")
const commands = require("../commands")
// const Color = require("../commands/color")
// const color = new Color()
// const Coult = require("../commands/coult")
// const coult = new Coult()
// const Magic8Ball = require("../commands/magic8ball")
// const magic8ball = new Magic8Ball()
// const Youtube = require("../commands/youtube")
// const youtube = new Youtube()
// const Quote = require("../commands/quote")
// const quote = new Quote()
// const Seifer = require("../commands/seifer")
// const seifer = new Seifer()

class CommandHandler {
  constructor() {
    this.admin = ["DrSmugleaf"]
    this.muted = []
    this.english = ["Coult909"]
  }
}

CommandHandler.prototype.getCommand = function(msg) {
  let command = msg.content.toLowerCase().split(" ")

  if(commands[command[0].substring(1)]) {
    commands[command[0].substring(1)].main(msg)
  } else {
    msg.reply(constants.errors.MISSING_COMMAND["english"](command.join(" ")))
  }
  // switch(commandtext[0]) {
  // case "!color":
  // case "!colour":
  //   commands.color.change(msg)
  //   break
  // case "!coult":
  //   coult.trapCard(msg)
  //   break
  // case "!erika":
  // case "!franrosave":
  //   msg.channel.sendMessage("I am dropping the bomb :bomb:")
  //     .then(sentmsg => setTimeout(function() {
  //       sentmsg.edit("I am dropping the bomb :boom:")
  //     }, 1500))
  //     .catch(winston.error)
  //   break
  // case "!ayuda":
  // case "!help":
  //   msg.channel.sendMessage(constants.Help[language])
  //   break
  // case "!josde":
  //   msg.channel.sendMessage("wew")
  //   break
  // case "!logoff":
  //   if(this.admin.contains(msg.author.username)) {
  //     msg.client.destroy()
  //   }
  //   break
  // case "!logoffvoice":
  //   if(this.admin.contains(msg.author.username)) {
  //     if(msg.member.voiceChannel) {
  //       msg.member.voiceChannel.leave()
  //     }
  //   }
  //   break
  // case "!magic8ball":
  // case "!8":
  // case "!8ball":
  // case "!magic8":
  //   magic8ball.answer(msg, language)
  //   break
  // case "!youtube":
  //   youtube.main(msg)
  //   break
  // case "!podemos":
  // case "!ciudadanos":
  //   msg.reply("Ese partido no existe")
  //   break
  // case "!quote":
  //   quote.getQuote(msg)
  //   break
  // case "+quote":
  //   quote.addQuote(msg)
  //   break
  // case "-quote":
  //   quote.delQuote(msg)
  //   break
  // case "!seifer":
  // case "!seif":
  // case "!diavolo":
  //   seifer.pepe(msg)
  //   break
  // default:
  //   msg.reply("Ese comando no existe")
  //   break
  // }
}

module.exports = CommandHandler
