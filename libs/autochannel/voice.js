//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const Discord = require("discord.js")
const winston = require("winston")

class VoiceAutoChannel {
  constructor(discord) {
    this.discord = discord

    // this.discord.on("presenceUpdate", (oldMember, newMember) => {
    //   var oldGame = oldMember.presence.game
    //   var newGame = newMember.presence.game
    //
    //   winston.info(newGame && newMember.guild.presences.filter(function(value) {
    //     winston.info(value)
    //     return value.game && value.game.name && newGame.name && value.game.name == newGame.name
    //   }))
    //
    //   if(newGame && newMember.guild.presences.filter(function(value) {
    //     return value.game && value.game.name && newGame.name && value.game.name == newGame.name
    //   }).length >= 2) {
    //     newMember.guild.createChannel(`BB-${newGame.name}`, "voice")
    //       .catch(winston.error)
    //   }
    //
    //   if(oldGame && newMember.guild.presences.filter(function(value) {
    //     return value.game && value.game.name && oldGame.name && value.game.name == oldGame.name
    //   }).length < 2) {
    //     if(oldMember.guild.channels.exists("name", `BB-${oldGame.name}`)) {
    //       var oldChannel = oldMember.guild.channels.find("name", `BB-${oldGame.name}`)
    //       if(oldChannel.type == "voice" && oldChannel.members.size < 2) oldChannel.delete()
    //     }
    //   }
    // })

    // this.discord.on("ready", () => {
    //   this.discord.guilds.forEach(function(guild) {
    //     guild.presences.forEach(function(presence) {
    //       if(presence.game && presence.game.name) {
    //         if(guild.presences.slice().some(function(slicedPresence) {
    //           return slicedPresence.game && slicedPresence.game.name == presence.game.name
    //         }))



    // this.discord.on("ready", () => {
    //
    //   this.discord.guilds.forEach(function(guild) {
    //     guild.presences.forEach(function(presence) {
    //       if(presence.game && presence.game.name) {
    //         if(guild.presences.slice().some(function(slicedPresence) {
    //           if(slicedPresence.game && slicedPresence.game.name == presence.game.name) {
    //             winston.info("test")
    //             guild.createChannel(`BB-${presence.game.name}`, "voice")
    //               .catch(winston.error)
    //           }
    //         }))
    //       }
    //     })
    //   })
    //
    // })

    // this.discord.on("ready", () => {
    //
    //   this.discord.guilds.forEach(function(guild) {
    //     guild.presences.forEach(function(presence) {
    //       if(presence.game && presence.game.name) {
    //         if(guild.presences.slice(presence).some(function(slicedPresence) {
    //           if(slicedPresence.game && slicedPresence.game.name == presence.game.name) {
    //             winston.info("test")
    //           }
    //         }))
    //       }
    //     })
    //   })
    // })

    this.discord.on("ready", () => {

      // this.discord.guilds.forEach(function(guild) {
      //   guild.presences.forEach(function(presence) {
      //     if(presence.game && presence.game.name) {
      //       var newPresences = new Discord.Collection(guild.presences)
      //       newPresences.delete(presence)
      //       if(newPresences.some(function(slicedPresence) {
      //         return slicedPresence.game && slicedPresence.game.name == presence.game.name
      //       })) {
      //         winston.info(presence)
      //       }
      //     }
      //   })
      // })

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
