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

    this.discord.on("presenceUpdate", (oldMember, newMember) => {
      const oldGame = oldMember.presence.game
      const newGame = newMember.presence.game

      if(oldGame) {
        winston.info(oldGame && oldMember.guild.presences.filter(function(presence) {
          return presence.game && presence.game.name && oldGame.name && presence.game.name == oldGame.name
        }))
      }

      if(oldGame && oldMember.guild.presences.filter(function(presence) {
        return presence.game && presence.game.name && oldGame.name && presence.game.name == oldGame.name
      }).size < 2) {
        const oldChannel = oldMember.guild.channels.find("name", `BB-${oldGame.name}`)
        winston.info(oldGame.name)
        winston.info((oldChannel && oldChannel.type == "voice") ? true : false)
        if(oldChannel && oldChannel.type == "voice" && oldChannel.members.size < 2) {
          oldChannel.delete()
        }
      }

      if(newGame && newMember.guild.presences.filter(function(presence) {
        return presence.game && presence.game.name && newGame.name && presence.game.name == newGame.name
      }).size >= 2) {
        if(!newMember.guild.channels.exists("name", `BB-${oldGame.name}`)) {
          newMember.guild.createChannel(`BB-${newGame.name}`, "voice")
            .catch(winston.error)
        }
      }
    })
  }
}

module.exports = VoiceAutoChannel
