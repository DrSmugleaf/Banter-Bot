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
          prompt: "What do you want to do?",
          type: "string",
          validate: (value) => {

          }
        }
      ]
    })

    this.client.once("dbReady", () => {
      new AutoChannel(this.client)
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission("MANAGE_CHANNELS")
  }

  async run(msg, args) {
    const mode = args.mode

  }
}
