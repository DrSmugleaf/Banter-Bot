//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = class BlackjackHand {
  constructor(data) {
    this.aces = 0

    this._action = null

    this.bet = 0

    this.cards = new Array()

    this.game = data.player.game

    this.player = data.player

    this._score = 0

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
    if(this.status !== "playing" || this.action) return actions

    actions.push("hit", "stand", "double")
    if(this.cards.length === 2 && this.cards[0].value === this.cards[1].value) actions.push("split")
    if(this.cards.length === 2) actions.push("surrender")

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

  get score() {
    var tempScore = this._score
    var tempAces = this.aces

    while(tempScore > 21 && tempAces > 0) {
      tempScore -= 10
      tempAces--
    }

    return tempScore
  }

  set score(value) {
    this._score = value
  }

  add(card) {
    this.cards.push(card)
    this.score = this._score + card.value
    if(card.name === "Ace") this.aces++
    return this.score
  }

  reset() {
    this.cards.forEach((card) => this.game.deck.discarded.push(card))
    this.cards = new Array()
    this.aces = 0
    this._score = 0
  }
}
