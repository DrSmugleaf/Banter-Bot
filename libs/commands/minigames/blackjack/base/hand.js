//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = class BlackjackHand {
  constructor() {
    this.cards = new Array()
    this.cardsSimple = new Array()
    this.ace = false
    this.status = "playing"
  }

  get score() {
    if(this.score > 21 && this.ace) return this.score - 10
    return this.score
  }

  set score(value) {
    this.score = value
  }

  add(card) {
    this.cards.push(card)
    this.cardsSimple.push(card.name)
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
    this.cardsSimple = new Array()
    this.ace = false
  }
}
