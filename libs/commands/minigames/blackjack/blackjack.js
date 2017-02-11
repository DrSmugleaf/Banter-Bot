//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const main = require("./base/deck")
const deck = new main({name: "french", decks: 1})
const commando = require("discord.js-commando")
console.log(deck.cards.length)

module.exports = class Blackjack extends commando.Command {
  constructor(client) {
    super(client, {
      name: "blackjack",
      aliases: ["blackjack"],
      group: "minigames",
      memberName: "blackjack",
      description: "Play a game of blackjack.",
      examples: ["blackjack"]
    })
  }

  async run(msg) {}
}
