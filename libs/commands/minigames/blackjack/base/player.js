//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackHand = require("./hand")

module.exports = class BlackjackPlayer {
  constructor(args) {
    this.member = args.member
    this.hand = new BlackjackHand()
  }
}
