//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")

module.exports = class Roll extends commando.Command {
  constructor(client) {
    super(client, {
      name: "roll",
      aliases: ["roll", "dice"],
      group: "misc",
      memberName: "roll",
      description: "Roll the dice.",
      examples: ["roll"],
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  async run(msg) {
    return msg.reply(Math.floor(Math.random() * ((100 - 1) + 1) + 1))
  }
}
