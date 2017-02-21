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

    this.deck = new BlackjackDeck({ decks: data.decks, game: this, name: data.deck })

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
    this.started = false
    clearTimeout(this.timeout)
    this.timeout = null

    this.players.forEach((player) => {
      if(player.status !== "playing") return
      switch (player.action) {
      case "hit":
        this.deck.deal(player, 1)
        break
      case "stand":
        break
      case "double":
        this.bet *= 2
        this.deck.deal(player, 1)
        player._action = "stand"
        break
      case "surrender":
        player.bet /= 2
        player.surrender()
        break
      default:
        this.removePlayer(player.id)
        this.emit("removedInactive", player)
      }

      if(player.hand.score > 21) return player.lose()
    })

    if(this.players.every((player) => player.status !== "playing")) return this.start()
    if(this.players.every((player) => player.status !== "playing" || player.action === "stand" )) {
      while(this.dealer.hand.score < 17) {
        this.deck.deal(this.dealer, 1)
      }

      this.players.forEach((player) => {
        if(player.status !== "playing") return
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
      this._players.delete(player.id)
    })
    this.dealer.reset()
    this.deck.deal(this.dealer, 1, { silent: true })

    this.players.forEach((player) => {
      player.reset()
      this.deck.deal(player, 2, { silent: true })
      if(player.hand.score === 21) player.blackjack()
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
