//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = class BlackjackCard {
  constructor(args) {
    this.deck = args.deck
    this.name = args.name
    this.value = args.value
    this.suit = args.suit
  }
}
