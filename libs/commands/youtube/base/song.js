//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = class Song {
  constructor(msg, args) {
    this.channel = msg.channel,
    this.guild = msg.guild,
    this.member = msg.member,
    this.url = args.url,
    this.repeat = args.repeat,
    this.repeated = false
  }
}
