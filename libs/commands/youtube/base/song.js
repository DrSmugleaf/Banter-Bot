//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = class Song {
  constructor(msg, args, video) {
    this.channel = msg.channel
    this.guild = msg.guild
    this.member = msg.member
    this.message = msg
    this.dispatcher = null

    this.url = args.url
    this.repeat = args.repeat
    this.repeated = false

    this.video = video
  }
}
