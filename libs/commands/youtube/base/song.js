//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = class Song {
  constructor(msg, args, video) {
    this.message = msg
    this.guild = msg.guild
    this.textChannel = msg.guild.channels.get(msg.guild.settings.get("song-text-channel"))
      || msg.channel
    this.voiceChannel = msg.guild.channels.get(msg.guild.settings.get("song-voice-channel"))
      || msg.member.voiceChannel
    this.member = msg.member

    this.url = args.url
    this.repeat = args.repeat
    this.repeated = false

    this.video = video
  }
}
