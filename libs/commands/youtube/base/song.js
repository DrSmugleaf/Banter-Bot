//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = class Song {
  constructor(msg, args, video) {
    this.channel = msg.channel,
    this.guild = msg.guild,
    this.member = msg.member,

    this.url = args.url,
    this.repeat = args.repeat,
    this.repeated = false

    this.video = {}
    for(const prop in video) {
      if(video.hasOwnProperty(prop)) {
        this.video[prop] = video[prop]
      }
    }
  }
}
