//
// Copyright (c) 2017 DrSmugleaf
//

// "use strict"
// const _ = require("underscore")
// const Discord = require("discord.js")
// const winston = require("winston")
//
// module.exports = class AutoChannel {
//   constructor(discord) {
//     this.discord = discord
//
//     this.channelName = (name) => `BB-${name}`
//     this.threshold = 2
//     this.games = new Discord.Collection()
//     this.previousGame = new Object()
//
//     this.discord.guilds.forEach((guild) => {
//       guild.presences.forEach((presence, id) => {
//         this.processPresence(guild, presence, id)
//       })
//       this.setupChannels(guild)
//     })
//
//     this.discord.on("presenceUpdate", (oldMember, newMember) => {
//       this.processPresence(newMember.guild, newMember.presence, newMember.id, true)
//     })
//
//     this.discord.on("voiceStateUpdate", (oldMember, newMember) => {
//       if(oldMember.voiceChannel === newMember.voiceChannel) return
//       this.processPresence(newMember.guild, newMember.presence, newMember.id, true)
//     })
//   }
//
//   processPresence(guild, presence, id, setup = false) {
//     if(!guild.member(guild.client.user).hasPermission("MANAGE_CHANNELS")) return
//     var guildGames = this.games.get(guild.id) || {}
//
//     if(presence.game && presence.game.name && presence.game.name !== this.previousGame[id]) {
//       if(!guildGames.hasOwnProperty(presence.game.name)) guildGames[presence.game.name] = []
//       if(!guildGames[presence.game.name].includes(id)) guildGames[presence.game.name].push(id)
//     } else {
//       if(this.previousGame[id]) {
//         winston.info(guildGames[this.previousGame[id]])
//         guildGames[this.previousGame[id]] = _.without(guildGames[presence.game.name], id)
//         winston.info(guildGames[this.previousGame[id]])
//       }
//       this.previousGame[id] = null
//     }
//
//     this.games.set(guild.id, guildGames)
//     if(setup) this.setupChannels(guild)
//   }
//
//   setupChannels(guild) {
//     const guildGames = this.games.get(guild.id)
//
//     guild.channels.filter((channel) => {
//       return channel.name.includes("BB-") && channel.type === "voice"
//     }).forEach((channel) => {
//       const gameInObject = guildGames ? guildGames[channel.name.replace("BB-", "")] : null
//
//       if(channel.members.size < 1 && (!gameInObject || gameInObject.length < this.threshold)) {
//         if(channel) channel.delete().catch(winston.error)
//       }
//     })
//
//     if(!guildGames) return
//     for(const game in guildGames) {
//       if(guildGames.hasOwnProperty(game)) {
//         if(guildGames[game].length >= this.threshold && !guild.channels.exists((channel) => {
//           return channel.name === this.channelName(game) && channel.type === "voice"
//         })) {
//           guild.createChannel(this.channelName(game), "voice").catch(winston.error)
//         }
//       }
//     }
//   }
// }
