//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const responses = require("../../util/constants").responses.INFO

module.exports = class Info extends commando.Command {
  constructor(client) {
    super(client, {
      name: "info",
      aliases: ["info", "information"],
      group: "util",
      memberName: "info",
      description: "Information about Banter Bot.",
      examples: ["info"],
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  async run(msg) {
    const answer = responses[msg.language]

    return msg.reply(answer)
  }
}
