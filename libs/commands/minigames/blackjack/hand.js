//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = class BlackjackHand {
  constructor() {
    this.cards = new Array()
    this.aces = 0
    this.status = "playing"
    this._score = 0
  }

  get score() {
    if(this._score > 21 && this.aces > 0) {
      if(!this.aces === 1) return this._score - 10
      if(!this.aces > 1) return this._score - (10 * this.aces - 1)
    }
    if(this._score > 21 && this.aces > 0) return this._score - (10 * this.aces)
    return this._score
  }

  set score(value) {
    this._score = value
  }

  add(card) {
    this.cards.push(card)
    this.score = this._score + card.value
    if(card.name === "Ace") this.aces = true
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
    this.aces = 0
  }
}
