//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackHand = require("./hand")

module.exports = class BlackjackPlayer {
  constructor(data) {
    this.action = null

    this.id = data.id

    this.game = data.game

    this.hand = new BlackjackHand()

    this.status = "playing"
  }

  blackjack() {
    this.status = "blackjack"
    this.game.emit("blackjack", this)
  }

  lose() {
    this.status = "lose"
    this.game.emit("lose", this)
  }

  tie() {
    this.status = "tie"
    this.game.emit("tie", this)
  }

  win() {
    this.status = "win"
    this.game.emit("win", this)
  }

  reset() {
    this.action = null
    this.status = "playing"
    this.hand.reset()
  }
}
