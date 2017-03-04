//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const responses = require("../../util/constants").responses.PLAYING
const winston = require("winston")

module.exports = class PlayingCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "playing",
      aliases: ["playing"],
      group: "bottools",
      memberName: "playing",
      description: "Change the bot's playing status.",
      examples: ["playing Overwatch", "playing"],
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: "name",
          prompt: "The game to set as playing",
          type: "string",
          default: ""
        }
      ]
    })
  }

  hasPermission(msg) {
    return this.client.isOwner(msg.author.id)
  }

  async run(msg, args) {
    const name = args.name ? args.name : null

    msg.client.user.setGame(name).then(() => {
      return msg.reply(responses.SET[msg.language](name ? name : "none"))
    }).catch(winston.error)
  }
}
