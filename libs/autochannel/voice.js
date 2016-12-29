//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const winston = require("winston")

class VoiceAutoChannel {
  constructor(discord) {
    this.discord = discord

    this.discord.on("presenceUpdate", (oldMember, newMember) => {
      var oldGame = oldMember.presence.game
      var newGame = newMember.presence.game

      if(newGame && newMember.guild.presences.findAll("game", newGame).length >= 2) {
        newMember.guild.createChannel(`BB-${newGame.name}`, "voice")
          .catch(winston.error)
      }

      if(oldGame && oldMember.guild.presences.findAll("game", oldGame).length < 2) {
        if(oldMember.guild.channels.exists("name", `BB-${oldGame.name}`)) {
          var oldChannel = oldMember.guild.channels.find("name", `BB-${oldGame.name}`)
          if(oldChannel.type == "voice" && oldChannel.members.size < 2) oldChannel.delete()
        }
      }
    })
  }
}

module.exports = VoiceAutoChannel
