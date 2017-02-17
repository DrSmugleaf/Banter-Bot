//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const _ = require("underscore")
const path = require("path")
const Decks = require("require-all")({
  dirname: path.join(__dirname, "decks"),
  // resolve: function(Controller) {
  //   return new Controller()
  // }
})

module.exports = class BlackjackDeck {
  constructor(args = {}) {
    this.game = args.game

    this.name = args.name

    this.amount = args.decks

    this.decks = Decks

    this.deck = this.decks[this.name].setup()

    this.cards = new Array()

    this._cards = new Array()

    this.setup()
  }

  deal(player, amount) {
    var cards = new Array()
    for(var i = 0; i < amount; i++) {
      const card = this.cards[Math.floor(Math.random() * this.cards.length)]
      cards.push(card)
      this.cards = _.without(this.cards, card)
      player.hand.add(card)
    }

    this.game.emit("deal", player, cards)
    return player.hand.score
  }

  reset() {
    this.cards = this.shuffle(this._cards)
    return this.cards
  }

  setup(cards) {
    for(var i = 0; i < this.amount; i++) {
      this.cards = this.cards.concat(cards)
    }

    this.cards = this.shuffle(this.cards)
    this._cards = this.cards
    return this.cards
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
