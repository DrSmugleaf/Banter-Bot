//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")

module.exports = class InfoChannel extends commando.Command {
  constructor(client) {
    super(client, {
      name: "info-channel",
      aliases: ["info-channel", "infochannel"],
      group: "server",
      memberName: "info-channel",
      description: "Set the server's info channel for the bot.",
      examples: ["info-channel info", "info-channel bots"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "channel",
          prompt: "What channel do you want to set as the info channel?",
          type: "channel"
        }
      ]
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission("ADMINISTRATOR")
  }

  async run(msg, args) {
    const channel = args.channel
    if(channel.type !== "text") {
      return msg.reply(constants.responses.INFO_CHANNEL.INVALID[msg.language](channel.name))
    }
    if(!channel.permissionsFor(msg.guild.member(msg.client.user)).hasPermission("SEND_MESSAGES")) {
      return msg.reply(constants.responses.INFO_CHANNEL.NO_PERMISSION[msg.language](channel.name))
    }

    msg.guild.settings.set("info-channel", channel.id)

    return msg.reply(constants.responses.INFO_CHANNEL.SET[msg.language](channel.name))
  }
}
