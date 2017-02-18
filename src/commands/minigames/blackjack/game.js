//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackDeck = require("./deck")
const BlackjackPlayer = require("./player")
const Discord = require("discord.js")
const EventEmitter = require("events").EventEmitter

module.exports = class BlackjackGame extends EventEmitter {
  constructor(data) {
    super()

    this.dealer = new BlackjackPlayer({ id: data.dealerID, game: this })

    this.deck = new BlackjackDeck({ game: this, name: data.deck, decks: data.decks })

    this.playerCount = 0

    this._players = new Discord.Collection()

    this.players = new Discord.Collection()

    this.timeLimit = 5 * 1000

    this.timeout = null

    this.started = false

    this.on("action", () => {
      if(this.players.every((player) => player.action)) return this.processTurn()
      if(this.started) return
      this.started = true
      this.timeout = setTimeout(() => {
        this.processTurn()
      }, this.timeLimit)
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
    return this.players.get(id)
  }

  hasPlayer(id) {
    return this.players.has(id)
  }

  removePlayer(id) {
    return this.players.delete(id)
  }

  processTurn() {
    this.started = false
    this.timeout = null

    this.players.forEach((player) => {
      switch(player.action) {
      case "hit":
        this.deck.deal(player, 1)
        break
      case "stand":
        break
      default:
        this.removePlayer(player.id)
        this.emit("removedInactive", player)
      }

      if(player.hand.score > 21) return player.lose()
    })

    if(this.players.every((player) => player.status === "lose")) return this.start()
    if(this.players.every((player) => player.status === "lose" || player.action === "stand" )) {
      while(this.dealer.hand.score < 17) {
        this.deck.deal(this.dealer, 1)
      }

      this.players.forEach((player) => {
        if(this.dealer.hand.score > 21) return player.win()
        if(this.dealer.hand.score > player.hand.score) return player.lose()
        if(this.dealer.hand.score < player.hand.score) return player.win()
        return player.tie()
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
      this._players.delete(player)
    })
    this.dealer.reset()
    this.deck.deal(this.dealer, 1)

    this.players.forEach((player) => {
      player.reset()
      this.deck.deal(player, 2)
      if(player.hand.score === 21) player.blackjack()
    })
  }

  nextTurn() {
    this.players.forEach((player) => {
      if(player.status === "playing" && player.action !== "stand") player.action = null
    })
  }

  end() {
    this.emit("end", this)
  }
}
