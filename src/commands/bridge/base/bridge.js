//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const responses = require("../../../util/constants").responses.BRIDGE
const Translator = require("mstranslator")
const translator = new Translator({
  client_id: process.env.MICROSOFT_KEY,
  client_secret: process.env.MICROSOFT_SECRET
}, true)
const winston = require("winston")

module.exports = class Bridge {
  constructor(client) {
    this.client = client

    this.client.on("message", (msg) => this.onMessage(msg))
  }

  onMessage(msg) {
    if(!msg.guild || msg.author.bot) return

    const settings = msg.guild.settings.get("bridged", {})
    if(settings && settings[msg.channel.id]) {

      const channel = settings[msg.channel.id]
      channel.connectedchannels.forEach((subChannel) => {

        const discordSubChannel = msg.guild.channels.get(subChannel)
        translator.translate({
          text: msg.cleanContent,
          from: channel.language,
          to: settings[subChannel].language
        }, function(e, translation) {
          if(e) return winston.error(e)
          return discordSubChannel.sendMessage(responses.TRANSLATE[msg.language](
            msg.member.displayName, translation
          ))
        })
      })
    }
  }
}
