//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const Discord = require("discord.js")
const winston = require("winston")

module.exports = class AutoChannel {
  constructor(discord, type) {
    this.discord = discord
    this.countThreshold = 2
    this.type = type
  }

  createChannel(guild, name) {
    guild.createChannel(name, this.type).catch(winston.error)
  }

  deleteChannel(guild, name) {
    guild.channels.find("name", name).delete().catch(winston.error)
  }

  getGameNames(guild) {
    var games = new Discord.Collection()

    guild.presences.forEach(presence => {
      if(presence.game && presence.game.name) {
        const name = presence.game.name
        games.set(name, +1)
      }
    })
    return games
  }

  processPresences() {
    this.discord.guilds.forEach(guild => {
      const games = this.getGameNames(guild)

      games.forEach((count, name) => {
        if(this.shouldCreateChannel(guild, games, name)) {
          this.createChannel(guild, `BB-${name}`)
        }

        if(this.shouldDeleteChannel(guild, games, name)) {
          this.deleteChannel(guild, `BB-${name}`)
        }
      })
    })
  }

  shouldCreateChannel(guild, games, name) {
    const count = games.get(name) >= this.countThreshold
    const exists = Boolean(guild.channels.find(channel => {
      return channel.name === `BB-${name}` && channel.type === this.type
    }))

    return count && !exists
  }

  shouldDeleteChannel(guild, games, name) {
    const count = games.get(name) >= this.countThreshold
    const exists = Boolean(guild.channels.find(channel => {
      return channel.name === `BB-${name}` && channel.type === this.type
    }))

    return !count && exists
  }
}
