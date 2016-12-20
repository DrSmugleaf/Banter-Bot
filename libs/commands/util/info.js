//
// Copyright (c) 2016 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")

module.exports = class Info extends commando.Command {
  constructor(client) {
    super(client, {
      name: "info",
      aliases: ["info", "information"],
      group: "util",
      memberName: "info",
      description: "Information about Banter Bot",
      examples: ["info"]
    })
  }

  async run(msg) {
    const answer = constants.responses.INFO["english"]
    return msg.reply(answer)
  }
}
