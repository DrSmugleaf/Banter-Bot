//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"

module.exports = class BlackjackCard {
  constructor(data) {
    this.deck = data.deck

    this.name = data.name

    this.value = data.value
    
    this.suit = data.suit
  }
}
