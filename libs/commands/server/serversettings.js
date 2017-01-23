//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")

module.exports = class ServerSettings extends commando.Command {
  constructor(client) {
    super(client, {
      name: "server-settings",
      aliases: ["server-settings", "serversettings"],
      group: "server",
      memberName: "server-settings",
      description: "Modifies this server's settings",
      examples: ["server-settings"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "mode",
          prompt: "What do you want to do?",
          type: "string",
          validate: (mode) => {
            return ["clear", "get", "remove", "set"].includes(mode)
          }
        },
        {
          key: "settings",
          prompt: "What settings do you want to apply?",
          type: "string"
        },
        {
          key: "settings2",
          prompt: "Dummy for mode set (value)",
          type: "string",
          default: ""
        }
      ]
    })
  }

  hasPermission(msg) {
    return msg.author.id === this.client.options.owner
  }

  async run(msg, args) {
    const mode = args.mode
    const key = args.settings
    const value = args.settings2
    const guildSettings = msg.guild.settings

    switch (mode) {
    case "clear": {
      guildSettings.clear()
      return msg.reply(constants.responses.SERVER_SETTINGS.CLEAR[msg.language])
    }
    case "get": {
      const get = guildSettings.get(key)
      return msg.reply(constants.responses.SERVER_SETTINGS.GET[msg.language](key, get))
    }
    case "remove": {
      guildSettings.remove(key)
      return msg.reply(constants.responses.SERVER_SETTINGS.REMOVE[msg.language](key))
    }
    case "set": {
      guildSettings.set(key, value)
      return msg.reply(constants.responses.SERVER_SETTINGS.SET[msg.language](key, value))
    }
    }
  }
}
