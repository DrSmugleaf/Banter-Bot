//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const AutoChannel = require("./base/autochannel")
const commando = require("discord.js-commando")
const responses = require("../../util/constants").responses.AUTO_CHANNEL

module.exports = class AutoChannelCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "autochannel",
      aliases: [
        "autochannel", "autoch", "auto-channel", "auto-ch",
        "automaticchannel", "automaticch", "automatic-channel", "automatic-ch"
      ],
      group: "autochannel",
      memberName: "autochannel",
      description: "Configure the automatic creation of voice and text channels depending on the games being played in your server.",
      examples: [
        "autochannel disable", "autochannel enable", "autochannel update",
        "autochannel threshold 5"
      ],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "mode",
          prompt: "What do you want to do? (disable, enable, update, threshold)",
          type: "string",
          validate: (value) => {
            return ["disable", "enable", "update", "threshold"].includes(value.toLowerCase())
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

    this.client.once("dbReady", () => {
      this.autoChannel = new AutoChannel(this.client)
      this.ready = true
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission("MANAGE_CHANNELS")
  }

  async run(msg, args) {
    if(!this.ready) return msg.reply(responses.NOT_READY[msg.language])
    const mode = args.mode.toLowerCase()
    var threshold = args.threshold
    const settings = msg.guild.settings.get("auto-channel", {})

    switch (mode) {
    case "disable":
      settings.enabled = false
      msg.guild.settings.set("auto-channel", settings)
      return msg.reply(responses.DISABLED[msg.language])
    case "enable":
      settings.enabled = true
      msg.guild.settings.set("auto-channel", settings)
      return msg.reply(responses.ENABLED[msg.language])
    case "update":
      this.autoChannel.updateGuild(msg.guild)
      return msg.reply(responses.UPDATED[msg.language])
    case "threshold":
      if(!threshold) threshold = await this.args[1].obtainSimple(msg)
      if(!threshold) return
      settings.threshold = threshold
      msg.guild.settings.set("auto-channel", settings)
      this.autoChannel.updateChannels(msg.guild)
      return msg.reply(responses.SET_THRESHOLD[msg.language](threshold))
    }
  }
}
