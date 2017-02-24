//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const MsTranslator = require("mstranslator")
const mstranslator = new MsTranslator({
  client_id: process.env.MICROSOFT_KEY,
  client_secret: process.env.MICROSOFT_SECRET
}, true)
const winston = require("winston")

module.exports = class Sender {
  constructor(discord) {
    this.discord = discord

    this.discord.on("message", (msg) => this.onMessage(msg))
  }

  onMessage(msg) {
    if(!msg.guild || msg.author.bot) return

    const settings = msg.guild.settings.get("bridged", {})

    if(settings && settings[msg.channel.id]) {
      const channel = settings[msg.channel.id]

      channel.connectedchannels.forEach(subChannel => {
        const discordSubChannel = msg.guild.channels.get(subChannel)

        mstranslator.translate({
          text: msg.cleanContent,
          from: channel.language,
          to: settings[subChannel].language
        }, function(e, translation) {
          if(e) return winston.error(e)
          return discordSubChannel.sendMessage(`**${msg.member.displayName}**: ${translation}`)
        })
      })
    }
  }
}
