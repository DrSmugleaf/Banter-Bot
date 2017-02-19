//
// Copyright (c) 2016-2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const responses = require("../../util/constants").responses.NAME
const winston = require("winston")

module.exports = class Name extends commando.Command {
  constructor(client) {
    super(client, {
      name: "name",
      aliases: ["alias", "name", "nick", "nickname"],
      group: "util",
      memberName: "name",
      description: "Change the bot's name.",
      examples: ["name Banter Bot"],
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "name",
          prompt: "The name to apply",
          type: "string",
          default: "Banter Bot"
        }
      ]
    })
  }

  hasPermission(msg) {
    return msg.author.id === this.client.options.owner
  }

  async run(msg, args) {
    const name = args.name

    msg.client.user.setUsername(name).then(() => {
      return msg.reply(responses.SET[msg.language](name))
    }).catch(winston.error)
  }
}
