//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackHand = require("./hand")

module.exports = class BlackjackPlayer {
  constructor(data) {
    this._action = null

    this.bet = 0

    this.id = data.id

    this.game = data.game

    this.hand = new BlackjackHand({ game: this.game })

    this.status = "playing"
  }

  get action() {
    return this._action
  }

  set action(action) {
    if(!action) return this._action = action
    if(!this.availableActions.includes(action)) return

    this._action = action
    this.game.emit("action", this)
  }

  get availableActions() {
    const actions = new Array()
    if(this.status !== "playing" || this._action) return actions

    actions.push("hit")
    actions.push("stand")
    actions.push("double")
    if(this.hand.cards.length === 2 && this.hand.cards[0].value === this.hand.cards[1].value) {
      actions.push("split")
    }
    if(this.hand.cards.length === 2) actions.push("surrender")

    return actions
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

  surrender() {
    this.status = "surrender"
    this.game.emit("surrender", this)
  }

  reset() {
    this.action = null
    this.status = "playing"
    this.hand.reset()
  }
}
