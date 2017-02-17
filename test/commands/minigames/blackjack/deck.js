//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackDeck = require("../../../../src/commands/minigames/blackjack/deck")
const BlackjackGame = require("../../../../src/commands/minigames/blackjack/game")
const BlackjackPlayer = require("../../../../src/commands/minigames/blackjack/player")
const path = require("path")
const Decks = require("require-all")({
  dirname: path.join(__dirname, "../../../../src/commands/minigames/blackjack/decks"),
  resolve: function(Controller) {
    return new Controller()
  }
})
const expect = require("chai").expect

describe("Blackjack Deck", function() {

  var deck, game, player
  before(function() {
    game = new BlackjackGame({ dealerID: global.client.user.id, deck: "french", decks: 1 })
    game._reset()
    deck = new BlackjackDeck({ decks: 1, game: game, name: "french" })
    player = new BlackjackPlayer({ game: game, id: global.client.user.id })
  })

  describe("constructor", function() {
    it("should create a new blackjack deck", function() {
      expect(deck.game).to.equal(game)
      expect(deck.name).to.equal("french")
      expect(deck.amount).to.equal(1)
      for(var subDeck in Decks) {
        expect(deck.decks[subDeck]).to.exist
      }
      expect(deck.deck.length).to.equal(52)
      expect(deck.cards.length).to.equal(52)
      expect(deck._cards.length).to.equal(52)
    })
  })

  describe("deal", function() {
    it("should deal 2 to a player and return their score", function() {
      const score = deck.deal(player, 2)
      expect(player.hand.cards.length).to.equal(2)
      expect(score).to.equal(player.hand.score)
    })
    it("should update the player's score", function() {
      expect(player.hand.score).to.be.above(0)
    })
    it("should deal 1 card to the dealer and return their score", function() {
      const score = deck.deal(game.dealer, 1)
      expect(game.dealer.hand.cards.length).to.equal(1)
      expect(score).to.equal(game.dealer.hand.score)
    })
    it("should update the player's score", function() {
      expect(game.dealer.hand.score).to.be.above(0)
    })
    it("should remove those cards from the deck", function() {
      expect(deck.cards.length).to.equal(49)
    })
    it("should emit a 'deal' event to the game", function() {
      var deal = false
      game.on("deal", () => deal = true)
      deck.deal(player, 1)
      expect(deal).to.be.true
    })
  })

  describe("shuffle", function() {
    it("should return a shuffled array", function() {
      const shuffled = deck.shuffle(deck.cards)
      expect(shuffled).to.be.a("array")
      expect(shuffled).to.have.members(deck.cards)
    })
  })
})
