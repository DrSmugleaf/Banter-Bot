//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const parse = require("url").parse

module.exports = class Song {
  constructor(msg, args) {
    this.message = msg
    this.guild = msg.guild
    this.textChannel = msg.guild.channels.get(msg.guild.settings.get("song-text-channel"))
      || msg.channel
    this.voiceChannel = msg.guild.channels.get(msg.guild.settings.get("song-voice-channel"))
      || msg.member.voiceChannel
    this.member = msg.member

    this.video = args.video
    this.repeat = args.repeat
    this.repeated = false
  }

  static id(url) {
    const parsed = parse(url, true)
    var id = parsed.query.v
    if(parsed.hostname === "youtu.be" || !id) {
      id = parsed.pathname.split("/")
      id = id[id.length - 1]
    }
    return id || null
  }

  static valid(url) {
    const parsed = parse(url, true)
    return !parsed || ["youtube", "youtu.be"].contains(parsed.hostname)
  }
}
