//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackHand = require("./hand")

module.exports = class BlackjackPlayer {
  constructor(data) {
    this.id = data.id

    this.game = data.game

    this.hands = [new BlackjackHand({ player: this })]
  }

  reset() {
    this.action = null
    this.status = "playing"
    this.hands.forEach((hand) => hand.reset())
    this.hands = [new BlackjackHand({ player: this })]
  }
}
