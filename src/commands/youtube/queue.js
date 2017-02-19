//
// Copyright (c) 2017 DrSmugleaf
//

"use strict"
const commando = require("discord.js-commando")
const main = require("./base/main")
const responses = require("../../util/constants").responses

module.exports = class Queue extends commando.Command {
  constructor(client) {
    super(client, {
      name: "queue",
      aliases: ["queue"],
      group: "youtube",
      memberName: "queue",
      description: "See the current video queue",
      examples: ["queue"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    })
  }

  async run(msg) {
    if(main.isQueueEmpty(msg.guild)) {
      return msg.reply(responses.EMPTY_QUEUE[msg.language])
    }

    const queue = main.queue.get(msg.guild.id)

    return msg.reply(responses.QUEUE[msg.language](queue.length))
  }
}
