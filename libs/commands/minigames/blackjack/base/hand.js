//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = class BlackjackHand {
  constructor() {
    this.cards = new Array()
    this.cardsSimple = new Array()
    this.score = 0
    this.ace = false
  }

  add(card) {
    this.cards.push(card)
    this.cardsSimple.push(card.name)
    this.score += card.value
    if(card.name === "Ace") this.ace = true
    return this.score
  }

  reset() {
    this.cards = new Array()
    this.cardsSimple = new Array()
    this.ace = false
  }
}
