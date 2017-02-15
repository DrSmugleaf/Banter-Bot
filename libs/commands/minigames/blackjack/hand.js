//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = class BlackjackHand {
  constructor() {
    this.cards = new Array()
    this.ace = false
    this.status = "playing"
    this._score = 0
  }

  get score() {
    if(this._score > 21 && this.ace) return this._score - 10
    return this._score
  }

  set score(value) {
    this._score = value
  }

  add(card) {
    this.cards.push(card)
    this.score += card.value
    if(card.name === "Ace") this.ace = true
    return this.score
  }

  get() {
    var response = new String()
    this.cards.forEach((card) => {
      response = `${response}${card.name}: ${card.value}\n`
    })
  }

  reset() {
    this.cards = new Array()
    this.ace = false
  }
}
