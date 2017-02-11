//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const BlackjackGame = require("./blackjack/base/game")
const commando = require("discord.js-commando")

module.exports = class Blackjack extends commando.Command {
  constructor(client) {
    super(client, {
      name: "blackjack",
      aliases: ["blackjack"],
      group: "minigames",
      memberName: "blackjack",
      description: "Play a game of blackjack.",
      examples: ["blackjack"],
      guildOnly: true
    })
  }

  async run(msg) {
    const game = new BlackjackGame({ channel: msg.channel, guild: msg.guild, members: [msg.member] })
  }
}
