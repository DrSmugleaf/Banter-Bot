//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")

module.exports = class SongVoiceChannel extends commando.Command {
  constructor(client) {
    super(client, {
      name: "song-voice-channel",
      aliases: [
        "song-voice-channel", "songvoicechannel",
        "voice-song-channel", "voicesongchannel",
      ],
      group: "server",
      memberName: "song-voice-channel",
      description: "Set the server's song channel for the bot.",
      examples: ["song-voice-channel none", "song-voice-channel music", "song-voice-channel songs"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "channel",
          prompt: "What channel do you want to set as the song voice channel?",
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
    if(!channel || channel === "none") {
      msg.guild.settings.remove("song-voice-channel")
      return msg.reply(constants.responses.SONG_VOICE_CHANNEL.REMOVED[msg.language])
    }
    if(channel.type !== "voice") {
      return msg.reply(constants.responses.SONG_VOICE_CHANNEL.INVALID[msg.language](channel.name))
    }

    const selfPermissions = channel.permissionsFor(msg.guild.member(msg.client.user))
    if(!selfPermissions.hasPermission("CONNECT")) {
      return msg.reply(constants.responses.SONG_VOICE_CHANNEL.CANT_CONNECT[msg.language](channel.name))
    }
    if(!selfPermissions.hasPermission("SPEAK")) {
      return msg.reply(constants.responses.SONG_VOICE_CHANNEL.CANT_SPEAK[msg.language](channel.name))
    }

    msg.guild.settings.set("song-voice-channel", channel.id)

    return msg.reply(constants.responses.SONG_VOICE_CHANNEL.SET[msg.language](channel.name))
  }
}
