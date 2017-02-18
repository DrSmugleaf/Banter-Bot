//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = class BlackjackHand {
  constructor(data) {
    this.game = data.game

    this.cards = new Array()

    this.aces = 0

    this._score = 0
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
