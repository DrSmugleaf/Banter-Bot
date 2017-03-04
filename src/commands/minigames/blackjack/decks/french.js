//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackCard = require("../card")

module.exports = class BlackjackFrenchDeck {
  constructor() {

    this.cards = (suit) => [
      new BlackjackCard({ deck: "french", name: "Ace", value: 11, suit: suit }),
      new BlackjackCard({ deck: "french", name: "2", value: 2, suit: suit }),
      new BlackjackCard({ deck: "french", name: "3", value: 3, suit: suit }),
      new BlackjackCard({ deck: "french", name: "4", value: 4, suit: suit }),
      new BlackjackCard({ deck: "french", name: "5", value: 5, suit: suit }),
      new BlackjackCard({ deck: "french", name: "6", value: 6, suit: suit }),
      new BlackjackCard({ deck: "french", name: "7", value: 7, suit: suit }),
      new BlackjackCard({ deck: "french", name: "8", value: 8, suit: suit }),
      new BlackjackCard({ deck: "french", name: "9", value: 9, suit: suit }),
      new BlackjackCard({ deck: "french", name: "10", value: 10, suit: suit }),
      new BlackjackCard({ deck: "french", name: "Jack", value: 10, suit: suit }),
      new BlackjackCard({ deck: "french", name: "Queen", value: 10, suit: suit }),
      new BlackjackCard({ deck: "french", name: "King", value: 10, suit: suit })
    ]

    this.suits = [
      {
        name: "clubs",
        symbol: "♣"
      },
      {
        name: "diamonds",
        symbol: "♦"
      },
      {
        name: "hearts",
        symbol: "♥"
      },
      {
        name: "spades",
        symbol: "♠"
      }
    ]
  }

  setup() {
    var deck = new Array()
    this.suits.forEach((suit) => {
      deck = deck.concat(this.cards(suit))
    })
    return deck
  }
}
