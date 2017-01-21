//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const constants = require("../../util/constants")
const main = require("./base/main")

module.exports = class Queue extends commando.Command {
  constructor(client) {
    super(client, {
      name: "queue",
      aliases: ["queue"],
      group: "youtube",
      memberName: "queue",
      description: "See the current video queue",
      examples: ["queue"],
      guildOnly: true
    })
  }

  async run(msg) {
    if(main.isQueueEmpty(msg.guild)) {
      return msg.reply(constants.responses.YOUTUBE.EMPTY_QUEUE["english"])
    }

    const queue = main.queue.get(msg.guild.id)

    return msg.reply(constants.responses.YOUTUBE.QUEUE["english"](queue.length))
  }
}
