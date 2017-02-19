//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const AutoChannel = require("./base/autochannel")
const commando = require("discord.js-commando")

module.exports = class AutoChannelCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "autochannel",
      aliases: ["autochannel", "autoch", "auto-channel", "auto-ch"],
      group: "autochannel",
      memberName: "autochannel",
      description: "Configure the automatic creation of voice and text channels depending on the games being played in your server.",
      examples: ["autochannel"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "mode",
          prompt: "What do you want to do? (disable, enable, threshold)",
          type: "string",
          validate: (value) => {
            return ["disable", "enable", "threshold"].includes(value)
          }
        },
        {
          key: "threshold",
          prompt: "What do you want to set the channel creation/deletion threshold to?",
          type: "integer",
          default: ""
        }
      ]
    })

    this.client.on("dbReady", () => {
      new AutoChannel(this.client)
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission("MANAGE_CHANNELS")
  }

  async run(msg, args) {
    const mode = args.mode
    const threshold = args.threshold
    const settings = msg.guild.settings.get("auto-channel", {})

    switch (mode) {
    case "disable":
      settings.enabled = false
      msg.guild.settings.set("auto-channel", settings)
      break
    case "enable":
      settings.enabled = true
      msg.guild.settings.set("auto-channel", settings)
      break
    case "threshold":
      settings.threshold = threshold
      msg.guild.settings.set("auto-channel", settings)
    }
  }
}
