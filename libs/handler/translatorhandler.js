"use strict"
const ArrayUtil = require("../util/arrayutil")
const arrayutil = new ArrayUtil()
const translate = require("yandex-translate")(process.env.YANDEX_KEY)
const key = process.env.YANDEX_KEY
const winston = require("winston")

class TranslatorHandler {
  constructor() {}
}

TranslatorHandler.prototype.translate = function(msg, opts) {
  if(opts[msg.channel.name]) {
    let language = opts[msg.channel.name]
    for(let channel in opts) {
      if(opts[channel] == opts[msg.channel.name]) { continue }
      translate.translate(msg.cleanContent, {from: language, to: opts[channel]}, function(e, res) {
        if(e) { winston.error(e) }
        msg.guild.channels.find("name", channel).sendMessage("**" + msg.author.username + "**" + ": " + res.text[0])
      })
    }
  }
}

module.exports = TranslatorHandler
