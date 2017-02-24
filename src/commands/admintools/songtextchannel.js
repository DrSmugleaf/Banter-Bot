//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const responses = require("../../util/constants").responses.SONG_TEXT_CHANNEL

module.exports = class SongTextChannelCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "song-text-channel",
      aliases: [
        "song-text-channel", "songtextchannel",
        "text-song-channel", "textsongchannel",
      ],
      group: "admintools",
      memberName: "song-text-channel",
      description: "Set the server's song channel for the bot.",
      examples: ["song-text-channel none", "song-text-channel songs", "song-text-channel videos"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "channel",
          prompt: "What channel do you want to set as the song text channel?",
          type: "channel",
          default: ""
        }
      ]
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission("ADMINISTRATOR")
  }

  async run(msg, args) {
    const channel = args.channel
    if(!channel) {
      msg.guild.settings.remove("song-text-channel")
      return msg.reply(responses.REMOVED[msg.language])
    }
    if(channel.type !== "text") {
      return msg.reply(responses.INVALID[msg.language](channel.name))
    }

    if(!channel.permissionsFor(msg.guild.member(msg.client.user)).hasPermission("SEND_MESSAGES")) {
      return msg.reply(responses.NO_PERMISSION[msg.language](channel.name))
    }

    msg.guild.settings.set("song-text-channel", channel.id)

    return msg.reply(responses.SET[msg.language](channel.name))
  }
}
