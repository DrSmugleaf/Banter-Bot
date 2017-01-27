//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")

module.exports = class SongTextChannel extends commando.Command {
  constructor(client) {
    super(client, {
      name: "song-text-channel",
      aliases: [
        "song-text-channel", "songtextchannel",
        "text-song-channel", "textsongchannel",
      ],
      group: "server",
      memberName: "song-text-channel",
      description: "Set the server's song channel for the bot.",
      examples: ["song-text-channel songs", "song-text-channel videos"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "channel",
          prompt: "What channel do you want to set as the song text channel?",
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
      return msg.reply(constants.responses.SONG_TEXT_CHANNEL.INVALID[msg.language](channel.name))
    }
    
    if(!channel.permissionsFor(msg.guild.member(msg.client.user)).hasPermission("SEND_MESSAGES")) {
      return msg.reply(constants.responses.SONG_TEXT_CHANNEL.NO_PERMISSION[msg.language](channel.name))
    }

    msg.guild.settings.set("song-text-channel", channel)

    return msg.reply(constants.responses.SONG_TEXT_CHANNEL.SET[msg.language](channel.name))
  }
}
