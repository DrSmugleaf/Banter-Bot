//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const Discord = require("discord.js")
const winston = require("winston")

module.exports = class AutoChannel {
  constructor(discord, type) {
    this.discord = discord

    this.channelName = (name) => `${this.prefix + name}`
    this.countThreshold = 2
    this.prefix = "BB-"
    this.type = type
  }

  createChannel(guild, name) {
    guild.createChannel(name, this.type).catch(winston.error)
  }

  deleteChannel(guild, name) {
    const channel = guild.channels.find(channel => {
      return channel.name === name && channel.type === this.type
    })
    if(channel) channel.delete().catch(winston.error)
  }

  getGameNames(guild) {
    var games = new Discord.Collection()

    guild.presences.forEach(presence => {
      if(presence.game && presence.game.name) {
        games.set(presence.game.name, +1)
      }
    })
    return games
  }

  getSpareChannels(guild) {
    const spareChannels = guild.channels.filter(channel => {
      return channel.name.includes("BB-") && channel.type === this.type
    })
    return spareChannels
  }

  onPresenceUpdate(guild) {
    this.processPresences(guild)
  }

  onReady() {
    this.discord.guilds.forEach(guild => {
      this.processPresences(guild)
    })
  }

  onVoiceStateUpdate(guild) {
    this.processPresences(guild)
  }

  processPresences(guild) {
    if(!guild.member(guild.client.user).hasPermission("MANAGE_CHANNELS")) return

    const games = this.getGameNames(guild)
    const spareChannels = this.getSpareChannels(guild)

    games.forEach((count, name) => {
      if(this.shouldCreateChannel(guild, games, name)) {
        this.createChannel(guild, this.channelName(name))
      }

      if(this.shouldDeleteChannel(guild, games, name)) {
        this.deleteChannel(guild, this.channelName(name))
      }
    })

    spareChannels.forEach((channel) => {
      if(this.shouldDeleteChannel(guild, games, channel.name.replace("BB-", ""))) {
        this.deleteChannel(guild, channel.name)
      }
    })
  }

  shouldCreateChannel(guild, games, name) {
    const count = games.get(name) >= this.countThreshold
    const exists = guild.channels.find(channel => {
      return channel.name === this.channelName(name) && channel.type === this.type
    })

    return count && !exists
  }

  shouldDeleteChannel(guild, games, name) {
    const count = games.get(name) >= this.countThreshold
    const exists = guild.channels.find(channel => {
      return channel.name === this.channelName(name) && channel.type === this.type
    })
    const empty = exists && exists.members.size < 1

    return !count && exists && empty
  }
}
