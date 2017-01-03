//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const winston = require("winston")

class VoiceAutoChannel {
  constructor(discord) {
    this.discord = discord

    this.discord.on("ready", () => {
      this.discord.guilds.forEach(function(guild) {
        var presences = {}
        guild.presences.forEach(function(presence) {
          if(presence.game && presence.game.name) {
            const gameName = presence.game.name
            if(presences[gameName]) {
              presences[gameName]++
            } else {
              presences[gameName] = 1
            }
          }
        })

        for(var game in presences) {
          if(presences[game] >= 2 && !guild.channels.exists("name", `BB-${game}`)) {
            winston.info(game)
            guild.createChannel(`BB-${game}`, "voice")
              .catch(winston.error)
          }
        }
      })
    })
  }
}

module.exports = VoiceAutoChannel
