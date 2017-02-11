//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = class BlackjackFrenchDeck {
  constructor() {
    this.cards = (suit) => [
      {
        name: "Ace",
        value: 11, // 1 || 11
        suit: suit
      },
      {
        name: "2",
        value: 2,
        suit: suit
      },
      {
        name: "3",
        value: 3,
        suit: suit
      },
      {
        name: "4",
        value: 4,
        suit: suit
      },
      {
        name: "5",
        value: 5,
        suit: suit
      },
      {
        name: "6",
        value: 6,
        suit: suit
      },
      {
        name: "7",
        value: 7,
        suit: suit
      },
      {
        name: "8",
        value: 8,
        suit: suit
      },
      {
        name: "9",
        value: 9,
        suit: suit
      },
      {
        name: "10",
        value: 10,
        suit: suit
      },
      {
        name: "Jack",
        value: 10,
        suit: suit
      },
      {
        name: "Queen",
        value: 10,
        suit: suit
      },
      {
        name: "King",
        value: 10,
        suit: suit
      }
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

    this.setup = () => {
      var deck = []
      this.suits.forEach((suit) => {
        deck = deck.concat(this.cards(suit))
      })
      return deck
    }
  }
}
