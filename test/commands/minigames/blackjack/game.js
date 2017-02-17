//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackDeck = require("../../../../src/commands/minigames/blackjack/deck")
const BlackjackGame = require("../../../../src/commands/minigames/blackjack/game")
const BlackjackPlayer = require("../../../../src/commands/minigames/blackjack/player")

const expect = require("chai").expect

describe("Blackjack Game", function() {

  var game
  beforeEach(function() {
    game = new BlackjackGame({ dealerID: global.client.user.id, deck: "french", decks: 1 })
    game._reset()
  })

  afterEach(function() {
    game.removePlayer(global.client.user.id)
  })

  describe("constructor", function() {
    it("should create a new blackjack game", function() {
      expect(game.dealer).to.be.an.instanceof(BlackjackPlayer)
      expect(game.dealer.id).to.equal(global.client.user.id)
      expect(game.deck).to.be.an.instanceof(BlackjackDeck)
      expect(game.playerCount).to.equal(0)
      expect(game.timeLimit).to.be.a("number")
      expect(game.timeout).to.be.null
      expect(game.turnStarted).to.be.false
      expect(game.listenerCount("action")).to.be.above(0)
    })
  })

  describe("add player", function() {
    it("should add a player to the game and return its BlackjackPlayer instance", function() {
      const player = game.addPlayer(global.client.user.id)
      expect(game.hasPlayer(global.client.user.id)).to.be.true
      expect(game.playerCount).to.equal(1)
      expect(player).to.be.an.instanceof(BlackjackPlayer)
    })
  })

  describe("get player", function() {
    it("should return undefined if the player doesn't exist", function() {
      expect(game.getPlayer(global.client.user.id)).to.be.undefined
    })
    it("should return the player's BlackjackPlayer instance if it does exist", function() {
      game.addPlayer(global.client.user.id)
      expect(game.getPlayer(global.client.user.id)).to.be.an.instanceof(BlackjackPlayer)
    })
  })

  describe("has player", function() {
    it("should return false if the player doesn't exist", function() {
      expect(game.hasPlayer(global.client.user.id)).to.be.false
    })
    it("should return true if the player does exist", function() {
      game.addPlayer(global.client.user.id)
      expect(game.hasPlayer(global.client.user.id)).to.be.true
    })
  })

  describe("remove player", function() {
    it("should remove the player from the game", function() {
      game.addPlayer(global.client.user.id)
      game.removePlayer(global.client.user.id)
      expect(game.hasPlayer(global.client.user.id)).to.be.false
    })
  })

  describe("process turn, 1 player", function() {

    var player
    beforeEach(function() {
      player = game.addPlayer(global.client.user.id)
    })

    afterEach(function() {
      game._reset()
    })

    describe("action: hit", function() {
      it("should have turnStarted be false, instant turn ending", function() {
        player.action = "hit"
        expect(game.turnStarted).to.be.false
      })

      it("should give 1 card to the player", function() {
        player.action = "hit"
        expect(player.hand.cards.length).to.equal(1)
      })
    })

    describe("action: stand", function() {
      it("should have turnStarted be false, instant turn ending", function() {
        player.action = "stand"
        expect(game.turnStarted).to.be.false
      })

      it("should end the game with a player win, loss or tie", function() {
        var win, lose, tie
        game.on("win", () => win = true)
        game.on("lose", () => lose = true)
        game.on("tie", () => tie = true)

        player.action = "stand"
        expect(win || lose || tie).to.be.true
      })

      it("should give the dealer 1 card", function() {
        player.action = "stand"
        expect(game.dealer.hand.cards.length).to.equal(1)
      })

      it("should give the player 2 cards", function() {
        player.action = "stand"
        expect(player.hand.cards.length).to.equal(2)
      })
    })

    describe("action: none", function() {
      it("should have turnStarted be false, instant turn ending", function() {
        player.action = null
        game.processTurn()
        expect(game.turnStarted).to.be.false
      })

      it("should kick the player from the game", function() {
        player.action = null
        game.processTurn()
        expect(game.hasPlayer(global.client.user.id)).to.be.false
      })
    })
  })
})
