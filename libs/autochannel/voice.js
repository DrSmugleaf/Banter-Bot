//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const AutoChannel = require("./base")
const winston = require("winston")

// class VoiceAutoChannel {
//   constructor(discord) {
//     this.discord = discord
//
//     this.createChannel = function(guild) {
//       if(guild.member(guild.member.client.user).hasPermission("MANAGE_CHANNELS") &&
//         this.shouldCreateChannel(guild)) {
        // guild.createChannel(`BB-${game}`, "voice").catch(winston.error)
//       }
//     }
//
//     this.getGameNames = function(guild) {
//       var presences = {}
//
//       guild.presences.forEach(presence => {
//         if(presence.game && presence.game.name) {
//           const gameName = presence.game.name
//           presences[gameName] = presences[gameName] ? +1 : 1
//         }
//       })
//       return presences
//     }
//
//     this.shouldCreateChannel = function(guild, count, name) {
//       return count >= 2 && !guild.channels.exists("name", `BB-${name}`)
//     }
//
//     this.discord.on("ready", () => {
//       this.discord.guilds.forEach(function(guild) {
//         var presences = {}
//         guild.presences.forEach(function(presence) {
//           if(presence.game && presence.game.name) {
//             const gameName = presence.game.name
//             if(presences[gameName]) {
//               presences[gameName]++
//             } else {
//               presences[gameName] = 1
//             }
//           }
//         })
//
//         for(var game in presences) {
//           if(presences[game] >= 2 && !guild.channels.exists("name", `BB-${game}`)) {
//             guild.createChannel(`BB-${game}`, "voice")
//               .catch(winston.error)
//           }
//         }
//       })
//     })
//
//     this.discord.on("presenceUpdate", (oldMember, newMember) => {
//       const oldGame = oldMember.presence.game
//       const newGame = newMember.presence.game
//
//       if(oldGame && oldGame.name && oldMember.guild.presences.filter(function(presence) {
//         return presence.game && presence.game.name && oldGame.name && presence.game.name == oldGame.name
//       }).size < 2) {
//         const oldChannel = oldMember.guild.channels.find("name", `BB-${oldGame.name}`)
//         if(oldChannel && oldChannel.type == "voice" && oldChannel.members.size < 1) {
//           oldChannel.delete()
//         }
//       }
//
//       if(newGame && newGame.name && newMember.guild.presences.filter(function(presence) {
//         return presence.game && presence.game.name && newGame.name && presence.game.name == newGame.name
//       }).size >= 2) {
//         if(!newMember.guild.channels.exists("name", `BB-${newGame.name}`)) {
//           newMember.guild.createChannel(`BB-${newGame.name}`, "voice")
//             .catch(winston.error)
//         }
//       }
//     })
//   }
// }

module.exports = class VoiceAutoChannel extends AutoChannel {
  constructor(discord) {
    super(discord, "voice")

    this.discord = discord

    this.discord.on("presenceUpdate", () => {
      super.processPresences()
    })

    this.discord.on("ready", () => {
      super.processPresences()
    })
  }
}

// module.exports = VoiceAutoChannel
