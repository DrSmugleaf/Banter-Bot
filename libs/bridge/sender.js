//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const MsTranslator = require("mstranslator")
const mstranslator = new MsTranslator({
  client_id: process.env.MICROSOFT_KEY,
  client_secret: process.env.MICROSOFT_SECRET
}, true)
const winston = require("winston")

class Sender {
  constructor() {}

  send(msg) {
    if(!msg.guild) return
    var settings = msg.guild.settings.get("bridged", {})
    if(!msg.author.bot && settings && settings[msg.channel.id]) {
      var channel = settings[msg.channel.id]
      channel.connectedchannels.forEach(function(subchannel) {
        var discordsubchannel = msg.guild.channels.get(subchannel)
        mstranslator.translate({
          text: msg.cleanContent,
          from: channel.language,
          to: settings[subchannel].language
        }, function(e, translation) {
          if(e) {
            winston.error(e)
            return
          }
          discordsubchannel.sendMessage(`**${msg.author.username}**: ${translation}`)
        })
      })
    }
  }
}

module.exports = Sender
