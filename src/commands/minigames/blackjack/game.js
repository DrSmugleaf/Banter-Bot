//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackDeck = require("./deck")
const BlackjackHand = require("./hand")
const BlackjackPlayer = require("./player")
const Discord = require("discord.js")
const EventEmitter = require("events").EventEmitter

module.exports = class BlackjackGame extends EventEmitter {
  constructor(data) {
    super()

    this.dealer = new BlackjackPlayer({ id: data.dealerID, game: this })

    this.deck = new BlackjackDeck({ decks: data.decks, game: this, name: data.deck })

    this.playerCount = 0

    this._players = new Discord.Collection()

    this.players = new Discord.Collection()

    this.on("action", () => {
      if(this.players.every((player) => {
        return player.hands.every((hand) => {
          return hand.action
        })
      })) {
        return this.processTurn()
      }
    })

    this.addPlayer(data.player)
  }

  addPlayer(id) {
    const player = new BlackjackPlayer({ game: this, id: id })
    this._players.set(id, player)
    this.playerCount++
    return player
  }

  getPlayer(id) {
    return this.players.get(id) || this._players.get(id)
  }

  hasPlayer(id) {
    return this.players.has(id) || this._players.has(id)
  }

  removePlayer(id) {
    this.playerCount--
    if(this.playerCount < 1) this.end()
    return this.players.delete(id) || this._players.delete(id)
  }

  processTurn() {
    this.players.forEach((player) => {
      player.hands.forEach((hand) => {
        if(hand.status !== "playing") return
        switch (hand.action) {
        case "hit":
          this.deck.deal(hand, 1)
          break
        case "stand":
          break
        case "double":
          hand.bet *= 2
          this.deck.deal(hand, 1)
          hand._action = "stand"
          break
        case "split": {
          const splitHand = new BlackjackHand({ player: this })
          splitHand.cards.push(hand.cards[0])
          hand.cards.shift()
          player.hands.push(splitHand)
          break
        }
        case "surrender":
          hand.bet /= 2
          hand.surrender()
          break
        }

        if(hand.score > 21) return hand.lose()
      })
    })

    if(this.players.every((player) => {
      return player.hands.every((hand) => {
        return hand.status !== "playing"
      })
    })) return this.start()

    if(this.players.every((player) => {
      return player.hands.every((hand) => {
        return hand.status !== "playing" || hand.action === "stand" || hand.score === 21
      })
    })) {
      while(this.dealer.hands[0].score < 17) {
        this.deck.deal(this.dealer.hands[0], 1)
      }

      this.players.forEach((player) => {
        player.hands.forEach((hand) => {
          if(hand.status !== "playing") return
          if(this.dealer.hands[0].score > 21) return hand.win()
          if(this.dealer.hands[0].score > hand.score) return hand.lose()
          if(this.dealer.hands[0].score < hand.score) return hand.win()
          return hand.tie()
        })
      })

      return this.start()
    } else {
      return this.nextTurn()
    }
  }

  _reset() {
    this.dealer.reset()
    this.players.forEach((player) => {
      player.reset()
    })
    this.deck.reset()
  }

  start() {
    this._players.forEach((player) => {
      this.players.set(player.id, player)
      this._players.delete(player.id)
    })
    this.dealer.reset()
    this.deck.deal(this.dealer.hands[0], 1, { silent: true })

    this.players.forEach((player) => {
      player.reset()
      this.deck.deal(player.hands[0], 2, { silent: true })
      if(player.hands[0].score === 21) player.hands[0].blackjack()
    })

    this.emit("start", this)
  }

  nextTurn() {
    this.players.forEach((player) => {
      if(player.status === "playing" && player.action !== "stand") player.action = null
    })

    this.emit("nextTurn", this)
  }

  end() {
    this.emit("end", this)
  }
}
