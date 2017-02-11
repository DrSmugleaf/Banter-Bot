//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const path = require("path")
const Decks = require("require-all")({
  dirname: path.join(__dirname, "decks"),
  resolve: function(Controller) {
    return new Controller()
  }
})

module.exports = class BlackjackDeck {
  constructor(args) {
    this.name = args.name || "french"
    this.amount = args.decks || 1
    this.decks = Decks
    this.deck = this.decks[args.name]
    this.cards = this.setup()
  }

  setup() {
    if(52 * this.amount > 416) throw new Error("Number of cards in blackjack can't exceed 416")

    const originalDeck = this.decks[this.name].setup()
    var cards = new Array()
    for(var i = 0; i < this.amount; i++) {
      cards = cards.concat(originalDeck)
    }
    cards = this.shuffle(cards)
    this._cards = cards
    return cards
  }

  reset() {
    return this._cards
  }

  shuffle(array) {
    var currentIndex = array.length
    var temporaryValue
    var randomIndex

    while(0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }
}
