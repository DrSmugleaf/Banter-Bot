//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const MsTranslator = require("mstranslator")
const mstranslator = new MsTranslator({
  client_id: process.env.MICROSOFT_KEY,
  client_secret: process.env.MICROSOFT_SECRET
}, true);
const winston = require("winston")

class TranslatorHandler {
  constructor() {}
}

TranslatorHandler.prototype.translate = function(msg, opts) {
  if(opts[msg.channel.name]) {
    let language = opts[msg.channel.name]
    for(let channel in opts) {
      if(opts[channel] == opts[msg.channel.name]) { continue }
      mstranslator.translate({
        text: msg.cleanContent,
        from: language,
        to: opts[channel]
      }, function(e, data) {
        if(e) {
          winston.error(e)
          return
        }
        msg.guild.channels.find("name", channel).sendMessage(`**${msg.author.username}**: ${data}`)
      })
    }
  }
}

module.exports = TranslatorHandler
