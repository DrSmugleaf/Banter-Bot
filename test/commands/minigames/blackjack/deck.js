//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackDeck = require("../../../../libs/commands/minigames/blackjack/deck")
const expect = require("chai").expect

describe("Blackjack Deck", function() {

  var deck

  before(function() {
    deck = new BlackjackDeck({ name: "french", decks: 1 })
  })

  describe("constructor", function() {
    // const deck = new BlackjackDeck({ name: "french", decks: 1 })
    // const game = new BlackjackGame(global.channel.sendTest("blackjack"))
    // const player = new BlackjackPlayer({ member: global.member, game: game})
    it("should create a new blackjack deck", function() {
      expect(deck.name).to.equal("french")
      expect(deck.amount).to.equal(1)
    })
  })
})
