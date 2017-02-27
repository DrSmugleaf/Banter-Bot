//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const _ = require("underscore")
const Discord = require("discord.js")

module.exports = class AutoChannel {
  constructor(client) {
    this.client = client

    this.guilds = new Discord.Collection()

    this.client.guilds.forEach((guild) => {
      this.updateGuild(guild)
    })

    this.client.on("presenceUpdate", (oldMember, newMember) => {
      this.processPresence(oldMember, newMember)
      this.updateChannels(newMember.guild)
    })

    this.client.on("voiceStateUpdate", (oldMember, newMember) => {
      if(oldMember.voiceChannel === newMember.voiceChannel) return
      this.updateChannels(newMember.guild)
    })

    this.client.on("guildCreate", (guild) => {
      setTimeout(() => this.updateGuild(guild), 5000)
    })
  }

  threshold(guild) {
    return guild.settings.get("auto-channel", {}).threshold || 2
  }

  processPresence(oldMember, newMember) {
    if(!newMember.guild.member(newMember.client.user).hasPermission("MANAGE_CHANNELS")) return
    if(newMember.guild.settings.get("auto-channel", {}).enabled === false) return

    const games = this.guilds.get(newMember.guild.id) || new Discord.Collection()

    const oldPresence = oldMember ? oldMember.presence : null
    if(oldPresence && oldPresence.game) {
      var oldGame = games.get(oldPresence.game.name) || new Array()
      oldGame = _.without(oldGame, newMember.id)
      games.set(oldPresence.game.name, oldGame)
    }

    const newPresence = newMember ? newMember.presence : null
    if(newPresence && newPresence.game) {
      var newGame = games.get(newPresence.game.name) || new Array()
      newGame.push(newMember.id)
      games.set(newPresence.game.name, newGame)
    }

    this.guilds.set(newMember.guild.id, games)
  }

  updateGuild(guild) {
    guild.fetchMembers().then(() => {
      this.guilds.delete(guild.id)
      guild.presences.forEach((presence, id) => {
        const member = guild.member(id)
        this.processPresence(null, member)
      })
      this.updateChannels(guild)
    })
  }

  updateChannels(guild) {
    if(guild.settings.get("auto-channel", {}).enabled === false) return

    const games = this.guilds.get(guild.id) || new Discord.Collection()

    games.forEach((game, name) => {
      if(game.length >= this.threshold(guild) && !guild.channels.exists((channel) => {
        return channel.name === `BB-${name}` && channel.type === "voice"
      })) {
        guild.createChannel(`BB-${name}`, "voice")
      }
    })

    guild.channels.filter((channel) => {
      const gameName = channel.name.replace("BB-", "")
      return channel.name.includes("BB-") && channel.type === "voice" &&
        channel.members.size < 1 && games.has(gameName) &&
        games.get(gameName).length < this.threshold(guild)
    }).deleteAll()
  }
}
