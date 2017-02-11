//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = class BlackjackGame {
  constructor(args) {
    this.guild = args.guild
    this.players = new Array()
    this.setup(args)
  }

  setup(args) {
    args.members.forEach((member) => {
      this.players.push(member)
    })
  }
}
