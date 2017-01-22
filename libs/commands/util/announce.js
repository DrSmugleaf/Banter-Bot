//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const stripIndents = require("common-tags").stripIndents
const winston = require("winston")

module.exports = class Announce extends commando.Command {
  constructor(client) {
    super(client, {
      name: "announce",
      aliases: ["announce", "announcement"],
      group: "util",
      memberName: "announce",
      description: "Announce a message to a server, list of servers or all servers",
      examples: ["announce all Doom is upon us"],
      args: [
        {
          key: "guilds",
          label: "guild(s)",
          prompt: "Which guilds do you want to send a message to?",
          type: "string"
        },
        {
          key: "text",
          prompt: "Which message do you want to send?",
          type: "string"
        }
      ]
    })

    this.fails = []
  }

  hasPermission(msg) {
    return msg.author.id === this.client.options.owner
  }

  sendAnnouncement(msg, guild, text) {
    guild.defaultChannel.sendMessage(text).catch(e => {
      winston.error(e)

      guild.owner.sendMessage(stripIndents`
        I couldn't send this announcement to ${guild.name}'s default channel,
        ${guild.defaultChannel}, a guild you are the owner of.
        Here is the announcement:
        ${text}
      `).catch(e => {
        winston.error(e)

        msg.reply(stripIndents`
          I couldn't send the announcement to ${guild.name}'s default channel,
          ${guild.defaultChannel} or to its owner, ${guild.owner}.
        `).catch(e => {
          winston.error(e)
          winston.error("lionThrow")
        })
      })
    })
  }

  async run(msg, args) {
    const guilds = args.guilds === "all" ? "all" : args.guilds.includes(",") ?
      args.guilds.split(",") : args.guilds
    const text = args.text

    if(guilds === "all") {
      msg.client.guilds.forEach((guild) => {
        this.sendAnnouncement(msg, guild, text)
      })
    } else if(guilds instanceof Array) {
      guilds.forEach((guildID) => {
        const guild = msg.client.guilds.get(guildID)
        if(!guild) {
          this.fails.push(guildID)
          return
        }

        this.sendAnnouncement(msg, guild, text)
      })
    } else {
      const guild = msg.client.guilds.get(guilds)
      if(!guild) return msg.reply(`Failed to send the announcement to ${guilds}`)

      this.sendAnnouncement(msg, guild, text)
    }

    if(this.fails.length > 0) {
      return msg.reply(stripIndents`
        Failed to send the announcement to these guilds:
        ${this.fails.join(", ")}
      `)
    }
  }
}
