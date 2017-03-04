//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const expect = require("chai").expect
const BlackjackGame = require("../../../../src/commands/minigames/blackjack/game")
const BlackjackPlayer = require("../../../../src/commands/minigames/blackjack/player")

describe("Blackjack Game", function() {

  var game, player, lose, tie, win, surrender, start, nextTurn, end, deal
  beforeEach(function() {
    lose = undefined
    tie = undefined
    win = undefined
    surrender = undefined
    start = undefined
    nextTurn = undefined
    deal = new Array()
    game = new BlackjackGame({
      dealerID: global.client.user.id, deck: "french", decks: 1, player: global.client.user.id
    }).on("deal", (hand, card) => {
      if(!hand.action) return
      deal.push({ hand: hand, card: card })
    }).on("lose", () => lose = true)
      .on("tie", () => tie = true)
      .on("win", () => win = true)
      .on("surrender", () => surrender = true)
      .on("start", () => start = true)
      .on("nextTurn", () => nextTurn = true)
      .on("end", () => end = true)

    player = game.getPlayer(global.client.user.id)
    game.players.set(player.id, player)
    game._players.delete(player.id)
  })

  describe("addPlayer", function() {

    var player
    beforeEach(function() {
      player = game.addPlayer(global.client.options.owner)
    })

    it("should add a player to the game", function() {
      expect(game.hasPlayer(global.client.options.owner))
    })
    it("should increase the player count", function() {
      expect(game.playerCount).to.equal(2)
    })
    it("should return an instance of BlackjackPlayer", function() {
      expect(player).to.be.an.instanceof(BlackjackPlayer)
    })
  })

  describe("getPlayer", function() {
    it("should return a player instance if it exists", function() {
      game.addPlayer(global.client.options.owner)
      const getPlayer = game.getPlayer(global.client.options.owner)
      expect(getPlayer).to.be.an.instanceof(BlackjackPlayer)
    })
    it("shouldn't return a player instance if it doesn't exist", function() {
      const getPlayer = game.getPlayer(global.client.options.owner)
      expect(getPlayer).to.be.undefined
    })
  })

  describe("hasPlayer", function() {
    it("should return true if the player exists", function() {
      game.addPlayer(global.client.options.owner)
      const hasPlayer = game.hasPlayer(global.client.options.owner)
      expect(hasPlayer).to.be.true
    })
    it("should return false if the player doesn't exist", function() {
      const hasPlayer = game.hasPlayer(global.client.options.owner)
      expect(hasPlayer).to.be.false
    })
  })

  describe("removePlayer", function() {

    beforeEach(function() {
      game.addPlayer(global.client.options.owner)
      game.removePlayer(global.client.user.id)
    })

    it("should remove a player from the game", function() {
      expect(game.hasPlayer(global.client.user.id)).to.be.false
    })
    it("should decrease the player count", function() {
      expect(game.playerCount).to.equal(1)
    })
    it("should end the game if there are no players left", function() {
      game.removePlayer(global.client.options.owner)
      expect(end).to.be.true
    })
  })

  describe("processTurn", function() {
    describe("1 player", function() {
      describe("action: hit", function() {

        beforeEach(function() {
          player.hands[0].action = "hit"
        })

        it("should deal 1 card to the player", function() {
          expect(player.hands[0].cards).to.have.lengthOf(1)
        })
        it("shouldn't result in a player loss, tie or victory", function() {
          expect(lose || tie || win).to.be.undefined
        })
        it("shouldn't start a new game", function() {
          expect(start).to.be.undefined
        })
        it("should start a new turn", function() {
          expect(nextTurn).to.be.true
        })
      })

      describe("action: stand", function() {

        beforeEach(function() {
          player.hands[0].action = "stand"
        })

        it("should deal no cards to the player", function() {
          expect(deal).to.be.empty
        })
        it("should result in a player loss or victory", function() {
          expect(lose || win).to.be.true
        })
        it("should start a new game", function() {
          expect(start).to.be.true
        })
        it("shouldn't start a new turn", function() {
          expect(nextTurn).to.be.undefined
        })
      })

      describe("action: double", function() {

        beforeEach(function() {
          player.hands[0].action = "double"
        })

        it("should double the player's bet")
        it("should deal 1 card to the player", function() {
          expect(deal).to.have.lengthOf(1)
        })
        it("should result in a player loss or victory", function() {
          expect(lose || win).to.be.true
        })
        it("should start a new game", function() {
          expect(start).to.be.true
        })
        it("shouldn't start a new turn", function() {
          expect(nextTurn).to.be.undefined
        })
      })

      describe("action: split", function() {

        beforeEach(function() {
          player.hands[0].action = "split"
        })

        it("should split the player's hand into two")
      })


      describe("action: surrender", function() {
        describe("not 2 cards", function() {

          beforeEach(function() {
            player.hands[0].action = "surrender"
          })

          it("shouldn't change the hand's action", function() {
            expect(player.hands[0].action).to.be.null
          })
          it("shouldn't result in a player loss, tie or victory", function() {
            expect(lose || tie || win).to.be.undefined
          })
          it("shouldn't start a new game", function() {
            expect(start).to.be.undefined
          })
          it("shouldn't start a new turn", function() {
            expect(nextTurn).to.be.undefined
          })
        })

        describe("2 cards", function() {

          beforeEach(function() {
            game.deck.deal(player.hands[0], 2)
            player.hands[0].action = "surrender"
          })

          it("should halve the player's bet")
          it("should result in a player surrender", function() {
            expect(surrender).to.be.true
          })
          it("should start a new game", function() {
            expect(start).to.be.true
          })
          it("shouldn't start a new turn", function() {
            expect(nextTurn).to.be.undefined
          })
        })
      })

      describe("action: none", function() {

        beforeEach(function() {
          game.processTurn()
        })
      })
    })
  })

  describe("start", function() {

    beforeEach(function() {
      game.players.set(player.id, player)
      game._players.delete(player.id)
      game.start()
    })

    it("should deal 1 card to the dealer", function() {
      expect(game.dealer.hands[0].cards).to.have.lengthOf(1)
    })
    it("should deal 2 cards to the player", function() {
      expect(player.hands[0].cards).to.have.lengthOf(2)
    })
    it("should start a new game", function() {
      expect(start).to.be.true
    })
  })

  describe("nextTurn", function() {
    describe("action: stand", function() {

      beforeEach(function() {
        player.hands[0].action = "stand"
        game.nextTurn()
      })

      it("should set the player's action to null", function() {
        expect(player.hands[0].action).to.be.null
      })
      it("should start a new turn", function() {
        expect(nextTurn).to.be.true
      })
      it("and then it should start a new game", function() {
        expect(start).to.be.true
      })
    })

    describe("action: none", function() {

      beforeEach(function() {
        game.nextTurn()
      })

      it("shouldn't change the player's action", function() {
        expect(player.hands[0].action).to.be.null
      })
      it("should start a new turn", function() {
        expect(nextTurn).to.be.true
      })
      it("shouldn't start a new game", function() {
        expect(start).to.be.undefined
      })
    })
  })

  describe("end", function() {
    it("should end the game", function() {
      expect(end).to.be.true
    })
  })
})
